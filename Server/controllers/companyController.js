import { sql, dbConfig } from "../dbConfig.js";

export class Company {
  constructor(C_id, name, description, address, I_id = null) {
    this.C_id = C_id;
    this.Name = name;
    this.Description = description;
    this.Address = address;
    this.I_id = I_id;
  }
}

export const getAllCompanies = async (req, res) => {
  try {
    await sql.connect(dbConfig);
    const result = await sql.query("SELECT * FROM Companies");
    const companies = result.recordset.map(
      (row) =>
        new Company(row.C_id, row.Name, row.Description, row.Address, row.I_id)
    );
    res.json(companies);
  } catch (err) {
    console.error("GET /companies error:", err);
    res.status(500).send("Failed to fetch companies");
  }
};

export const createCompany = async (req, res) => {
  const { name, description, address, I_id = null } = req.body;
  try {
    await sql.connect(dbConfig);
    const result = await sql.query`
        INSERT INTO Companies (Name, Description, Address, I_id)
        OUTPUT INSERTED.C_id
        VALUES (${name}, ${description}, ${address}, ${I_id})
      `;
    res.status(201).json({ C_id: result.recordset[0].C_id });
  } catch (err) {
    console.error("POST /companies error:", err);
    res.status(500).send("Failed to create company");
  }
};

export const getCompanyById = async (req, res) => {
  const id = req.query.id;

  if (!id) {
    return res.status(400).json({ message: "Id query parameter is required" });
  }

  try {
    await sql.connect(dbConfig);
    const result = await sql.query`SELECT * FROM Companies WHERE C_id = ${id}`;

    if (result.recordset.length === 0) {
      return res.status(404).json({ message: "Company not found" });
    }

    const row = result.recordset[0];
    const company = new Company(
      row.C_id,
      row.Name,
      row.Description,
      row.Address,
      row.I_id
    );

    res.status(200).json(company);
  } catch (err) {
    console.error("Error fetching company by id:", err);
    res.status(500).json({ message: "Server error" });
  }
};
