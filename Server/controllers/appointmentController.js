import { sql, dbConfig } from "../dbConfig.js";

export class Appointment {
    constructor(A_id, H_id, title, message, date, U_id, R_id, ts_created = null) {
        this.A_id = A_id;
        this.H_id = H_id;
        this.title = title;
        this.message = message;
        this.date = date;
        this.U_id = U_id;
        this.R_id = R_id;
        this.ts_created = ts_created;
    }
  }
  
export const getAllAppointments = async (req, res) => {
    try {
      await sql.connect(dbConfig);
      const result = await sql.query("SELECT * FROM Appointments");
      const appointments = result.recordset.map(row =>
        new Appointment(
            row.A_id,
            row.H_id,
            row.Title,
            row.Message,
            row.Date,
            row.U_id,
            row.R_id,
            row.Ts_created
        )
      );
      res.json(appointments);
    } catch (err) {
      console.error("GET /appointments error:", err);
      res.status(500).send("Failed to fetch appointments");
    }
  };
  
export const createAppointment = async (req, res) => {
    const { H_id, title, message, date, U_id, R_id } = req.body;
    try {
      await sql.connect(dbConfig);
      await sql.query`
        INSERT INTO Appointments (H_id, Title, Message, Date, U_Id, R_Id)
        VALUES (${H_id}, ${title}, ${message}, ${date}, ${U_id}, ${R_id})`;
      res.status(201).send("Appointment created successfully");
    } catch (err) {
      console.error("POST /appointments error:", err);
      res.status(500).send("Failed to create appointment");
    }
  };
  

export const getAppointmentsByHelperId = async (req, res) => {
    const id = req.query.helperId;
  
    if (!id) {
      return res.status(400).json({ message: "ID query parameter is required" });
    }
  
    try {
      await sql.connect(dbConfig);
      const result = await sql.query(`SELECT * FROM Appointments WHERE H_Id = ${id}`);
  
      if (result.recordset.length === 0) {
        return res.status(404).json({ message: "Appointments not found" });
      }
  
       const appointments = result.recordset.map(row =>
              new Appointment(
                row.A_id,
                row.H_id,
                row.Title,
                row.Message,
                row.Date,
                row.U_id,
                row.R_id,
                row.Ts_created
              )
            );
            res.status(200).json(appointments);
          } catch (err) {
            console.error("Error fetching appointments by helper id:", err);
            res.status(500).json({ message: "Server error" });
          }
  };

  export const getAppointmentsByUserId = async (req, res) => {
    const id = req.query.userId;
  
    if (!id) {
      return res.status(400).json({ message: "User id query parameter is required" });
    }
    
    try {
        await sql.connect(dbConfig);
        const result = await sql.query(`SELECT * FROM Appointments WHERE U_Id = ${id}`);
    
        if (result.recordset.length === 0) {
          return res.status(404).json({ message: "Appointments not found" });
        }
    
         const appointments = result.recordset.map(row =>
                new Appointment(
                  row.A_id,
                  row.H_id,
                  row.Title,
                  row.Message,
                  row.Date,
                  row.U_id,
                  row.R_id,
                  row.Ts_created
                )
              );
              res.status(200).json(appointments);
    } catch (err) {
      console.error("GET /appointments error:", err);
      res.status(500).send("Failed to fetch appointments");
    }
  };