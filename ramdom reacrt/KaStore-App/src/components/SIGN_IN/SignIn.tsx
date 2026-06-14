import React, { useState,FC } from "react";
import { useNavigate } from "react-router-dom";
import {
  TextField,
  Button,
  Typography,
  Box,
  Paper,
  RadioGroup,
  Radio,
  FormControlLabel,
  Checkbox,
  Link,
  Snackbar,
  Alert,
} from "@mui/material";

interface AuthProps {
  onLogin:(item:any) => void;
}
const Auth:FC<AuthProps> = ({onLogin}) => {
  const [isSignIn, setIsSignIn] = useState(true);
  var [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [gender, setGender] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [error1, setError1] = useState("");
  const [error2, setError2] = useState("");
  const [error3, setError3] = useState("");
  const [error4, setError4] = useState("");
  const [error5, setError5] = useState("");
  const [error6, setError6] = useState("");
  const [error, setError] = useState("");

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const navigate = useNavigate();

  const resetFields = () => {
    setEmail("");
    setPassword("");
    setUsername("");
    setConfirmPassword("");
    setGender("");
    setAcceptTerms(false);
    setError1("");
    setError2("");
    setError3("");
    setError4("");
    setError("");
    setError5("");
    setError6("");
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    let hasError = false;

    if (isSignIn) {
      const users = JSON.parse(localStorage.getItem("users") || "[]");
      const savedUser = users.find((user: any) => user.email === email && user.password === password);
      
      if (savedUser) {
        localStorage.setItem("loggedInUser", JSON.stringify(savedUser)); 
        setSnackbarMessage(`Login successful! Welcome, ${savedUser.username}`);
        setSnackbarOpen(true);
        onLogin(savedUser); 
        setTimeout(() => {
          navigate("/");
        }, 1000);
        resetFields();
      } else {
        setError("Incorrect email or password");
      }
    } else {
      if (!email.includes("@")) {
        setError1("Please enter a valid email address");
        hasError = true;
      }
      if (!username) {
        setError6("Please enter a username");
        hasError = true;
      }
      if (password !== confirmPassword) {
        setError2("Passwords do not match");
        hasError = true;
      }
      if (!/^(?=.*[A-Z]).{6,}$/.test(password)) {
        setError3(
          "Password must have at least 6 characters and 1 uppercase letter"
        );
        hasError = true;
      }
      if (!gender) {
        setError4("Please select a gender");
        hasError = true;
      }
      if (!acceptTerms) {
        setError5("Please accept terms and privacy policy");
        hasError = true;
      }

      if (!hasError) {
        const newUser = { email, password, username, gender };
        const users = JSON.parse(localStorage.getItem("users") || "[]");
        users.push(newUser); 
        localStorage.setItem("users", JSON.stringify(users)); 
        setSnackbarMessage(`Registration Successfull`);
        setSnackbarOpen(true);
        resetFields();
        setIsSignIn(true); 
      }
    }
  };

  return (
    <Box>

      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="85vh"
      >
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={3000} 
          onClose={() => setSnackbarOpen(false)}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert
            onClose={() => setSnackbarOpen(false)}
            severity="success"
            sx={{ width: "100%", fontSize: "20px" }}
          >
            {snackbarMessage}
          </Alert>
        </Snackbar>

        <Paper elevation={3} sx={{ padding: 4, maxWidth: 400 }}>
          <Box display="flex" justifyContent="space-around" mb={3}>
            <Button
              onClick={() => setIsSignIn(true)}
              sx={{
                backgroundColor: isSignIn ? "#E6F1FF" : "white",
                fontWeight: isSignIn ? "bold" : "normal",
                fontSize: "24px",
              }}
            >
              Log In
            </Button>
            <Button
              onClick={() => setIsSignIn(false)}
              sx={{
                backgroundColor: !isSignIn ? "#E6F1FF" : "white",
                fontWeight: !isSignIn ? "bold" : "normal",
                fontSize: "24px",
              }}
            >
              Register
            </Button>
          </Box>
          {isSignIn ? (
            <Box
              component="form"
              onSubmit={handleSubmit}
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                mt: 3,
              }}
            >
              <TextField 
                label={
                  <Typography variant="h6" fontWeight={"bold"} >
                    Email
                  </Typography>
                }
                variant="outlined"
                fullWidth
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError1("");
                }}
                sx={{ mb: 2,
                  "& .MuiOutlinedInput-input": {
                    fontSize: "13px", 
                  },}}
              />

              <TextField
                label={
                  <Typography variant="h6" fontWeight={"bold"}>
                    Password
                  </Typography>
                }
                type="password"
                variant="outlined"
                fullWidth
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError(""); 
                }}
                sx={{ mb: 2,
                  "& .MuiOutlinedInput-input": {
                    fontSize: "13px", 
                  }, }}
              />
              {error && (
                <Typography
                  variant="h6"
                  fontWeight={"bold"}
                  color="error"
                  align="center"
                >
                  {error}
                </Typography>
              )}
              <Link
                marginTop={"5px"}
                href="#"
                variant="body2"
                sx={{ alignSelf: "flex-end", mb: 2, fontSize: "16px" }}
              >
                Forgot password?
              </Link>

              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                sx={{ backgroundColor: "#F40F22", fontSize: "20px" }}
              >
                Log in
              </Button>
            </Box>
          ) : (
            <Box
              component="form"
              onSubmit={handleSubmit}
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                mt: 3,
              }}
            >
              <TextField
                label={
                  <Typography variant="h6" fontWeight={"bold"}>
                    Email
                  </Typography>
                }
                variant="outlined"
                fullWidth
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
                sx={{ mb: 2,
                  "& .MuiOutlinedInput-input": {
                    fontSize: "13px"
                  },  }}
              />
              {error1 && (
                <Typography
                  variant="h6"
                  fontWeight={"bold"}
                  color="error"
                  align="center"
                  marginTop={"-10px"}
                  marginBottom={"10px"}
                >
                  {error1}
                </Typography>
              )}
              <TextField
                label={
                  <Typography variant="h6" fontWeight={"bold"}>
                    Username
                  </Typography>
                }
                variant="outlined"
                fullWidth
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  setError1(""); 
                }}
                sx={{ mb: 2, "& .MuiOutlinedInput-input": {
                  fontSize: "13px", 
                },  }}
              />
   {error6 && ( 
                <Typography
                  variant="h6"
                  fontWeight={"bold"}
                  color="error"
                  align="center"
                  marginTop={"-10px"}
                  marginBottom={"10px"}
                >
                  {error6}
                </Typography>
              )}
              <TextField
                label={
                  <Typography variant="h6" fontWeight={"bold"}>
                    Password
                  </Typography>
                }
                type="password"
                variant="outlined"
                fullWidth
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError3(""); 
                }}
                sx={{ mb: 2,
                  "& .MuiOutlinedInput-input": {
                    fontSize: "13px", 
                  },  }}
              />
              {error3 && (
                <Typography
                  variant="h6"
                  fontWeight={"bold"}
                  color="error"
                  align="center"
                  marginTop={"-10px"}
                  marginBottom={"10px"}
                >
                  {error3}
                </Typography>
              )}
              <TextField
                label={
                  <Typography variant="h6" fontWeight={"bold"}>
                    Confirm Password
                  </Typography>
                }
                type="password"
                variant="outlined"
                fullWidth
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  setError2("");
                }}
                sx={{ mb: 2, "& .MuiOutlinedInput-input": {
                  fontSize: "13px", 
                },  }}
              />
              {error2 && (
                <Typography
                  variant="h6"
                  fontWeight={"bold"}
                  color="error"
                  align="center"
                  marginTop={"-10px"}
                  marginBottom={"10px"}
                >
                  {error2}
                </Typography>
              )}
              <RadioGroup
                row
                value={gender}
                onChange={(e) => {
                  setGender(e.target.value);
                  setError4(""); 
                }}
                sx={{ mb: 2 }}
              >
                <FormControlLabel
                  value="female"
                  control={<Radio />}
                  label={
                    <Typography variant="h6" fontWeight={"bold"}>
                      Female
                    </Typography>
                  }
                />
                <FormControlLabel
                  value="male"
                  control={<Radio />}
                  label={
                    <Typography variant="h6" fontWeight={"bold"}>
                      Male
                    </Typography>
                  }
                />
              </RadioGroup>
              {error4 && (
                <Typography
                  color="error"
                  variant="h6"
                  fontWeight={"bold"}
                  align="center"
                  marginTop={"-20px"}
                  marginBottom={"15px"}
                >
                  {error4}
                </Typography>
              )}
              <FormControlLabel
                control={
                  <Checkbox
                    checked={acceptTerms}
                    onChange={(e) => setAcceptTerms(e.target.checked)}
                  />
                }
                label={
                  <Typography variant="h6" fontWeight={"bold"}>
                    I have read and agree to the privacy policy.
                  </Typography>
                }
              />
              {error5 && (
                <Typography
                  color="error"
                  variant="h6"
                  fontWeight={"bold"}
                  align="center"
                  marginTop={"-10px"}
                  marginBottom={"10px"}
                >
                  {error5}
                </Typography>
              )}
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                sx={{ backgroundColor: "#F40F22", fontSize: "20px" }}
              >
                Register
              </Button>
            </Box>
          )}
        </Paper>
      </Box>
    </Box>
  );
};

export default Auth;
