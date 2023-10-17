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

  marginLeft: "16px",
});

const AssistantMessageContainer = styled(Paper)({
  display: "flex",
  flexDirection: "column",
  padding: "16px",
  alignSelf: "flex-start",
  marginRight: "16px",
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
  // return (
  //   <div
  //     className={`message ${message.role === "user" ? "user" : "assistant"}`}
  //     dangerouslySetInnerHTML={{
  //       __html: formatMessageContent(message.content),
  //     }}
  //   />
  // );
};

export default Message;
