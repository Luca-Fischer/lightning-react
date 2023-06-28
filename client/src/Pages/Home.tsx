import React, { useEffect } from "react";
import CardContent from "@mui/material/CardContent";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import InputAdornment from "@mui/material/InputAdornment";
import Grid from "@mui/material/Unstable_Grid2";
import Button from "@mui/material/Button";
import Axios from "axios";

interface WalletBalance {
  total_balance: String;
  confirmend_balance: String;
  unconfirmend_balance: String;
  locked_balance: String;
  reserved_balance_anchor_chan: String;
  account_balance: String;
}

function Home() {

  // TODO: unclear which are required, if not used can be removed 
  const [walletBalance, setWalletBalance] = React.useState<WalletBalance>({
    total_balance: "0",
    confirmend_balance: "0",
    unconfirmend_balance: "0",
    locked_balance: "0",
    reserved_balance_anchor_chan: "0",
    account_balance: "Object",
  });

  useEffect(() => {
    reloadData();
  }, []);

  const reloadData = () => {
    Axios.get("http://localhost:3001/walletbalance")
      .then((response) => {
        console.log(response.data);
        setWalletBalance({
          total_balance: response.data.total_balance,
          confirmend_balance: response.data.confirmed_balance,
          unconfirmend_balance: response.data.unconfirmed_balance,
          locked_balance: response.data.locked_balance,
          reserved_balance_anchor_chan:
            response.data.reserved_balance_anchor_chan,
          account_balance: response.data.account_balance,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getInfoLoader = async () => {
    // TODO: to unlock wallet, has to be moved later and getInfoLoader is useless then
    const requestBody = {
      wallet_password: btoa("!ikXX4MLpA"),
    };

    Axios.post("http://localhost:3001/unlockwallet", requestBody)
      .then((response) => {
        console.log(response.data); 
      })
      .catch((error) => {
        console.log(error); 
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
                label="Total Balance"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      {walletBalance.total_balance}
                    </InputAdornment>
                  ),
                }}
                disabled
              />
              <TextField
                id="outlined-controlled"
                label="Locked Balance"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      {walletBalance.locked_balance}
                    </InputAdornment>
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
    </div>
  );
}

export default Home;
