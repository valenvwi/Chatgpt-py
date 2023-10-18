import {
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  styled,
} from "@mui/material";
import AddBoxIcon from "@mui/icons-material/AddBox";

const StyledList = styled(List)(({ theme }) => ({
  width: 200,
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.spacing(1),
  border: "1px solid rgba(0, 0, 0, 0.12)",
  [theme.breakpoints.down("sm")]: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    zIndex: 1,
  },
}));

type Props = {
  chats: { id: string }[];
  chatId: string | undefined;
  setChatId: (chatId: string) => void;
  createNewChat: () => void;
};

const NavbarLeft = ({ chats, setChatId, createNewChat }: Props) => {
  return (
    <StyledList>
      <ListItem color="inherit" disablePadding>
        <ListItemButton onClick={createNewChat}>
          <AddBoxIcon sx={{ m: 1 }} /> New Chat
        </ListItemButton>
      </ListItem>
      <Divider />
      {chats.map((chat, index) => (
        <ListItem key={chat.id} disablePadding>
          <ListItemButton onClick={() => setChatId(chat.id)}>
            <ListItemText>Chat {chats.length - index}</ListItemText>
          </ListItemButton>
        </ListItem>
      ))}
    </StyledList>
  );
};

export default NavbarLeft;
