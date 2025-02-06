import db from "../config/db.js"

async function findAll(req, res) {
    async function findAll(req, res) {
        try {
            let [allOrders] = await db.query(`
                SELECT 
                    o.*, 
                    u.fname AS user_name 
                FROM orders o
                LEFT JOIN user u ON o.user_id = u.id;
            `);
            res.status(200).json(allOrders);
        } catch (error) {
            res.status(500).json({ message: "Something went wrong!" });
            console.log(error.message);
        }
    }
};   

async function findOne(req, res) {
    try {
        const { id } = req.params;
        const [currentOrder] = await db.query(`
            SELECT 
                o.*, 
                u.fname AS user_name 
            FROM orders o
            LEFT JOIN user u ON o.user_id = u.id
            WHERE o.id = ?;
        `, [id]);

        if (!currentOrder) {
            return res.status(404).json({ message: "Order not found!" });
        }

        res.status(200).json(currentOrder);
    } catch (error) {
        res.status(500).json({ message: "Something went wrong!" });
        console.log(error.message);
    }
};


async function create(req, res) {
    try {
        const { user_id, total_prise } = req.body;

        const query = `
            INSERT INTO orders (user_id, total_prise)
            VALUES (?, ?);
        `;
        const [createdOrder] = await db.query(query, [user_id, total_prise]);

        res.status(201).json({ message: createdOrder.insertId });
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
            UPDATE orders 
            SET ${queryKey.join(", ")} 
            WHERE id = ?;
        `, [...Object.values(values), id]);

        if (result.affectedRows == 0) {
            return res.status(404).json({ message: "Order not found!" });
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

        await db.query(`DELETE FROM orderItem WHERE order_id = ?`, [id]);
        const [result] = await db.query(`DELETE FROM orders WHERE id = ?`, [id]);

        if (result.affectedRows == 0) {
            return res.status(404).json({ message: "Order not found!" });
        }

        res.json({ message: "Data deleted successfully!" });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};


export{findAll, findOne, create, update, remove}