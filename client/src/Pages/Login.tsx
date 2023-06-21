import React from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import Axios from "axios";

import { Link } from "react-router-dom";

function Login() {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [isError, setIsError] = React.useState(false);

  // TODO: Password and email always convert to small capital in server and client
  const handleChangeEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };
  const handleChangePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };
  const userExists = () => {
    Axios.get("http://localhost:3002/api/getUser/", {
      params: {
        email: email,
        password: password,
      },
    })
      .then((response) => {
        console.log(response);
        if (response.data.length !== 0) {
          console.log(response.data.token);
          localStorage.setItem("isLoggedIn", response.data.token);
          window.location.href = "http://localhost:3000/";
        } else {
          setIsError(true);
        }
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
          {isError ? (
            <>
              <TextField
                error
                id="outlined-controlled"
                label="Email"
                value={email}
                onChange={handleChangeEmail}
                helperText="Incorrect entry."
              />
              <TextField
                error
                id="outlined-uncontrolled"
                label="Password"
                value={password}
                onChange={handleChangePassword}
                helperText="Incorrect entry."
              />
              <Button onClick={userExists} variant="contained">
                Login
              </Button>
            </>
          ) : (
            <>
              <TextField
                id="outlined-controlled"
                label="Email"
                value={email}
                onChange={handleChangeEmail}
              />
              <TextField
                id="outlined-uncontrolled"
                label="Password"
                value={password}
                onChange={handleChangePassword}
              />
              <Button onClick={userExists} variant="contained">
                Login
              </Button>
            </>
          )}
        </Stack>
      </CardContent>
      <CardActions>
        <Link to="/Register">
          <Button size="small">Don't have an account?</Button>
        </Link>
      </CardActions>
    </Card>
  );
}

export default Login;
