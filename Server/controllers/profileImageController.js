import { sql, dbConfig } from "../dbConfig.js";

export class ProfileImage {
  constructor(I_id, Name, Data) {
    this.I_id = I_id;
    this.Name = Name;
    this.Data = Data;
  }
}

export const getAllProfileImages = async (req, res) => {
  try {
    await sql.connect(dbConfig);
    const result = await sql.query("SELECT * FROM Profile_Images");
    const profileImages = result.recordset.map(
      (row) => new ProfileImage(row.I_id, row.Name, row.Data)
    );
    res.json(profileImages);
  } catch (err) {
    console.error("GET /profileImages error:", err);
    res.status(500).send("Failed to fetch profile images");
  }
};

export const createProfileImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).send("No file uploaded.");
    }

    const { originalname, buffer } = req.file;

    await sql.connect(dbConfig);
    const result = await sql.query`
      INSERT INTO Profile_Images (Name, Data)
      OUTPUT INSERTED.I_id
      VALUES (${originalname}, ${buffer})`;

    const imageId = result.recordset[0].I_id;

    res.status(201).json({ I_id: imageId });
  } catch (err) {
    console.error("POST /profileImages error:", err);
    res.status(500).send("Failed to create profile image");
  }
};

export const getProfileImageById = async (req, res) => {
  const id = req.query.id;

  if (!id) {
    return res.status(400).json({ message: "Id query parameter is required" });
  }

  try {
    await sql.connect(dbConfig);
    const result =
      await sql.query`SELECT * FROM Profile_Images WHERE I_id = ${id}`;

    if (result.recordset.length === 0) {
      return res.status(404).json({ message: "Profile image not found" });
    }

    const row = result.recordset[0];
    const profileImage = new ProfileImage(row.I_id, row.Name, row.Data);

    res.status(200).json(profileImage);
  } catch (err) {
    console.error("Error fetching profile image by id:", err);
    res.status(500).json({ message: "Server error" });
  }
};
