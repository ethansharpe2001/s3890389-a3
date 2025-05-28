export interface LoanRequest {
  loanType: 'Fixed Rate' | 'Variable Rate' | 'Interest Only';
  loanAmount: number;
  term: number;
  creditScore: 'Excellent' | 'Good' | 'Fair' | 'Poor';
  houseAge: number;
}

export interface LoanResponse {
  monthlyPayment: number;
  totalPayment: number;
  totalInterest: number;
  breakdown: {
    loanAmount: number;
    term: number;
    baseRate: number;
    adjustedRate: number;
    creditMultiplier: number;
    houseAgeMultiplier: number;
    houseAgeCategory: string;
    termInMonths: number;
  };
}

export async function calculateLoan(payload: LoanRequest): Promise<LoanResponse> {
  const res = await fetch(
    'https://home-loan.matthayward.workers.dev/calculate',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    },
  );
  const data = await res.json();
  if (!res.ok) throw new Error(data?.error || 'Server error');
  return data as LoanResponse;
}
