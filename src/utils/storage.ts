import { Debt, Goal, Budget, Alert } from '../types';

const STORAGE_KEYS = {
  DEBTS: 'debts',
  GOALS: 'goals',
  BUDGET: 'budget',
  ALERTS: 'alerts',
  THEME: 'theme',
};

export const storage = {
  getItem: <T>(key: string): T | null => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return null;
    }
  },

  setItem: <T>(key: string, value: T): void => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Error writing to localStorage:', error);
    }
  },

  getDebts: (): Debt[] => storage.getItem(STORAGE_KEYS.DEBTS) || [],
  setDebts: (debts: Debt[]) => storage.setItem(STORAGE_KEYS.DEBTS, debts),

  getGoals: (): Goal[] => storage.getItem(STORAGE_KEYS.GOALS) || [],
  setGoals: (goals: Goal[]) => storage.setItem(STORAGE_KEYS.GOALS, goals),

  getBudget: (): Budget | null => storage.getItem(STORAGE_KEYS.BUDGET),
  setBudget: (budget: Budget) => storage.setItem(STORAGE_KEYS.BUDGET, budget),

  getAlerts: (): Alert[] => storage.getItem(STORAGE_KEYS.ALERTS) || [],
  setAlerts: (alerts: Alert[]) => storage.setItem(STORAGE_KEYS.ALERTS, alerts),

  getTheme: (): 'light' | 'dark' => storage.getItem(STORAGE_KEYS.THEME) || 'light',
  setTheme: (theme: 'light' | 'dark') => storage.setItem(STORAGE_KEYS.THEME, theme),

  exportData: () => {
    const data = {
      debts: storage.getDebts(),
      goals: storage.getGoals(),
      budget: storage.getBudget(),
      alerts: storage.getAlerts(),
    };
    return JSON.stringify(data);
  },

  importData: (jsonData: string) => {
    try {
      const data = JSON.parse(jsonData);
      if (data.debts) storage.setDebts(data.debts);
      if (data.goals) storage.setGoals(data.goals);
      if (data.budget) storage.setBudget(data.budget);
      if (data.alerts) storage.setAlerts(data.alerts);
      return true;
    } catch (error) {
      console.error('Error importing data:', error);
      return false;
    }
  },
};