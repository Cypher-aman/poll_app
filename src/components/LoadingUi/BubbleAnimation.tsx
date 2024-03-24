const BubbleAnimation = () => {
  return (
    <div
      className="text-surface inline-block h-12 w-12 animate-[spinner-grow_0.75s_linear_infinite] rounded-full bg-black align-[-0.125em] opacity-0 motion-reduce:animate-[spinner-grow_1.5s_linear_infinite] dark:text-white"
      role="status"
    >
      <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
        Loading...
      </span>
    </div>
  );
};

export default BubbleAnimation;
