import db from "../config/db.js";
import fs from "fs";

async function findAll(req, res) {
    try {
        let [allProducts]  = await db.query(`
            SELECT 
                p.*, 
                b.name_uz AS brand_name_uz, 
                b.name_en AS brand_name_en, 
                c.name_uz AS country_name_uz, 
                c.name_en AS country_name_en
            FROM products p
            LEFT JOIN brand b ON p.brand_id = b.id
            LEFT JOIN country c ON p.country_id = c.id;
        `);
        res.status(200).json(allProducts);
    } catch (error) {
        res.status(404).json({ message: "Something went wrong!" });
        console.log(error.message);
        
    }
};


async function findOne(req, res) {
    try {
        const { id } = req.params;
        const [currentItem] =  db.query(`
            SELECT 
                p.*, 
                b.name_uz AS brand_name_uz, 
                b.name_en AS brand_name_en, 
                c.name_uz AS country_name_uz, 
                c.name_en AS country_name_en
            FROM products p
            LEFT JOIN brand b ON p.brand_id = b.id
            LEFT JOIN country c ON p.country_id = c.id
            WHERE p.id = ?;
        `,[id]);
        if (!currentItem) {
            return res.status(404).json({ message: "Product not found!" });
        }
        res.status(200).json(currentItem);
    } catch (error) {
        res.status(404).json({ message: "Something went wrong!" });
        console.log(error.message);
        
    }
};


async function create(req, res) {
    try {
        const {
            name_uz, name_en, brand_id, country_id, price, old_price,
            available, description_uz, description_en, washable, size
        } = req.body;
        let image = req.file;

        const query = `
            INSERT INTO products 
            (name_uz, name_en, image, brand_id, country_id, price, old_price, available, 
            description_uz, description_en, washable, size)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
        `;
        const [createdPr] = await db.query(query, [
            name_uz, name_en, image, brand_id, country_id, price, old_price,
            available, description_uz, description_en, washable, size
        ]);
        
        res.status(200).json({ message: createdPr.insertId });
    } catch (error) {
        console.log("Something went wrong:", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

async function update(req, res) {
    try {
        const { id } = req.params; 
        const values = req.body; 

        if (Object.keys(values).length == 0) {
            return res.status(400).json({ message: "No fields provided for update." });
        }

        const keys = Object.keys(values); 
        const queryKey = keys.map((key) => `${key} = ?`); 

        const [result] = await db.query( `
            UPDATE products 
            SET ${queryKey.join(", ")} 
            WHERE id = ?`
        , [...Object.values(values), id]);

        if (result[0].affectedRows == 0) {
            return res.status(404).json({ message: "Product not found!" });
        }

        res.status(200).json({ message: result });
    } catch (error) {
        console.log(error.message);
        
        res.status(500).json({ message: "Internal Server Error" });
    }
};


async function remove(req, res) {
    try {
        const { id } = req.params;
        const [product] = await db.query(`SELECT * FROM products WHERE id = ?`, [id]);

        await db.query(`DELETE FROM categoryItem WHERE product_id = ?`, [id]);
        await db.query(`DELETE FROM orderItem WHERE product_id = ?`, [id]);

        const [result] = await db.query(`DELETE FROM products WHERE id = ?`, [id]);

        if (result.affectedRows == 0) {
            return res.status(404).json({ message: "Product not found!" });
        };
        fs.unlinkSync(product[0].image);

        res.json({ message: "Product and related data deleted successfully!" });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
}


export { findAll, findOne, create, update, remove };
