import React, { useEffect, useState, ChangeEvent } from "react";
import Grid from "@mui/material/Unstable_Grid2";
import Button from "@mui/material/Button";
import Axios from "axios";
import TextField from "@mui/material/TextField";

function Channels() {
  
  const [existingChannels, setExistingChannels] = useState([]);
  const [identityPubkey, setIdentityPubkey] = useState("");
  const [remoteIdentityPubkey, setRemoteIdentityPubkey] = useState("");

  useEffect(() => {
    reloadChannels();
    getInfo();
  }, []);

  const reloadChannels = () => {
    Axios.post("http://localhost:3001/listchannels", {
      user_id_token: localStorage.getItem("isLoggedIn"),
    }).then((response) => {
      setExistingChannels(response.data.channels);
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

  return (
    <Grid container spacing={3}>
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

export default Channels;
