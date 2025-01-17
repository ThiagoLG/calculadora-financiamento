'use client';
import { InstallmentSimulation } from '@/application/services/uc-calculate-financing';
import { NumberFormatter } from '@/shared/utils/number-formatter';
import styles from './financing-grid.module.scss';

interface FinancingGridProps {
  financingPaymentSimulation: InstallmentSimulation[] | null;
}
export function FinancingGrid({ financingPaymentSimulation }: FinancingGridProps) {
  // console.log(financingPaymentSimulation);
  return (
    <div className={styles.gridContainer}>
      <table>
        <thead>
          <tr>
            <th align="center">Parcela</th>
            <th align="center">Valor da Parcela</th>
            <th align="center">Valor do Juros</th>
            <th align="center">Valor Amortizado</th>
            <th align="center">Saldo Devedor</th>
          </tr>
        </thead>
        <tbody>
          {financingPaymentSimulation?.map((installment, index) => (
            <tr key={index}>
              <td align="center">{index + 1}</td>
              <td align="center">{NumberFormatter.formatCurrency(installment.amount)}</td>
              <td align="center">{NumberFormatter.formatCurrency(installment.interestAmount)}</td>
              <td align="center">{NumberFormatter.formatCurrency(installment.additionalAmortization)}</td>
              <td align="center">{NumberFormatter.formatCurrency(installment.remainingBalance)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
