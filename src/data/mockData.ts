import { Teacher, Student, Subject } from '../types';

export const teachers: Teacher[] = [
  {
    id: '1',
    name: 'Dr. Neha Kapoor',
    password: 'teacher123',
    subjects: ['DBMS', 'Computer Networks', 'Operating Systems']
  },
  {
    id: '2',
    name: 'Prof. Rajesh Kumar',
    password: 'prof456',
    subjects: ['Data Structures', 'Algorithms', 'Programming']
  }
];

export const students: Student[] = [
  {
    id: '1',
    name: 'Amit Sharma',
    enrollment: '2025BCA101',
    password: '2025BCA101'
  },
  {
    id: '2',
    name: 'Priya Singh',
    enrollment: '2025BCA102',
    password: '2025BCA102'
  },
  {
    id: '3',
    name: 'Rohit Verma',
    enrollment: '2025BCA103',
    password: '2025BCA103'
  }
];

export const subjects: Subject[] = [
  {
    id: '1',
    name: 'Database Management Systems',
    code: 'DBMS',
    year: 'BCA 2nd Year'
  },
  {
    id: '2',
    name: 'Computer Networks',
    code: 'CN',
    year: 'BCA 3rd Year'
  },
  {
    id: '3',
    name: 'Operating Systems',
    code: 'OS',
    year: 'BCA 2nd Year'
  }
];