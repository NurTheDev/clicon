import { Progress } from "@/components/ui/progress";
import { useEffect, useState } from "react";

interface ProgressLoadingProps {
  message?: string;
}

const ProgressLoading = ({ message = "Loading..." }: ProgressLoadingProps) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) return prev;
        return prev + 10;
      });
    }, 500);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-4">
      <div className="w-full max-w-md space-y-2">
        <p className="text-sm font-medium text-center">{message}</p>
        <Progress value={progress} className="w-full" />
        <p className="text-xs text-muted-foreground text-center">{progress}%</p>
      </div>
    </div>
  );
};

export default ProgressLoading;
