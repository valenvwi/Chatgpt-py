import { Divider, List, ListItem, ListItemButton, styled } from "@mui/material";
import AddBoxIcon from "@mui/icons-material/AddBox";
import { useMemo } from "react";
import * as dayjs from "dayjs";
import CategorizedList from "./CategorizedList";

const StyledList = styled(List)(({ theme }) => ({
  width: 200,
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.spacing(1),
  border: "1px solid rgba(0, 0, 0, 0.12)",
  flexShrink: 0,
  overflowY: "auto",
  [theme.breakpoints.down("sm")]: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    zIndex: 1,
  },
}));

type Props = {
  chats: { id: string; created_at: Date }[];
  chatId: string | undefined;
  setChatId: (chatId: string) => void;
  createNewChat: () => void;
};

const categorizeChats = (chats: { id: string; created_at: Date }[]) => {
  const today = dayjs();
  const yesterday = dayjs().subtract(1, "day");
  const startOfMonth = dayjs().startOf("month");

  const todayChats: { id: string; created_at: Date }[] = [];
  const yesterdayChats: { id: string; created_at: Date }[] = [];
  const thisMonthChats: { id: string; created_at: Date }[] = [];
  const olderChats: { id: string; created_at: Date }[] = [];

  chats.forEach((chat) => {
    const chatDate = dayjs(chat.created_at);
    if (chatDate.isSame(today, "day")) {
      todayChats.push(chat);
    } else if (chatDate.isSame(yesterday, "day")) {
      yesterdayChats.push(chat);
    } else if (chatDate.isAfter(startOfMonth)) {
      thisMonthChats.push(chat);
    } else {
      olderChats.push(chat);
    }
  });

  return {
    todayChats,
    yesterdayChats,
    thisMonthChats,
    olderChats,
  };
};

const NavbarLeft = ({ chats, setChatId, createNewChat }: Props) => {
  // const [categorizedChats, setCategorizedChats] = useState({
  //   todayChats: [],
  //   yesterdayChats: [],
  //   thisMonthChats: [],
  //   olderChats: [],
  // });

  // useEffect(() => {
  //   const categorized = categorizeChats(chats);
  //   setCategorizedChats(categorized);
  // }, [chats]);

  const categorizedChats = useMemo(() => categorizeChats(chats), [chats]);

  return (
    <StyledList>
      <ListItem color="inherit" disablePadding>
        <ListItemButton onClick={createNewChat}>
          <AddBoxIcon sx={{ m: 1 }} /> New Chat
        </ListItemButton>
      </ListItem>
      <Divider />
      {categorizedChats.todayChats.length > 0 && (
        <CategorizedList
          chatList={categorizedChats.todayChats}
          title="Today"
          setChatId={setChatId}
        />
      )}
      {categorizedChats.yesterdayChats.length > 0 && (
        <CategorizedList
          chatList={categorizedChats.yesterdayChats}
          title="Yesterday"
          setChatId={setChatId}
        />
      )}
      {categorizedChats.thisMonthChats.length > 0 && (
        <CategorizedList
          chatList={categorizedChats.thisMonthChats}
          title="This Month"
          setChatId={setChatId}
        />
      )}
      {categorizedChats.olderChats.length > 0 && (
        <CategorizedList
          chatList={categorizedChats.olderChats}
          title="Older"
          setChatId={setChatId}
        />
      )}
    </StyledList>
  );
};

export default NavbarLeft;
