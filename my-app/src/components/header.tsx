import React from 'react';
import { usePayment } from '../contexts/PaymentContext';

const Header: React.FC = () => {
  const { monthlyPayment } = usePayment();
  return (
    <header className="bg-primary text-white py-3 mb-4">
      <div className="container d-flex justify-content-between align-items-center">
        <h1 className="h3 mb-0">Loan Calculator</h1>
        {monthlyPayment !== null && (
          <span className="badge bg-success fs-6">
            Monthly Payment: ${monthlyPayment.toFixed(2)}
          </span>
        )}
      </div>
    </header>
  );
};

export default Header;
