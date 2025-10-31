import { useEffect, useRef, useState } from "react";
import { Camera, RotateCcw, Save, Shuffle } from "lucide-react";
import Bounded from "./landing/Bounded";
import StarGrid from "./landing/StarGrid";
import { FaCloudUploadAlt } from "react-icons/fa";

function Add() {
  const video = useRef<HTMLVideoElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isCaptured, setIsCaptured] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [capturedFile, setCapturedFile] = useState<File | null>(null);
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

  const handleUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = () => {
        setCapturedFile(file);
        setIsCaptured(true);

        if (canvas.current) {
          const img = new Image();
          img.onload = () => {
            if (canvas.current) {
              canvas.current.width = img.width;
              canvas.current.height = img.height;
              const context = canvas.current.getContext("2d");
              context?.drawImage(img, 0, 0);
            }
          };
          img.src = reader.result as string;
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    if (!canvas.current) return;

    canvas.current.toBlob(
      (blob) => {
        if (blob) {
          const file = new File([blob], `capture-${Date.now()}.jpg`, {
            type: "image/jpeg",
          });

          setCapturedFile(file);
          setIsSubmitted(true);
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

  if (isSubmitted && capturedFile) {
    return (
      <Bounded className="bg-white">
        <main className="w-full max-w-4xl mx-auto flex flex-col items-center justify-start gap-8 px-4">
          <div className="relative w-full flex flex-col items-center gap-4">
            <StarGrid />
            <h1 className="text-3xl md:text-4xl font-bold text-foreground">
              Details
            </h1>
          </div>
          <section className="w-full flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <h2 className="text-xl font-semibold text-foreground">
                Product Image
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-3">
                <div className="w-full aspect-video flex flex-col items-center justify-center rounded-xl cursor-pointer">
                  <div className="w-full h-full relative overflow-hidden flex items-center justify-center">
                    <img
                      src={
                        capturedFile ? URL.createObjectURL(capturedFile) : ""
                      }
                      alt="Uploaded Product Image Preview"
                      className="w-full h-full object-cover rounded"
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>
      </Bounded>
    );
  }

  return (
    <div className="relative w-[calc(100vw-1px)] h-[calc(100vh-1px)] overflow-hidden bg-white">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
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
        <div className="flex items-center gap-4">
          {!isCaptured ? (
            <>
              <button
                onClick={handleFlip}
                className="bg-white rounded-full p-3 shadow-lg hover:bg-gray-100 active:scale-95 transition-all duration-200 cursor-pointer"
                aria-label="Flip"
              >
                <Shuffle className="w-6 h-6 text-gray-800" />
              </button>
              <button
                onClick={handleCapture}
                className="bg-white rounded-full p-4 shadow-lg hover:bg-gray-100 active:scale-95 transition-all duration-200 cursor-pointer"
                aria-label="Capture photo"
              >
                <Camera className="w-8 h-8 text-gray-800" />
              </button>
              <button
                onClick={handleUpload}
                className="bg-white rounded-full p-3 shadow-lg hover:bg-gray-100 active:scale-95 transition-all duration-200 cursor-pointer"
                aria-label="Upload"
              >
                <FaCloudUploadAlt className="w-6 h-6 text-gray-800" />
              </button>
            </>
          ) : (
            <>
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
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Add;
