import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MoveLeft, Search } from "lucide-react";

const NotFoundPage = () => {
  const handleGoBack = () => {
    window.history.back();
  };

  const handleGoHome = () => {
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-50 p-4">
      <Card className="max-w-lg w-full">
        <CardContent className="pt-6">
          <div className="text-center space-y-6">
            {/* 404 Icon */}
            <div className="relative mx-auto">
              <Search className="w-24 h-24 text-gray-400 mx-auto" />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl font-bold text-gray-900">404</span>
              </div>
            </div>

            {/* Error Message */}
            <div className="space-y-2">
              <h1 className="text-2xl font-bold tracking-tight text-gray-900">
                Page not found
              </h1>
              <p className="text-gray-500">
                Sorry, we couldn&apos;t find the page you&apos;re looking for. It might have been
                moved or deleted.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                variant="outline"
                className="gap-2"
                onClick={handleGoBack}
              >
                <MoveLeft className="w-4 h-4" />
                Go Back
              </Button>
              <Button
                className="gap-2"
                onClick={handleGoHome}
              >
                Go Home
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotFoundPage;