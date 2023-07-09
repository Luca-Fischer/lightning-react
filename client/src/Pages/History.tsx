import React, { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import SendIcon from "@mui/icons-material/Send";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import Stack from "@mui/material/Stack";
import Axios from "axios";

import Sent from "../Components/Sent";
import Received from "../Components/Received";

function History() {
  const [isLoading, setIsLoading] = useState(true);

  const [showTable, setShowTable] = useState(true);

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

  

  const showReceived = () => {
    setShowTable(false);
  };

  const showSent = () => {
    setShowTable(true);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Transactions</h1>
      <Stack direction="row" spacing={2}>
        {showTable ? (
          <div>
            <Button
              variant="contained"
              endIcon={<SendIcon />}
              style={{ marginBottom: 20 }}
            >
              Sent
            </Button>{" "}
            <Button
              onClick={showReceived}
              variant="outlined"
              startIcon={<ArrowDownwardIcon />}
              style={{ marginBottom: 20 }}
            >
              Received
            </Button>
            <Sent />
          </div>
        ) : (
          <div>
            <Button
              onClick={showSent}
              variant="outlined"
              endIcon={<SendIcon />}
              style={{ marginBottom: 20 }}
            >
              Sent
            </Button>{" "}
            <Button
              variant="contained"
              startIcon={<ArrowDownwardIcon />}
              style={{ marginBottom: 20 }}
            >
              Received
            </Button>
            <Received />
          </div>
        )}
      </Stack>
    </div>
  );
}

export default History;
