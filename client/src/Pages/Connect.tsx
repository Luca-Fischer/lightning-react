import React, { useEffect, useState, ChangeEvent } from "react";
import Grid from "@mui/material/Unstable_Grid2";
import Button from "@mui/material/Button";
import Axios from "axios";
import TextField from "@mui/material/TextField";

interface Peer {
  address: string;
}

function Connect() {
  const [existingPeers, setExistingPeers] = useState([]);
  const [names, setNames] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [filteredNames, setFilteredNames] = useState([]);
  const [connectedPeers, setConnectedPeers] = useState<{ name: string }[]>([]);
  const [connectRemoteIdentityPubkey, setConnectRemoteIdentityPubkey] =
    useState("");
  const [remoteHostAddress, setRemoteHostAddress] = useState("");
  const [remotePort, setRemotePort] = useState("");

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const inputValue = event.target.value;
    setInputValue(inputValue);
    const filtered = names.filter((item: string) =>
      item.toLowerCase().includes(inputValue.toLowerCase())
    );
    setFilteredNames(filtered);
  };

  useEffect(() => {
    reloadPeers();
    getUsers();
  }, []);

  const reloadPeers = () => {
    Axios.post("http://localhost:3001/listpeers", {
      user_id_token: localStorage.getItem("isLoggedIn"),
    })
      .then((response) => {
        setExistingPeers(response.data.peers);
        const addresses = response.data.peers.map((peer: Peer) => {
          const parts = peer.address.split(":");
          const port = parseInt(parts[1]) - 10000;
          return port;
        });
        // get names for each port
        return Axios.get("http://localhost:3002/api/getNames", {
          params: {
            ports: addresses,
          },
        });
      })
      .then((response) => {
        console.log(response.data.names);
        setConnectedPeers(response.data.names);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getUsers = () => {
    Axios.get("http://localhost:3002/api/getUsers").then((response) => {
      setNames(response.data.names.map((item: any) => item.name));
    });
  };

  const connectPeer = () => {
    Axios.post("http://localhost:3001/connectpeer", {
      user_id_token: localStorage.getItem("isLoggedIn"),
      pub_key: connectRemoteIdentityPubkey,
      host: remoteHostAddress,
      port: remotePort,
    }).then((response) => {
      console.log(response);
    });
  };

  const handleChangePubKey = (event: React.ChangeEvent<HTMLInputElement>) => {
    setConnectRemoteIdentityPubkey(event.target.value);
  };
  const handleChangeHostAddress = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRemoteHostAddress(event.target.value);
  };
  const handleChangePort = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRemotePort(event.target.value);
  };

  return (
    <Grid container spacing={3}>
      <Grid xs={3}>
        <h3>Existing Connections to Peers</h3>
        {existingPeers.length === 0 ? (
          <p>No existing connections to peers</p>
        ) : (
          <ul style={{ listStyleType: "none" }}>
            {connectedPeers.map((item, index) => (
              <li key={index}>{item.name}</li>
            ))}
          </ul>
        )}
        <Button onClick={reloadPeers} variant="contained">
          Reload Peers
        </Button>
      </Grid>
      <Grid xs={4}>
        <h3>Connect to new Peers</h3>
        <TextField
          fullWidth
          label="Search"
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          placeholder="Search..."
        />
        <ul style={{ listStyleType: "none", padding: 20 }}>
          {filteredNames.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </Grid>
      <Grid xs={4}>
        <h3>Connect To Peers Manually</h3>
        <TextField
          fullWidth
          label="PubKey"
          value={connectRemoteIdentityPubkey}
          onChange={handleChangePubKey}
        />
        <br></br>
        <br></br>
        <TextField
          fullWidth
          label="Host Address"
          value={remoteHostAddress}
          onChange={handleChangeHostAddress}
        />
        <br></br>
        <br></br>
        <TextField
          fullWidth
          label="Port"
          value={remotePort}
          onChange={handleChangePort}
        />
        <br></br>
        <br></br>
        <Button onClick={connectPeer} variant="contained">
          Connect To Peer
        </Button>
      </Grid>
    </Grid>
  );
}

export default Connect;
