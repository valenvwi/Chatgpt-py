import { AppBar, IconButton, Toolbar, Typography } from "@mui/material";
import AddBoxIcon from "@mui/icons-material/AddBox";

type Props = {
  createNewChat: () => void;
};

export default function Header({ createNewChat }: Props) {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          ChatGPT wiht Django and React
        </Typography>
        <IconButton color="inherit" onClick={createNewChat}>
          <AddBoxIcon />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
}
