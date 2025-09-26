import { AttendanceRecord, Session } from '../types';

const STORAGE_KEYS = {
  SESSIONS: 'attendance_sessions',
  ATTENDANCE: 'attendance_records',
  CURRENT_USER: 'current_user',
  USER_TYPE: 'user_type'
};

export const storageUtils = {
  // Session management
  saveSessions: (sessions: Session[]) => {
    localStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(sessions));
  },

  getSessions: (): Session[] => {
    const sessions = localStorage.getItem(STORAGE_KEYS.SESSIONS);
    return sessions ? JSON.parse(sessions) : [];
  },

  // Attendance management
  saveAttendanceRecord: (record: AttendanceRecord) => {
    const records = storageUtils.getAttendanceRecords();
    records.push(record);
    localStorage.setItem(STORAGE_KEYS.ATTENDANCE, JSON.stringify(records));
  },

  getAttendanceRecords: (): AttendanceRecord[] => {
    const records = localStorage.getItem(STORAGE_KEYS.ATTENDANCE);
    return records ? JSON.parse(records) : [];
  },

  // Check if student already marked attendance for a session
  hasAttendance: (enrollment: string, sessionId: string): boolean => {
    const records = storageUtils.getAttendanceRecords();
    return records.some(record => 
      record.enrollment === enrollment && record.sessionId === sessionId
    );
  },

  // User session management
  setCurrentUser: (user: any, type: 'teacher' | 'student') => {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
    localStorage.setItem(STORAGE_KEYS.USER_TYPE, type);
  },

  getCurrentUser: () => {
    const user = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    const type = localStorage.getItem(STORAGE_KEYS.USER_TYPE);
    return user ? { user: JSON.parse(user), type } : null;
  },

  clearCurrentUser: () => {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    localStorage.removeItem(STORAGE_KEYS.USER_TYPE);
  }
};