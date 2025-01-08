'use client';
import { useState } from 'react';
import styles from './form.module.scss';
import { Controller, useForm } from 'react-hook-form';
import { CurrencyInput } from 'react-currency-mask';

interface IFormFinancingData {
  totalValue: number;
  downPayment: number;
  numberOfInstallments: number;
  anualInterestRate: number;
  targetPaymentTerm: number;
}
export function FormFinancing() {
  const { register, handleSubmit, formState, control } = useForm<IFormFinancingData>();
  const [formData, setFormData] = useState<IFormFinancingData | null>(null);

  function formSubmit(data: IFormFinancingData) {
    setFormData(data);
    console.log('Formulário enviado!', data);
    console.log('Formulário enviado!', formState);
  }

  return (
    <form className={styles.financingForm} onSubmit={handleSubmit(formSubmit)}>
      <div className={styles.fieldsWrapper}>
        <div className={styles.formGroup}>
          <label>Valor Total do Imóvel</label>
          <Controller
            name="totalValue"
            control={control}
            render={({ field }) => {
              return (
                <CurrencyInput
                  value={field.value}
                  onChangeValue={(_, originalValue) => {
                    field.onChange(originalValue);
                  }}
                />
              );
            }}
          />
        </div>

        <div className={styles.formGroup}>
          <label>Valor da Entrada</label>
          <Controller
            name="downPayment"
            control={control}
            render={({ field }) => {
              return (
                <CurrencyInput
                  value={field.value}
                  onChangeValue={(_, originalValue) => {
                    field.onChange(originalValue);
                  }}
                />
              );
            }}
          />
        </div>

        <div className={styles.formGroup}>
          <label>Número de Parcelas</label>
          <input type="number" {...register('numberOfInstallments', { required: true, min: 12 })} />
        </div>

        <div className={styles.formGroup}>
          <label>Taxa de Juros Anual (%)</label>
          <input type="number" step="0.1" {...register('anualInterestRate', { required: true, min: 0 })} />
        </div>

        <div className={styles.formGroup}>
          <label>Tempo Desejado Quitação</label>
          <input type="number" {...register('targetPaymentTerm')} />
        </div>
      </div>

      <div className={styles.buttonWrapper}>
        <button type="submit">Calcular</button>
      </div>

      {formData && <pre>{JSON.stringify(formData, null, 2)} </pre>}
    </form>
  );
}
