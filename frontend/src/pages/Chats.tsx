import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import NavbarLeft from "../components/NavbarLeft";
import ChatBox from "../components/ChatBox";

const Chats = () => {
  const baseURL = "http://localhost:8000/api";

  const [chats, setChats] = useState([]);
  const [chatId, setChatId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const messagesEndRef = useRef(null);
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
    try {
      const response = await axios.get(`${baseURL}/chats/`);
      setChats(response.data);
      console.log(`Using fetchChats: ${response.data}`);
    } catch (error) {
      console.error("Error fetching chats:", error);
    }
  };

  const fetchMessages = async (chatId) => {
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

  function formatMessageContent(content) {
    const sections = content.split(/(```[\s\S]*?```|`[\s\S]*?`)/g);
    return sections
      .map((section) => {
        if (section.startsWith("```") && section.endsWith("```")) {
          section = section.split("\n").slice(1).join("\n");
          const code = section.substring(0, section.length - 3);
          return `<pre><code class="code-block">${code}</code></pre>`;
        } else if (section.startsWith("`") && section.endsWith("`")) {
          const code = section.substring(1, section.length - 1);
          return `<code class="inline-code">${code}</code>`;
        } else {
          return section.replace(/\n/g, "<br>");
        }
      })
      .join("");
  }

  return (
    <div>
      <h1>ChatGPT wiht Django and React</h1>
      {chats.length === 0 ? (
        <>
          <h1>Start a new Chat</h1>
          <button className="new-chat-button" onClick={createNewChat}>
            <strong>+ New Chat</strong>
          </button>
        </>
      ) : (
        <>
          <NavbarLeft chats={chats} chatId={chatId} setChatId={setChatId} />
          <ChatBox
            messages={messages}
            inputMessage={inputMessage}
            setInputMessage={setInputMessage}
            sendMessage={sendMessage}
            aiTyping={aiTyping}
            messagesEndRef={messagesEndRef}
            formatMessageContent={formatMessageContent}
          />
        </>
      )}
    </div>
  );
};

export default Chats;
