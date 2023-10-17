import React from "react";

const NavbarLeft = ({ chats, chatId, setChatId }) => {
  return (
    <div className="chat-history">
      {chats.map((chat, index) => (
        <div key={chat.id}>
          <div onClick={() => setChatId(chat.id)}>
            Chat {chats.length - index}
          </div>
        </div>
      ))}
    </div>
  );
};

export default NavbarLeft;
