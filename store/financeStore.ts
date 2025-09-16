import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface LoanResult {
  id: string;
  amount: number;
  interestRate: number;
  termMonths: number;
  monthlyRepayment: number;
  totalRepayment: number;
  totalInterest: number;
  timestamp: Date;
}

interface VatResult {
  id: string;
  amount: number;
  isAddingVat: boolean;
  vatAmount: number;
  totalAmount: number;
  timestamp: Date;
}

interface IncomeTaxResult {
  id: string;
  annualIncome: number;
  taxBrackets: { bracket: string; tax: number }[];
  totalTax: number;
  effectiveRate: number;
  timestamp: Date;
}

interface FinanceState {
  // Loan Calculator
  loanAmount: string;
  loanInterestRate: string;
  loanTermMonths: string;
  loanResults: LoanResult[];
  setLoanInputs: (amount: string, rate: string, term: string) => void;
  addLoanResult: (result: Omit<LoanResult, 'id' | 'timestamp'>) => void;

  // VAT Calculator
  vatAmount: string;
  isAddingVat: boolean;
  vatResults: VatResult[];
  setVatInputs: (amount: string, isAdding: boolean) => void;
  addVatResult: (result: Omit<VatResult, 'id' | 'timestamp'>) => void;

  // Income Tax Calculator
  annualIncome: string;
  taxResults: IncomeTaxResult[];
  setAnnualIncome: (income: string) => void;
  addTaxResult: (result: Omit<IncomeTaxResult, 'id' | 'timestamp'>) => void;

  // Favorites
  favorites: string[]; // article IDs
  toggleFavorite: (articleId: string) => void;
}

export const useFinanceStore = create<FinanceState>()(
  persist(
    (set, get) => ({
      // Loan
      loanAmount: '',
      loanInterestRate: '',
      loanTermMonths: '',
      loanResults: [],
      setLoanInputs: (amount, rate, term) => set({ loanAmount: amount, loanInterestRate: rate, loanTermMonths: term }),
      addLoanResult: (result) => {
        const newResult: LoanResult = { ...result, id: Date.now().toString(), timestamp: new Date() };
        set((state) => ({
          loanResults: [newResult, ...state.loanResults.slice(0, 4)] // Keep last 5
        }));
      },

      // VAT
      vatAmount: '',
      isAddingVat: true,
      vatResults: [],
      setVatInputs: (amount, isAdding) => set({ vatAmount: amount, isAddingVat: isAdding }),
      addVatResult: (result) => {
        const newResult: VatResult = { ...result, id: Date.now().toString(), timestamp: new Date() };
        set((state) => ({
          vatResults: [newResult, ...state.vatResults.slice(0, 4)]
        }));
      },

      // Income Tax
      annualIncome: '',
      taxResults: [],
      setAnnualIncome: (income) => set({ annualIncome: income }),
      addTaxResult: (result) => {
        const newResult: IncomeTaxResult = { ...result, id: Date.now().toString(), timestamp: new Date() };
        set((state) => ({
          taxResults: [newResult, ...state.taxResults.slice(0, 4)]
        }));
      },

      // Favorites
      favorites: [],
      toggleFavorite: (articleId) => {
        set((state) => ({
          favorites: state.favorites.includes(articleId)
            ? state.favorites.filter(id => id !== articleId)
            : [...state.favorites, articleId]
        }));
      },
    }),
    {
      name: 'finance-store',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);