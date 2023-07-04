const fs = require("fs");
const express = require("express");
const request = require("request");
const cors = require("cors");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");

const app = express();

const corsOptions = {
  origin: "http://localhost:3000",
};

app.use(cors(corsOptions));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// get wallet balance
app.post("/walletbalance", (req, res) => {
  const token = jwt.verify(req.body.user_id_token, "secretLightningKeyForId");

  const REST_PORT = token.id;
  const MACAROON_PATH =
    "/Users/lucafischer/Library/Application Support/lnd" +
    token.id +
    "/data/chain/bitcoin/regtest/admin.macaroon";

  let options = {
    url: `https://localhost:${REST_PORT}/v1/balance/blockchain`,
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
app.post("/newaddress", (req, res) => {
  const token = jwt.verify(req.body.user_id_token, "secretLightningKeyForId");
  const REST_PORT = token.id;
  const MACAROON_PATH =
    "/Users/lucafischer/Library/Application Support/lnd" +
    token.id +
    "/data/chain/bitcoin/regtest/admin.macaroon";

  let options = {
    url: `https://localhost:${REST_PORT}/v1/newaddress`,
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

// init wallet
app.post("/initwallet", async (req, res) => {
  const cipher_seed_mnemonic = [];
  const wallet_password = Buffer.from(req.body.wallet_password).toString(
    "base64"
  );

  const REST_PORT = req.body.user_id;

  try {
    const getSeedPromise = new Promise((resolve, reject) => {
      let options = {
        url: `https://localhost:${REST_PORT}/v1/genseed`,
        rejectUnauthorized: false,
        json: true,
      };
      request.get(options, function (error, response, body) {
        if (error) {
          reject(error);
        } else {
          console.log(body);
          cipher_seed_mnemonic.push(...body.cipher_seed_mnemonic);
          resolve();
        }
      });
    });

    await getSeedPromise;

    const makeRequest = () =>
      new Promise((resolve, reject) => {
        let requestBody = {
          wallet_password: wallet_password,
          cipher_seed_mnemonic: cipher_seed_mnemonic,
        };
        console.log("INNITWALLET");
        let options = {
          url: `https://localhost:${REST_PORT}/v1/initwallet`,
          rejectUnauthorized: false,
          json: true,
          form: JSON.stringify(requestBody),
        };
        request.post(options, function (error, response, body) {
          if (error) {
            reject(error);
          } else {
            resolve({ response, body });
          }
        });
      });

    try {
      const { response, body } = await makeRequest();
      console.log(body);
      res.json({ cipher_seed_mnemonic }); // TODO: mnemonic get send back but not used yet
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "An error occurred" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred" });
  }
});

// get info
app.post("/getinfo", (req, res) => {
  const token = jwt.verify(req.body.user_id_token, "secretLightningKeyForId");
  const REST_PORT = token.id;
  const MACAROON_PATH =
    "/Users/lucafischer/Library/Application Support/lnd" +
    token.id +
    "/data/chain/bitcoin/regtest/admin.macaroon";

  let options = {
    url: `https://localhost:${REST_PORT}/v1/getinfo`,
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

// connect peer
app.post("/connectpeer", (req, res) => {
  const token = jwt.verify(req.body.user_id_token, "secretLightningKeyForId");
  const host = req.body.host + ":" + req.body.port;
  const REST_PORT = token.id;
  const MACAROON_PATH =
    "/Users/lucafischer/Library/Application Support/lnd" +
    token.id +
    "/data/chain/bitcoin/regtest/admin.macaroon";

  const addr = {
    pubkey: req.body.pub_key,
    host: host,
  };
  console.log(addr);

  let requestBody = {
    addr: addr,
    // perm: true,
  };
  let options = {
    url: `https://localhost:${REST_PORT}/v1/peers`,
    rejectUnauthorized: false,
    json: true,
    headers: {
      "Grpc-Metadata-macaroon": fs.readFileSync(MACAROON_PATH).toString("hex"),
    },
    form: JSON.stringify(requestBody),
  };
  request.post(options, function (error, response, body) {
    console.log(body);
    res.json(body);
  });
});

// list peers
app.post("/listpeers", (req, res) => {
  const token = jwt.verify(req.body.user_id_token, "secretLightningKeyForId");
  const REST_PORT = token.id;
  const MACAROON_PATH =
    "/Users/lucafischer/Library/Application Support/lnd" +
    token.id +
    "/data/chain/bitcoin/regtest/admin.macaroon";
  let options = {
    url: `https://localhost:${REST_PORT}/v1/peers`,
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

// open channel
app.post("/openchannel", (req, res) => {
  const token = jwt.verify(req.body.user_id_token, "secretLightningKeyForId");
  const buffer = Buffer.from(req.body.identity_pub_key, "hex");
  const base64String = buffer.toString("base64");
  const channelAmount = req.body.amount;

  const REST_PORT = token.id;
  const MACAROON_PATH =
    "/Users/lucafischer/Library/Application Support/lnd" +
    token.id +
    "/data/chain/bitcoin/regtest/admin.macaroon";

  let requestBody = {
    sat_per_vbyte: 1,
    node_pubkey: base64String,
    local_funding_amount: channelAmount,
    min_confs: 0,
  };

  let options = {
    url: `https://localhost:${REST_PORT}/v1/channels/stream`,
    rejectUnauthorized: false,
    json: true,
    headers: {
      "Grpc-Metadata-macaroon": fs.readFileSync(MACAROON_PATH).toString("hex"),
    },
    form: JSON.stringify(requestBody),
  };
  request.post(options, function (error, response, body) {
    console.log(body);
  });
});

// list channels
app.post("/listchannels", (req, res) => {
  const token = jwt.verify(req.body.user_id_token, "secretLightningKeyForId");
  const REST_PORT = token.id;
  const MACAROON_PATH =
    "/Users/lucafischer/Library/Application Support/lnd" +
    token.id +
    "/data/chain/bitcoin/regtest/admin.macaroon";

  let options = {
    url: `https://localhost:${REST_PORT}/v1/channels`,
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
