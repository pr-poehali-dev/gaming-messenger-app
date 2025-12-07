import { useEffect, useState } from 'react';

interface SplashScreenProps {
  onComplete: () => void;
}

const SplashScreen = ({ onComplete }: SplashScreenProps) => {
  const [showLetter, setShowLetter] = useState(false);

  useEffect(() => {
    const letterTimer = setTimeout(() => {
      setShowLetter(true);
    }, 800);

    const completeTimer = setTimeout(() => {
      onComplete();
    }, 2200);

    return () => {
      clearTimeout(letterTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-background via-card to-background">
      <div className="relative">
        <div className="w-32 h-32 rounded-3xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center animate-logo-appear shadow-2xl">
          <div className="relative w-full h-full flex items-center justify-center">
            <div className="absolute inset-0 rounded-3xl animate-glow-pulse" />
          </div>
        </div>
        
        {showLetter && (
          <div className="absolute -top-2 -right-2 w-16 h-16 rounded-2xl bg-gradient-to-br from-secondary to-primary flex items-center justify-center text-3xl font-bold animate-letter-slide shadow-xl">
            R
          </div>
        )}
      </div>
    </div>
  );
};

export default SplashScreen;
