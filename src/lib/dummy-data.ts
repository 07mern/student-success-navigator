// ─── Dummy fallback data for when backend is unavailable ───

export interface Student {
  id: string;
  name: string;
  department: string;
  attendance: number;
  gpa: number;
  risk_score: number;
  risk_level: "Low" | "Medium" | "High";
  email: string;
  enrollment_year: number;
  semester: number;
  dropout_probability: number;
  risk_factors: string[];
  attendance_history: number[];
  gpa_history: number[];
}

export interface DashboardStats {
  total_students: number;
  high_risk: number;
  medium_risk: number;
  low_risk: number;
  average_attendance: number;
  department_risk: { department: string; high: number; medium: number; low: number }[];
}

export interface CounselingSession {
  id: string;
  student_id: string;
  student_name: string;
  date: string;
  notes: string;
  counselor: string;
  follow_up_date: string;
  status: "Completed" | "Scheduled" | "Missed";
}

export const dummyStudents: Student[] = [
  {
    id: "STU001", name: "Aarav Sharma", department: "Computer Science", attendance: 92, gpa: 3.8,
    risk_score: 15, risk_level: "Low", email: "aarav@university.edu", enrollment_year: 2022,
    semester: 5, dropout_probability: 8, risk_factors: ["None significant"],
    attendance_history: [95, 92, 90, 93, 92], gpa_history: [3.6, 3.7, 3.8, 3.9, 3.8],
  },
  {
    id: "STU002", name: "Priya Patel", department: "Electrical Engineering", attendance: 68, gpa: 2.4,
    risk_score: 72, risk_level: "High", email: "priya@university.edu", enrollment_year: 2021,
    semester: 7, dropout_probability: 78, risk_factors: ["Low attendance", "Declining GPA", "Financial stress"],
    attendance_history: [85, 78, 72, 70, 68], gpa_history: [3.2, 2.9, 2.7, 2.5, 2.4],
  },
  {
    id: "STU003", name: "Rahul Verma", department: "Mechanical Engineering", attendance: 75, gpa: 2.9,
    risk_score: 55, risk_level: "Medium", email: "rahul@university.edu", enrollment_year: 2022,
    semester: 5, dropout_probability: 45, risk_factors: ["Irregular attendance", "Mid-range GPA"],
    attendance_history: [88, 82, 78, 76, 75], gpa_history: [3.4, 3.2, 3.0, 2.9, 2.9],
  },
  {
    id: "STU004", name: "Sneha Iyer", department: "Computer Science", attendance: 88, gpa: 3.5,
    risk_score: 22, risk_level: "Low", email: "sneha@university.edu", enrollment_year: 2023,
    semester: 3, dropout_probability: 12, risk_factors: ["None significant"],
    attendance_history: [90, 89, 87, 88, 88], gpa_history: [3.3, 3.4, 3.5, 3.5, 3.5],
  },
  {
    id: "STU005", name: "Amit Kumar", department: "Civil Engineering", attendance: 58, gpa: 2.0,
    risk_score: 88, risk_level: "High", email: "amit@university.edu", enrollment_year: 2021,
    semester: 7, dropout_probability: 91, risk_factors: ["Very low attendance", "Failing grades", "No extracurriculars"],
    attendance_history: [72, 68, 63, 60, 58], gpa_history: [2.8, 2.5, 2.3, 2.1, 2.0],
  },
  {
    id: "STU006", name: "Kavya Nair", department: "Information Technology", attendance: 80, gpa: 3.1,
    risk_score: 42, risk_level: "Medium", email: "kavya@university.edu", enrollment_year: 2022,
    semester: 5, dropout_probability: 35, risk_factors: ["Moderate attendance drop", "Average GPA trend"],
    attendance_history: [90, 86, 83, 81, 80], gpa_history: [3.5, 3.3, 3.2, 3.1, 3.1],
  },
  {
    id: "STU007", name: "Vikram Singh", department: "Electronics", attendance: 45, gpa: 1.8,
    risk_score: 95, risk_level: "High", email: "vikram@university.edu", enrollment_year: 2020,
    semester: 9, dropout_probability: 96, risk_factors: ["Critically low attendance", "Academic probation", "Mental health concerns"],
    attendance_history: [65, 58, 52, 48, 45], gpa_history: [2.4, 2.1, 1.9, 1.8, 1.8],
  },
  {
    id: "STU008", name: "Ananya Desai", department: "Computer Science", attendance: 95, gpa: 3.9,
    risk_score: 8, risk_level: "Low", email: "ananya@university.edu", enrollment_year: 2023,
    semester: 3, dropout_probability: 4, risk_factors: ["None significant"],
    attendance_history: [96, 95, 94, 95, 95], gpa_history: [3.7, 3.8, 3.9, 3.9, 3.9],
  },
  {
    id: "STU009", name: "Rohan Joshi", department: "Mechanical Engineering", attendance: 72, gpa: 2.6,
    risk_score: 62, risk_level: "Medium", email: "rohan@university.edu", enrollment_year: 2022,
    semester: 5, dropout_probability: 52, risk_factors: ["Declining attendance", "Below-average GPA"],
    attendance_history: [82, 80, 76, 74, 72], gpa_history: [3.0, 2.8, 2.7, 2.6, 2.6],
  },
  {
    id: "STU010", name: "Meera Reddy", department: "Electrical Engineering", attendance: 62, gpa: 2.2,
    risk_score: 78, risk_level: "High", email: "meera@university.edu", enrollment_year: 2021,
    semester: 7, dropout_probability: 82, risk_factors: ["Poor attendance", "Low GPA", "Lack of engagement"],
    attendance_history: [78, 72, 68, 65, 62], gpa_history: [2.9, 2.6, 2.4, 2.3, 2.2],
  },
];

export const dummyDashboardStats: DashboardStats = {
  total_students: 1247,
  high_risk: 186,
  medium_risk: 324,
  low_risk: 737,
  average_attendance: 78.5,
  department_risk: [
    { department: "Computer Science", high: 24, medium: 45, low: 120 },
    { department: "Electrical Eng.", high: 38, medium: 52, low: 95 },
    { department: "Mechanical Eng.", high: 42, medium: 60, low: 110 },
    { department: "Civil Eng.", high: 35, medium: 48, low: 85 },
    { department: "Information Tech.", high: 22, medium: 55, low: 140 },
    { department: "Electronics", high: 25, medium: 64, low: 187 },
  ],
};

export const dummyCounselingSessions: CounselingSession[] = [
  { id: "CS001", student_id: "STU002", student_name: "Priya Patel", date: "2024-12-15", notes: "Discussed attendance issues. Student facing financial difficulties. Referred to financial aid office.", counselor: "Dr. Mehta", follow_up_date: "2025-01-10", status: "Completed" },
  { id: "CS002", student_id: "STU005", student_name: "Amit Kumar", date: "2024-12-18", notes: "Academic performance review. Created study plan for upcoming semester. Will monitor bi-weekly.", counselor: "Prof. Gupta", follow_up_date: "2025-01-05", status: "Completed" },
  { id: "CS003", student_id: "STU007", student_name: "Vikram Singh", date: "2025-01-02", notes: "Mental health screening conducted. Referred to campus counseling center. Requested reduced course load.", counselor: "Dr. Mehta", follow_up_date: "2025-01-20", status: "Scheduled" },
  { id: "CS004", student_id: "STU003", student_name: "Rahul Verma", date: "2025-01-05", notes: "Mid-semester check-in. Attendance improving slightly. Encouraged to join study groups.", counselor: "Prof. Sharma", follow_up_date: "2025-02-01", status: "Completed" },
  { id: "CS005", student_id: "STU010", student_name: "Meera Reddy", date: "2025-01-08", notes: "Initial dropout prevention session. Student considering leaving. Discussed career options and support available.", counselor: "Dr. Mehta", follow_up_date: "2025-01-22", status: "Scheduled" },
  { id: "CS006", student_id: "STU002", student_name: "Priya Patel", date: "2025-01-10", notes: "Follow-up: Financial aid application submitted. Attendance slightly improved. Continue monitoring.", counselor: "Dr. Mehta", follow_up_date: "2025-02-10", status: "Scheduled" },
];

/** Helper: get risk level color class */
export const getRiskColor = (level: string) => {
  switch (level) {
    case "Low": return "risk-low";
    case "Medium": return "risk-medium";
    case "High": return "risk-high";
    default: return "risk-low";
  }
};

export const getRiskBgColor = (level: string) => {
  switch (level) {
    case "Low": return "risk-low-bg risk-low-text";
    case "Medium": return "risk-medium-bg risk-medium-text";
    case "High": return "risk-high-bg risk-high-text";
    default: return "risk-low-bg risk-low-text";
  }
};
