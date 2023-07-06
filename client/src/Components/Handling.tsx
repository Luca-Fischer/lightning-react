import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import Button from "@mui/material/Button";
import Alert from '@mui/material/Alert';


function Handling() {
  const location = useLocation();
  const [type, setType] = useState(0);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const responseDataString = searchParams.get("responseData");
    const responseData = responseDataString && JSON.parse(responseDataString);

    if (responseData) {
      setType(responseData.error.code);
      setMessage(responseData.error.message);
    }
  }, [location]);

  return (
    <div>
      {type === 2 ? (
        <Alert variant="filled" severity="error">{message}</Alert>
      ) : (
        <Alert variant="filled" severity="success">{message}</Alert>
      )}
      <br></br>
      <br></br>
      <Link to="/" style={{ textDecoration: "none" }}>
        <Button variant="contained">Go Back</Button>
      </Link>
    </div>
  );
}

export default Handling;
