import { sql, dbConfig } from "../dbConfig.js";

export class HelperCategory {
    constructor(HC_id, name, description) {
        this.HC_id = HC_id;
        this.name = name;
        this.description = description;
    }
  }
  
export const getAllHelperCategories = async (req, res) => {
    try {
      await sql.connect(dbConfig);
      const result = await sql.query("SELECT * FROM Helper_Categories");
      const helperCategories = result.recordset.map(row =>
        new HelperCategory(
          row.HC_id,
          row.Name,
          row.Description,
        )
      );
      res.json(helperCategories);
    } catch (err) {
      console.error("GET /helper_categories error:", err);
      res.status(500).send("Failed to fetch helper categories");
    }
  };
  
export const createHelperCategory = async (req, res) => {
    const { name, description } = req.body;
    try {
      await sql.connect(dbConfig);
      await sql.query`
        INSERT INTO Helper_Categories (Name, Description)
        VALUES (${name}, ${description})`;
      res.status(201).send("Helper category created successfully");
    } catch (err) {
      console.error("POST /helper_categories error:", err);
      res.status(500).send("Failed to create helper category");
    }
  };
  

export const getHelperCategoryById = async (req, res) => {
    const id = req.query.id;
  
    if (!id) {
      return res.status(400).json({ message: "Id query parameter is required" });
    }
  
    try {
      await sql.connect(dbConfig);
      const result = await sql.query`SELECT * FROM Helper_Categories WHERE HC_id = ${id}`;
  
      if (result.recordset.length === 0) {
        return res.status(404).json({ message: "Helper category not found" });
      }
  
      const row = result.recordset[0];
      const helperCategory = new HelperCategory(
        row.HC_id,
        row.Name,
        row.Description,
      );
  
      res.status(200).json(helperCategory);
    } catch (err) {
      console.error("Error fetching helper category by id:", err);
      res.status(500).json({ message: "Server error" });
    }
  };