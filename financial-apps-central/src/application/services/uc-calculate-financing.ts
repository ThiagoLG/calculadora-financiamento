import { Financing } from "@/domain/entities/financing";

export type InstallmentSimulation = {
  number: number,
  amount: number,
  interestAmount: number,
  amortizationAmount: number,
  remainingBalance: number
  additionalAmortization: number;
  totalPaidOnMonth: number;
  balanceWithAmortization: number;
}
export class UCCalculateFinancing {
  financing: Financing;
  paymentTarget: number;

  constructor(financing: Financing, paymentTarget: number) {
    this.financing = financing;
    this.paymentTarget = paymentTarget;
  }

  public execute(): InstallmentSimulation[] {
    this.financing.calculateInstallments();

    const averageMonthlyAmortization = this.financing.getInstallments()?.[this.paymentTarget - 1]?.getBalance() / this.paymentTarget;

    const financingPaymentPlan: InstallmentSimulation[] = this.financing.getInstallments().reduce<InstallmentSimulation[]>((acc, curr) => {
      const additionalAmortization = averageMonthlyAmortization - curr.getAmortization();
      const totalPaidOnMonth = curr.getInterest() + curr.getAmortization() + additionalAmortization;
      const balanceWithAmortization = curr.getBalance() - additionalAmortization;

      acc.push({
        additionalAmortization,
        totalPaidOnMonth,
        balanceWithAmortization,
        amortizationAmount: curr.getAmortization(),
        amount: curr.getAmount(),
        interestAmount: curr.getInterest(),
        number: curr.getNumber(),
        remainingBalance: curr.getBalance()
      });
      return acc;
    }, []);

    return financingPaymentPlan
  }
}