interface DotsLoadingProps {
  message?: string;
  size?: "sm" | "md" | "lg";
}

const DotsLoading = ({ message, size = "md" }: DotsLoadingProps) => {
  const dotSizes = {
    sm: "h-2 w-2",
    md: "h-3 w-3",
    lg: "h-4 w-4",
  };

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <div className="flex space-x-2">
        <div
          className={`${dotSizes[size]} bg-primary rounded-full animate-bounce`}
          style={{ animationDelay: "0ms" }}
        />
        <div
          className={`${dotSizes[size]} bg-primary rounded-full animate-bounce`}
          style={{ animationDelay: "150ms" }}
        />
        <div
          className={`${dotSizes[size]} bg-primary rounded-full animate-bounce`}
          style={{ animationDelay: "300ms" }}
        />
      </div>
      {message && <p className="text-sm text-muted-foreground">{message}</p>}
    </div>
  );
};

export default DotsLoading;
