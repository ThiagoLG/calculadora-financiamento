'use client';
import { useState } from 'react';
import styles from './form.module.scss';
import { Controller, useForm } from 'react-hook-form';
import { CurrencyInput } from 'react-currency-mask';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const FormFinancingSchema = z
  .object({
    totalValue: z.preprocess(preprocessNumber, z.number().min(1000, 'O valor mínimo é de R$ 1.000,00')),
    downPayment: z.preprocess(preprocessNumber, z.number().min(1, 'O valor da entrada é obrigatório')),
    numberOfInstallments: z.coerce.number().min(1, 'É necessário ter pelo menos 1 parcela'),
    anualInterestRate: z.coerce
      .number()
      .min(0, 'A taxa de juros não pode ser negativa')
      .max(100, 'A taxa de juros não pode ser maior que 100'),
    targetPaymentTerm: z.coerce.number().optional()
  })
  .superRefine((data, ctx) => {
    console.log('Data', data);
    if (data.targetPaymentTerm !== undefined && data.targetPaymentTerm > data.numberOfInstallments) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['targetPaymentTerm'],
        message: 'O tempo desejado de quitação não pode exceder o número de parcelas'
      });
    }
    if (data.downPayment > data.totalValue * 0.9) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['downPayment'],
        message: 'O valor da entrada não pode ser maior que 90% do valor total do imóvel'
      });
    }
  });

type IFormFinancingData = z.infer<typeof FormFinancingSchema>;

function preprocessNumber(val: unknown) {
  return Number(val) || 0;
}

export function FormFinancing() {
  const { register, handleSubmit, formState, control } = useForm<IFormFinancingData>({
    resolver: zodResolver(FormFinancingSchema),
    defaultValues: {
      totalValue: 300_000,
      downPayment: 80_000,
      anualInterestRate: 9,
      numberOfInstallments: 360,
      targetPaymentTerm: 60
    }
  });
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
            data-invalid={formState?.errors?.totalValue ? 'true' : 'false'}
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
          {formState?.errors?.totalValue && (
            <span className={styles.errorAlert}>{formState.errors.totalValue.message}</span>
          )}
        </div>

        <div className={styles.formGroup}>
          <label>Valor da Entrada</label>
          <Controller
            name="downPayment"
            control={control}
            data-invalid={formState?.errors?.downPayment ? 'true' : 'false'}
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
          {formState?.errors?.downPayment && (
            <span className={styles.errorAlert}>{formState.errors.downPayment.message}</span>
          )}
        </div>

        <div className={styles.formGroup}>
          <label>Número de Parcelas</label>
          <input
            type="number"
            data-invalid={formState?.errors?.numberOfInstallments ? 'true' : 'false'}
            {...register('numberOfInstallments')}
          />
          {formState?.errors?.numberOfInstallments && (
            <span className={styles.errorAlert}>{formState.errors.numberOfInstallments.message}</span>
          )}
        </div>

        <div className={styles.formGroup}>
          <label>Taxa de Juros Anual (%)</label>
          <input
            type="number"
            min="0"
            max="100"
            step="0.1"
            data-invalid={formState?.errors?.anualInterestRate ? 'true' : 'false'}
            {...register('anualInterestRate')}
          />
          {formState?.errors?.anualInterestRate && (
            <span className={styles.errorAlert}>{formState.errors.anualInterestRate.message}</span>
          )}
        </div>

        <div className={styles.formGroup}>
          <label>Tempo Desejado Quitação</label>
          <input
            type="number"
            data-invalid={formState?.errors?.targetPaymentTerm ? 'true' : 'false'}
            {...register('targetPaymentTerm')}
          />
          {formState?.errors?.targetPaymentTerm && (
            <span className={styles.errorAlert}>{formState.errors.targetPaymentTerm.message}</span>
          )}
        </div>
      </div>

      <div className={styles.buttonWrapper}>
        <button type="submit">Calcular</button>
      </div>

      {formData && <pre>{JSON.stringify(formData, null, 2)} </pre>}
    </form>
  );
}
