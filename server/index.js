const express = require("express");
const db = require("./config/db");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const { exec } = require("child_process");

const app = express();

const PORT = 3002;
app.use(cors());
app.use(express.json());

// TODO: check if user email address is real and email and username is not used
// Create User
app.post("/api/create", (req, res) => {
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;

  db.query(
    "INSERT INTO users (name, email, password) VALUES (?,?,?)",
    [name, email, password],
    (err, result) => {
      if (err) {
        console.log(err);
        res.status(500).json({ error: "Failed to create user" });
      } else {
        console.log(result);
        res.send({
          token: jwt.sign({ id: result.insertId }, "secretLightningKeyForId", {
            expiresIn: "1h",
          }),
        });
       // openTerminal();
      }
    }
  );
});

// Login
app.get("/api/getUser/", async (req, res) => {
  const email = req.query.email;
  const password = req.query.password;

  try {
    const result = await new Promise((resolve, reject) => {
      db.query(
        "SELECT * FROM users WHERE (name = ? OR email = ?) AND password = ?",
        [email, email, password],
        (err, result) => {
          if (err) {
            reject(err);
          } else {
            resolve(result);
          }
        }
      );
    });

    if (result.length > 0) {
      res.send({
        token: jwt.sign({ id: result[0].id }, "secretLightningKeyForId", {
          expiresIn: "1h",
        }),
      });
    } else {
      res.send("Error: Something went wrong");
    }
  } catch (err) {
    console.log(err);
    res.status(500).send("An error occurred");
  }
});

// verify token
app.get("/api/accessResource", (req, res) => {
  const token = req.headers.authorization.split(" ")[1];
  if (!token) {
    res
      .status(200)
      .json({ success: false, message: "Error! Token was not provided" });
  }
  const decodedToken = jwt.verify(token, "secretLightningKeyForId");
  res.status(200).json({ success: true, data: { id: decodedToken.id } });
  console.log("Valid Token");
});

/*const openTerminal = () => {
  const command = 'osascript -e \'tell app "Terminal" to do script ""\'';

  const terminalProcess = exec("sh", ["-c", command]);

  terminalProcess.on("error", (error) => {
    console.error(`Error opening terminal: ${error.message}`);
  });

  terminalProcess.on("exit", (code) => {
    console.log("Terminal opened successfully");
  });
};*/

app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
