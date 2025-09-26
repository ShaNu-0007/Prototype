import React, { useState, useEffect } from 'react';
import { TeacherLogin } from './components/TeacherLogin';
import { TeacherDashboard } from './components/TeacherDashboard';
import { StudentLogin } from './components/StudentLogin';
import { StudentQRScanner } from './components/StudentQRScanner';
import { StudentSelfieCapture } from './components/StudentSelfieCapture';
import { StudentConfirmation } from './components/StudentConfirmation';
import { AttendanceSuccess } from './components/AttendanceSuccess';
import { storageUtils } from './utils/storage';
import { Teacher, Student, QRData } from './types';

type AppState = 
  | 'home'
  | 'teacher-login'
  | 'teacher-dashboard'
  | 'student-scanner'
  | 'student-login'
  | 'student-selfie'
  | 'student-confirmation'
  | 'attendance-success';

function App() {
  const [currentState, setCurrentState] = useState<AppState>('home');
  const [currentTeacher, setCurrentTeacher] = useState<Teacher | null>(null);
  const [currentStudent, setCurrentStudent] = useState<Student | null>(null);
  const [scannedQR, setScannedQR] = useState<QRData | null>(null);
  const [capturedSelfie, setCapturedSelfie] = useState<string | null>(null);

  // Check for existing user session on app start
  useEffect(() => {
    const userSession = storageUtils.getCurrentUser();
    if (userSession) {
      if (userSession.type === 'teacher') {
        setCurrentTeacher(userSession.user);
        setCurrentState('teacher-dashboard');
      } else {
        setCurrentStudent(userSession.user);
        // Don't auto-resume student session, always start from scanner
        setCurrentState('student-scanner');
      }
    } else {
      setCurrentState('teacher-login'); // Default to teacher login
    }
  }, []);

  const handleTeacherLogin = (teacher: Teacher) => {
    setCurrentTeacher(teacher);
    setCurrentState('teacher-dashboard');
  };

  const handleStudentLogin = (student: Student) => {
    setCurrentStudent(student);
    setCurrentState('student-selfie');
  };

  const handleValidQR = (qrData: QRData) => {
    setScannedQR(qrData);
    setCurrentState('student-login');
  };

  const handleSelfieCapture = (selfieData: string) => {
    setCapturedSelfie(selfieData);
    setCurrentState('student-confirmation');
  };

  const handleAttendanceConfirm = () => {
    setCurrentState('attendance-success');
  };

  const handleLogout = () => {
    storageUtils.clearCurrentUser();
    setCurrentTeacher(null);
    setCurrentStudent(null);
    setScannedQR(null);
    setCapturedSelfie(null);
    setCurrentState('teacher-login');
  };

  const handleReturnHome = () => {
    setCurrentStudent(null);
    setScannedQR(null);
    setCapturedSelfie(null);
    setCurrentState('student-scanner');
  };

  const handleMarkAnother = () => {
    setScannedQR(null);
    setCapturedSelfie(null);
    setCurrentState('student-scanner');
  };

  const switchToStudent = () => {
    setCurrentState('student-scanner');
  };

  const switchToTeacher = () => {
    setCurrentState('teacher-login');
  };

  const goBackToScanner = () => {
    setScannedQR(null);
    setCurrentState('student-scanner');
  };

  const goBackToLogin = () => {
    setCurrentState('student-login');
  };

  const goBackToSelfie = () => {
    setCapturedSelfie(null);
    setCurrentState('student-selfie');
  };

  // Render appropriate component based on current state
  switch (currentState) {
    case 'teacher-login':
      return (
        <TeacherLogin 
          onLogin={handleTeacherLogin}
          onSwitchToStudent={switchToStudent}
        />
      );

    case 'teacher-dashboard':
      return currentTeacher ? (
        <TeacherDashboard 
          teacher={currentTeacher}
          onLogout={handleLogout}
        />
      ) : null;

    case 'student-scanner':
      return (
        <StudentQRScanner 
          onValidQR={handleValidQR}
          onSwitchToTeacher={switchToTeacher}
        />
      );

    case 'student-login':
      return scannedQR ? (
        <StudentLogin 
          onLogin={handleStudentLogin}
          onSwitchToTeacher={switchToTeacher}
          onBack={goBackToScanner}
        />
      ) : null;

    case 'student-selfie':
      return currentStudent && scannedQR ? (
        <StudentSelfieCapture 
          student={currentStudent}
          qrData={scannedQR}
          onSelfieCapture={handleSelfieCapture}
          onBack={goBackToLogin}
        />
      ) : null;

    case 'student-confirmation':
      return currentStudent && scannedQR && capturedSelfie ? (
        <StudentConfirmation 
          student={currentStudent}
          qrData={scannedQR}
          selfieData={capturedSelfie}
          onConfirm={handleAttendanceConfirm}
          onBack={goBackToSelfie}
        />
      ) : null;

    case 'attendance-success':
      return (
        <AttendanceSuccess 
          onReturnHome={handleReturnHome}
          onMarkAnother={handleMarkAnother}
        />
      );

    default:
      return (
        <TeacherLogin 
          onLogin={handleTeacherLogin}
          onSwitchToStudent={switchToStudent}
        />
      );
  }
}

export default App;