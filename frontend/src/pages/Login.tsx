import type { LoginUserSchema } from "@backend/model/UserModel";
import { UserRole } from "@backend/types";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { Button, Link, TextField, Typography } from "@mui/material";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { SubmitHandler, useForm } from "react-hook-form";
import { Link as RRDLink, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks";
import { API } from "../services";
import { errorSnackbar, getErrorMessage, successSnackbar } from "../utils";

// Import the image directly
import loginImage from "../assets/images/login.jpg";

const defaultTheme = createTheme();

export default function SignInSide() {
  const { account, setAccount } = useAuth();

  console.log({ account });
  const navigate = useNavigate();
  const { register, handleSubmit } = useForm<LoginUserSchema>();

  const onSubmit: SubmitHandler<LoginUserSchema> = async (data) => {
    let errorMessage = "";
    try {
      // send request
      const response = await API.login(data);
      // store account details
      console.log("error");
      console.log({ data: response.data });
      setAccount(response.data.data);
      // show snackbar
      successSnackbar("Logged in successfully");
      if (response.data.data.user.role === UserRole.seller) {
        navigate("/seller/dashboard");
      } else {
        navigate("/");
      }
      return;
    } catch (error) {
      errorMessage = getErrorMessage(error);
    }
    errorSnackbar(errorMessage);
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Grid container component="main" sx={{ height: "100vh" }}>
        <CssBaseline />
        <Grid
          item
          xs={false}
          sm={4}
          md={7}
          sx={{
            backgroundImage: `url(${loginImage})`, // Use image directly
            backgroundColor: (t) =>
              t.palette.mode === "light"
                ? t.palette.grey[50]
                : t.palette.grey[900],
            backgroundSize: "cover",
            backgroundPosition: "center", // Changed from "left" for better alignment
          }}
        />
        <Grid
          item
          xs={12}
          sm={8}
          md={5}
          component={Paper}
          sx={{ backgroundColor: "#FAF9F6" }}
          elevation={6}
          square
        >
          <Box
            sx={{
              my: 8,
              mx: 4,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Login
            </Typography>
            <Box
              component="form"
              onSubmit={handleSubmit(onSubmit)}
              sx={{ mt: 1 }}
            >
              <TextField
                margin="normal"
                required
                type="email"
                fullWidth
                id="email"
                label="Email Address"
                autoComplete="email"
                {...register("email")}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                {...register("password")}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Login
              </Button>
              <Grid container>
                <Grid item>
                  <Link to="/signup" variant="body2" component={RRDLink}>
                    {"Don't have an account? Sign Up"}
                  </Link>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}
