import db  from '../config/db.js';
import fs from "fs";

async function findAll(req, res) {
    try {
        let [allCategories] = await db.query(`
            SELECT 
                c.*, 
                p.name_uz AS product_name_uz, 
                p.name_en AS product_name_en
            FROM category c
            LEFT JOIN products p ON c.id = p.category_id;
        `);

        res.status(200).json({ msg: allCategories });
    } catch (error) {
        res.status(500).json({ message: "Something went wrong!" });
        console.log(error.message);
    }
};



async function findOne(req, res) {
    try {
        const { id } = req.params;

        let [currentCategory] = await db.query(`
            SELECT 
                c.*, 
                p.name_uz AS product_name_uz, 
                p.name_en AS product_name_en
            FROM category c
            LEFT JOIN products p ON c.id = p.category_id
            WHERE c.id = ?;
        `, [id]);

        if (currentCategory.length == 0) {
            return res.status(404).json({ message: "Category not found!" });
        }

        res.status(200).json({ msg: currentCategory });
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
            INSERT INTO category (name_uz, name_en, image)
            VALUES (?, ?, ?);
        `;

        const [createdCategory] = await db.query(query, [name_uz, name_en, image]);
        res.status(201).json({ message: createdCategory.insertId });
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

        const [result] = await db.query(`
            UPDATE category
            SET ${queryKey.join(", ")}
            WHERE id = ?;
        `, [...Object.values(values), id]);

        if (result.affectedRows == 0) {
            return res.status(404).json({ message: "Category not found!" });
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

        await db.query(`DELETE FROM categoryItem WHERE category_id = ?`, [id]);
        const [result] = await db.query(`DELETE FROM category WHERE id = ?`, [id]);
        fs.unlinkSync(product[0].image);

        if (result.affectedRows == 0) {
            return res.status(404).json({ message: "Category not found!" });
        }

        res.status(200).json({ message: "Category deleted successfully!" });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
}


export {findAll, findOne, create, update, remove}
