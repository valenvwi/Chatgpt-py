import { useEffect, useRef, useState } from "react";
import axios from "axios";
import NavbarLeft from "./NavbarLeft";
import ChatBox from "./ChatBox";
import NewChat from "./NewChat";
import { styled } from "@mui/material";
import Header from "./Header";

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
});

const Chats = () => {
  const baseURL = "http://localhost:8000/api";

  const [chats, setChats] = useState<{ id: string }[]>([]);
  const [chatId, setChatId] = useState<string>();
  const [messages, setMessages] = useState<MessageData[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [aiTyping, setAiTyping] = useState(false);
  // const [userId, setUserId] = useState<string>();

  // useEffect(() => {
  //   const userId = localStorage.getItem("user_id");
  //   if (userId) {
  //     setUserId(localStorage.getItem("user_id"));
  //   }
  // },[]);


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
    try {
      const response = await axios.get(`${baseURL}/chats/`);
      setChats(response.data);
      console.log(`Using fetchChats: ${response.data}`);
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
    // Update the local state before sending the message to the backend
    setMessages([
      ...messages,
      {
        content: inputMessage,
        role: "user",
        // owner: localStorage.getItem("user_id")
      },
    ]);
    setInputMessage("");

    setAiTyping(true);

    try {
      // Simulate a delay for the typewriting effect
      const delay = 1000 + Math.random() * 1000; // Random delay between 1-2 seconds
      setTimeout(async () => {
        try {
          const response = await axios.post(`${baseURL}/chats/`, {
            chat_id: chatId || undefined,
            message: inputMessage,
          });
          console.log(response);

          // If there was no selected chat, set the selected chat to the newly created one
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
      const response = await axios.post(`${baseURL}/chats/`);
      const newChat = response.data;

      setChats([newChat, ...chats]);
      setChatId(newChat.id);
    } catch (error) {
      console.error("Error creating a new chat:", error);
    }
  };

  // if (chats.length === 0) {
  //   return (
  //     <Container>
  //       <Header />
  //       <NewChat createNewChat={createNewChat} />
  //     </Container>
  //   );
  // }

  return (
    <Container>
      <Header />
      <Content>
        <NavbarLeft chats={chats} chatId={chatId} setChatId={setChatId} createNewChat={createNewChat} />
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
