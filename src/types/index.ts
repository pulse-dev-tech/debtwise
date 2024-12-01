export interface Debt {
  id: string;
  name: string;
  amount: number;
  interestRate: number;
  minimumPayment: number;
  dueDate: string;
  currency: string;
  category: string;
  createdAt: string;
  payments: Payment[];
}

export interface Payment {
  id: string;
  amount: number;
  date: string;
  note?: string;
}

export interface Goal {
  id: string;
  name: string;
  targetDate: string;
  targetAmount: number;
  currentAmount: number;
  currency: string;
}

export interface Budget {
  id: string;
  income: number;
  expenses: Expense[];
  savings: number;
  currency: string;
}

export interface Expense {
  id: string;
  category: string;
  amount: number;
  isRecurring: boolean;
}

export interface Alert {
  id: string;
  type: 'payment' | 'goal' | 'budget';
  message: string;
  date: string;
  isRead: boolean;
}