import { useState } from "react";

import { Link } from "react-router-dom";

import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";

function Navbar() {
  const isLoggedIn = localStorage.getItem("isLoggedIn");
  const [, setForceRender] = useState("");

  const logout = () => {
    localStorage.setItem("isLoggedIn", "false");
    setForceRender(" ");
  };

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar component="nav">
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            sx={{ mr: 2, display: { sm: "none" } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1, display: { xs: "none", sm: "block" } }}
          >
            <Stack direction="row">
              <Link to="/" style={{ textDecoration: "none" }}>
                <Button sx={{ my: 2, color: "white", display: "block" }}>
                  Home
                </Button>
              </Link>
              <Link to="/History" style={{ textDecoration: "none" }}>
                <Button sx={{ my: 2, color: "white", display: "block" }}>
                  History
                </Button>
              </Link>
              <Link to="/Connect" style={{ textDecoration: "none" }}>
                <Button sx={{ my: 2, color: "white", display: "block" }}>
                  Connect
                </Button>
              </Link>
              <Link to="/Channels" style={{ textDecoration: "none" }}>
                <Button sx={{ my: 2, color: "white", display: "block" }}>
                  Channels
                </Button>
              </Link>
              <Link to="/handling" style={{ textDecoration: "none" }}>
                <Button sx={{ my: 2, color: "white", display: "block" }}>
                  handling
                </Button>
              </Link>
            </Stack>
          </Typography>
          <Box sx={{ display: { xs: "none", sm: "block" } }}>
            {isLoggedIn?.startsWith("ey") ? (
              <Button
                onClick={logout}
                sx={{ my: 2, color: "white", display: "block" }}
              >
                Logout
              </Button>
            ) : (
              <Link to="/Login" style={{ textDecoration: "none" }}>
                <Button sx={{ my: 2, color: "white", display: "block" }}>
                  Login
                </Button>
              </Link>
            )}
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
}

export default Navbar;
