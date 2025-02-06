import jwt from "jsonwebtoken";
import db from "../config/db.js";

const authMiddleware = (allowedRoles) => async (req, res, next) => {
  try {
    const token = req.headers["authorization"];
    if (!token) {
      return res.status(401).send({ msg: "No token provided" });
    }

    jwt.verify(token, process.env.accessKey, async (err, decoded) => {
      if (err) {
        return res.status(403).send({ msg: "Failed to authenticate token" });
      }

      let [data, _] = await db.query(`SELECT * FROM user WHERE id = ?`, [
        decoded.id,
      ]);
      if (!data.length) {
        return res.status(404).send({ msg: "User not found" });
      }

      if (!data[0].isActive) {
        return res
          .status(403)
          .send({ msg: "User not verified. Please verify your account." });
      }

      if (!allowedRoles.includes(data[0].role)) {
        return res.status(403).send({ msg: "Not allowed" });
      }

      req.user = {
        id: data[0].id,
        role: data[0].role,
        phone: data[0].phone,
      };

      next();
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send({ msg: "Internal server error" });
  }
};

export default authMiddleware;
