import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import Button from "@mui/material/Button";
import Axios from "axios";
import Alert from "@mui/material/Alert";

import TextField from "@mui/material/TextField";

function Payment() {
  const [amount, setAmount] = useState("");
  const [invoice, setInvoice] = useState({
    add_index: "",
    payment_addr: "",
    payment_request: "",
    r_hash: "",
  });
  const [confirm, setConfirm] = useState(0);
  const [amountToSmall, setAmountToSmall] = useState(false);

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const responseData = searchParams.get("responseData");

  let id = "";
  let name = "";

  if (responseData) {
    const dataParts = responseData.split("-sep-");
    if (dataParts.length === 2) {
      id = dataParts[0];
      name = dataParts[1];
    }
  }

  const addInvoice = () => {
    if (Number(amount) > 0) {
      Axios.post("http://localhost:3001/addinvoice", {
        user_id_token: id,
        amount: amount,
      }).then((response) => {
        console.log(response.data);
        setInvoice(response.data);
        setConfirm(1);
        setAmountToSmall(false);
      });
    } else {
      setAmountToSmall(true);
    }
  };

  const sendPayment = () => {
    Axios.post("http://localhost:3001/sendpayment", {
      user_id_token: localStorage.getItem("isLoggedIn"),
      payment_request: invoice.payment_request,
      amount: amount,
    }).then((response) => {
      console.log(response); // check if response is good, then setConfirm(3)
    });
    setConfirm(3);
  };

  const handleAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const input = event.target.value;
    if (/^\d*$/.test(input)) {
      setAmount(input);
    }
  };

  return (
    <div>
      <h3>Payment to {name}</h3>
      {!amountToSmall ? (
        <TextField
          label="Amount"
          value={amount}
          onChange={handleAmountChange}
          variant="outlined"
          type="number"
          inputProps={{ inputMode: "numeric" }}
        />
      ) : (
        <TextField
          error
          label="Amount"
          value={amount}
          helperText="Set an amount!"
          onChange={handleAmountChange}
          variant="outlined"
          type="number"
          inputProps={{ inputMode: "numeric" }}
        />
      )}
      <br></br>
      <br></br>
      {confirm === 0 ? (
        <Button variant="contained" onClick={addInvoice}>
          Create Payment
        </Button>
      ) : confirm === 1 ? (
        <Button variant="contained" color="success" onClick={sendPayment}>
          Confirm Payment
        </Button>
      ) : (
        <Alert variant="filled" severity="success">
          Payment Successful!
        </Alert>
      )}
    </div>
  );
}

export default Payment;
