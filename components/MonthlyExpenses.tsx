import React, { useState, useMemo, useCallback } from 'react';
import { MonthlyData } from '../types';
import { Zap, Fan, Briefcase, TrendingUp, Edit3, X, Sliders, Banknote, TrendingDown } from 'lucide-react';
import { formatCurrency } from '../utils/calculations';

interface Props {
  monthlyInputs: Record<number, Partial<MonthlyData>>;
  setMonthlyInputs: (
    updater: (
      prev: Record<number, Partial<MonthlyData>>
    ) => Record<number, Partial<MonthlyData>> | Record<number, Partial<MonthlyData>>
  ) => void;
  totalMonths: number;
}

const fixedStartDate = new Date(2025, 7, 1); // August is month 7 (0-indexed)

type TabType = 'dewa' | 'ac' | 'service' | 'income' | 'payment';

const BulkEditModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onApply: (start: number, end: number, value: number) => void;
  totalMonths: number;
  tabLabel: string;
  yearOptions: string[];
  fixedStartDate: Date;
}> = ({ isOpen, onClose, onApply, totalMonths, tabLabel, yearOptions, fixedStartDate }) => {
    
    const startYearOfLoan = fixedStartDate.getFullYear();
    const startMonthOfLoan = fixedStartDate.getMonth() + 1;
    
    const endDate = new Date(fixedStartDate);
    endDate.setMonth(endDate.getMonth() + totalMonths - 1);
    const endYearOfLoan = endDate.getFullYear();
    const endMonthOfLoan = endDate.getMonth() + 1;

    const [startYear, setStartYear] = useState(startYearOfLoan.toString());
    const [startMonth, setStartMonth] = useState(startMonthOfLoan.toString());
    const [endYear, setEndYear] = useState(endYearOfLoan.toString());
    const [endMonth, setEndMonth] = useState(endMonthOfLoan.toString());
    const [value, setValue] = useState('');

    if (!isOpen) return null;
    
    const handleApply = () => {
        const sYear = parseInt(startYear);
        const sMonth = parseInt(startMonth);
        const eYear = parseInt(endYear);
        const eMonth = parseInt(endMonth);
        const val = parseFloat(value);

        if (isNaN(sYear) || isNaN(sMonth) || isNaN(eYear) || isNaN(eMonth) || isNaN(val)) {
            alert('无效输入。请检查您的年份、月份和数值。');
            return;
        }

        if (sYear > eYear || (sYear === eYear && sMonth > eMonth)) {
            alert('开始日期不能晚于结束日期。');
            return;
        }
    
        const baseYear = fixedStartDate.getFullYear();
        const baseMonth = fixedStartDate.getMonth(); // 0-indexed

        const startMonthIndex = (sYear - baseYear) * 12 + (sMonth - 1 - baseMonth);
        const endMonthIndex = (eYear - baseYear) * 12 + (eMonth - 1 - baseMonth);
        
        const start = startMonthIndex + 1;
        const end = endMonthIndex + 1;

        if (start < 1 || end > totalMonths || start > end) {
            alert('选择的日期范围无效或超出了贷款期限。');
            return;
        }

        onApply(start, end, val);
        onClose();
    };

    const monthOptions = Array.from({length: 12}, (_, i) => i + 1);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-sm">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold text-brand-slate">批量编辑: {tabLabel}</h3>
                    <button onClick={onClose}><X className="w-5 h-5 text-slate-500 hover:text-slate-800" /></button>
                </div>
                <div className="space-y-4">
                    <div>
                        <label className="text-xs font-semibold text-slate-500 uppercase">开始日期</label>
                        <div className="flex items-center gap-2 mt-1">
                            <select value={startYear} onChange={e => setStartYear(e.target.value)} className="w-full border rounded-md px-3 py-2 text-sm focus:ring-1 focus:ring-brand-gold focus:outline-none bg-white">
                                {yearOptions.map(y => <option key={`start-${y}`} value={y}>{y}年</option>)}
                            </select>
                            <select value={startMonth} onChange={e => setStartMonth(e.target.value)} className="w-full border rounded-md px-3 py-2 text-sm focus:ring-1 focus:ring-brand-gold focus:outline-none bg-white">
                                {monthOptions.map(m => <option key={`start-m-${m}`} value={m}>{m}月</option>)}
                            </select>
                        </div>
                    </div>
                     <div>
                        <label className="text-xs font-semibold text-slate-500 uppercase">结束日期</label>
                        <div className="flex items-center gap-2 mt-1">
                            <select value={endYear} onChange={e => setEndYear(e.target.value)} className="w-full border rounded-md px-3 py-2 text-sm focus:ring-1 focus:ring-brand-gold focus:outline-none bg-white">
                                {yearOptions.map(y => <option key={`end-${y}`} value={y}>{y}年</option>)}
                            </select>
                            <select value={endMonth} onChange={e => setEndMonth(e.target.value)} className="w-full border rounded-md px-3 py-2 text-sm focus:ring-1 focus:ring-brand-gold focus:outline-none bg-white">
                                {monthOptions.map(m => <option key={`end-m-${m}`} value={m}>{m}月</option>)}
                            </select>
                        </div>
                    </div>
                    <div>
                        <label className="text-xs font-semibold text-slate-500 uppercase">金额 (AED)</label>
                        <input 
                            type="number" 
                            placeholder="输入月度金额" 
                            value={value} 
                            onChange={e => setValue(e.target.value)} 
                            className="w-full border rounded-md px-3 py-2 text-sm focus:ring-1 focus:ring-brand-gold focus:outline-none mt-1" 
                            onWheel={(e) => (e.target as HTMLElement).blur()}
                        />
                    </div>
                </div>
                <div className="mt-6 flex justify-end gap-3">
                    <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 rounded-md hover:bg-slate-200">取消</button>
                    <button onClick={handleApply} className="px-4 py-2 text-sm font-medium text-white bg-brand-blue rounded-md hover:bg-brand-blue-dark">应用</button>
                </div>
            </div>
        </div>
    );
};

const MonthlyExpenses: React.FC<Props> = ({ monthlyInputs, setMonthlyInputs, totalMonths }) => {
  const [activeTab, setActiveTab] = useState<TabType>('payment');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedYear, setSelectedYear] = useState<string>('all');
  
  const handleBulkApply = useCallback((startMonth: number, endMonth: number, value: number) => {
    setMonthlyInputs(prev => {
        const newInputs = {...prev};
        for (let i = startMonth - 1; i < endMonth; i++) {
            if (!newInputs[i]) newInputs[i] = {};
            
            if (activeTab === 'dewa') newInputs[i]!.dewa = value;
            else if (activeTab === 'ac') newInputs[i]!.ac = value;
            else if (activeTab === 'service') newInputs[i]!.serviceFees = value;
            else if (activeTab === 'income') newInputs[i]!.rentalIncome = value;
            else if (activeTab === 'payment') newInputs[i]!.loanPayment = value;
        }
        return newInputs;
    });
  }, [setMonthlyInputs, activeTab]);

  const updateSingleMonth = useCallback((monthIdx: number, valStr: string) => {
      // Allow only valid numeric strings (including empty or ending with a dot)
      if (valStr !== '' && !/^\d*\.?\d*$/.test(valStr)) {
          return; // Don't update if input is invalid like 'abc'
      }

      const keyToUpdate = activeTab === 'dewa' ? 'dewa' 
                        : activeTab === 'ac' ? 'ac' 
                        : activeTab === 'service' ? 'serviceFees' 
                        : activeTab === 'income' ? 'rentalIncome' 
                        : 'loanPayment';

      setMonthlyInputs(prev => ({
          ...prev,
          [monthIdx]: {
              ...prev[monthIdx],
              [keyToUpdate]: valStr 
          }
      }));
  }, [setMonthlyInputs, activeTab]);
  
  const yearOptions = useMemo(() => {
    const startYear = fixedStartDate.getFullYear();
    const numYears = Math.ceil(totalMonths / 12);
    // Ensure numYears is at least 1, even if totalMonths is 0
    const years = Array.from({ length: Math.max(1, numYears) }, (_, i) => startYear + i);
    return ['all', ...years.map(String)];
  }, [totalMonths]);

  const monthsToDisplay = useMemo(() => {
    const allMonths = Array.from({ length: totalMonths }, (_, i) => i);
    if (selectedYear === 'all') {
      return allMonths;
    }
    return allMonths.filter(monthIndex => {
      const date = new Date(fixedStartDate);
      date.setMonth(date.getMonth() + monthIndex);
      return date.getFullYear().toString() === selectedYear;
    });
  }, [selectedYear, totalMonths]);

  const yearlyTotals = useMemo(() => {
    let totalIncome = 0;
    let totalExpense = 0;

    monthsToDisplay.forEach(monthIndex => {
        const month = monthlyInputs[monthIndex] || {};
        totalIncome += Number(month.rentalIncome) || 0;
        totalExpense += 
            (Number(month.loanPayment) || 0) +
            (Number(month.dewa) || 0) +
            (Number(month.ac) || 0) +
            (Number(month.serviceFees) || 0) +
            (month.otherMaintenance || 0);
    });

    return { totalIncome, totalExpense };
  }, [monthsToDisplay, monthlyInputs]);

  const getTabLabel = (t: TabType) => ({
    'payment': '还款',
    'income': '收入',
    'service': '物业',
    'dewa': 'DEWA',
    'ac': '空调',
  }[t]);

  const getTabIcon = (t: TabType) => ({
    'payment': <Banknote className="w-4 h-4" />,
    'income': <TrendingUp className="w-4 h-4" />,
    'service': <Briefcase className="w-4 h-4" />,
    'dewa': <Zap className="w-4 h-4" />,
    'ac': <Fan className="w-4 h-4" />,
  }[t]);

  const getValueForMonth = (monthIdx: number) => {
    const m = monthlyInputs[monthIdx];
    if (!m) return '';
    let value;
    switch (activeTab) {
      case 'dewa': value = m.dewa; break;
      case 'ac': value = m.ac; break;
      case 'service': value = m.serviceFees; break;
      case 'income': value = m.rentalIncome; break;
      case 'payment': value = m.loanPayment; break;
      default: return '';
    }
    if (value === undefined || value === null) {
      return '';
    }
    return String(value);
  };


  const getDateLabel = (monthIndex: number) => {
      const date = new Date(fixedStartDate);
      date.setMonth(date.getMonth() + monthIndex);
      return `${date.getFullYear()}年${date.getMonth() + 1}月`;
  };

  return (
    <>
      <BulkEditModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onApply={handleBulkApply}
        totalMonths={totalMonths}
        tabLabel={getTabLabel(activeTab)}
        yearOptions={yearOptions.filter(y => y !== 'all')}
        fixedStartDate={fixedStartDate}
      />
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col h-full overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex justify-between items-center">
             <div>
                <h2 className="text-lg font-bold text-brand-slate flex items-center gap-2">
                    <Edit3 className="w-5 h-5 text-brand-gold" />
                    周期性现金流
                </h2>
                <p className="text-xs text-slate-500">管理月度还款、开销和收入。</p>
             </div>
             {(activeTab !== 'ac' && activeTab !== 'dewa') && (
                <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-brand-blue-dark bg-brand-blue-light rounded-md hover:bg-brand-blue/30">
                    <Sliders className="w-4 h-4" />
                    批量编辑
                </button>
             )}
          </div>

          <div className="flex border-b border-slate-100">
              {(['payment', 'income', 'service', 'dewa', 'ac'] as TabType[]).map(tab => (
                  <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`flex-1 flex items-center justify-center gap-1.5 px-2 py-3 text-sm font-medium text-center transition-colors
                          ${activeTab === tab 
                              ? (tab === 'income' ? 'text-green-600 border-b-2 border-green-600 bg-green-50/50' : 'text-brand-blue border-b-2 border-brand-blue bg-blue-50/50') 
                              : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
                          }`}
                  >
                      {getTabIcon(tab)}
                      <span>{getTabLabel(tab)}</span>
                  </button>
              ))}
          </div>
          
           <div className="p-2 border-b border-slate-100 bg-slate-50/50 flex items-center justify-start gap-2">
              <label htmlFor="year-select" className="text-xs text-slate-500 font-medium ml-2">选择年份:</label>
              <select 
                id="year-select"
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="bg-white border border-slate-200 rounded-md shadow-sm px-3 py-1 text-xs font-semibold text-brand-blue-dark focus:ring-1 focus:ring-brand-gold focus:outline-none"
              >
                {yearOptions.map(year => (
                  <option key={year} value={year}>
                    {year === 'all' ? '全部' : year}
                  </option>
                ))}
              </select>
          </div>

          <div className="p-3 border-b border-slate-100 grid grid-cols-2 gap-3 bg-white">
            <div className="p-3 rounded-lg bg-red-50 border border-red-100">
                <div className="flex items-center justify-between">
                    <span className="text-xs text-red-700 font-semibold uppercase">{selectedYear === 'all' ? '总支出' : '年度总支出'}</span>
                    <TrendingDown className="w-4 h-4 text-red-500" />
                </div>
                <div className="text-xl font-bold text-red-600 mt-1">{formatCurrency(yearlyTotals.totalExpense)}</div>
            </div>
            <div className="p-3 rounded-lg bg-green-50 border border-green-100">
                <div className="flex items-center justify-between">
                    <span className="text-xs text-green-700 font-semibold uppercase">{selectedYear === 'all' ? '总收入' : '年度总收入'}</span>
                    <TrendingUp className="w-4 h-4 text-green-500" />
                </div>
                <div className="text-xl font-bold text-green-600 mt-1">{formatCurrency(yearlyTotals.totalIncome)}</div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar p-0">
              <table className="w-full text-sm text-left table-fixed">
                  <thead className="text-xs text-slate-500 bg-slate-50 sticky top-0 z-10 shadow-sm">
                      <tr>
                          <th className="px-2 sm:px-4 py-3 font-semibold text-left">日期</th>
                          <th className="px-2 sm:px-4 py-3 font-semibold text-left">金额 (AED)</th>
                          <th className="px-2 sm:px-4 py-3 font-semibold text-right">月份</th>
                      </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                      {monthsToDisplay.map(i => (
                          <tr key={i} className={`hover:bg-slate-50`}>
                              <td className="px-2 sm:px-4 py-2 text-slate-700 font-medium text-left">{getDateLabel(i)}</td>
                              <td className="px-2 sm:px-4 py-2 text-left">
                                  <input 
                                      type="tel"
                                      inputMode="decimal"
                                      className={`w-full text-left bg-transparent border-b border-transparent focus:border-brand-gold focus:outline-none focus:bg-white px-2 py-1 rounded
                                          ${activeTab === 'income' ? 'text-green-600' : 'text-brand-slate-dark'}
                                          font-medium
                                      `}
                                      value={getValueForMonth(i)}
                                      onChange={(e) => updateSingleMonth(i, e.target.value)}
                                  />
                              </td>
                              <td className="px-2 sm:px-4 py-2 text-slate-400 text-xs text-right">第 {i + 1} 月</td>
                          </tr>
                      ))}
                  </tbody>
              </table>
          </div>
      </div>
    </>
  );
};

export default MonthlyExpenses;