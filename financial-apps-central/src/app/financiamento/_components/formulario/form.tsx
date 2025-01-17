'use client';
import { Dispatch, SetStateAction } from 'react';
import styles from './form.module.scss';
import { Controller, useForm } from 'react-hook-form';
import { CurrencyInput } from 'react-currency-mask';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Financing } from '@/domain/entities/financing';
import { InstallmentSimulation, UCCalculateFinancing } from '@/application/services/uc-calculate-financing';

interface IFormFinancingProps {
  setFinancingPaymentSimulation: Dispatch<SetStateAction<InstallmentSimulation[] | null>>;
  setFinancing: Dispatch<SetStateAction<Financing | null>>;
}

const FormFinancingSchema = z
  .object({
    loanAmount: z.preprocess(preprocessNumber, z.number().min(1000, 'O valor mínimo é de R$ 1.000,00')),
    downPayment: z.preprocess(preprocessNumber, z.number().min(1, 'O valor da entrada é obrigatório')),
    installmentCount: z.coerce.number().min(1, 'É necessário ter pelo menos 1 parcela'),
    interestRate: z.coerce
      .number()
      .min(0, 'A taxa de juros não pode ser negativa')
      .max(100, 'A taxa de juros não pode ser maior que 100'),
    targetPaymentTerm: z.coerce.number().optional()
  })
  .superRefine((data, ctx) => {
    console.log('Data', data);
    if (data.targetPaymentTerm !== undefined && data.targetPaymentTerm > data.installmentCount) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['targetPaymentTerm'],
        message: 'O tempo desejado de quitação não pode exceder o número de parcelas'
      });
    }
    if (data.downPayment > data.loanAmount * 0.9) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['downPayment'],
        message: 'O valor da entrada não pode ser maior que 90% do valor total do imóvel'
      });
    }
    if (data.downPayment < data.loanAmount * 0.1) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['downPayment'],
        message: 'O valor da entrada não pode ser menor que 10% do valor total do imóvel'
      });
    }
  });

type IFormFinancingData = z.infer<typeof FormFinancingSchema>;

function preprocessNumber(val: unknown) {
  return Number(val) || 0;
}

export function FormFinancing({ setFinancingPaymentSimulation, setFinancing }: IFormFinancingProps) {
  const { register, handleSubmit, formState, control } = useForm<IFormFinancingData>({
    resolver: zodResolver(FormFinancingSchema),
    defaultValues: {
      loanAmount: 300_000,
      downPayment: 80_000,
      interestRate: 9,
      installmentCount: 360,
      targetPaymentTerm: 60
    }
  });

  function formSubmit(data: IFormFinancingData) {
    const financing = new Financing(data.loanAmount, data.downPayment, data.installmentCount, data.interestRate, 'SAC');
    setFinancing(financing);
    const paymentSimulation = new UCCalculateFinancing(financing, data.targetPaymentTerm || 60).execute();
    setFinancingPaymentSimulation(paymentSimulation);
  }

  return (
    <>
      <form className={styles.financingForm} onSubmit={handleSubmit(formSubmit)}>
        <div className={styles.fieldsWrapper}>
          <div className={styles.formGroup}>
            <label>Valor Total do Imóvel</label>
            <Controller
              name="loanAmount"
              control={control}
              data-invalid={formState?.errors?.loanAmount ? 'true' : 'false'}
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
            {formState?.errors?.loanAmount && (
              <span className={styles.errorAlert}>{formState.errors.loanAmount.message}</span>
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
              data-invalid={formState?.errors?.installmentCount ? 'true' : 'false'}
              {...register('installmentCount')}
            />
            {formState?.errors?.installmentCount && (
              <span className={styles.errorAlert}>{formState.errors.installmentCount.message}</span>
            )}
          </div>

          <div className={styles.formGroup}>
            <label>Taxa de Juros Anual (%)</label>
            <input
              type="number"
              min="0"
              max="100"
              step="0.1"
              data-invalid={formState?.errors?.interestRate ? 'true' : 'false'}
              {...register('interestRate')}
            />
            {formState?.errors?.interestRate && (
              <span className={styles.errorAlert}>{formState.errors.interestRate.message}</span>
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
      </form>
    </>
  );
}
