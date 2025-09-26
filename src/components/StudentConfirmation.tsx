import React, { useState } from 'react';
import { CheckCircle, User, BookOpen, Calendar, ArrowLeft } from 'lucide-react';
import { Student, QRData, AttendanceRecord } from '../types';
import { storageUtils } from '../utils/storage';

interface StudentConfirmationProps {
  student: Student;
  qrData: QRData;
  selfieData: string;
  onConfirm: () => void;
  onBack: () => void;
}

export const StudentConfirmation: React.FC<StudentConfirmationProps> = ({
  student,
  qrData,
  selfieData,
  onConfirm,
  onBack
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleConfirmAttendance = async () => {
    setIsSubmitting(true);
    setError('');

    try {
      // Check if already marked attendance
      if (storageUtils.hasAttendance(student.enrollment, qrData.sessionId)) {
        setError('You have already marked attendance for this session.');
        setIsSubmitting(false);
        return;
      }

      // Create attendance record
      const attendanceRecord: AttendanceRecord = {
        id: Math.random().toString(36).substr(2, 9),
        studentName: student.name,
        enrollment: student.enrollment,
        subject: qrData.subject,
        teacherName: qrData.teacherName,
        sessionId: qrData.sessionId,
        timestamp: new Date().toISOString(),
        selfieData: selfieData
      };

      // Save attendance record
      storageUtils.saveAttendanceRecord(attendanceRecord);

      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 2000));

      onConfirm();
    } catch (err) {
      setError('Failed to mark attendance. Please try again.');
    } finally {
      setIsSubmitting(false);
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
            <h1 className="text-2xl font-bold text-gray-800">Confirm Attendance</h1>
            <p className="text-gray-600">Review your details and confirm attendance</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Attendance Details */}
          <div className="space-y-6">
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Attendance Details</h3>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <User className="text-blue-600" size={20} />
                  <div>
                    <p className="text-sm text-gray-500">Student Name</p>
                    <p className="font-semibold text-gray-800">{student.name}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <BookOpen className="text-green-600" size={20} />
                  <div>
                    <p className="text-sm text-gray-500">Subject</p>
                    <p className="font-semibold text-gray-800">{qrData.subject}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <User className="text-purple-600" size={20} />
                  <div>
                    <p className="text-sm text-gray-500">Teacher</p>
                    <p className="font-semibold text-gray-800">{qrData.teacherName}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Calendar className="text-orange-600" size={20} />
                  <div>
                    <p className="text-sm text-gray-500">Time</p>
                    <p className="font-semibold text-gray-800">
                      {new Date().toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 rounded-xl p-6">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="text-blue-600" size={20} />
                <h4 className="font-semibold text-blue-800">Session Information</h4>
              </div>
              <p className="text-sm text-blue-700">
                Session ID: {qrData.sessionId}
              </p>
              <p className="text-sm text-blue-700">
                Enrollment: {student.enrollment}
              </p>
            </div>
          </div>

          {/* Captured Selfie */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Captured Photo</h3>
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="relative rounded-lg overflow-hidden" style={{ height: '300px' }}>
                <img 
                  src={selfieData} 
                  alt="Student Selfie" 
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="text-sm text-gray-600 mt-2 text-center">
                This photo will be used for attendance verification
              </p>
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mt-6">
            {error}
          </div>
        )}

        <div className="mt-8 flex gap-4">
          <button
            onClick={onBack}
            disabled={isSubmitting}
            className="flex-1 bg-gray-600 text-white py-3 rounded-lg font-semibold hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          >
            Go Back
          </button>
          
          <button
            onClick={handleConfirmAttendance}
            disabled={isSubmitting}
            className="flex-1 bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Marking Attendance...
              </>
            ) : (
              <>
                <CheckCircle size={20} />
                Confirm Attendance
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};