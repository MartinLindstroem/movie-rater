import React from "react";
import { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import InputLabel from "@mui/material/InputLabel";
import Alert from "@mui/material/Alert";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import CheckIcon from "@mui/icons-material/Check";

import Header from "./Header";
import { Outlet, Link } from "react-router-dom";
import { helperFunctions } from "../helpers/functions";

const Register = ({ incrementPageViews }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [helperText, setHelperText] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [severity, setSeverity] = useState("");

  // useEffect(() => {
  //   incrementPageViews();
  // }, []);

  const onClick = async () => {
    if (email === "" || password === "") {
      setHelperText("Please fill out the required fields");
    } else {
      const msg = await helperFunctions.registerUser({
        email,
        password,
      });
      if (!msg.success) {
        setSeverity("error");
        setStatusMessage(msg.error);
      } else {
        setSeverity("success");
        setStatusMessage(msg.success);
        setHelperText("");
        setEmail("");
        setPassword("");
      }
      setShowAlert(true);
    }
  };

  return (
    <div className="container">
      <h1>Sign up</h1>
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
            label="Password"
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
          <Button variant="contained" onClick={onClick}>
            Sign up
          </Button>
        </form>
        <br />
        {showAlert && (
          <Alert variant="outlined" severity={severity}>
            {statusMessage}
            {statusMessage.includes("successful") ? (
              <Link to={`/login`}>! Sign in</Link>
            ) : (
              ""
            )}
          </Alert>
        )}
      </div>
    </div>
  );
};

export default Register;
