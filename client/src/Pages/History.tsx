import React, { useState } from "react";
import Button from "@mui/material/Button";
import SendIcon from "@mui/icons-material/Send";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import Stack from "@mui/material/Stack";

import Sent from "../Components/Sent";
import Received from "../Components/Received";

function History() {
  const [showTable, setShowTable] = useState(true);

  const showReceived = () => {
    setShowTable(false);
  };

  const showSent = () => {
    setShowTable(true);
  };
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
