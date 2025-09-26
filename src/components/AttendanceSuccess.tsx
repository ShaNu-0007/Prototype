import React from 'react';
import { CheckCircle, Home, RotateCcw } from 'lucide-react';

interface AttendanceSuccessProps {
  onReturnHome: () => void;
  onMarkAnother: () => void;
}

export const AttendanceSuccess: React.FC<AttendanceSuccessProps> = ({
  onReturnHome,
  onMarkAnother
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md text-center">
        <div className="mb-8">
          <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="text-green-600" size={48} />
          </div>
          
          <h1 className="text-3xl font-bold text-gray-800 mb-3">
            Attendance Marked Successfully!
          </h1>
          
          <p className="text-gray-600 text-lg">
            Your attendance has been recorded and verified.
          </p>
        </div>

        <div className="bg-green-50 rounded-xl p-6 mb-8">
          <div className="space-y-2">
            <div className="flex items-center justify-center gap-2">
              <CheckCircle className="text-green-600" size={16} />
              <span className="text-green-800 font-medium">Attendance Confirmed</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <CheckCircle className="text-green-600" size={16} />
              <span className="text-green-800 font-medium">Photo Captured</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <CheckCircle className="text-green-600" size={16} />
              <span className="text-green-800 font-medium">Record Saved</span>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <button
            onClick={onReturnHome}
            className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors duration-200 flex items-center justify-center gap-2"
          >
            <Home size={20} />
            Return to Home
          </button>
          
          <button
            onClick={onMarkAnother}
            className="w-full bg-gray-600 text-white py-3 rounded-lg font-semibold hover:bg-gray-700 transition-colors duration-200 flex items-center justify-center gap-2"
          >
            <RotateCcw size={20} />
            Mark Another Attendance
          </button>
        </div>

        <div className="mt-8 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-700">
            Your attendance record is securely stored and can be viewed by your teacher.
          </p>
        </div>
      </div>
    </div>
  );
};