import db from "../config/db.js";

async function findAll(req, res) {
  try {
    let [countries] = await db.query(`
      SELECT 
        c.*, 
        p.name_uz AS product_name_uz, 
        p.name_en AS product_name_en
      FROM country c
      LEFT JOIN products p ON c.id = p.country_id;
    `);

    res.status(200).json({ msg: countries });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ msg: error.message });
  }
};


async function findOne(req, res) {
  try {
    let { id } = req.params;

    let [country] = await db.query(`
      SELECT 
        c.*, 
        p.name_uz AS product_name_uz, 
        p.name_en AS product_name_en
      FROM country c
      LEFT JOIN products p ON c.id = p.country_id
      WHERE c.id = ?;
    `, [id]);

    if (country.length == 0) {
      return res.status(404).json({ msg: "Country not found" });
    }

    res.status(200).send({ msg: country });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ msg: error.message });
  }
}


async function create(req, res) {
  try {
    let { name_uz, name_en } = req.body;

    let [data] = await db.query(`INSERT INTO country (name_uz, name_en) VALUES (?, ?)`, [
      name_uz,
      name_en,
    ]);

    
    res.status(201).json({ msg: data.insertId });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ msg: error.message });
  }
}

async function update(req, res) {
  try {
      const { id } = req.params;
      const values = req.body;

      if (Object.keys(values).length == 0) {
          return res.status(400).json({ message: "No fields provided for update." });
      }

      const keys = Object.keys(values);
      const queryKey = keys.map((key) => `${key} = ?`);

      const [result] = await db.query(`
          UPDATE country 
          SET ${queryKey.join(", ")} 
          WHERE id = ?;
      `, [...Object.values(values), id]);

      if (result.affectedRows == 0) {
          return res.status(404).json({ message: "Country not found!" });
      }

      res.status(200).json({ message: result });
  } catch (error) {
      console.log(error.message);
      res.status(500).json({ message: "Internal Server Error" });
  }
};

  

async function remove(req, res) {
  try {
    let { id } = req.params;
    await db.query(`DELETE FROM products WHERE country_id = ?`, [id])
    let [result] = await db.query(`DELETE FROM country WHERE id = ?`, [id]);

    if (result.affectedRows == 0) {
      return res.status(404).json({ msg: "Country not found" });
    }

    res.status(200).json({ msg: "Country deleted successfully" });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ msg: error.message});
  }
};

export { findAll, findOne, create, update, remove };
