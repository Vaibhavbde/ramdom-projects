export type NavItem = 'symptoms' | 'diagnose' | 'scan' | 'chatbot' | 'hub';

export interface SymptomAnalysis {
  possibleConditions: {
    name: string;
    description: string;
  }[];
  severity: 'Low' | 'Moderate' | 'High';
  recommendedNextSteps: string[];
}

export interface HealthRecordData {
  key: string;
  value: string;
  insight: 'Normal' | 'Low' | 'High' | 'N/A';
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export interface Reminder {
  id: number;
  medicine: string;
  dosage: string;
  time: string;
}

export interface Vital {
  date: string;
  heartRate?: number;
  bpSystolic?: number;
  bpDiastolic?: number;
}
