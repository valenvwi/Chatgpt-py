import { useEffect, useRef, useState } from "react";
import NavbarLeft from "./NavbarLeft";
import ChatBox from "./ChatBox";
import { styled, useTheme } from "@mui/material";
import Header from "./Header";
import useMediaQuery from "@mui/material/useMediaQuery";
import { BASEURL } from "../../config";
import useAxiosWithJwtInterceptor from "../../helpers/jwtinterceptor";

type MessageData = { content: string; role: string };

const Container = styled("div")({
  display: "flex",
  flexDirection: "column",
  height: "100%",
});

const Content = styled("div")({
  flexGrow: 1,
  display: "flex",
  backgroundColor: "#eeeeee",
  position: "relative",
  overflow: "hidden",
});

const Chats = () => {
  const [chats, setChats] = useState<{ id: string; created_at: Date }[]>([]);
  const [chatId, setChatId] = useState<string>();
  const [messages, setMessages] = useState<MessageData[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [aiTyping, setAiTyping] = useState(false);

  const jwtAxios = useAxiosWithJwtInterceptor();

  useEffect(() => {
    fetchChats();
  }, []);

  useEffect(() => {
    if (chatId) {
      fetchMessages(chatId);
    } else {
      setMessages([]);
    }
  }, [chatId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "auto" });
  };

  const fetchChats = async () => {
    const userId = localStorage.getItem("user_id");
    try {
      const response = await jwtAxios.get(`${BASEURL}/chats/?by_userId=${userId}`);
      setChats(response.data);
    } catch (error) {
      console.error("Error fetching chats:", error);
    }
  };

  const fetchMessages = async (chatId: string) => {
    try {
      const response = await jwtAxios.get(`${BASEURL}/chats/${chatId}/`);
      setMessages(response.data);
      console.log(`Using fetchMessages: ${response.data}`);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  const sendMessage = async () => {
    setMessages([
      ...messages,
      {
        content: inputMessage,
        role: "user",
      },
    ]);
    setInputMessage("");
    setAiTyping(true);

    try {
      const delay = 1000 + Math.random() * 1000;
      setTimeout(async () => {
        try {
          const response = await jwtAxios.post(`${BASEURL}/chats/${chatId}/`, {
            chat_id: chatId || undefined,
            owner: localStorage.getItem("user_id"),
            message: inputMessage,
          });
          console.log(response);

          if (!chatId) {
            setChatId(response.data.chat_id);
            setChats([{ id: response.data.chat_id,
              created_at: response.data.created_at }, ...chats]);
          } else {
            fetchMessages(chatId);
          }
        } catch (error) {
          console.error("Error sending message:", error);
          setMessages([
            ...messages,
            {
              content:
                "Sorry, I'm having trouble communicating with the server. 😔",
              role: "assistant",
            },
          ]);
        } finally {
          setAiTyping(false);
        }
      }, delay);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const createNewChat = async () => {
    try {
      const response = await jwtAxios.post(`${BASEURL}/chats/`, {
        owner: localStorage.getItem("user_id"),
      });
      console.log(response);
    } catch (error) {
      console.error("Error creating a new chat:", error);
    }
    fetchChats();
  };

  const [navbarExpanded, setNavbarExpanded] = useState(false);
  const theme = useTheme();
  const isBigScreen = useMediaQuery(theme.breakpoints.up("sm"));

  return (
    <Container>
      <Header
        showButton={!isBigScreen}
        onMenuClick={() => setNavbarExpanded((previousValue) => !previousValue)}
      />
      <Content>
        {(navbarExpanded || isBigScreen) && (
          <NavbarLeft
            chats={chats}
            chatId={chatId}
            setChatId={setChatId}
            createNewChat={createNewChat}
          />
        )}
        <ChatBox
          messages={messages}
          inputMessage={inputMessage}
          setInputMessage={setInputMessage}
          sendMessage={sendMessage}
          aiTyping={aiTyping}
          messagesEndRef={messagesEndRef}
        />
      </Content>
    </Container>
  );
};

export default Chats;
