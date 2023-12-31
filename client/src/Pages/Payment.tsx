import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Button from "@mui/material/Button";
import Axios from "axios";
import Alert from "@mui/material/Alert";

import TextField from "@mui/material/TextField";

function Payment() {
  const [isLoading, setIsLoading] = useState(true);
  const [amount, setAmount] = useState("");
  const [invoice, setInvoice] = useState({
    add_index: "",
    payment_addr: "",
    payment_request: "",
    r_hash: "",
  });
  const [confirm, setConfirm] = useState(0);
  const [amountToSmall, setAmountToSmall] = useState(false);
  const [error, setError] = useState("");

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

  useEffect(() => {
    checkToken();
  }, []);

  const checkToken = () => {
    const token = localStorage.getItem("isLoggedIn");

    Axios.get("http://localhost:3002/api/accessResource", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then((response) => {
      if (!response.data.success) {
        const responseData = "false";
        window.location.href = `http://localhost:3000/Login?responseData=${JSON.stringify(
          responseData
        )}`;
      } else {
        setIsLoading(false);
      }
    });
  };

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
      console.log(response.data)
     
      const responseArray = response.data.split("}}");
      console.log(responseArray);

      const lastPart = responseArray[responseArray.length - 2] + "}}";
      console.log(lastPart);
      const errorMessage = JSON.parse(lastPart);
      const failure_reason = errorMessage.result.failure_reason; 
      if (failure_reason === "FAILURE_REASON_NONE") {
        setConfirm(2);
      } else {
        setConfirm(3);
        setError(failure_reason);
     }
    });
  };

  const handleAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const input = event.target.value;
    if (/^\d*$/.test(input)) {
      setAmount(input);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

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
      ) : confirm === 2 ? (
        <Alert variant="filled" severity="success">
          Payment Successful!
        </Alert>
      ) : (
        <>
          <Alert variant="filled" severity="error">
            {error}
          </Alert>
          <br></br>
          <Alert variant="filled" severity="info">
            Tipp: You can never spend the whole amount of the channel, to
            provide an incentive against cheating. {/* TODO: find out the amount a channel always requires */}
          </Alert> 
        </>
      )}
    </div>
  );
}

export default Payment;
