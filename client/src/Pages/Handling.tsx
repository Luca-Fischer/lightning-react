import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import MuiAlert, { AlertProps } from "@mui/material/Alert";
import { Link } from "react-router-dom";
import Button from "@mui/material/Button";

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

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
        <Alert severity="error">{message}</Alert>
      ) : (
        <Alert severity="success">{message}</Alert>
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
