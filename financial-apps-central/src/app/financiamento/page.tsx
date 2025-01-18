'use client';
import { InstallmentSimulation } from '@/application/services/uc-calculate-financing';
import { useState } from 'react';
import { FormFinancing } from './_components/formulario/form';
import { FinancingGrid } from './_components/grid/financing-grid';
import styles from './page.module.scss';
import { Financing } from '@/domain/entities/financing';
import { PaymentSummary } from './_components/payment-summary/payment-summary';

export default function Financiamento() {
  const [financing, setFinancing] = useState<Financing | null>(null);
  const [financingPaymentSimulation, setFinancingPaymentSimulation] = useState<InstallmentSimulation[] | null>(null);
  return (
    <div className={styles.container}>
      <h1>Calculadora de financiamento</h1>

      <FormFinancing setFinancingPaymentSimulation={setFinancingPaymentSimulation} setFinancing={setFinancing} />
      {financing && <PaymentSummary financing={financing} />}
      {financingPaymentSimulation && <FinancingGrid financingPaymentSimulation={financingPaymentSimulation} />}
    </div>
  );
}
