import { AuthApiTypes } from "@backend/controller/auth";
import { UserRole } from "@backend/types";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import {
  Button,
  Stack,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { API } from "../services";
import { errorSnackbar, getErrorMessage, successSnackbar } from "../utils";

// Importing a custom background image
import signupImage from "../assets/images/login.jpg";

const defaultTheme = createTheme();

type CreateUserSchema = AuthApiTypes["signup"]["request"];

export default function Signup() {
  const navigate = useNavigate();
  const { register, handleSubmit, control, setValue } =
    useForm<CreateUserSchema>({
      defaultValues: {
        role: UserRole.user,
      },
    });

  const onSubmit: SubmitHandler<CreateUserSchema> = async (data) => {
    let errorMessage;
    try {
      await API.signup(data);
      successSnackbar("Signed up successfully");
      navigate("/login");
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
        {/* Left Side Background Image */}
        <Grid
          item
          xs={false}
          sm={4}
          md={7}
          sx={{
            backgroundImage: `url(${signupImage})`,
            backgroundColor: (t) =>
              t.palette.mode === "light"
                ? t.palette.grey[50]
                : t.palette.grey[900],
            backgroundSize: "cover",
            backgroundPosition: "center", // Center the image
          }}
        />
        {/* Right Side Signup Form */}
        <Grid
          item
          xs={12}
          sm={8}
          md={5}
          component={Paper}
          elevation={6}
          square
          sx={{
            backgroundColor: "#FAF9F6",
            display: "flex", // Flexbox to enable centering
            justifyContent: "center", // Centers horizontally
            alignItems: "center", // Centers vertically
          }}
        >
          <Box
            sx={{
              my: 4, // Vertical margin for spacing
              mx: 4, // Horizontal margin for spacing
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Sign Up
            </Typography>
            <Box
              component="form"
              onSubmit={handleSubmit(onSubmit)}
              sx={{ mt: 1 }}
            >
              <TextField
                margin="normal"
                required
                fullWidth
                type="email"
                id="email"
                label="Email Address"
                autoComplete="email"
                {...register("email")}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                type="password"
                id="password"
                label="Password"
                autoComplete="password"
                {...register("password")}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                type="text"
                id="username"
                label="Username"
                autoComplete="username"
                {...register("username")}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                type="text"
                id="mobileNumber"
                label="Mobile Number"
                autoComplete="mobileNumber"
                {...register("mobileNumber")}
              />
              <Stack
                direction={"row"}
                justifyContent={"space-between"}
                gap={4}
                sx={{ mt: 2 }}
                alignItems={"center"}
              >
                <Controller
                  name="role"
                  control={control}
                  render={({ field }) => {
                    return (
                      <ToggleButtonGroup
                        size="small"
                        {...field}
                        onChange={(_, value) => setValue(field.name, value)}
                        exclusive
                      >
                        <ToggleButton value="user" sx={{ width: 100 }}>
                          Buyer
                        </ToggleButton>
                        <ToggleButton value="seller" sx={{ width: 100 }}>
                          Seller
                        </ToggleButton>
                      </ToggleButtonGroup>
                    );
                  }}
                />
              </Stack>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Sign Up
              </Button>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}
