import React from 'react';
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';
import { MoveLeft, AlertCircle } from 'lucide-react';

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background p-4">
      <div className="max-w-md w-full space-y-8 text-center">
        {/* Error Icon */}
        <div className="flex justify-center">
          <AlertCircle className="h-24 w-24 text-destructive animate-pulse" />
        </div>
        
        {/* Error Code */}
        <h1 className="text-8xl font-bold text-foreground">404</h1>
        
        {/* Error Message */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-foreground">Page Not Found</h2>
          <p className="text-muted-foreground">
            Oops! The page you're looking for seems to have wandered off into the digital wilderness.
          </p>
        </div>
        
        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          <Button 
            variant="default"
            className="flex items-center gap-2"
            onClick={() => navigate('/')}
          >
            <MoveLeft className="h-4 w-4" />
            Go Home
          </Button>
          <Button 
            variant="outline"
            onClick={() => navigate(-1)}
          >
            Go Back
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;