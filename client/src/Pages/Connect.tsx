import React, { useEffect, useState, ChangeEvent } from "react";
import Grid from "@mui/material/Unstable_Grid2";
import Button from "@mui/material/Button";
import Axios from "axios";
import TextField from "@mui/material/TextField";
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';

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
         <List
          sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}
        >
          {filteredNames.map((value) => (
            <ListItem key={value} disableGutters sx={{ padding: '0px', marginLeft: '20px' }}>
              <ListItemText primary={value} /><Button id={value}>Open Channel</Button>
            </ListItem>
          ))}
        </List>
      </Grid>
    </Grid>
  );
}

export default Connect;
