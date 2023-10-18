import { AppBar, IconButton, Toolbar, Typography } from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import MenuIcon from "@mui/icons-material/Menu";
import { useAuth } from "../../service/Auth";

type Props = {
  showButton: boolean;
  onMenuClick: () => void;
};

export default function Header({ showButton, onMenuClick }: Props) {
  const { logout } = useAuth();

  return (
    <AppBar position="static">
      <Toolbar sx={{ gap: 2 }}>
        {showButton && (
          <IconButton color="inherit" onClick={onMenuClick}>
            <MenuIcon />
          </IconButton>
        )}
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          ChatGPT clone
        </Typography>
        <IconButton color="inherit" onClick={logout}>
          <LogoutIcon />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
}
