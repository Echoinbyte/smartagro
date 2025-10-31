import { useEffect, useRef, useState } from "react";
import { Camera, RotateCcw, Save, Shuffle } from "lucide-react";

function Add() {
  const video = useRef<HTMLVideoElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const [isCaptured, setIsCaptured] = useState(false);
  const [facingMode, setFacingMode] = useState<"user" | "environment">(
    "environment"
  );

  async function startCamera() {
    try {
      if (video.current?.srcObject) {
        const stream = video.current.srcObject as MediaStream;
        stream.getTracks().forEach((track) => track.stop());
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode },
      });
      if (video.current) {
        video.current.srcObject = stream;
      }
    } catch (err) {
      alert("Camera access denied or not available.");
      console.error(err);
    }
  }

  const handleCapture = () => {
    if (!canvas.current || !video.current) return;

    const context = canvas.current.getContext("2d");
    if (!context) return;

    canvas.current.width = video.current.videoWidth;
    canvas.current.height = video.current.videoHeight;
    context.drawImage(
      video.current,
      0,
      0,
      canvas.current.width,
      canvas.current.height
    );
    setIsCaptured(true);
  };

  const handleRetake = () => {
    setIsCaptured(false);
    startCamera();
  };

  const handleFlip = () => {
    setFacingMode((prev) => (prev === "user" ? "environment" : "user"));
  };

  const handleSubmit = async () => {
    if (!canvas.current) return;

    canvas.current.toBlob(
      (blob) => {
        if (blob) {
          const file = new File([blob], `capture-${Date.now()}.jpg`, {
            type: "image/jpeg",
          });

          // TODO: Will handle Backend Logic
          console.log("Submitting file:", file);
        }
      },
      "image/jpeg",
      0.95
    );
  };

  useEffect(() => {
    startCamera();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [facingMode]);

  useEffect(() => {
    const videoElement = video.current;

    return () => {
      if (videoElement?.srcObject) {
        const stream = videoElement.srcObject as MediaStream;
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  return (
    <div className="relative w-[calc(100vw-1px)] h-[calc(100vh-1px)] overflow-hidden bg-black">
      <video
        ref={video}
        autoPlay
        playsInline
        className={`w-full h-full object-cover ${
          isCaptured ? "hidden" : "block"
        }`}
      />
      <canvas
        ref={canvas}
        className={`w-full h-full object-cover ${
          isCaptured ? "block" : "hidden"
        }`}
      />

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
        {!isCaptured ? (
          <div className="flex items-center gap-4">
            <button
              onClick={handleCapture}
              className="bg-white rounded-full p-4 shadow-lg hover:bg-gray-100 active:scale-95 transition-all duration-200 cursor-pointer"
              aria-label="Capture photo"
            >
              <Camera className="w-8 h-8 text-gray-800" />
            </button>
            <button
              onClick={handleFlip}
              className="bg-white rounded-full p-3 shadow-lg hover:bg-gray-100 active:scale-95 transition-all duration-200 cursor-pointer"
              aria-label="Flip"
            >
              <Shuffle className="w-6 h-6 text-gray-800" />
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-4">
            <button
              onClick={handleRetake}
              className="bg-white rounded-full p-3 shadow-lg hover:bg-gray-100 active:scale-95 transition-all duration-200 cursor-pointer"
              aria-label="Retake photo"
            >
              <RotateCcw className="w-6 h-6 text-gray-800" />
            </button>
            <button
              onClick={handleSubmit}
              className="bg-primary/90 rounded-full p-4 shadow-lg hover:bg-primary active:scale-95 transition-all duration-200 cursor-pointer"
              aria-label="Submit"
            >
              <Save className="w-8 h-8 text-white" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Add;
