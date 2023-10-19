import { Paper, styled } from "@mui/material";

type MessageData = {
  content: string;
  role: string;
};

const UserMessageContainer = styled(Paper)({
  display: "flex",
  flexDirection: "column",
  padding: "16px",
  alignSelf: "flex-end",

  marginLeft: "32px",
});

const AssistantMessageContainer = styled(Paper)({
  display: "flex",
  flexDirection: "column",
  padding: "16px",
  alignSelf: "flex-start",
  marginRight: "32px",
  backgroundColor: "#e5faff",
});

type Props = { message: MessageData };

const Message = ({ message }: Props) => {
  if (message.role === "user") {
    return <UserMessageContainer>{message.content}</UserMessageContainer>;
  }
  return (
    <AssistantMessageContainer>{message.content}</AssistantMessageContainer>
  );
};

export default Message;
