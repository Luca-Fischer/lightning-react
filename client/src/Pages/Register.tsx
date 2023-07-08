import React, { useState, useEffect } from "react";
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
  // TODO: encryption and small capital letter always for email
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [emails, setEmails] = useState<string[]>([]);
  const [names, setNames] = useState<string[]>([]);

  const [loader, setLoader] = useState(false);
  const [passwordToShort, setpasswordToShort] = useState(false);
  const [nameUsed, setNameUsed] = useState(false);
  const [emailUsed, setEmailUsed] = useState(false);

  useEffect(() => {
    getUsers();
  }, [name]);

  const createUser = async () => {
    getUsers();
    if (emails.includes(email)) {
      setEmailUsed(true);
      return;
    }
    if (names.includes(name)) {
      setNameUsed(true);
      return;
    }
    if (password.length >= 8) {
      setLoader(true);
      try {
        const response = await Axios.post("http://localhost:3002/api/create", {
          name: name,
          email: email,
          password: password,
        });
        localStorage.setItem("isLoggedIn", response.data.token);
  
        await new Promise((resolve) => setTimeout(resolve, 3000));
  
        const initWalletResponse = await Axios.post("http://localhost:3001/initwallet", {
          wallet_password: password,
          user_id: response.data.id,
        });
        console.log(initWalletResponse.data);
  
        await new Promise((resolve) => setTimeout(resolve, 5000));
  
        const getinfoResponse = await Axios.post("http://localhost:3001/getinfo", {
          user_id_token: localStorage.getItem("isLoggedIn"),
        });
        await Axios.post("http://localhost:3002/api/setPubkey", {
          id: localStorage.getItem("isLoggedIn"),
          pubkey: getinfoResponse.data.identity_pubkey,
        });
  
        window.location.href = "http://localhost:3000/";
      } catch (error) {
        console.error(error);
      }
    } else {
      setpasswordToShort(true);
    }
  };
  
  

  const getUsers = () => {
    Axios.get("http://localhost:3002/api/getUserInfos").then((response) => {
      setNames(response.data.result.map((item: any) => item.name));
      setEmails(response.data.result.map((item: any) => item.email));
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
              {!nameUsed ? (
                <TextField
                  id="outlined-controlled"
                  label="Username"
                  onChange={(e) => {
                    setName(e.target.value);
                  }}
                />
              ) : (
                <TextField
                  error
                  id="outlined-controlled"
                  label="Username"
                  helperText="Name already used!"
                  onChange={(e) => {
                    setName(e.target.value);
                  }}
                />
              )}

              {!emailUsed ? (
                <TextField
                  id="outlined-controlled"
                  label="Email"
                  onChange={(e) => {
                    setEmail(e.target.value);
                  }}
                />
              ) : (
                <TextField
                  error
                  id="outlined-controlled"
                  label="Email"
                  helperText="Email already used!"
                  onChange={(e) => {
                    setEmail(e.target.value);
                  }}
                />
              )}

              {!passwordToShort ? (
                <TextField
                  id="outlined-uncontrolled"
                  label="Password"
                  onChange={(e) => {
                    setPassword(e.target.value);
                  }}
                />
              ) : (
                <TextField
                  error
                  id="outlined-uncontrolled"
                  label="Password"
                  helperText="At least 8 characters!"
                  onChange={(e) => {
                    setPassword(e.target.value);
                  }}
                />
              )}

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
