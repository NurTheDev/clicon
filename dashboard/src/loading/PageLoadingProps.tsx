import { Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface PageLoadingProps {
  message?: string;
}

const PageLoading = ({ message = "Loading data..." }: PageLoadingProps) => {
  return (
    <div className="flex h-[calc(100vh-4rem)] items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardContent className="flex flex-col items-center justify-center p-8">
          <Loader2 className="h-16 w-16 animate-spin text-primary mb-4" />
          <h3 className="text-lg font-semibold mb-2">Please Wait</h3>
          <p className="text-sm text-muted-foreground text-center">{message}</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default PageLoading;
