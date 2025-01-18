import {
  LoanPaymentSummary,
  UCGenerateLoanPaymentSummary
} from '@/application/services/uc-generate-loan-payment-summary';
import { Financing } from '@/domain/entities/financing';
import { NumberFormatter } from '@/shared/utils/number-formatter';
import { useEffect, useState } from 'react';
import styles from './resume.module.scss';

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
    <>
      {resume && (
        <div className={styles.resumeContainer}>
          <h2>Plano de Pagamento do Financiamento</h2>
          <ul>
            <li>
              <span className={styles.description}>Valor total do financiamento:</span>
              <span className={styles.value}>{NumberFormatter.formatCurrency(resume.loanAmount)}</span>
            </li>
            <li>
              <span className={styles.description}>Valor médio das parcelas no tempo estipulado:</span>
              <span className={styles.value}>
                {NumberFormatter.formatCurrency(resume.averageInstallmentValueUntilTarget)}
              </span>
            </li>
            <li>
              <span className={styles.description}>Total gasto no pagamento de parcelas no tempo estipulado:</span>
              <span className={styles.value}>
                {NumberFormatter.formatCurrency(resume.totalSpentOnInstallmentsUntilTarget)}
              </span>
            </li>
            <li>
              <span className={styles.description}>Total pago de juros no tempo estipulado:</span>
              <span className={styles.value}>
                {NumberFormatter.formatCurrency(resume.totalInterestPaidUntilTarget)}
              </span>
            </li>
            <li>
              <span className={styles.description}>Total amortizado por parcelas no tempo estipulado:</span>
              <span className={styles.value}>
                {NumberFormatter.formatCurrency(resume.totalAmortizedValueUntilTarget)}
              </span>
            </li>
            <li>
              <span className={styles.description}>Total pendente de pagamento:</span>
              <span className={styles.value}>{NumberFormatter.formatCurrency(resume.totalPendingPayment)}</span>
            </li>
            <li>
              <span className={styles.description}>Valor médio mensal de amortização no tempo estipulado:</span>
              <span className={styles.value}>
                {NumberFormatter.formatCurrency(resume.averageMonthlyAmortizationPayment)}
              </span>
            </li>
            <li>
              <span className={styles.description}>Valor médio mensal para quitar no tempo estipulado:</span>
              <span className={styles.value}>
                {NumberFormatter.formatCurrency(resume.averageMonthlyPaymentToSettle)}
              </span>
            </li>
            <li>
              <span className={styles.description}>Total gasto ao término da quitação:</span>
              <span className={styles.value}>{NumberFormatter.formatCurrency(resume.totalSpentAtSettlement)}</span>
            </li>
          </ul>
          {/* <pre>{JSON.stringify(resume, null, 2)}</pre> */}
        </div>
      )}
    </>
  );
}
