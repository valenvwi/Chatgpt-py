import { AppBar, IconButton, Toolbar, Typography } from "@mui/material";
import LogoutIcon from '@mui/icons-material/Logout';
import { useAuth } from "../../service/Auth";

export default function Header() {
  const { logout } = useAuth();

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          ChatGPT wiht Django and React
        </Typography>
        <IconButton color="inherit" onClick={logout}>
          <LogoutIcon />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
}
