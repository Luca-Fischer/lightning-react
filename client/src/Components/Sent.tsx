import React, { useEffect, useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Axios from "axios";
import UnixTimestamp from "./UnixTimestamp";

interface Data {
  creation_date: string;
  fee_sat: string;
  status: string;
  payment_request: string; // TODO: payment request onclick and https://api.lightning.community/api/lnd/lightning/decode-pay-req 
  value_sat: string;
} //TODO: check if the other data is usefull (https://api.lightning.community/api/lnd/lightning/list-payments): htlcs, payment_preimage, payment_hash

function Sent() {
  const [data, setData] = useState<Data[]>([]);

  useEffect(() => {
    listPayments();
  }, []);

  const listPayments = () => {
    Axios.post("http://localhost:3001/listpayments", {
      user_id_token: localStorage.getItem("isLoggedIn"),
    }).then((response) => {
      console.log(response.data);
      setData(response.data);
    });
  };

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell align="right">Date</TableCell>
            <TableCell align="right">Status</TableCell>
            <TableCell align="right">Amount</TableCell>
            <TableCell align="right">Fee</TableCell>
            <TableCell align="right">Payment Rqeuest</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row) => (
            <TableRow
              key={row.creation_date}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                <div style={{ whiteSpace: "nowrap" }}>
                  <UnixTimestamp unixTime={row.creation_date} />
                </div>
              </TableCell>
              <TableCell align="right">{row.status}</TableCell>
              <TableCell align="right">{row.value_sat}</TableCell>
              <TableCell align="right">{row.fee_sat}</TableCell>
              <TableCell align="right">
                {" "}
                {`${row.payment_request.slice(
                  0,
                  15
                )}...${row.payment_request.slice(-15)}`}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default Sent;
