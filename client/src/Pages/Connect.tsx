import React, { useEffect, useState, ChangeEvent } from "react";
import Grid from "@mui/material/Unstable_Grid2";
import Button from "@mui/material/Button";
import Axios from "axios";
import TextField from "@mui/material/TextField";

function Connect() {
  const [existingChannels, setExistingChannels] = useState([]);
  const [existingPeers, setExistingPeers] = useState([]);
  const [names, setNames] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [filteredNames, setFilteredNames] = useState([]);
  const [identityPubkey, setIdentityPubkey] = useState("");
  const [remoteIdentityPubkey, setRemoteIdentityPubkey] = useState("");
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
    reloadChannels();
    getUsers();
    getInfo();
  }, []);

  const reloadChannels = () => {
    Axios.post("http://localhost:3001/listchannels", {
      user_id_token: localStorage.getItem("isLoggedIn"),
    }).then((response) => {
      setExistingChannels(response.data.channels);
    });
  };

  const reloadPeers = () => {
    Axios.post("http://localhost:3001/listpeers", {
      user_id_token: localStorage.getItem("isLoggedIn"),
    }).then((response) => {
      setExistingPeers(response.data.peers);
    });
  }

  const getUsers = () => {
    Axios.get("http://localhost:3002/api/getUsers").then((response) => {
      setNames(response.data.names.map((item: any) => item.name));
    });
  };

  const getInfo = () => {
    Axios.post("http://localhost:3001/getinfo", {
      user_id_token: localStorage.getItem("isLoggedIn"),
    }).then((response) => {
      setIdentityPubkey(response.data.identity_pubkey);
    });
  };

  const openChannel = () => {
    Axios.post("http://localhost:3001/openchannel", {
      user_id_token: localStorage.getItem("isLoggedIn"),
      identity_pub_key: remoteIdentityPubkey,
    }).then((response) => {
      console.log(response);
    });
  };

  const handleChangeOpenChannel = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRemoteIdentityPubkey(event.target.value);
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

  return (
    <Grid container spacing={3}>
      <Grid xs={3}>
        <h3>Existing Connections to Peers</h3>
        {existingPeers.length === 0 ? <p>No existing connections to peers</p> : <></>}
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
      <Grid xs={3}>
        <h3>Existing Channels</h3>
        {existingChannels.length === 0 ? <p>No existing channels</p> : <></>}
        <Button onClick={reloadChannels} variant="contained">
          Reload Data
        </Button>
      </Grid>
      <Grid xs={4}>
        <h3>Open Channels Manually</h3>
        <p>Your Identity Pubkey: {identityPubkey}</p>
        <TextField
          fullWidth
          label="Partners' Identity PubKey"
          value={remoteIdentityPubkey}
          onChange={handleChangeOpenChannel}
        />
        <br></br>
        <br></br>
        <Button onClick={openChannel} variant="contained">
          Open Channel
        </Button>
      </Grid>
    </Grid>
  );
}

export default Connect;
