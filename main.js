import express from "express";
import bcrypt from "bcrypt";
import db from "./config/db.js";
import jwt from "jsonwebtoken";
import { totp } from "otplib";
import dotenv from "dotenv";
import mainRoute from "./routes/index.js";
dotenv.config()
const app = express();
app.use(express.json());
app.use("/api", mainRoute)

app.post("/register", async (req, res) => {
  try {
    let item = req.body;

    let [data, _] = await db.query(`SELECT * FROM user WHERE phone = ?`, [
      item.phone,
    ]);

    if (data.length !== 0) {
      return res.status(208).send({ msg: "User already exists" });
    }

    let hashPassword = bcrypt.hashSync(item.password, 7);

    let newUser = {
      ...item,
      password: hashPassword,
    };

    await db.query(
      `INSERT INTO user (fname, phone, password, role) VALUES (?, ?, ?, ?)`,
      [newUser.name, newUser.phone, newUser.password, newUser.role]
    );

    let otp = totp.generate(`secret_${newUser.phone}`);
    console.log(`secret_${newUser.phone}`);
    
    console.log(newUser.phone);
    
    res.status(200).send({ otp });
  } catch (error) {
    console.log(error.message);
    res.status(500).send({ msg: "Internal server error" });
  }
});

app.post("/verify/:otp/:phone", async (req, res) => {
  try {
    let { otp, phone } = req.params;
     
    let isValid = totp.check(otp, `secret_${phone}`);
    console.log(isValid);
    
    if (isValid) {
      await db.query(`UPDATE user SET isActive = true WHERE phone = ?`, [
        phone,
      ]);
      res.status(200).send({ msg: "User activated successfully" });
    } else {
      res.status(400).send({ msg: "OTP or phone number is wrong" });
    }
  } catch (error) {
    console.log(error.message);
    res.status(500).send({ msg: "Internal server error" });
  }
});

app.post("/login", async (req, res) => {
  try {
    let { phone, password } = req.body;

    let [data, _] = await db.query(`SELECT * FROM user WHERE phone = ?`, [
      phone,
    ]);

    if (!data.length) {
      return res.status(401).send({ msg: "User not found" });
    }

    let matchPassword = bcrypt.compareSync(password, data[0].password);

    if (!matchPassword) {
      return res.status(422).send({ msg: "Wrong phone or password" });
    }

    if (!data[0].isActive) {
      return res.status(403).send({ msg: "User not verified. Please verify your account." });
    }

    let { id, role, isActive } = data[0];
    let payload = {
      id,
      role,
      isActive,
    };
    let token = jwt.sign(payload, process.env.accessKey, { expiresIn: "1h" });

    res.status(200).send({ accessToken: token });
  } catch (error) {
    console.log(error.message);
    res.status(500).send({ msg: "Internal server error" });
  }
});


app.listen(3000, () => {
  console.log("Server running on port 3000");
});
