import db from "../config/db.js";
import fs from "fs";

async function findAll(req, res) {
    try {
      let [allBrands] = await db.query(`
        SELECT 
          b.*, 
          p.name_uz AS product_name_uz, 
          p.name_en AS product_name_en
        FROM brand b
        LEFT JOIN products p ON b.id = p.brand_id;
      `);
  
      res.status(200).json({ msg: allBrands });
    } catch (error) {
      res.status(500).json({ message: "Something went wrong!" });
      console.log(error.message);
    }
  };
  

  async function findOne(req, res) {
    try {
      const { id } = req.params;
  
      let [currentBrand] = await db.query(`
        SELECT 
          b.*, 
          p.name_uz AS product_name_uz, 
          p.name_en AS product_name_en
        FROM brand b
        LEFT JOIN products p ON b.id = p.brand_id
        WHERE b.id = ?;
      `, [id]);
  
      if (!currentBrand || currentBrand.length === 0) {
        return res.status(404).json({ message: "Brand not found!" });
      }
  
      res.status(200).json({ msg: currentBrand });
    } catch (error) {
      res.status(500).json({ message: "Something went wrong!" });
      console.log(error.message);
    }
  };
  

  async function create(req, res) {
    try {
      const { name_uz, name_en } = req.body;
      const image = req.file;

      const query = `
        INSERT INTO brand (name_uz, name_en, image)
        VALUES (?, ?, ?);
      `;
      const [result] = await db.query(query, [name_uz, name_en, image]);
  
      res.status(201).json({ msg:result.insertId });
    } catch (error) {
      console.log(error.message);
      res.status(500).json({ msg: "Something went wrong!" });
    }
  };
  
async function update(req, res) {
    try {
      const { id } = req.params;
      const { name_uz, name_en, image } = req.body;
  
      const query = `
        UPDATE brand
        SET name_uz = ?, name_en = ?, image = ?
        WHERE id = ?;
      `;
      const [result] = await db.query(query, [name_uz, name_en, image, id]);
  
      if (result.affectedRows == 0) {
        return res.status(404).json({ msg: "Brand not found!" });
      }
  
      res.status(200).json({ msg: result });
    } catch (error) {
      console.log(error.message);
      res.status(500).json({ msg: "Something went wrong!" });
    }
  };
  

  async function remove(req, res) {
    try {
      const { id } = req.params;
      const [product] = await db.query(`SELECT * FROM products WHERE id = ?`, [id]);
      fs.unlinkSync(product[0].image);
      
    await db.query(`DELETE FROM products WHERE brand_id = ?`, [id])
      const [result] = await db.query(`DELETE FROM brand WHERE id = ?`, [id]);
  
      if (result.affectedRows == 0) {
        return res.status(404).json({ msg: "Brand not found!" });
      }
  
      res.status(200).json({ msg: "Brand deleted successfully" });
    } catch (error) {
      console.log(error.message);
      res.status(500).json({ msg: "Something went wrong!" });
    }
  };
  

export { findAll, findOne, create, update, remove };