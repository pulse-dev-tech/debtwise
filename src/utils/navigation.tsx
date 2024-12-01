import React from 'react';
import { 
  LayoutDashboard, 
  TrendingUp, 
  Calculator, 
  Target, 
  PiggyBank,
  Snowflake,
  Calendar,
  Lightbulb,
  BookOpen,
  Bell
} from 'lucide-react';

export const navItems = [
  { to: '/', icon: <LayoutDashboard />, text: 'Dashboard' },
  { to: '/progress', icon: <TrendingUp />, text: 'Progress' },
  { to: '/calculators', icon: <Calculator />, text: 'Calculators' },
  { to: '/goals', icon: <Target />, text: 'Goals' },
  { to: '/budget', icon: <PiggyBank />, text: 'Budget' },
  { to: '/strategies', icon: <Snowflake />, text: 'Strategies' },
  { to: '/schedule', icon: <Calendar />, text: 'Schedule' },
  { to: '/insights', icon: <Lightbulb />, text: 'Insights' },
  { to: '/education', icon: <BookOpen />, text: 'Education' },
  { to: '/alerts', icon: <Bell />, text: 'Alerts' },
];