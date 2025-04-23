import { sql, dbConfig } from "../dbConfig.js";

export class User {
    constructor(U_id, firstname, lastname, email, password, phone, I_id = null, ts_created = null) {
        this.U_id = U_id;
        this.firstname = firstname;
        this.lastname = lastname;
        this.email = email;
        this.password = password;
        this.phone = phone;
        this.I_id = I_id;
        this.ts_created = ts_created;
    }
  }
  
export const getAllUsers = async (req, res) => {
    try {
      await sql.connect(dbConfig);
      const result = await sql.query("SELECT * FROM Users");
      const users = result.recordset.map(row =>
        new User(
          row.U_id,
          row.Firstname,
          row.Lastname,
          row.Email,
          row.Password,
          row.Phone,
          row.I_id,
          row.Ts_created
        )
      );
      res.json(users);
    } catch (err) {
      console.error("GET /users error:", err);
      res.status(500).send("Failed to fetch users");
    }
  };
  
export const createUser = async (req, res) => {
    const { firstname, lastname, email, password, phone, I_id = null } = req.body;
    try {
      await sql.connect(dbConfig);
      await sql.query`
        INSERT INTO Users (Firstname, Lastname, Email, Password, Phone, I_id)
        VALUES (${firstname}, ${lastname}, ${email}, ${password}, ${phone}, ${I_id})`;
      res.status(201).send("User created successfully");
    } catch (err) {
      console.error("POST /users error:", err);
      res.status(500).send("Failed to create user");
    }
  };
  

export const getUserByEmail = async (req, res) => {
    const email = req.query.email;
  
    if (!email) {
      return res.status(400).json({ message: "Email query parameter is required" });
    }
  
    try {
      await sql.connect(dbConfig);
      const result = await sql.query`SELECT * FROM Users WHERE Email = ${email}`;
  
      if (result.recordset.length === 0) {
        return res.status(404).json({ message: "User not found" });
      }
  
      const row = result.recordset[0];
      const user = new User(
        row.U_id,
        row.Firstname,
        row.Lastname,
        row.Email,
        row.Password,
        row.Phone,
        row.I_id,
        row.Ts_created
      );
  
      res.status(200).json(user);
    } catch (err) {
      console.error("Error fetching user by email:", err);
      res.status(500).json({ message: "Server error" });
    }
  };