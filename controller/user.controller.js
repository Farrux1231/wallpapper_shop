import db from "../config/db.js";

async function findAll(req, res) {
  try {
    let [users] = await db.query(`SELECT * FROM user`);
    res.status(200).json({msg:users});
  } catch (error) {
    console.log(error.message);
    res.status(500).send({ msg: error.message });
  }
}

async function findOne(req, res) {
  try {
    let { id } = req.params;

    let [user] = await db.query(`SELECT * FROM user WHERE id = ?`, [
      id,
    ]);

    if (user.length == 0) {
      return res.status(404).send({ msg: "user not found" });
    }

    res.status(200).json({msg:user});
  } catch (error) {
    console.log(error.message);
    res.status(500).send({ msg: error.message });
  }
}

async function create(req, res) {
  try {
    let { fname, phone, password, role} = req.body;

    let [data] = await db.query(`INSERT INTO user (fname, phone, password, role) VALUES (?, ?, ? ,? )`, [
      fname,
      phone,
      password,
      role
    ]);
    
    res.status(201).json({ msg: data.insertId });
  } catch (error) {
    console.log(error.message);
    res.status(500).send({ msg: error.message });
  }
}

async function update(req, res) {
    try {
      let { id } = req.params;
      let values = req.body;

      if (Object.keys(values).length == 0) {
        return res.status(400).json({ message: "No fields provided for update." });
    }

    const keys = Object.keys(values); 
    const queryKey = keys.map((key) => `${key} = ?`); 

    const [result] = await db.query( `
        UPDATE user 
        SET ${queryKey.join(", ")} 
        WHERE id = ?`
    , [...Object.values(values), id]);

    if (result[0].affectedRows == 0) {
        return res.status(404).json({ message: "user not found!" })};

    res.status(200).json(result.insertId)
    } catch (error) {
      console.log(error.message);
      res.status(500).send({ msg: error.message });
    
  }
};

  

async function remove(req, res) {
  try {
    let { id } = req.params;
    await db.query("DELETE FROM orders WHERE user_id = ?",[id])
    
    let [result] = await db.query(`DELETE FROM user WHERE id = ?`, [id]);

    if (result.affectedRows == 0) {
      return res.status(404).send({ msg: "user not found" });
    }

    res.status(200).send({ msg: "user deleted successfully" });
  } catch (error) {
    console.log(error.message);
    res.status(500).send({ msg: error.message});
  }
}

export { findAll, findOne, create, update, remove };
