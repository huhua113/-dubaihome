export interface PropertySettings {
  propertyValue: number;
  downPaymentPercent: number;
  loanAmount: number; // calculated or manual
  loanTenorMonths: number;
  address: string;
  areaSqm: number;
  bedrooms: number;
  landDepartmentFeePercent: number;
  insurancePercent: number;
  fixedRatePercent: number;
  fixedRateMonths: number;
  floatingRatePercent: number;
}

export interface OneTimeExpense {
  id: string;
  name: string;
  amount: number;
  category: 'pre' | 'post'; // Pre-purchase or Post-purchase
  date: string; // YYYY-MM-DD format
}

export interface MonthlyData {
  monthIndex: number; // 0 to loanTenorMonths
  dewa: number | string;
  ac: number | string;
  serviceFees: number | string; // HOA/Property Management
  otherMaintenance: number;
  rentalIncome: number | string;
  loanPayment?: number | string; // Manual monthly loan payment input
  oneTimeExpenses: number;
}

export interface Property {
    id: string;
    name:string;
    settings: PropertySettings;
    oneTimeExpenses: OneTimeExpense[];
    monthlyInputs: Record<number, Partial<MonthlyData>>;
}

export interface SimulationResult {
  monthlyData: MonthlyData[];
  totalUpfrontCost: number;
  totalRecurringExpenses: number;
  totalIncome: number;
  netValue: number;
  roi: number;
}