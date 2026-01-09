import { Play, Pause, Volume2, VolumeX } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { Button } from "./ui/button";

const AudioControl = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Audio file path
  const audioSrc = "/music/back.mp3";

  // Handle audio play/pause
  const togglePlayPause = async () => {
    if (!audioRef.current) return;

    try {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        await audioRef.current.play();
        setIsPlaying(true);
      }
    } catch (error) {
      console.error("Audio playback error:", error);
      setHasError(true);
      setIsPlaying(false);
    }
  };

  // Handle mute/unmute
  const toggleMute = () => {
    if (!audioRef.current) return;

    if (isMuted) {
      audioRef.current.muted = false;
      audioRef.current.volume = 0.5;
      setIsMuted(false);
    } else {
      audioRef.current.muted = true;
      audioRef.current.volume = 0;
      setIsMuted(true);
    }
  };

  // Setup global interaction listener to unmute
  useEffect(() => {
    const handleInteraction = () => {
      const audio = audioRef.current;
      if (audio) {
        // Unmute if muted
        if (audio.muted) {
          audio.muted = false;
          audio.volume = 0.5;
          setIsMuted(false);
        }

        // Force play if paused (covers cases where autoplay was blocked entirely)
        if (audio.paused) {
          const playPromise = audio.play();
          if (playPromise !== undefined) {
            playPromise.then(() => {
              setIsPlaying(true);
              console.log("Audio started by user interaction");
            }).catch(e => console.log("Play failed on interaction (likely rapid toggle):", e.name));
          }
        }
      }
    };

    const events = ['click', 'keydown', 'touchstart', 'scroll'];
    events.forEach(event => {
      document.addEventListener(event, handleInteraction, { once: true });
    });

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, handleInteraction);
      });
    };
  }, []);

  // Handle audio events
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleCanPlay = () => {
      setIsLoading(false);
      setHasError(false);
      // Ensure we are playing (muted) if not already
      if (audio.paused) {
        // Attempt to play, but handle expected autoplay rejection
        const playPromise = audio.play();
        if (playPromise !== undefined) {
          playPromise.then(() => {
            setIsPlaying(true);
            console.log("Muted autoplay confirmed");
          }).catch(e => {
            // Auto-play was prevented. This is expected in many browsers.
            // We just update state to show paused UI.
            console.log("Autoplay prevented (expected behavior):", e.name);
            setIsPlaying(false);
          });
        }
      }
    };

    const handleError = (e: Event) => {
      console.error("Audio error:", e);
      setIsLoading(false);
      setHasError(true);
      setIsPlaying(false);
    };

    const handleEnded = () => {
      if (!hasError) {
        audio.currentTime = 0;
        audio.play().catch(console.error);
      }
    };

    audio.addEventListener("canplay", handleCanPlay);
    audio.addEventListener("error", handleError);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("canplay", handleCanPlay);
      audio.removeEventListener("error", handleError);
      audio.removeEventListener("ended", handleEnded);
    };
  }, []);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <audio
        ref={audioRef}
        src={audioSrc}
        loop
        preload="auto"
        muted
        autoPlay
      />

      <div className="flex items-center space-x-2">
        <Button
          size="icon"
          variant="secondary"
          onClick={toggleMute}
          className={`rounded-full w-12 h-12 bg-card/90 hover:bg-primary hover:text-primary-foreground transition-smooth shadow-lg ${isMuted ? 'bg-red-500/20 border-red-500' : 'bg-green-500/20 border-green-500'
            }`}
          title={isMuted ? "Unmute music" : "Mute music"}
        >
          {isMuted ? (
            <VolumeX className="w-6 h-6" />
          ) : (
            <Volume2 className="w-6 h-6" />
          )}
        </Button>

        <Button
          size="icon"
          variant="secondary"
          onClick={togglePlayPause}
          disabled={isLoading}
          className={`rounded-full w-12 h-12 bg-card/90 hover:bg-primary hover:text-primary-foreground transition-smooth shadow-lg ${hasError ? 'bg-red-500/20 border-red-500' : ''
            }`}
          title={
            hasError
              ? "Audio file not found or corrupted"
              : isPlaying
                ? "Pause music"
                : "Play music"
          }
        >
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
          ) : hasError ? (
            <span className="text-red-500">⚠</span>
          ) : isPlaying ? (
            <Pause className="w-6 h-6" />
          ) : (
            <Play className="w-6 h-6" />
          )}
        </Button>
      </div>
    </div>
  );
};

export default AudioControl;
