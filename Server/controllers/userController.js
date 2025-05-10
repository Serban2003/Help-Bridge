import { sql, dbConfig } from "../dbConfig.js";
import bcrypt from "bcrypt";

export class User {
  constructor(
    U_id,
    firstname,
    lastname,
    email,
    password,
    phone,
    I_id = null,
    ts_created = null
  ) {
    this.U_id = U_id;
    this.Firstname = firstname;
    this.Lastname = lastname;
    this.Email = email;
    this.Password = password;
    this.Phone = phone;
    this.I_id = I_id;
    this.Ts_created = ts_created;
  }
}

export const getAllUsers = async (req, res) => {
  try {
    await sql.connect(dbConfig);
    const result = await sql.query("SELECT * FROM Users");
    const users = result.recordset.map(
      (row) =>
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
    const saltRounds = 10; // Higher = more secure, but slower
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    console.log(I_id);
    await sql.connect(dbConfig);
    await sql.query`
        INSERT INTO Users (Firstname, Lastname, Email, Password, Phone, I_id)
        VALUES (${firstname}, ${lastname}, ${email}, ${hashedPassword}, ${phone}, ${I_id})`;
    res.status(201).send("User created successfully");
  } catch (err) {
    console.error("POST /users error:", err);
    res.status(500).send("Failed to create user");
  }
};

export const getUserByEmail = async (req, res) => {
  const email = req.query.email;

  if (!email) {
    return res
      .status(400)
      .json({ message: "Email query parameter is required" });
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

export const getUserById = async (req, res) => {
  const id = req.query.id;

  if (!id) {
    return res.status(400).json({ message: "ID query parameter is required" });
  }

  try {
    await sql.connect(dbConfig);
    const result = await sql.query`SELECT * FROM Users WHERE U_id = ${id}`;

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
    console.error("Error fetching user by id:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const loginUser = async (email, password, res) => {
  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "Email and password are required." });
  }

  try {
    await sql.connect(dbConfig);

    // Try Users table first
    const resultUsers = await sql.query`
      SELECT * FROM Users WHERE Email = ${email}
    `;

    if (resultUsers.recordset.length > 0) {
      const user = resultUsers.recordset[0];

      const match = await bcrypt.compare(password, user.Password);
      if (match) {
        return res.status(200).json({ role: "user", data: user });
      }
    }

    // Then try Helpers table
    const resultHelpers = await sql.query`
      SELECT * FROM Helpers WHERE Email = ${email}
    `;

    if (resultHelpers.recordset.length > 0) {
      const helper = resultHelpers.recordset[0];
      const match = await bcrypt.compare(password, helper.Password);
      if (match) {
        return res.status(200).json({ role: "helper", data: helper });
      }
    }

    return res.status(401).json({ message: "Invalid email or password" });
  } catch (err) {
    console.error("Error during login:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

export const deleteUser = async (req, res) => {
  const { email } = req.query.email;

  if (!email) {
    return res.status(400).json({ message: "User email is required" });
  }

  try {
    await sql.connect(dbConfig);
    const result = await sql.query`DELETE FROM Users WHERE Email = ${email}`;
    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    console.error("DELETE /users error:", err);
    res.status(500).send("Failed to delete user");
  }
};
