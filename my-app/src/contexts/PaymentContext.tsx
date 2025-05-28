import React, { createContext, useContext, useState } from 'react';

type Ctx = {
  monthlyPayment: number | null;
  setMonthlyPayment: (val: number | null) => void;
};

const PaymentContext = createContext<Ctx | undefined>(undefined);

export const PaymentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [monthlyPayment, setMonthlyPayment] = useState<number | null>(null);
  return (
    <PaymentContext.Provider value={{ monthlyPayment, setMonthlyPayment }}>
      {children}
    </PaymentContext.Provider>
  );
};

export const usePayment = () => {
  const ctx = useContext(PaymentContext);
  if (!ctx) throw new Error('usePayment must be inside PaymentProvider');
  return ctx;
};
