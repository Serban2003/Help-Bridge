import { sql, dbConfig } from "../dbConfig.js";

export class Availability {
  constructor(AV_id, H_id, date, isBooked, A_id = null) {
    this.AV_id = AV_id;
    this.H_id = H_id;
    this.Date = date;
    this.IsBooked = isBooked;
    this.A_id = A_id;
  }
}

export const getAllAvailabilities = async (req, res) => {
  try {
    await sql.connect(dbConfig);
    const result = await sql.query("SELECT * FROM Availability");
    const availabilities = result.recordset.map(
      (row) =>
        new Availability(row.AV_id, row.H_id, row.Date, row.IsBooked, row.A_id)
    );
    res.json(availabilities);
  } catch (err) {
    console.error("GET /availability error:", err);
    res.status(500).send("Failed to fetch availability");
  }
};

export const createAvailability = async (req, res) => {
  const { H_id, date, hours } = req.body;

  if (!H_id || !date || !Array.isArray(hours) || hours.length === 0) {
    return res
      .status(400)
      .json({ message: "H_id, date, and hours are required" });
  }

  try {
    await sql.connect(dbConfig);

    for (const hour of hours) {
      const [dd, mm, yyyy] = date.split("-");
      const fullDateTime = `${yyyy}-${mm}-${dd}T${hour}:00Z`; // e.g., 2025-05-05T08:00:00Z

      await sql.query`
        INSERT INTO Availability (H_id, Date, IsBooked)
        VALUES (${H_id}, ${fullDateTime}, 0)`;
    }

    res.status(201).json({ message: "Availability created successfully" });
  } catch (err) {
    console.error("POST /availability error:", err);
    res.status(500).json({ message: "Failed to create availability" });
  }
};

export const updateAvailability = async (req, res) => {
  if (!req.query.id) {
    return res.status(400).json({ message: "AV_id is required" });
  }

  try {
    await sql.connect(dbConfig);
    await sql.query`
        UPDATE Availability
        SET IsBooked = ${req.body.IsBooked}, A_id = ${req.body.A_id}
        WHERE AV_id = ${req.query.id}`;

    res.status(200).json({ message: "Availability updated successfully" });
  } catch (err) {
    console.error("PUT /availability error:", err);
    res.status(500).json({ message: "Failed to update availability" });
  }
};

export const getAvailabilityByHelperId = async (req, res) => {
  const id = req.query.helperId;

  if (!id) {
    return res.status(400).json({ message: "Id query parameter is required" });
  }

  try {
    await sql.connect(dbConfig);
    const result =
      await sql.query`SELECT * FROM Availability WHERE H_id = ${id}`;

    if (result.recordset.length === 0) {
      return res.status(200).json({ message: "Availability not found" });
    }

    const availabilities = result.recordset.map(
      (row) =>
        new Availability(row.AV_id, row.H_id, row.Date, row.IsBooked, row.A_id)
    );
    res.status(200).json(availabilities);
  } catch (err) {
    console.error("Error fetching availability by helper id:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteAvailability = async (req, res) => {
  const idsParam = req.body.ids;

  console.log("DELETE /availability ids:", idsParam);

  if (!idsParam) {
    return res.status(400).json({ message: "ids query parameter is required" });
  }

  let idsArray;

  if (typeof idsParam === "string") {
    // Split comma-separated list into array
    idsArray = idsParam.split(",").map((id) => parseInt(id.trim(), 10));
  } else if (Array.isArray(idsParam)) {
    idsArray = idsParam.map((id) => parseInt(id, 10));
  } else {
    return res.status(400).json({ message: "Invalid ids format" });
  }

  // Filter out NaN
  idsArray = idsArray.filter((id) => !isNaN(id));

  if (idsArray.length === 0) {
    return res.status(400).json({ message: "No valid IDs provided" });
  }

  try {
    await sql.connect(dbConfig);

    await sql.query`
      DELETE FROM Availability WHERE AV_id IN (${idsArray})
    `;

    res.status(200).json({ message: "Availability deleted successfully" });
  } catch (err) {
    console.error("DELETE /availability error:", err);
    res.status(500).json({ message: "Failed to delete availability" });
  }
};
