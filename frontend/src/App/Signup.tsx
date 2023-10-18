import { useNavigate } from "react-router-dom";
import { useAuth } from "../service/Auth";
import { useFormik } from "formik";
import {
  Box,
  Button,
  Container,
  Grid,
  Link,
  TextField,
  Typography,
} from "@mui/material";

const Signup = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
      confirmedPassword: "",
    },
    validate: (values) => {
      const errors: Partial<typeof values> = {};
      if (!values.username) {
        errors.username = "Required";
      }
      if (!values.password) {
        errors.password = "Required";
      }
      if (values.password.length < 6) {
        errors.password = "Password must be at least 6 characters";
      }
      if (!values.confirmedPassword) {
        errors.confirmedPassword = "Required";
      }
      if (values.password !== values.confirmedPassword) {
        errors.confirmedPassword = "Password not match";
      }
      return errors;
    },
    onSubmit: async (values) => {
      const { username, password } = values;
      const status = await register(username, password);
      if (status === 409) {
        formik.setErrors({
          username: "Invalid username",
        });
      } else if (status === 401) {
        console.log("Unauthorized");
        formik.setErrors({
          username: "Username already existed",
          password: "Invalid username or password",
        });
      } else {
        navigate("/login");
      }
    },
  });
  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          alignItems: "center",
          flexDirection: "column",
        }}
      >
        <Typography
          variant="h5"
          noWrap
          component="h1"
          sx={{
            fontWeight: 500,
            pb: 2,
          }}
        >
          Register
        </Typography>
        <Box component="form" onSubmit={formik.handleSubmit} sx={{ mt: 1 }}>
          <TextField
            autoFocus
            fullWidth
            id="username"
            name="username"
            label="username"
            value={formik.values.username}
            onChange={formik.handleChange}
            error={!!formik.touched.username && !!formik.errors.username}
            helperText={formik.touched.username && formik.errors.username}
          ></TextField>
          <TextField
            margin="normal"
            fullWidth
            id="password"
            name="password"
            type="password"
            label="password"
            value={formik.values.password}
            onChange={formik.handleChange}
            error={!!formik.touched.password && !!formik.errors.password}
            helperText={formik.touched.password && formik.errors.password}
          ></TextField>
          <TextField
            margin="normal"
            fullWidth
            id="confirmedPassword"
            name="confirmedPassword"
            type="confirmedPassword"
            label="Retype Password"
            value={formik.values.confirmedPassword}
            onChange={formik.handleChange}
            error={!!formik.touched.confirmedPassword && !!formik.errors.confirmedPassword}
            helperText={formik.touched.confirmedPassword && formik.errors.confirmedPassword}
          ></TextField>
          <Button type="submit" fullWidth variant="contained" sx={{ my: 3 }}>
            SIgn up
          </Button>
          <Grid item>
            <Link href="/login" variant="body2">
              {"Already have an account? Log in"}
            </Link>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
};

export default Signup;
