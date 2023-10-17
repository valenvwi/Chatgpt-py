type Props = {
  createNewChat: () => void;
};

export default function NewChat({ createNewChat }: Props) {
  return (
    <div>
      <h1>Start a new Chat</h1>
      <button className="new-chat-button" onClick={createNewChat}>
        <strong>+ New Chat</strong>
      </button>
    </div>
  );
}
