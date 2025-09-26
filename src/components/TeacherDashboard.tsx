import React, { useState, useEffect } from 'react';
import { QrCode, Clock, BookOpen, LogOut, RefreshCw } from 'lucide-react';
import { generateQRCode, generateSessionId } from '../utils/qrUtils';
import { storageUtils } from '../utils/storage';
import { Teacher, Session, QRData } from '../types';

interface TeacherDashboardProps {
  teacher: Teacher;
  onLogout: () => void;
}

export const TeacherDashboard: React.FC<TeacherDashboardProps> = ({ teacher, onLogout }) => {
  const [selectedSubject, setSelectedSubject] = useState('');
  const [qrCode, setQrCode] = useState('');
  const [currentSession, setCurrentSession] = useState<Session | null>(null);
  const [timeLeft, setTimeLeft] = useState(60);
  const [isGenerating, setIsGenerating] = useState(false);

  // Auto-refresh QR code every 60 seconds
  useEffect(() => {
    if (!currentSession) return;

    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          generateNewQR();
          return 60;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [currentSession]);

  const generateNewQR = async () => {
    if (!selectedSubject || !currentSession) return;

    const qrData: QRData = {
      teacherName: teacher.name,
      subject: selectedSubject,
      sessionId: currentSession.sessionId,
      issuedAt: new Date().toISOString()
    };

    try {
      const qrCodeDataURL = await generateQRCode(qrData);
      setQrCode(qrCodeDataURL);
    } catch (error) {
      console.error('Error generating QR:', error);
    }
  };

  const startSession = async () => {
    if (!selectedSubject) return;

    setIsGenerating(true);

    const sessionId = generateSessionId();
    const now = new Date();
    const expiresAt = new Date(now.getTime() + 60 * 60 * 1000); // 1 hour

    const session: Session = {
      id: Math.random().toString(36).substr(2, 9),
      teacherId: teacher.id,
      teacherName: teacher.name,
      subject: selectedSubject,
      sessionId,
      issuedAt: now.toISOString(),
      expiresAt: expiresAt.toISOString(),
      isActive: true
    };

    // Save session
    const sessions = storageUtils.getSessions();
    sessions.push(session);
    storageUtils.saveSessions(sessions);

    setCurrentSession(session);

    const qrData: QRData = {
      teacherName: teacher.name,
      subject: selectedSubject,
      sessionId,
      issuedAt: now.toISOString()
    };

    try {
      const qrCodeDataURL = await generateQRCode(qrData);
      setQrCode(qrCodeDataURL);
      setTimeLeft(60);
    } catch (error) {
      console.error('Error generating QR:', error);
    }

    setIsGenerating(false);
  };

  const endSession = () => {
    if (currentSession) {
      const sessions = storageUtils.getSessions();
      const updatedSessions = sessions.map(s => 
        s.id === currentSession.id ? { ...s, isActive: false } : s
      );
      storageUtils.saveSessions(updatedSessions);
    }
    
    setCurrentSession(null);
    setQrCode('');
    setSelectedSubject('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Welcome, {teacher.name}</h1>
              <p className="text-gray-600 mt-1">Manage your class attendance</p>
            </div>
            <button
              onClick={onLogout}
              className="flex items-center gap-2 text-red-600 hover:text-red-800 font-medium transition-colors duration-200"
            >
              <LogOut size={20} />
              Logout
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Subject Selection */}
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <BookOpen className="text-blue-600" size={24} />
              <h2 className="text-xl font-semibold text-gray-800">Select Subject</h2>
            </div>

            <div className="space-y-4">
              {teacher.subjects.map((subject) => (
                <label key={subject} className="flex items-center">
                  <input
                    type="radio"
                    name="subject"
                    value={subject}
                    checked={selectedSubject === subject}
                    onChange={(e) => setSelectedSubject(e.target.value)}
                    className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                    disabled={currentSession !== null}
                  />
                  <span className="ml-3 text-gray-700 font-medium">{subject}</span>
                </label>
              ))}
            </div>

            {!currentSession ? (
              <button
                onClick={startSession}
                disabled={!selectedSubject || isGenerating}
                className="w-full mt-6 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02]"
              >
                {isGenerating ? 'Generating...' : 'Start Attendance Session'}
              </button>
            ) : (
              <button
                onClick={endSession}
                className="w-full mt-6 bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-all duration-200 transform hover:scale-[1.02]"
              >
                End Session
              </button>
            )}
          </div>

          {/* QR Code Display */}
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <QrCode className="text-green-600" size={24} />
              <h2 className="text-xl font-semibold text-gray-800">QR Code</h2>
            </div>

            {currentSession ? (
              <div className="text-center">
                <div className="bg-gray-50 rounded-2xl p-8 mb-6">
                  {qrCode ? (
                    <img 
                      src={qrCode} 
                      alt="Attendance QR Code" 
                      className="mx-auto rounded-lg shadow-md"
                      style={{ width: '256px', height: '256px' }}
                    />
                  ) : (
                    <div className="w-64 h-64 bg-gray-200 rounded-lg flex items-center justify-center mx-auto">
                      <RefreshCw className="text-gray-400 animate-spin" size={48} />
                    </div>
                  )}
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-center gap-2 text-green-600">
                    <Clock size={20} />
                    <span className="font-medium">Refreshes in {timeLeft}s</span>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-600 mb-1">Current Session</p>
                    <p className="font-semibold text-gray-800">{selectedSubject}</p>
                    <p className="text-sm text-gray-500">Session ID: {currentSession.sessionId}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-16">
                <QrCode className="text-gray-300 mx-auto mb-4" size={64} />
                <p className="text-gray-500">Start a session to generate QR code</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};