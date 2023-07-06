import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import Axios from "axios";

function Handling() {
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();
  const [type, setType] = useState(0);
  const [message, setMessage] = useState("");

  useEffect(() => {
    checkToken();
    const searchParams = new URLSearchParams(location.search);
    const responseDataString = searchParams.get("responseData");
    const responseData = responseDataString && JSON.parse(responseDataString);

    if (responseData) {
      setType(responseData.error.code);
      setMessage(responseData.error.message);
    }
  }, [location]);

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

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {type === 2 ? (
        <Alert variant="filled" severity="error">
          {message}
        </Alert>
      ) : (
        <Alert variant="filled" severity="success">
          {message}
        </Alert>
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
