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
      const reviews = result.recordset.map(row =>
        new Review(
            row.R_id,
            row.H_id,
            row.Title,
            row.Description,
            row.U_id,
            row.Rating,
            row.Ts_created,
        )
      );
      res.json(reviews);
    } catch (err) {
      console.error("GET /reviews error:", err);
      res.status(500).send("Failed to fetch reviews");
    }
  };
  
export const createReview = async (req, res) => {
    const { H_id, title, description, U_id, rating} = req.body;
    try {
      await sql.connect(dbConfig);
      await sql.query`
        INSERT INTO Reviews (H_id, Title, Description, U_id, Rating)
        VALUES (${H_id}, ${title}, ${description}, ${U_id}, ${rating})`;
      res.status(201).send("Review created successfully");
    } catch (err) {
      console.error("POST /reviews error:", err);
      res.status(500).send("Failed to create review");
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
        return res.status(404).json({ message: "Review not found" });
      }
  
      const row = result.recordset[0];
      const review = new Review(
        row.R_id,
        row.H_id,
        row.Title,
        row.Description,
        row.U_id,
        row.Rating,
        row.Ts_created,
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
        return res.status(404).json({ message: "Reviews not found" });
      }
  
      const reviews = result.recordset.map(row =>
        new Review(
            row.R_id,
            row.H_id,
            row.Title,
            row.Description,
            row.U_id,
            row.Rating,
            row.Ts_created,
        )
      );
      res.status(200).json(reviews);
    } catch (err) {
      console.error("Error fetching reviews by helper id:", err);
      res.status(500).json({ message: "Server error" });
    }
  };