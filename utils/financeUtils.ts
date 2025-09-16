export interface LoanCalculation {
  monthlyRepayment: number;
  totalRepayment: number;
  totalInterest: number;
}

export interface VatCalculation {
  vatAmount: number;
  totalAmount: number;
}

export interface IncomeTaxCalculation {
  taxBrackets: { bracket: string; tax: number }[];
  totalTax: number;
  uifDeduction: number;
  netSalary: number;
  effectiveRate: number;
}

export const calculateLoan = (amount: number, interestRate: number, termMonths: number): LoanCalculation => {
  const monthlyRate = interestRate / 100 / 12;
  const monthlyRepayment = (amount * monthlyRate * Math.pow(1 + monthlyRate, termMonths)) /
                          (Math.pow(1 + monthlyRate, termMonths) - 1);
  const totalRepayment = monthlyRepayment * termMonths;
  const totalInterest = totalRepayment - amount;

  return {
    monthlyRepayment: Math.round(monthlyRepayment * 100) / 100,
    totalRepayment: Math.round(totalRepayment * 100) / 100,
    totalInterest: Math.round(totalInterest * 100) / 100,
  };
};

export const calculateVat = (amount: number, isAddingVat: boolean): VatCalculation => {
  const vatRate = 0.15; // 15% for South Africa
  const vatAmount = amount * vatRate;
  const totalAmount = isAddingVat ? amount + vatAmount : amount - vatAmount;

  return {
    vatAmount: Math.round(vatAmount * 100) / 100,
    totalAmount: Math.round(totalAmount * 100) / 100,
  };
};

export const calculateIncomeTax = (annualIncome: number): IncomeTaxCalculation => {
  // South African tax brackets for 2024/2025
  const brackets = [
    { min: 0, max: 237100, rate: 0.18 },
    { min: 237101, max: 370500, rate: 0.26 },
    { min: 370501, max: 512800, rate: 0.31 },
    { min: 512801, max: 673000, rate: 0.36 },
    { min: 673001, max: 857900, rate: 0.39 },
    { min: 857901, max: 1819000, rate: 0.41 },
    { min: 1819001, max: Infinity, rate: 0.45 },
  ];

  let totalTax = 0;
  const taxBrackets: { bracket: string; tax: number }[] = [];

  for (const bracket of brackets) {
    if (annualIncome > bracket.min) {
      const taxableInBracket = Math.min(annualIncome, bracket.max) - bracket.min;
      const taxInBracket = taxableInBracket * bracket.rate;
      totalTax += taxInBracket;
      taxBrackets.push({
        bracket: `R${bracket.min.toLocaleString()} - ${bracket.max === Infinity ? '∞' : 'R' + bracket.max.toLocaleString()}`,
        tax: Math.round(taxInBracket * 100) / 100,
      });
      if (annualIncome <= bracket.max) break;
    }
  }

  // Calculate UIF (Unemployment Insurance Fund) - 1% of salary, capped at R177.12 per month
  const monthlySalary = annualIncome / 12;
  const monthlyUIF = Math.min(monthlySalary * 0.01, 177.12);
  const annualUIF = monthlyUIF * 12;

  // Calculate net salary
  const netSalary = annualIncome - totalTax - annualUIF;

  const effectiveRate = (totalTax / annualIncome) * 100;

  return {
    taxBrackets,
    totalTax: Math.round(totalTax * 100) / 100,
    uifDeduction: Math.round(annualUIF * 100) / 100,
    netSalary: Math.round(netSalary * 100) / 100,
    effectiveRate: Math.round(effectiveRate * 100) / 100,
  };
};