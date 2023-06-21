import React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

function Received() {
  function createData(
    date: string,
    type: string,
    request: string,
    note: string,
    amount: number
  ) {
    return { date, type, request, note, amount };
  }

  const rows = [
    createData(
      "May 20, 15:03",
      "Request",
      "Indnasdbaberhjb3",
      "Some String",
      40.0
    ),
    createData(
      "May 20, 15:02",
      "Request",
      "Indnasdbaberhjb3",
      "Some String",
      40.0
    ),
    createData(
      "May 20, 15:00",
      "Request",
      "Indnasdbaberhjb3",
      "Some String",
      40.0
    ),
    createData(
      "May 20, 15:01",
      "Request",
      "Indnasdbaberhjb3",
      "Some String",
      40.0
    ),
  ];
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Date</TableCell>
            <TableCell align="right">Type</TableCell>
            <TableCell align="right">Request</TableCell>
            <TableCell align="right">Note</TableCell>
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
              <TableCell align="right">{row.type}</TableCell>
              <TableCell align="right">{row.request}</TableCell>
              <TableCell align="right">{row.note}</TableCell>
              <TableCell align="right">{row.amount}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default Received;
