import React, { useEffect } from "react";
import CardContent from "@mui/material/CardContent";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import InputAdornment from "@mui/material/InputAdornment";
import Grid from "@mui/material/Unstable_Grid2";
import Button from "@mui/material/Button";
import Axios from "axios";
import Card from "@mui/material/Card";
import CheckIcon from "@mui/icons-material/Check";

import CopyToClipboardButton from "../Components/CopyToClipboardButton";
import "../Components/HoverButton.css";

interface WalletBalance {
  total_balance: String;
  confirmend_balance: String;
  unconfirmend_balance: String;
  locked_balance: String;
  reserved_balance_anchor_chan: String;
  account_balance: String;
}

function Home() {
  // TODO: Check always if localstorage token is there, otherwise log out

  const [newAddress, setNewAddress] = React.useState("");

  const [isCopied, setIsCopied] = React.useState(false);

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
    Axios.post("http://localhost:3001/walletbalance", {
      user_id_token: localStorage.getItem("isLoggedIn"),
    })
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

  const createNewAddress = () => {
    setIsCopied(false);
    Axios.post("http://localhost:3001/newaddress", {
      user_id_token: localStorage.getItem("isLoggedIn"),
    }).then((response) => {
      console.log(response.data);
      setNewAddress(response.data.address);
    });
  };

  const copied = () => {
    setIsCopied(true);
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
                label="Confirmed Balance"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      {walletBalance.confirmend_balance}
                    </InputAdornment>
                  ),
                }}
                disabled
              />
              <TextField
                id="outlined-controlled"
                label="Unconfirmed Balance"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      {walletBalance.unconfirmend_balance}
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
          <Card sx={{ maxWidth: 450 }}>
            <CardContent>
              <h3>
                Get started by depositing bitcoin into your Lightning Node with
                an on-chain Transaction.
              </h3>
              <Button onClick={createNewAddress} variant="contained">
                Deposit Bitcoin
              </Button>
              <br></br>
              <br></br>
              <Grid
                container
                rowSpacing={1}
                columnSpacing={{ xs: 1, sm: 2, md: 3 }}
              >
                {newAddress !== "" ? (
                  <>
                    <b>Send BTC to this address:</b>
                    {newAddress}
                    &nbsp;&nbsp;
                    <div onClick={copied} className="hover-button">
                      <CopyToClipboardButton text={newAddress} />
                    </div>
                    {isCopied ? (
                      <div>
                        <CheckIcon fontSize="small" />
                        Copied
                      </div>
                    ) : (
                      <></>
                    )}
                  </>
                ) : (
                  <></>
                )}
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </CardContent>
      <Button onClick={reloadData} variant="contained">
        Reload Data
      </Button>
      {localStorage.getItem("isLoggedIn")}
    </div>
  );
}

export default Home;
