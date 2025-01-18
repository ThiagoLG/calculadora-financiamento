import {
  LoanPaymentSummary,
  UCGenerateLoanPaymentSummary
} from '@/application/services/uc-generate-loan-payment-summary';
import { Financing } from '@/domain/entities/financing';
import { useEffect, useState } from 'react';
import styles from './payment-summary.module.scss';
import { motion } from 'motion/react';
import { PaymentSummaryItem } from './payment-summary-item';

interface PaymentSummaryProps {
  financing: Financing;
}

export function PaymentSummary({ financing }: PaymentSummaryProps) {
  const [paymentSummary, setPaymentSummary] = useState<LoanPaymentSummary>();
  const [filled, setFilled] = useState(true);

  useEffect(() => {
    setFilled(false);

    const data = new UCGenerateLoanPaymentSummary(financing, 60).execute();

    setTimeout(() => {
      setPaymentSummary(data);
      setFilled(true);
    }, 400);
  }, [financing]);

  const variants = {
    hidden: {
      transition: {
        staggerChildren: 0.02,
        staggerDirection: -1
      }
    },
    show: {
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1
      }
    }
  };

  return (
    <>
      {paymentSummary && (
        <motion.div className={styles.summaryContainer} initial={{ scale: 0 }} animate={{ scale: 1 }}>
          <h2>Plano de Pagamento do Financiamento</h2>
          <motion.ul variants={variants} initial="hidden" animate={filled ? 'show' : 'hidden'}>
            <PaymentSummaryItem title="Valor total do financiamento:" value={paymentSummary.loanAmount} />
            <PaymentSummaryItem
              title="Valor médio das parcelas no tempo estipulado:"
              value={paymentSummary.averageInstallmentValueUntilTarget}
            />
            <PaymentSummaryItem
              title="Total gasto no pagamento de parcelas no tempo estipulado:"
              value={paymentSummary.totalSpentOnInstallmentsUntilTarget}
            />
            <PaymentSummaryItem
              title="Total pago de juros no tempo estipulado:"
              value={paymentSummary.totalInterestPaidUntilTarget}
            />
            <PaymentSummaryItem
              title="Total amortizado por parcelas no tempo estipulado:"
              value={paymentSummary.totalAmortizedValueUntilTarget}
            />
            <PaymentSummaryItem title="Total pendente de pagamento:" value={paymentSummary.totalPendingPayment} />
            <PaymentSummaryItem
              title="Valor médio mensal de amortização no tempo estipulado:"
              value={paymentSummary.averageMonthlyAmortizationPayment}
            />
            <PaymentSummaryItem
              title="Valor médio mensal para quitar no tempo estipulado:"
              value={paymentSummary.averageMonthlyPaymentToSettle}
            />
            <PaymentSummaryItem
              title="Total gasto ao término da quitação:"
              value={paymentSummary.totalSpentAtSettlement}
            />
          </motion.ul>
        </motion.div>
      )}
    </>
  );
}
