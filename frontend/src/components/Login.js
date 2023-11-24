import React from "react";
import { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { Outlet, Link } from "react-router-dom";
import { helperFunctions } from "../helpers/functions";
import Alert from "@mui/material/Alert";

const Login = ({ login, incrementPageViews }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [helperText, setHelperText] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [severity, setSeverity] = useState("");

  useEffect(() => {
    incrementPageViews();
  }, []);

  const onClick = async () => {
    if (email === "" || password === "") {
      setHelperText("Please fill out the required fields");
    } else {
      const msg = await helperFunctions.login({
        email,
        password,
      });
      if (msg.error) {
        setSeverity("error");
        setStatusMessage(msg.error);
      } else {
        setSeverity("success");
        setStatusMessage("Successfully logged in!");
        login({ username: msg.username, email: msg.email });
        setHelperText("");
        setEmail("");
        setPassword("");
      }
      setShowAlert(true);
    }
  };

  return (
    <div className="container">
      <h1>Sign in</h1>
      <div>
        <form>
          <TextField
            autoFocus
            margin="dense"
            id="email"
            label="Email"
            type="text"
            fullWidth
            variant="standard"
            autoComplete="off"
            value={email}
            required={true}
            helperText={email ? "" : helperText}
            error={email ? "" : helperText}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            margin="dense"
            id="password"
            label="password"
            type="password"
            fullWidth
            variant="standard"
            autoComplete="off"
            value={password}
            required={true}
            helperText={password ? "" : helperText}
            error={password ? "" : helperText}
            onChange={(e) => setPassword(e.target.value)}
          />
          <br />
          <br />
          <Button variant="contained" onClick={onClick}>
            Sign in
          </Button>
        </form>
        <span>
          <p className="register">Don't have an account? </p>
          <Link to={`/register`}> Sign up</Link>
        </span>
        <br />
        {showAlert && (
          <Alert variant="outlined" severity={severity}>
            {statusMessage}
          </Alert>
        )}
      </div>
    </div>
  );
};

export default Login;
