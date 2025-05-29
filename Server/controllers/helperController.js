import { sql, dbConfig } from "../dbConfig.js";
import bcrypt from "bcrypt";

export class Helper {
    constructor(H_id, HC_id, C_id, firstname, lastname, description, experience, email, password, phone, I_id = null, ts_created = null) {
        this.H_id = H_id;
        this.HC_id = HC_id;
        this.C_id = C_id;
        this.Firstname = firstname;
        this.Lastname = lastname;
        this.Description = description;
        this.Experience = experience;
        this.Email = email;
        this.Password = password;
        this.Phone = phone;
        this.I_id = I_id;
        this.Ts_created = ts_created;
    }
  }
  
export const getAllHelpers = async (req, res) => {
    try {
      await sql.connect(dbConfig);
      const result = await sql.query("SELECT * FROM Helpers");
      const helpers = result.recordset.map(row =>
        new Helper(
            row.H_id,
            row.HC_id,
            row.C_id,
            row.Firstname,
            row.Lastname,
            row.Description,
            row.Experience,
            row.Email,
            row.Password,
            row.Phone,
            row.I_id,
            row.Ts_created
        )
      );
      res.json(helpers);
    } catch (err) {
      console.error("GET /helpers error:", err);
      res.status(500).send("Failed to fetch helpers");
    }
  };
  
export const createHelper = async (req, res) => {
    const { HC_id, C_id, firstname, lastname, description, experience, email, password, phone, I_id = null } = req.body;
    const saltRounds = 10; // Higher = more secure, but slower
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    try {
      await sql.connect(dbConfig);
      await sql.query`
        INSERT INTO Helpers (HC_id, C_id, Firstname, Lastname, Description, Experience, Email, Password, Phone, I_id)
        VALUES (${HC_id}, ${C_id}, ${firstname}, ${lastname}, ${description}, ${experience}, ${email}, ${hashedPassword}, ${phone}, ${I_id})`;
      res.status(201).send("Helper created successfully");
    } catch (err) {
      console.error("POST /helpers error:", err);
      res.status(500).send("Failed to create helper");
    }
  };
  

export const getHelperByEmail = async (req, res) => {
    const email = req.query.email;
  
    if (!email) {
      return res.status(400).json({ message: "Email query parameter is required" });
    }
  
    try {
      await sql.connect(dbConfig);
      const result = await sql.query`SELECT * FROM Helpers WHERE Email = ${email}`;
  
      if (result.recordset.length === 0) {
        return res.status(404).json({ message: "Helper not found" });
      }
  
      const row = result.recordset[0];
      const helper = new Helper(
        row.H_id,
        row.HC_id,
        row.C_id,
        row.Firstname,
        row.Lastname,
        row.Description,
        row.Experience,
        row.Email,
        row.Password,
        row.Phone,
        row.I_id,
        row.Ts_created
    )
  
      res.status(200).json(helper);
    } catch (err) {
      console.error("Error fetching helper by email:", err);
      res.status(500).json({ message: "Server error" });
    }
  };


  export const getHelperById = async (req, res) => {
    const id = req.query.id;
  
    if (!id) {
      return res.status(400).json({ message: "Helper id query parameter is required" });
    }
    
    try {
      await sql.connect(dbConfig);
      const result = await sql.query(`SELECT * FROM Helpers WHERE H_id = ${id}`);
      const helpers = result.recordset.map(row =>
        new Helper(
            row.H_id,
            row.HC_id,
            row.C_id,
            row.Firstname,
            row.Lastname,
            row.Description,
            row.Experience,
            row.Email,
            row.Password,
            row.Phone,
            row.I_id,
            row.Ts_created
        )
      );
      res.json(helpers);
    } catch (err) {
      console.error("GET /helpers error:", err);
      res.status(500).send("Failed to fetch helpers");
    }
  };

  export const getHelpersByHelperCategoryId = async (req, res) => {
    const id = req.query.helperCategoryId;
  
    if (!id) {
      return res.status(400).json({ message: "Helper category id query parameter is required" });
    }
    
    try {
      await sql.connect(dbConfig);
      const result = await sql.query(`SELECT * FROM Helpers WHERE HC_id = ${id}`);
      const helpers = result.recordset.map(row =>
        new Helper(
            row.H_id,
            row.HC_id,
            row.C_id,
            row.Firstname,
            row.Lastname,
            row.Description,
            row.Experience,
            row.Email,
            row.Password,
            row.Phone,
            row.I_id,
            row.Ts_created
        )
      );
      res.json(helpers);
    } catch (err) {
      console.error("GET /helpers error:", err);
      res.status(500).send("Failed to fetch helpers");
    }
  };

  
export const deleteHelper = async (req, res) => {
  console.log("DELETE /helpers", req.query.id);
  if (!req.query.id) {
    return res.status(400).json({ message: "Helper id is required" });
  }

  try {
    await sql.connect(dbConfig);
    const result = await sql.query`DELETE FROM Helpers WHERE H_id = ${req.query.id}`;
    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ message: "Helper not found" });
    }
    res.status(200).json({ message: "Helper deleted successfully" });
  } catch (err) {
    console.error("DELETE /helpers error:", err);
    res.status(500).send("Failed to delete helper");
  }
};

export const updateHelperById = async (req, res) => {
  const helperId = req.query.id;

  if (!helperId) {
    return res.status(400).json({ message: "Helper ID is required for update" });
  }

  try {
    await sql.connect(dbConfig);

    const fieldsToUpdate = [];
    if (req.body.Firstname !== undefined) fieldsToUpdate.push(`Firstname = '${req.body.Firstname}'`);
    if (req.body.Lastname !== undefined) fieldsToUpdate.push(`Lastname = '${req.body.Lastname}'`);
    if (req.body.Email !== undefined) fieldsToUpdate.push(`Email = '${req.body.Email}'`);
    if (req.body.Phone !== undefined) fieldsToUpdate.push(`Phone = '${req.body.Phone}'`);
    if (req.body.Description !== undefined) fieldsToUpdate.push(`Description = '${req.body.Description}'`);
    if (req.body.Experience !== undefined) fieldsToUpdate.push(`Experience = ${req.body.Experience}`);
    if (req.body.HC_id !== undefined) fieldsToUpdate.push(`HC_id = ${req.body.HC_id}`);
    if (req.body.C_id !== undefined) fieldsToUpdate.push(`C_id = ${req.body.C_id}`);
    if (req.body.I_id !== undefined) fieldsToUpdate.push(`I_id = ${req.body.I_id ?? "NULL"}`);
    if (req.body.Password !== undefined) {
      const hashed = await bcrypt.hash(req.body.Password, 10);
      fieldsToUpdate.push(`Password = '${hashed}'`);
    }

    if (fieldsToUpdate.length === 0) {
      return res.status(400).json({ message: "No fields provided for update" });
    }

    const result = await sql.query(`
      UPDATE Helpers
      SET ${fieldsToUpdate.join(", ")}
      OUTPUT INSERTED.*
      WHERE H_id = ${helperId}
    `);

    const row = result.recordset[0];

    if (!row) {
      return res.status(404).json({ message: "Helper not found" });
    }

    const updatedHelper = new Helper(
      row.H_id,
      row.HC_id,
      row.C_id,
      row.Firstname,
      row.Lastname,
      row.Description,
      row.Experience,
      row.Email,
      row.Password,
      row.Phone,
      row.I_id,
      row.Ts_created
    );

    res.status(200).json(updatedHelper);
  } catch (err) {
    console.error("PUT /helpers error:", err);
    res.status(500).send("Failed to update helper");
  }
};

export const changeHelperPassword = async (req, res) => {
  const { H_id, currentPassword, newPassword } = req.body;

  if (!H_id || !currentPassword || !newPassword) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    await sql.connect(dbConfig);
    const result = await sql.query`SELECT * FROM Helpers WHERE H_id = ${H_id}`;

    const helper = result.recordset[0];
    if (!helper) return res.status(404).json({ message: "Helper not found" });

    const isMatch = await bcrypt.compare(currentPassword, helper.Password);
    if (!isMatch) {
      return res.status(401).json({ message: "Incorrect current password" });
    }

    const hashed = await bcrypt.hash(newPassword, 10);
    await sql.query`UPDATE Helpers SET Password = ${hashed} WHERE H_id = ${H_id}`;

    res.status(200).json({ message: "Password changed successfully" });
  } catch (err) {
    console.error("Password change error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
