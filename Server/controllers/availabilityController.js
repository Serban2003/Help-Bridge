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
      const availabilities = result.recordset.map(row =>
        new Availability(
            row.AV_id,
            row.H_id,
            row.Date,
            row.IsBooked,
            row.A_id
        )
      );
      res.json(availabilities);
    } catch (err) {
      console.error("GET /availability error:", err);
      res.status(500).send("Failed to fetch availability");
    }
  };
  
export const createAvailability = async (req, res) => {
    const { H_id, date, isBooked} = req.body;
    try {
      await sql.connect(dbConfig);
      await sql.query`
        INSERT INTO Availability (H_id, Date, IsBooked)
        VALUES (${H_id}, ${date}, ${isBooked})`;
      res.status(201).send("Availability created successfully");
    } catch (err) {
      console.error("POST /availability error:", err);
      res.status(500).send("Failed to create availability");
    }
  };

  export const getAvailabilityByHelperId = async (req, res) => {
    const id = req.query.helperId;
  
    if (!id) {
      return res.status(400).json({ message: "Id query parameter is required" });
    }
  
    try {
      await sql.connect(dbConfig);
      const result = await sql.query`SELECT * FROM Availability WHERE H_id = ${id}`;
  
      if (result.recordset.length === 0) {
        return res.status(200).json({ message: "Availability not found" });
      }
  
      const availabilities = result.recordset.map(row =>
        new Availability(
            row.AV_id,
            row.H_id,
            row.Date,
            row.IsBooked,
            row.A_id
        )
      );
      res.status(200).json(availabilities);
    } catch (err) {
      console.error("Error fetching availability by helper id:", err);
      res.status(500).json({ message: "Server error" });
    }
  };