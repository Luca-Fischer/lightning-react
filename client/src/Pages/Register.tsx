import React, { useState } from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import Axios from "axios";

import { Link } from "react-router-dom";

function Register() {

  // TODO: encryption and small capital letter always 

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const createUser = () => {
    Axios.post("http://localhost:3002/api/create", {
      name: name,
      email: email,
      password: password,
    })
      .then((response) => {
        localStorage.setItem("isLoggedIn", "true");
        console.log(response);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <Card sx={{ minWidth: 275 }}>
      <CardContent>
        <Stack
          component="form"
          sx={{
            width: "25ch",
          }}
          spacing={2}
          noValidate
          autoComplete="off"
        >
          <TextField
            id="outlined-controlled"
            label="Username"
            onChange={(e) => {
              setName(e.target.value);
            }}
          />
          <TextField
            id="outlined-controlled"
            label="Email"
            onChange={(e) => {
              setEmail(e.target.value);
            }}
          />
          <TextField
            id="outlined-uncontrolled"
            label="Password"
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />
          <Link to="/">
            <Button
              onClick={createUser}
              variant="contained"
             // value={"buttonClick"}
            >
              Register
            </Button>
          </Link>
        </Stack>
      </CardContent>
      <CardActions>
        <Link to="/Login">
          <Button size="small">Already an account?</Button>
        </Link>
      </CardActions>
    </Card>
  );
}

export default Register;
