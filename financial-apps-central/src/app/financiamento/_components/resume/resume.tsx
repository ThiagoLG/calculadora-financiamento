import {
  LoanPaymentSummary,
  UCGenerateLoanPaymentSummary
} from '@/application/services/uc-generate-loan-payment-summary';
import { Financing } from '@/domain/entities/financing';
import { useEffect, useState } from 'react';

interface ResumeProps {
  financing: Financing;
}
export function Resume({ financing }: ResumeProps) {
  const [resume, setResume] = useState<LoanPaymentSummary>();
  useEffect(() => {
    const data = new UCGenerateLoanPaymentSummary(financing, 60).execute();
    setResume(data);
  }, [financing]);

  return (
    <div>
      <h2>Resumo</h2>
      <pre>{JSON.stringify(resume, null, 2)}</pre>
    </div>
  );
}
