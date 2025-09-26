export interface Teacher {
  id: string;
  name: string;
  password: string;
  subjects: string[];
}

export interface Student {
  id: string;
  name: string;
  enrollment: string;
  password: string;
}

export interface Subject {
  id: string;
  name: string;
  code: string;
  year: string;
}

export interface Session {
  id: string;
  teacherId: string;
  teacherName: string;
  subject: string;
  sessionId: string;
  issuedAt: string;
  expiresAt: string;
  isActive: boolean;
}

export interface AttendanceRecord {
  id: string;
  studentName: string;
  enrollment: string;
  subject: string;
  teacherName: string;
  sessionId: string;
  timestamp: string;
  selfieData: string;
}

export interface QRData {
  teacherName: string;
  subject: string;
  sessionId: string;
  issuedAt: string;
}