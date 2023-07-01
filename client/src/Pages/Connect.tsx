import React, { useEffect, useState, ChangeEvent } from "react";
import Grid from "@mui/material/Unstable_Grid2";
import Button from "@mui/material/Button";
import Axios from "axios";
import TextField from "@mui/material/TextField";

function Connect() {
  const [existingChannels, setExistingChannels] = useState([]);
  const [names, setNames] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [filteredNames, setFilteredNames] = useState([]);

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const inputValue = event.target.value;
    setInputValue(inputValue);
    const filtered = names.filter((item: string) =>
      item.toLowerCase().includes(inputValue.toLowerCase())
    );
    setFilteredNames(filtered);
  };

  useEffect(() => {
    reloadData();
    getUsers();
  }, []);

  const reloadData = () => {
    Axios.post("http://localhost:3001/listchannels", {
      user_id_token: localStorage.getItem("isLoggedIn"),
    }).then((response) => {
      setExistingChannels(response.data.channels);
    });
  };

  const getUsers = () => {
    Axios.get("http://localhost:3002/api/getUsers").then((response) => {
      setNames(response.data.names.map((item: any) => item.name));
    });
  };

  return (
    <Grid container spacing={2}>
      <Grid xs={4}>
        <h3>Existing Channels</h3>
        {existingChannels.length === 0 ? <p>No existing channels</p> : <></>}
        <Button onClick={reloadData} variant="contained">
          Reload Data
        </Button>
      </Grid>
      <Grid xs={4}>
        <h3>Open new Channels</h3>
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
    </Grid>
  );
}

export default Connect;
