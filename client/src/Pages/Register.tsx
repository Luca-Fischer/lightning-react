import React, { useState } from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import Axios from "axios";
import CircularProgress from "@mui/material/CircularProgress";

import { Link } from "react-router-dom";

function Register() {
  // TODO: encryption and small capital letter always
  // TODO: PASSWORD AT LEAST 8 CHARACTERS
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loader, setLoader] = useState(false);

  const createUser = () => {
    setLoader(true);
    Axios.post("http://localhost:3002/api/create", {
      name: name,
      email: email,
      password: password,
    })
      .then((response) => {
        localStorage.setItem("isLoggedIn", response.data.token);
        setTimeout(() => {
          const requestBody = {
            wallet_password: password,
            user_id: response.data.id
          };

          Axios.post("http://localhost:3001/initwallet", requestBody)
            .then((response) => {
              console.log(response.data);
            })
            .catch((error) => {
              console.log(error);
            });
          window.location.href = "http://localhost:3000/"; // force rerender otherwise localStorage item is updated to late
        }, 2000); // timeout to wait for terminal to start
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <>
      {!loader ? (
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
              <Button onClick={createUser} variant="contained">
                Register
              </Button>
            </Stack>
          </CardContent>
          <CardActions>
            <Link to="/Login">
              <Button size="small">Already an account?</Button>
            </Link>
          </CardActions>
        </Card>
      ) : (
        <>
          <CircularProgress /> Setting Up Account
        </>
      )}
    </>
  );
}

export default Register;
