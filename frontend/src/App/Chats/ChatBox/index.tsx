import {
  Box,
  IconButton,
  LinearProgress,
  TextField,
  styled,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import Message from "./Message";
import { useEffect, useState } from "react";

type MessageData = {
  content: string;
  role: string;
};

const Container = styled("div")({
  flexGrow: 1,
  display: "flex",
  flexDirection: "column",
  padding: "16px",
  gap: "16px",
});

const DefaultMessageContainer = styled("div")({
  flexGrow: 1,
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
});

const MessagesContainer = styled("div")({
  flexGrow: 1,
  height: 0,
  overflowY: "auto",
  display: "flex",
  flexDirection: "column",
  gap: "8px",
});

const InputContainer = styled("div")({
  display: "flex",
  gap: "16px",
});

type Props = {
  messages: MessageData[];
  inputMessage: string;
  setInputMessage: (inputMessage: string) => void;
  sendMessage: () => void;
  aiTyping: boolean;
  messagesEndRef: React.RefObject<HTMLDivElement>;
};

const ChatBox = ({
  messages,
  inputMessage,
  setInputMessage,
  sendMessage,
  aiTyping,
  messagesEndRef,
}: Props) => {

  const username =localStorage.getItem("username");

  return (
    <Container>
      <MessagesContainer>
        {messages.length === 0 && (
          <DefaultMessageContainer>
            <p>Hi {username}! Ask me anything!</p>
          </DefaultMessageContainer>
        )}
        {messages.map((message, index) => (
          <Message key={index} message={message} />
        ))}
        {aiTyping && (
          <Box sx={{ width: "80%", margin: 'auto' }}>
            <LinearProgress />
          </Box>
        )}
        <div ref={messagesEndRef}></div>
      </MessagesContainer>

      <InputContainer>
        <TextField
          sx={{ flexGrow: 1, backgroundColor: "white" }}
          placeholder="Type a message"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              if (inputMessage) {
                sendMessage();
              }
            }
          }}
        />

        <IconButton onClick={sendMessage} disabled={!inputMessage}>
          <SendIcon />
        </IconButton>
      </InputContainer>
    </Container>
  );
};

export default ChatBox;
