export interface Institution {
  id: string;
  name: string;
  address: string;
  departments: Department[];
}

export interface Department {
  id: string;
  name: string;
  tuitionFee: string; // in tHELIOS
}

export interface PaymentRecord {
  id: string;
  studentAddress: string;
  studentId: string;
  studentName: string;
  institution: string;
  department: string;
  semester: string;
  amount: string;
  transactionHash: string;
  timestamp: number;
  status: 'pending' | 'confirmed' | 'failed';
  customInstitution?: string;
  customDepartment?: string;
  customSemester?: string;
  isCustom?: boolean;
}

export interface WalletState {
  address: string | null;
  balance: string;
  isConnected: boolean;
  isCorrectNetwork: boolean;
}