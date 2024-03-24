const ThreeDots = ({ color = "white" }: { color?: string }) => {
  return (
    <div className="flex items-center justify-center space-x-1  dark:invert">
      <span className="sr-only">Loading...</span>
      <div
        className={`h-2 w-2 animate-bounce rounded-full bg-${color} [animation-delay:-0.3s]`}
      ></div>
      <div
        className={`h-2 w-2 animate-bounce rounded-full bg-${color} [animation-delay:-0.15s]`}
      ></div>
      <div className={`h-2 w-2 animate-bounce rounded-full bg-${color}`}></div>
    </div>
  );
};

export default ThreeDots;
