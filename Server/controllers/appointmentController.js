import { sql, dbConfig } from "../dbConfig.js";

export class Appointment {
  constructor(A_id, H_id, title, message, date, U_id, R_id, ts_created = null) {
    this.A_id = A_id;
    this.H_id = H_id;
    this.Title = title;
    this.Message = message;
    this.Date = date;
    this.U_id = U_id;
    this.R_id = R_id;
    this.Ts_created = ts_created;
  }
}

export const getAllAppointments = async (req, res) => {
  try {
    await sql.connect(dbConfig);
    const result = await sql.query("SELECT * FROM Appointments");
    const appointments = result.recordset.map(
      (row) =>
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
  try {
    await sql.connect(dbConfig);
    const result = await sql.query`
        INSERT INTO Appointments (H_id, Title, Message, Date, U_Id, R_Id)
        OUTPUT INSERTED.A_id
        VALUES (${req.body.H_id}, ${req.body.Title}, ${req.body.Message}, ${req.body.Date}, ${req.body.U_id}, ${req.body.R_id})`;
    const insertedA_id = result.recordset[0].A_id;
    res.status(201).json({ A_id: insertedA_id });
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
    const result = await sql.query(
      `SELECT a.A_id, a.Date, a.Title, a.Message, u.U_id, u.Firstname, u.Lastname, u.I_id
      FROM Appointments a
      JOIN Users u ON a.U_id = u.U_id
      WHERE a.H_id = ${id}`
    );
    if (result.recordset.length === 0) {
      return res.status(404).json({ message: "Appointments not found" });
    }

    const appointments = result.recordset.map((row) => ({
      A_id: row.A_id,
      Date: row.Date,
      Title: row.Title,
      Message: row.Message,
      User: {
        U_id: row.U_id,
        Firstname: row.Firstname,
        Lastname: row.Lastname,
        ImageUrl: row.I_id ? `/api/images/${row.I_id}` : null, // adjust if needed
      },
    }));
    res.status(200).json(appointments);
  } catch (err) {
    console.error("Error fetching appointments by helper id:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getAppointmentsByUserId = async (req, res) => {
  const id = req.query.userId;

  if (!id) {
    return res
      .status(400)
      .json({ message: "User id query parameter is required" });
  }

  try {
    await sql.connect(dbConfig);
    const result = await sql.query(
       `SELECT a.A_id, a.Date, a.Title, a.Message, h.H_id, h.Firstname, h.Lastname, h.I_id, a.R_id
      FROM Appointments a
      JOIN Helpers h ON h.H_id = a.H_id
      LEFT JOIN Reviews r ON a.R_id = r.R_id
      WHERE a.U_id = ${id}`
    );

    if (result.recordset.length === 0) {
      return res.status(404).json({ message: "Appointments not found" });
    }

    const appointments = result.recordset.map((row) => ({
      A_id: row.A_id,
      Date: row.Date,
      Title: row.Title,
      Message: row.Message,
      R_id: row.R_id,
      Helper: {
        H_id: row.H_id,
        Firstname: row.Firstname,
        Lastname: row.Lastname,
        ImageUrl: row.I_id ? `/api/images/${row.I_id}` : null, // adjust if needed
      },
    }));
    res.status(200).json(appointments);
  } catch (err) {
    console.error("GET /appointments error:", err);
    res.status(500).send("Failed to fetch appointments");
  }
};

export const deleteAppointment = async (req, res) => {
  if (!req.query.id) {
    return res.status(400).json({ message: "Appointment ID is required" });
  }

  try {
    await sql.connect(dbConfig);

    // Clear the availability reference
    await sql.query`
      UPDATE Availability
      SET A_id = NULL, IsBooked = 0
      WHERE A_id = ${req.query.id}
    `;

    // Delete the appointment
    await sql.query`
      DELETE FROM Appointments
      WHERE A_id = ${req.query.id}
    `;

    res.status(200).json({ message: "Appointment cancelled successfully" });
  } catch (err) {
    console.error("DELETE /appointments error:", err);
    res.status(500).json({ message: "Failed to cancel appointment" });
  }
};

