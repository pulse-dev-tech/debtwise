export const calculateTotalDebt = (debts: any[]): { amount: number; currency: string }[] => {
  const totals: { [key: string]: number } = {};
  
  debts.forEach(debt => {
    if (!totals[debt.currency]) {
      totals[debt.currency] = 0;
    }
    totals[debt.currency] += debt.amount;
  });

  return Object.entries(totals).map(([currency, amount]) => ({
    amount,
    currency
  }));
};

export const calculateMonthlyPayment = (
  principal: number,
  annualRate: number,
  years: number
): number => {
  const monthlyRate = annualRate / 12 / 100;
  const numberOfPayments = years * 12;
  
  if (monthlyRate === 0) {
    return principal / numberOfPayments;
  }
  
  return (
    (principal * monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) /
    (Math.pow(1 + monthlyRate, numberOfPayments) - 1)
  );
};

export const calculateAmortizationSchedule = (
  principal: number,
  annualRate: number,
  years: number
): Array<{ payment: number; principal: number; interest: number; balance: number }> => {
  const monthlyRate = annualRate / 12 / 100;
  const numberOfPayments = years * 12;
  const monthlyPayment = calculateMonthlyPayment(principal, annualRate, years);
  
  let balance = principal;
  const schedule = [];

  for (let i = 1; i <= numberOfPayments; i++) {
    const interest = balance * monthlyRate;
    const principalPaid = monthlyPayment - interest;
    balance -= principalPaid;

    schedule.push({
      payment: monthlyPayment,
      principal: principalPaid,
      interest,
      balance: Math.max(0, balance),
    });
  }

  return schedule;
};

export const calculatePayoffTimeline = (
  amount: number,
  interestRate: number,
  monthlyPayment: number
): { months: number; totalInterest: number } => {
  let balance = amount;
  let months = 0;
  let totalInterest = 0;
  const monthlyRate = interestRate / 12 / 100;

  while (balance > 0 && months < 360) { // 30 years max
    const interest = balance * monthlyRate;
    totalInterest += interest;
    
    const principalPayment = monthlyPayment - interest;
    balance -= principalPayment;
    months++;

    if (monthlyPayment <= interest) {
      return { months: -1, totalInterest: -1 }; // Indicates payment too low
    }
  }

  return { months, totalInterest };
};

export const formatCurrency = (
  amount: number,
  currency: string = 'USD',
  locale: string = 'en-US'
): string => {
  const currencyFormats: { [key: string]: { locale: string; symbol: string } } = {
    USD: { locale: 'en-US', symbol: '$' },
    KES: { locale: 'sw-KE', symbol: 'KSh' },
    EUR: { locale: 'en-IE', symbol: '€' },
    GBP: { locale: 'en-GB', symbol: '£' },
  };

  const format = currencyFormats[currency] || currencyFormats.USD;

  try {
    return new Intl.NumberFormat(format.locale, {
      style: 'currency',
      currency,
    }).format(amount);
  } catch (error) {
    // Fallback formatting if the currency is not supported
    return `${format.symbol}${amount.toFixed(2)}`;
  }
};