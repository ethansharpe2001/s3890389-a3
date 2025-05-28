import React, { useState, FormEvent } from 'react';
import Header from '../components/header';
import Footer from '../components/footer';
import { calculateLoan } from '../pages/api/loanApi';
import { usePayment } from '../contexts/PaymentContext';

const HomePage: React.FC = () => {
  const [loanType, setLoanType] = useState('');
  const [loanAmount, setLoanAmount] = useState('');
  const [term, setTerm] = useState('');
  const [creditScore, setCreditScore] = useState('');
  const [houseAge, setHouseAge] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  const [result, setResult] = useState<any>(null);
  const { setMonthlyPayment } = usePayment();

  const termMax = loanType === 'InterestOnly' ? 10 : 30;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!loanType) newErrors.loanType = 'Required';
    const amt = Number(loanAmount);
    if (!loanAmount) newErrors.loanAmount = 'Required';
    else if (isNaN(amt) || amt <= 0) newErrors.loanAmount = 'Positive number';
    const tm = Number(term);
    if (!term) newErrors.term = 'Required';
    else if (isNaN(tm) || tm < 1 || tm > termMax)
      newErrors.term = `1-${termMax}`;
    if (!creditScore) newErrors.creditScore = 'Required';
    const age = Number(houseAge);
    if (!houseAge) newErrors.houseAge = 'Required';
    else if (isNaN(age) || age < 0) newErrors.houseAge = '≥ 0';

    setErrors(newErrors);
    if (Object.keys(newErrors).length) return;

    setLoading(true);
    setApiError('');
    try {
      const response = await calculateLoan({
        loanType:
          loanType === 'InterestOnly' ? 'Interest Only' : `${loanType} Rate`,
        loanAmount: amt,
        term: tm,
        creditScore: creditScore as any,
        houseAge: age,
      });
      setResult(response);
      setMonthlyPayment(response.monthlyPayment);
    } catch (err: any) {
      setApiError(err.message);
      setResult(null);
      setMonthlyPayment(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />

      <main className="container my-4">
        <form id="loanForm" onSubmit={handleSubmit} noValidate>
          <div className="row g-3">
            <div className="col-12 col-md-6 mb-3">
              <label htmlFor="loanType" className="form-label">Loan Type</label>
              <select
                id="loanType"
                name="loanType"
                className={`form-select ${errors.loanType ? 'is-invalid' : ''}`}
                value={loanType}
                onChange={e => setLoanType(e.target.value)}
              >
                <option value="">Select</option>
                <option value="Fixed">Fixed Rate</option>
                <option value="Variable">Variable Rate</option>
                <option value="InterestOnly">Interest Only</option>
              </select>
              {errors.loanType && <div className="invalid-feedback">{errors.loanType}</div>}
            </div>

            <div className="col-12 col-md-6 mb-3">
              <label htmlFor="loanAmount" className="form-label">Loan Amount ($)</label>
              <input
                type="number"
                id="loanAmount"
                name="loanAmount"
                className={`form-control ${errors.loanAmount ? 'is-invalid' : ''}`}
                min={1}
                step={1000}
                value={loanAmount}
                onChange={e => setLoanAmount(e.target.value)}
              />
              {errors.loanAmount && <div className="invalid-feedback">{errors.loanAmount}</div>}
            </div>

            <div className="col-12 col-md-6 mb-3">
              <label htmlFor="term" className="form-label">Term (years)</label>
              <input
                type="number"
                id="term"
                name="term"
                className={`form-control ${errors.term ? 'is-invalid' : ''}`}
                min={1}
                max={termMax}
                value={term}
                onChange={e => setTerm(e.target.value)}
              />
              {errors.term && <div className="invalid-feedback">{errors.term}</div>}
            </div>

            <div className="col-12 col-md-6 mb-3">
              <label htmlFor="creditScore" className="form-label">Credit Score</label>
              <select
                id="creditScore"
                name="creditScore"
                className={`form-select ${errors.creditScore ? 'is-invalid' : ''}`}
                value={creditScore}
                onChange={e => setCreditScore(e.target.value)}
              >
                <option value="">Select</option>
                <option value="Excellent">Excellent</option>
                <option value="Good">Good</option>
                <option value="Fair">Fair</option>
                <option value="Poor">Poor</option>
              </select>
              {errors.creditScore && <div className="invalid-feedback">{errors.creditScore}</div>}
            </div>

            <div className="col-12 col-md-6 mb-3">
              <label htmlFor="houseAge" className="form-label">House Age (years)</label>
              <input
                type="number"
                id="houseAge"
                name="houseAge"
                className={`form-control ${errors.houseAge ? 'is-invalid' : ''}`}
                min={0}
                value={houseAge}
                onChange={e => setHouseAge(e.target.value)}
              />
              {errors.houseAge && <div className="invalid-feedback">{errors.houseAge}</div>}
            </div>

            <div className="col-12 text-end">
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading && <span className="spinner-border spinner-border-sm me-2" role="status" />}
                {loading ? 'Calculating…' : 'Submit'}
              </button>
            </div>
          </div>
        </form>

        {apiError && (
          <div className="alert alert-danger mt-4" role="alert">{apiError}</div>
        )}

        {result && (
          <div className="card mt-4">
            <div className="card-header">Calculation Results</div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-4"><p>Monthly Payment: ${result.monthlyPayment.toFixed(2)}</p></div>
                <div className="col-md-4"><p>Total Payment: ${result.totalPayment.toFixed(2)}</p></div>
                <div className="col-md-4"><p>Total Interest: ${result.totalInterest.toFixed(2)}</p></div>
              </div>
              <ul className="list-unstyled mb-0">
                <li>Loan Amount: ${result.breakdown.loanAmount.toFixed(2)}</li>
                <li>Term: {result.breakdown.term} years</li>
                <li>Base Interest Rate: {(result.breakdown.baseRate * 100).toFixed(2)}%</li>
                <li>Adjusted Interest Rate: {(result.breakdown.adjustedRate * 100).toFixed(2)}%</li>
                <li>Credit Score Multiplier: {result.breakdown.creditMultiplier}</li>
                <li>House Age Multiplier: {result.breakdown.houseAgeMultiplier}</li>
                <li>House Age Category: {result.breakdown.houseAgeCategory}</li>
                <li>Term in months: {result.breakdown.termInMonths}</li>
              </ul>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </>
  );
};

export default HomePage;
