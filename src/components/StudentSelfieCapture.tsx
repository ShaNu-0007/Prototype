import React, { useState, useRef, useEffect } from 'react';
import { Camera, RotateCcw, Check, ArrowLeft } from 'lucide-react';
import { Student, QRData } from '../types';

interface StudentSelfieCaptureProps {
  student: Student;
  qrData: QRData;
  onSelfieCapture: (selfieData: string) => void;
  onBack: () => void;
}

export const StudentSelfieCapture: React.FC<StudentSelfieCaptureProps> = ({ 
  student, 
  qrData, 
  onSelfieCapture, 
  onBack 
}) => {
  const [isCapturing, setIsCapturing] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [error, setError] = useState('');
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    startCamera();
    return () => {
      stopCamera();
    };
  }, []);

  const startCamera = async () => {
    try {
      setError('');
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'user' } 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        setIsCapturing(true);
      }
    } catch (err) {
      setError('Camera access denied. Please allow camera access to continue.');
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsCapturing(false);
  };

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const video = videoRef.current;
    const context = canvas.getContext('2d');

    if (context && video.readyState === video.HAVE_ENOUGH_DATA) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      // Flip the image horizontally for selfie mode
      context.scale(-1, 1);
      context.drawImage(video, -canvas.width, 0);
      context.scale(-1, 1);

      const imageDataURL = canvas.toDataURL('image/jpeg', 0.8);
      setCapturedImage(imageDataURL);
      stopCamera();
    }
  };

  const retakePhoto = () => {
    setCapturedImage(null);
    startCamera();
  };

  const confirmPhoto = () => {
    if (capturedImage) {
      onSelfieCapture(capturedImage);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-2xl">
        <div className="flex items-center mb-6">
          <button
            onClick={onBack}
            className="mr-3 p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors duration-200"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Take Selfie</h1>
            <p className="text-gray-600">Capture your photo for attendance verification</p>
          </div>
        </div>

        {/* Student and Session Info */}
        <div className="bg-gray-50 rounded-xl p-4 mb-6">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-500">Student:</span>
              <p className="font-semibold text-gray-800">{student.name}</p>
            </div>
            <div>
              <span className="text-gray-500">Enrollment:</span>
              <p className="font-semibold text-gray-800">{student.enrollment}</p>
            </div>
            <div>
              <span className="text-gray-500">Subject:</span>
              <p className="font-semibold text-gray-800">{qrData.subject}</p>
            </div>
            <div>
              <span className="text-gray-500">Teacher:</span>
              <p className="font-semibold text-gray-800">{qrData.teacherName}</p>
            </div>
          </div>
        </div>

        {/* Camera/Photo Display */}
        <div className="relative bg-gray-900 rounded-2xl overflow-hidden mb-6" style={{ height: '400px' }}>
          {!capturedImage ? (
            <>
              <video
                ref={videoRef}
                className="w-full h-full object-cover scale-x-[-1]"
                playsInline
                muted
              />
              <canvas ref={canvasRef} className="hidden" />
              
              {!isCapturing && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center text-white">
                    <Camera size={48} className="mx-auto mb-4 opacity-50" />
                    <p className="text-lg">Camera not active</p>
                  </div>
                </div>
              )}

              {isCapturing && (
                <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2">
                  <button
                    onClick={capturePhoto}
                    className="bg-white text-gray-800 w-16 h-16 rounded-full flex items-center justify-center shadow-lg hover:bg-gray-100 transition-colors duration-200 transform hover:scale-105"
                  >
                    <Camera size={24} />
                  </button>
                </div>
              )}
            </>
          ) : (
            <img 
              src={capturedImage} 
              alt="Captured Selfie" 
              className="w-full h-full object-cover"
            />
          )}
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-4">
          {capturedImage ? (
            <>
              <button
                onClick={retakePhoto}
                className="flex-1 bg-gray-600 text-white py-3 rounded-lg font-semibold hover:bg-gray-700 transition-colors duration-200 flex items-center justify-center gap-2"
              >
                <RotateCcw size={20} />
                Retake
              </button>
              <button
                onClick={confirmPhoto}
                className="flex-1 bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors duration-200 flex items-center justify-center gap-2"
              >
                <Check size={20} />
                Continue
              </button>
            </>
          ) : (
            <div className="text-center text-gray-500 flex-1">
              {isCapturing ? 'Position yourself and click the camera button' : 'Initializing camera...'}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};