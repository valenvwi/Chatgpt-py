import Message from "./Message";

const ChatBox = ({
  messages,
  inputMessage,
  setInputMessage,
  sendMessage,
  aiTyping,
  messagesEndRef,
  formatMessageContent
}) => {
  return (
    <div className="chat-ui">
      <div className="chat-messages">
        {messages.map((message, index) => (
          <Message
            key={index}
            message={message}
            formatMessageContent={formatMessageContent}
          />
        ))}
        {aiTyping && (
          <div className="message assistant">
            <div className="typing-indicator">
              <span className="dot"></span>
              <span className="dot"></span>
              <span className="dot"></span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef}></div>
      </div>
      <div className="chat-input">
      <textarea
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

      <button onClick={sendMessage} disabled={!inputMessage}>Send Message</button>
    </div>
    </div>
  );
};

export default ChatBox;
