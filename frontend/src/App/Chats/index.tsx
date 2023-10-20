import { useEffect, useRef, useState } from "react";
import axios from "axios";
import NavbarLeft from "./NavbarLeft";
import ChatBox from "./ChatBox";
import { styled, useTheme } from "@mui/material";
import Header from "./Header";
import useMediaQuery from "@mui/material/useMediaQuery";

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
});

const Chats = () => {
  const baseURL = "http://localhost:8000/api";

  const [chats, setChats] = useState<{ id: string, created_at: Date }[]>([]);
  const [chatId, setChatId] = useState<string>();
  const [messages, setMessages] = useState<MessageData[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [aiTyping, setAiTyping] = useState(false);


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
      const response = await axios.get(
        `${baseURL}/chats/?by_userId=${userId}`,
        {}
      );
      setChats(response.data);
    } catch (error) {
      console.error("Error fetching chats:", error);
    }
  };

  const fetchMessages = async (chatId: string) => {
    try {
      const response = await axios.get(`${baseURL}/chats/${chatId}/`);
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
          const response = await axios.post(`${baseURL}/chats/${chatId}/`, {
            chat_id: chatId || undefined,
            owner: localStorage.getItem("user_id"),
            message: inputMessage,
          });
          console.log(response);

          if (!chatId) {
            setChatId(response.data.chat_id);
            setChats([{ id: response.data.chat_id }, ...chats]);
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
      const response = await axios.post(`${baseURL}/chats/`, {
        owner: localStorage.getItem("user_id"),
      });
      const newChat = response.data;

      setChats([newChat, ...chats]);
      setChatId(newChat.id);
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
