import React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

function Sent() {
  function createData(
    date: string,
    status: string,
    to: string,
    request: string,
    note: string,
    fee: number,
    amount: number
  ) {
    return { date, status, to, request, note, fee, amount };
  }

  const rows = [
    createData(
      "May 20, 15:03",
      "Complete",
      "0xjnsuf3h42hjrb2br",
      "Indnasdbaberhjb3",
      "Some String",
      0,
      40.0
    ),
    createData(
      "May 20, 15:02",
      "Complete",
      "0xjnsuf3h42hjrb2br",
      "Indnasdbaberhjb3",
      "Some String",
      0,
      40.0
    ),
    createData(
      "May 20, 15:01",
      "Complete",
      "0xjnsuf3h42hjrb2br",
      "Indnasdbaberhjb3",
      "Some String",
      0,
      40.0
    ),
    createData(
      "May 20, 15:04",
      "Complete",
      "0xjnsuf3h42hjrb2br",
      "Indnasdbaberhjb3",
      "Some String",
      0,
      40.0
    ),
  ];
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Date</TableCell>
            <TableCell align="right">Status</TableCell>
            <TableCell align="right">To</TableCell>
            <TableCell align="right">Request</TableCell>
            <TableCell align="right">Note</TableCell>
            <TableCell align="right">Fee</TableCell>
            <TableCell align="right">Amount</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow
              key={row.date}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {row.date}
              </TableCell>
              <TableCell align="right">{row.status}</TableCell>
              <TableCell align="right">{row.to}</TableCell>
              <TableCell align="right">{row.request}</TableCell>
              <TableCell align="right">{row.note}</TableCell>
              <TableCell align="right">{row.fee}</TableCell>
              <TableCell align="right">{row.amount}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default Sent;
