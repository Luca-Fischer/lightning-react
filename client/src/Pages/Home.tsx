import React, { useState } from "react";
import CardContent from "@mui/material/CardContent";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import InputAdornment from "@mui/material/InputAdornment";
import Grid from "@mui/material/Unstable_Grid2";
import Button from "@mui/material/Button";
import Axios from "axios";

interface WalletBalance {
  total_balance: Number;
  confirmend_balance: Number;
  unconfirmend_balance: Number;
  locked_balance: Number;
  reserved_balance_anchor_chan: Number;
  account_balance: string;
}

function Home() {
  const [getInfo, setGetInfo] = useState<any>(null);

  const [walletBalance, setWalletBalance] = React.useState<WalletBalance>({
    total_balance: 120000,
    confirmend_balance: 1000000,
    unconfirmend_balance: 0,
    locked_balance: 100,
    reserved_balance_anchor_chan: 0,
    account_balance: "some object",
  });

  const reloadData = () => {
    setWalletBalance({
      // api to receive the new balance
      total_balance: 120001,
      confirmend_balance: 1000000,
      unconfirmend_balance: 0,
      locked_balance: 100,
      reserved_balance_anchor_chan: 0,
      account_balance: "some object",
    });
  };

  const getInfoLoader = async () => {
    const requestBody = {
      wallet_password: btoa("!ikXX4MLpA"),
    };

    Axios.post("http://localhost:3001/unlockwallet", requestBody)
      .then((response) => {
        console.log(response.data); // Handle the response data
      })
      .catch((error) => {
        console.log(error); // Handle any errors
      });
  };

  return (
    <div>
      <CardContent>
        <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
          <Grid>
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
                label="Balance"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      {walletBalance.total_balance.toString()}
                    </InputAdornment>
                  ),
                }}
                disabled
              />
              <TextField
                id="outlined-controlled"
                label="Recieved"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      recievedAmount
                    </InputAdornment>
                  ),
                }}
                disabled
              />
              <TextField
                id="outlined-controlled"
                label="Sent"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">SentAmount</InputAdornment>
                  ),
                }}
                disabled
              />
              <TextField
                id="outlined-controlled"
                label="Network Fees"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">Fees</InputAdornment>
                  ),
                }}
                disabled
              />
            </Stack>
          </Grid>
          <Grid>Graph</Grid>
        </Grid>
      </CardContent>
      <Button onClick={reloadData} variant="contained">
        Reload Data
      </Button>
      <Button onClick={getInfoLoader}>getInfo</Button>
      <div>{getInfo}</div>
    </div>
  );
}

export default Home;
