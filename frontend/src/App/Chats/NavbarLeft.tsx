import {
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Paper,
} from "@mui/material";
import AddBoxIcon from "@mui/icons-material/AddBox";

type Props = {
  chats: { id: string }[];
  chatId: string | undefined;
  setChatId: (chatId: string) => void;
  createNewChat: () => void;
};

const NavbarLeft = ({ chats, setChatId, createNewChat }: Props) => {
  return (
    <>
      <List component={Paper} sx={{ minWidth: 200 }}>
        <ListItem color="inherit" disablePadding >
          <ListItemButton onClick={createNewChat}>
          <AddBoxIcon sx={{ m:1}}/> New Chat
          </ListItemButton>
        </ListItem>
        {chats.map((chat, index) => (
          <ListItem key={chat.id} disablePadding>
            <ListItemButton onClick={() => setChatId(chat.id)}>
              <ListItemText>Chat {chats.length - index}</ListItemText>
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </>
  );
};

export default NavbarLeft;
