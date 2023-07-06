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
          id: result.insertId,
        });
        openTerminal(result.insertId);
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

// get all names
app.get("/api/getUsers", (req, res) => {
  db.query("SELECT name FROM users", (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).json({ error: "Failed to get users" });
    } else {
      console.log(result);
      res.send({
        names: result,
      });
    }
  });
});

// get all names and emails
app.get("/api/getUserInfos", (req, res) => {
  db.query("SELECT name, email FROM users", (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).json({ error: "Failed to get users" });
    } else {
      res.send({
        result: result,
      });
    }
  });
});

// get all names by id
app.get("/api/getNames", (req, res) => {
  const ports = req.query.ports;
  db.query(`SELECT name FROM users WHERE id IN (${ports})`, (err, result) => {
    console.log(result);
    res.json({ names: result });
  });
});

// get all id, names and pubkey by pubkey
app.get("/api/getByPubkey", (req, res) => {
  const pubkey = req.query.pubkey;
  console.log(pubkey);
  db.query(
    `SELECT id, name, pubkey FROM users WHERE pubkey IN (?)`,
    [pubkey],
    (err, result) => {
      console.log(result);
      const modifiedResult = result.map((row) => {
        const userId = row.id;

        const token = jwt.sign({ id: userId }, "secretLightningKeyForId", {
          expiresIn: "1h",
        });

        return {
          ...row,
          id: token,
        };
      });
      console.log(modifiedResult);
      res.json({ result: modifiedResult }); // TODO: does the id in result has to be sign with secretLightningKeyForId???
    }
  );
});

// set PubKey
app.post("/api/setPubkey", (req, res) => {
  const id = req.body.id;
  const decodedId = jwt.verify(id, "secretLightningKeyForId");
  const pubkey = req.body.pubkey;
  db.query(
    "UPDATE users SET pubkey = ? WHERE id = ?",
    [pubkey, decodedId.id],
    (error, results) => {
      if (error) {
        console.error(error);
        return res.status(500).json({ error: "Failed to update pubkey" });
      }

      res.status(200).json({ message: "Pubkey updated successfully" });
    }
  );
});

// get id and pubkey from db
app.post("/api/getIdAndPubKey", (req, res) => {
  const name = req.body.name;
  db.query(
    "SELECT id, pubkey FROM users WHERE name = ?",
    [name],
    (error, results) => {
      if (error) {
        console.error(error);
        return res.status(500).json({ error: "Failed to fetch user" });
      }

      res.status(200).json({ users: results });
    }
  );
});

// verify token
app.get("/api/accessResource", (req, res) => {
  const token = req.headers.authorization.split(" ")[1];
  if (!token) {
    res
      .status(200)
      .json({ success: false, message: "Error! Token was not provided" });
  }
  try {
    const decodedToken = jwt.verify(token, "secretLightningKeyForId");
    res.status(200).json({ success: true, data: { id: decodedToken.id } });
    console.log("Valid Token");
  } catch (error) {
    res.status(200).json({ success: false, message: "Invalid token" });
  }
});

const openTerminal = (id) => {
  const { exec } = require("child_process");
  console.log(id);
  exec(
    `osascript -e 'tell application "Terminal" to do script "/Users/lucafischer/Documents/projects/lightning-react/server/start_lnd.sh ${id}"'`,

    (error, stdout, stderr) => {
      if (error) {
        console.error(`Command execution error: ${error}`);
      } else {
        console.log("New terminal window opened");
      }
    }
  );
};

app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
