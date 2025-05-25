import { sql, dbConfig } from "../dbConfig.js";

export class Review {
  constructor(R_id, H_id, title, description, U_id, rating, ts_created = null) {
    this.R_id = R_id;
    this.H_id = H_id;
    this.Title = title;
    this.Description = description;
    this.U_id = U_id;
    this.Rating = rating;
    this.Ts_created = ts_created;
  }
}

export const getAllReviews = async (req, res) => {
  try {
    await sql.connect(dbConfig);
    const result = await sql.query("SELECT * FROM Reviews");
    const reviews = result.recordset.map(
      (row) =>
        new Review(
          row.R_id,
          row.H_id,
          row.Title,
          row.Description,
          row.U_id,
          row.Rating,
          row.Ts_created
        )
    );
    res.json(reviews);
  } catch (err) {
    console.error("GET /reviews error:", err);
    res.status(500).send("Failed to fetch reviews");
  }
};

export const createReview = async (req, res) => {
  const { H_id, Title, Description, U_id, Rating, A_id } = req.body;

  if (!H_id || !Title || !Description || !U_id || !Rating || !A_id) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    await sql.connect(dbConfig);

    // Insert review and get inserted ID
    const insertResult = await sql.query`
      INSERT INTO Reviews (H_id, Title, Description, U_id, Rating)
      OUTPUT INSERTED.R_id
      VALUES (${H_id}, ${Title}, ${Description}, ${U_id}, ${Rating});
    `;

    const newReviewId = insertResult.recordset[0].R_id;

    // Update appointment with the new review ID
    await sql.query`
      UPDATE Appointments
      SET R_id = ${newReviewId}
      WHERE A_id = ${A_id};
    `;

    res.status(201).json({
      R_id: newReviewId,
      H_id,
      Title,
      Description,
      U_id,
      Rating,
      A_id,
    });
  } catch (err) {
    console.error("POST /reviews error:", err);
    res.status(500).json({ message: "Failed to submit review" });
  }
};

export const getReviewById = async (req, res) => {
  const id = req.query.id;

  if (!id) {
    return res.status(400).json({ message: "Id query parameter is required" });
  }

  try {
    await sql.connect(dbConfig);
    const result = await sql.query`SELECT * FROM Reviews WHERE R_id = ${id}`;

    if (result.recordset.length === 0) {
      return res.status(200).json({ message: "Review not found" });
    }

    const row = result.recordset[0];
    const review = new Review(
      row.R_id,
      row.H_id,
      row.Title,
      row.Description,
      row.U_id,
      row.Rating,
      row.Ts_created
    );

    res.status(200).json(review);
  } catch (err) {
    console.error("Error fetching review by id:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getReviewsByHelperId = async (req, res) => {
  const id = req.query.helperId;

  if (!id) {
    return res.status(400).json({ message: "Id query parameter is required" });
  }

  try {
    await sql.connect(dbConfig);
    const result = await sql.query`SELECT * FROM Reviews WHERE H_id = ${id}`;

    if (result.recordset.length === 0) {
      return res.status(200).json({ message: "Reviews not found" });
    }

    const reviews = result.recordset.map(
      (row) =>
        new Review(
          row.R_id,
          row.H_id,
          row.Title,
          row.Description,
          row.U_id,
          row.Rating,
          row.Ts_created
        )
    );
    res.status(200).json(reviews);
  } catch (err) {
    console.error("Error fetching reviews by helper id:", err);
    res.status(500).json({ message: "Server error" });
  }
};
