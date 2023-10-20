import {
  ListItem,
  ListItemButton,
  ListItemText,
  Typography,
} from "@mui/material";

type Props = {
  title: string;
  chatList: { id: string; created_at: Date }[];
  setChatId: (chatId: string) => void;
};

const CategorizedList = ({ title, chatList, setChatId }: Props) => {
  console.log('Using CategorizedList:', chatList);

  return (
    <>
      <ListItem sx={{ mt: 1 }}>
        <Typography sx={{ fontWeight: 700 }}>{title}</Typography>
      </ListItem>
      {chatList.map((chat, index) => (
        <ListItem key={chat.id} disablePadding>
          <ListItemButton onClick={() => setChatId(chat.id)}>
            <ListItemText>Chat {chatList.length - index}</ListItemText>
          </ListItemButton>
        </ListItem>
      ))}
    </>
  );
};

export default CategorizedList;
