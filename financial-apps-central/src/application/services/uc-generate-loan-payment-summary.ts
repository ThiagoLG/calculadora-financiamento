import { Financing } from "@/domain/entities/financing";

export interface LoanPaymentSummary {
  loanAmount: number;
  averageInstallmentValueUntilTarget: number;
  totalSpentOnInstallmentsUntilTarget: number;
  totalInterestPaidUntilTarget: number;
  totalAmortizedValueUntilTarget: number;
  totalPendingPayment: number;
  averageMonthlyAmortizationPayment: number;
  averageMonthlyPaymentToSettle: number;
  averageMonthlyExpenseToSettle: number;
  averageMonthlyPaymentWithExtraExpense: number;
  totalSpentAtSettlement: number;
}

export class UCGenerateLoanPaymentSummary {
  constructor(private financing: Financing, private paymentTarget: number) { }

  execute(): LoanPaymentSummary {
    let totalPaidUntilTarget = 0;
    let totalInterestUntilTarget = 0;
    let totalAmortizedValueUntilTarget = 0;

    const loanPaymentSummary: LoanPaymentSummary = this.financing
      .getInstallments()
      .reduce<LoanPaymentSummary>((acc, installment, index) => {
        if (!this.paymentTarget || index < this.paymentTarget - 1) {
          totalPaidUntilTarget += installment.getAmount();
          totalInterestUntilTarget += installment.getInterest();
          totalAmortizedValueUntilTarget += installment.getAmortization();
        }
        else if (this.paymentTarget - 1 === index || index - 1 === this.financing.getInstallments().length) {
          acc.averageInstallmentValueUntilTarget = totalPaidUntilTarget / this.paymentTarget;
          acc.totalSpentOnInstallmentsUntilTarget = totalPaidUntilTarget;
          acc.totalInterestPaidUntilTarget = totalInterestUntilTarget;
          acc.totalAmortizedValueUntilTarget = totalAmortizedValueUntilTarget;
          acc.totalPendingPayment = installment.getBalance();
          acc.averageMonthlyAmortizationPayment = acc.totalPendingPayment / this.paymentTarget;
          acc.averageMonthlyPaymentToSettle = acc.averageMonthlyAmortizationPayment + acc.averageInstallmentValueUntilTarget;
          acc.totalSpentAtSettlement = (acc.averageMonthlyPaymentToSettle * this.paymentTarget) + this.financing.getDownPayment();
        }

        return acc;
      }, {
        loanAmount: this.financing.getLoanAmount(),
        averageInstallmentValueUntilTarget: 0,
        totalSpentOnInstallmentsUntilTarget: 0,
        totalInterestPaidUntilTarget: 0,
        totalAmortizedValueUntilTarget: 0,
        totalPendingPayment: 0,
        averageMonthlyAmortizationPayment: 0,
        averageMonthlyPaymentToSettle: 0,
        averageMonthlyExpenseToSettle: 0,
        averageMonthlyPaymentWithExtraExpense: 0,
        totalSpentAtSettlement: 0
      });

    return loanPaymentSummary;
  }
}