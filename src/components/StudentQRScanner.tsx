import React, { useState, useRef, useEffect } from 'react';
import { Camera, Scan, AlertCircle, ArrowRight } from 'lucide-react';
import { parseQRData } from '../utils/qrUtils';
import { storageUtils } from '../utils/storage';
import { QRData } from '../types';

interface StudentQRScannerProps {
  onValidQR: (qrData: QRData) => void;
  onSwitchToTeacher: () => void;
}

export const StudentQRScanner: React.FC<StudentQRScannerProps> = ({ onValidQR, onSwitchToTeacher }) => {
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState('');
  const [manualQRInput, setManualQRInput] = useState('');
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const startScanning = async () => {
    try {
      setError('');
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        setIsScanning(true);

        // Start QR scanning interval
        intervalRef.current = setInterval(() => {
          captureAndScan();
        }, 1000);
      }
    } catch (err) {
      setError('Camera access denied. Please allow camera access and try again.');
    }
  };

  const stopScanning = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    
    setIsScanning(false);
  };

  const captureAndScan = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const video = videoRef.current;
    const context = canvas.getContext('2d');

    if (context && video.readyState === video.HAVE_ENOUGH_DATA) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      context.drawImage(video, 0, 0);

      // Get image data for QR scanning
      const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
      
      // Simple QR detection simulation - in real app, use a proper QR scanner library
      // For demo purposes, we'll use manual input
    }
  };

  const processQRCode = (qrString: string) => {
    const qrData = parseQRData(qrString);
    
    if (!qrData) {
      setError('Invalid QR code format. Please scan a valid attendance QR code.');
      return;
    }

    // Validate session
    const sessions = storageUtils.getSessions();
    const activeSession = sessions.find(s => 
      s.sessionId === qrData.sessionId && s.isActive
    );

    if (!activeSession) {
      setError('QR code is expired or invalid. Please scan a current QR code.');
      return;
    }

    // Check if QR is too old (more than 2 minutes)
    const qrTime = new Date(qrData.issuedAt).getTime();
    const now = new Date().getTime();
    const timeDiff = (now - qrTime) / 1000;

    if (timeDiff > 120) { // 2 minutes
      setError('QR code has expired. Please scan a fresh QR code.');
      return;
    }

    stopScanning();
    onValidQR(qrData);
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (manualQRInput.trim()) {
      processQRCode(manualQRInput.trim());
    }
  };

  useEffect(() => {
    return () => {
      stopScanning();
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-2xl">
        <div className="text-center mb-8">
          <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Scan className="text-green-600" size={32} />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Scan QR Code</h1>
          <p className="text-gray-600">Scan the QR code displayed by your teacher</p>
        </div>

        {/* Camera Section */}
        <div className="mb-8">
          <div className="relative bg-gray-900 rounded-2xl overflow-hidden" style={{ height: '300px' }}>
            <video
              ref={videoRef}
              className="w-full h-full object-cover"
              playsInline
              muted
            />
            <canvas ref={canvasRef} className="hidden" />
            
            {!isScanning && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-white">
                  <Camera size={48} className="mx-auto mb-4 opacity-50" />
                  <p className="text-lg mb-4">Camera not active</p>
                  <button
                    onClick={startScanning}
                    className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors duration-200"
                  >
                    Start Scanning
                  </button>
                </div>
              </div>
            )}

            {isScanning && (
              <div className="absolute inset-0">
                <div className="absolute top-4 left-4 right-4 text-center">
                  <div className="bg-black bg-opacity-50 text-white px-4 py-2 rounded-lg inline-block">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      Scanning for QR code...
                    </div>
                  </div>
                </div>
                
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-48 h-48 border-2 border-green-400 rounded-2xl animate-pulse"></div>
                </div>
              </div>
            )}
          </div>

          {isScanning && (
            <div className="text-center mt-4">
              <button
                onClick={stopScanning}
                className="text-red-600 hover:text-red-800 font-medium transition-colors duration-200"
              >
                Stop Scanning
              </button>
            </div>
          )}
        </div>

        {/* Manual QR Input */}
        <div className="mb-6">
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Or enter QR data manually</h3>
            <form onSubmit={handleManualSubmit} className="flex gap-3">
              <input
                type="text"
                value={manualQRInput}
                onChange={(e) => setManualQRInput(e.target.value)}
                placeholder="Paste QR code data here..."
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
              <button
                type="submit"
                className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors duration-200 flex items-center gap-2"
              >
                <ArrowRight size={20} />
                Submit
              </button>
            </form>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-center gap-2">
            <AlertCircle size={20} />
            {error}
          </div>
        )}

        <div className="text-center">
          <p className="text-gray-600 mb-4">Are you a teacher?</p>
          <button
            onClick={onSwitchToTeacher}
            className="text-green-600 hover:text-green-800 font-medium transition-colors duration-200"
          >
            Switch to Teacher Portal
          </button>
        </div>

        {/* Demo QR Data */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <p className="text-xs text-gray-600 mb-2">Demo QR Data (copy and paste above):</p>
          <code className="text-xs text-gray-500 break-all">
            {"{"}"teacherName":"Dr. Neha Kapoor","subject":"DBMS","sessionId":"Sess20250927-01","issuedAt":"2025-01-27T09:00:00Z"{"}"}
          </code>
        </div>
      </div>
    </div>
  );
};