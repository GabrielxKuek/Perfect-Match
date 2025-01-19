import React, { useState, useEffect, useRef } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { UserCircle, X } from 'lucide-react';
import { Alert, AlertDescription } from "@/components/ui/alert";

const AreYouSure = ({
  isOpen,
  onClose,
  onConfirm,
  profile,
  className
}) => {
  const [basePosition, setBasePosition] = useState({ x: 0, y: 0 });
  const [dodgeOffset, setDodgeOffset] = useState({ x: 0, y: 0 });
  const [clickCount, setClickCount] = useState(0);
  const [showError, setShowError] = useState(false);
  const dialogRef = useRef(null);
  
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!dialogRef.current || !isOpen) return;

      const dialogRect = dialogRef.current.getBoundingClientRect();
      const dialogCenterX = dialogRect.left + dialogRect.width / 2;
      const dialogCenterY = dialogRect.top + dialogRect.height / 2;
      const mouseX = e.clientX;
      const mouseY = e.clientY;

      const distance = Math.sqrt(
        Math.pow(mouseX - dialogCenterX, 2) + 
        Math.pow(mouseY - dialogCenterY, 2)
      );

      const isNear = distance < 250;

      if (isNear) {
        const angle = Math.atan2(mouseY - dialogCenterY, mouseX - dialogCenterX);
        const dodgeDistance = 100;
        const newX = -Math.cos(angle) * dodgeDistance;
        const newY = -Math.sin(angle) * dodgeDistance;

        setDodgeOffset({ x: newX, y: newY });
      } else {
        setDodgeOffset({ x: 0, y: 0 });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [isOpen]);

  // Reset positions and click count when dialog opens
  useEffect(() => {
    if (isOpen) {
      setBasePosition({ x: 0, y: 0 });
      setDodgeOffset({ x: 0, y: 0 });
      setClickCount(0);
      setShowError(false);
    }
  }, [isOpen]);

  const teleportRandomly = () => {
    const maxX = window.innerWidth / 2 - 200;
    const maxY = window.innerHeight / 2 - 200;
    
    const randomX = Math.random() * maxX * 2 - maxX;
    const randomY = Math.random() * maxY * 2 - maxY;
    
    setBasePosition({ x: randomX, y: randomY });
    setDodgeOffset({ x: 0, y: 0 });
  };

  const handlePassClick = () => {
    const newClickCount = clickCount + 1;
    setClickCount(newClickCount);
    
    teleportRandomly();
    
    if (newClickCount >= 3) {
      setShowError(true);
      // Close after showing error
      setTimeout(() => {
        setClickCount(0);
        setShowError(false);
        onConfirm();
        onClose();
      }, 1000);
    }
  };

  // Combine base position from teleports with dodge offset from mouse
  const finalPosition = {
    x: basePosition.x + dodgeOffset.x,
    y: basePosition.y + dodgeOffset.y
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        ref={dialogRef}
        className="sm:max-w-md transition-transform duration-200 ease-out fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        style={{
          transform: `translate(calc(-50% + ${finalPosition.x}px), calc(-50% + ${finalPosition.y}px))`
        }}
      >
        <DialogHeader>
          <DialogTitle>Are you sure?</DialogTitle>
          <DialogDescription>
            You&apos;re about to pass on {profile?.name}
          </DialogDescription>
        </DialogHeader>
       
        <div className="flex items-center space-x-4 py-4">
          <div className="h-20 w-20 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
            {profile?.profileUrl ? (
              <img
                src={profile.profileUrl}
                alt={`${profile.name}'s profile`}
                className="w-full h-full object-cover"
              />
            ) : (
              <UserCircle className="w-12 h-12 text-[#318CE7]" />
            )}
          </div>
          <div>
            <h4 className="font-semibold text-lg">{profile?.name}, {profile?.age}</h4>
            <p className="text-sm text-gray-500">{profile?.occupation}</p>
          </div>
        </div>

        {showError && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>
              An error has occurred, please try again
            </AlertDescription>
          </Alert>
        )}

        <DialogFooter className="flex sm:justify-between sm:space-x-2">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="flex-1"
          >
            Keep Viewing
          </Button>
          <Button
            type="button"
            className="flex-1 bg-[#FF7F11] hover:bg-[#FF7F11]/90"
            onClick={handlePassClick}
          >
            <X className="mr-2 h-4 w-4" />
            Pass
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AreYouSure;