const TypingIndicator = () => {
  return (
    <div className="flex justify-start">
      <div className="flex items-center gap-1 rounded-2xl rounded-bl-md border border-border bg-secondary px-4 py-3">
        <span
          className="inline-block h-2 w-2 rounded-full bg-accent animate-bounce-dot"
          style={{ animationDelay: "0s" }}
        />
        <span
          className="inline-block h-2 w-2 rounded-full bg-accent animate-bounce-dot"
          style={{ animationDelay: "0.16s" }}
        />
        <span
          className="inline-block h-2 w-2 rounded-full bg-accent animate-bounce-dot"
          style={{ animationDelay: "0.32s" }}
        />
      </div>
    </div>
  );
};

export default TypingIndicator;
