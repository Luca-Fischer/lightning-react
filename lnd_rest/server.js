const fs = require("fs");
const express = require("express");
const request = require("request");
const cors = require("cors");
const bodyParser = require("body-parser");

const REST_HOST = "localhost:8080";
const MACAROON_PATH =
  "/Users/lucafischer/Library/Application Support/Lnd/data/chain/bitcoin/regtest/admin.macaroon";

const app = express();

const corsOptions = {
  origin: "http://localhost:3000",
};

app.use(cors(corsOptions));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// unlock wallet
app.post("/unlockwallet", (req, res) => {
  const password = req.body.wallet_password;
  const requestBody = {
    wallet_password: password,
  };

  let options = {
    url: `https://${REST_HOST}/v1/unlockwallet`,
    rejectUnauthorized: false,
    json: true,
    form: JSON.stringify(requestBody),
  };
  request.post(options, function (error, response, body) {
    console.log(body);
  });
});

// get wallet balance
app.get("/walletbalance", (req, res) => {
  let options = {
    url: `https://${REST_HOST}/v1/balance/blockchain`,
    rejectUnauthorized: false,
    json: true,
    headers: {
      "Grpc-Metadata-macaroon": fs.readFileSync(MACAROON_PATH).toString("hex"),
    },
  };
  request.get(options, function (error, response, body) {
    if (error) {
      res.status(500).json({ error: "Internal Server Error" });
    } else {
      console.log(body);
      res.json(body);
    }
  });
});

// create new address
app.get("/newaddress", (req, res) => {
  let options = {
    url: `https://${REST_HOST}/v1/newaddress`,
    rejectUnauthorized: false,
    json: true,
    headers: {
      "Grpc-Metadata-macaroon": fs.readFileSync(MACAROON_PATH).toString("hex"),
    },
  };
  request.get(options, function (error, response, body) {
    if (error) {
      res.status(500).json({ error: "Internal Server Error" });
    } else {
      console.log(body);
      res.json(body);
    }
  });
});

app.listen(3001, "localhost", () => {
  console.log("Server is running on http://localhost:3001");
});
