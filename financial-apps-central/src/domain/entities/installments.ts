export class Installment {
  private readonly number: number;
  private readonly amount: number;
  private readonly interestAmount: number;
  private readonly amortizationAmount: number;
  private readonly remainingBalance: number;

  constructor(
    number: number,
    amount: number,
    interestAmount: number,
    amortizationAmount: number,
    remainingBalance: number
  ) {
    this.validateNumber(number);
    this.validateInstallmentAmount(amount);
    this.validateInterestAmount(interestAmount);
    this.validateAmortizationAmount(amortizationAmount);
    this.validateRemainingBalance(remainingBalance);

    this.number = number;
    this.amount = amount;
    this.interestAmount = interestAmount;
    this.amortizationAmount = amortizationAmount;
    this.remainingBalance = remainingBalance;
  }

  private validateNumber(number: number) {
    if (number == null)
      throw new Error('O número da parcela é obrigatório');
    if (number <= 0)
      throw new Error('O número da parcela deve ser maior que zero');
  }

  private validateInstallmentAmount(installmentAmount: number) {
    if (installmentAmount == null)
      throw new Error('O valor da parcela é obrigatório');
    if (installmentAmount <= 0)
      throw new Error('O valor da parcela deve ser maior que zero');
  }

  private validateInterestAmount(interestAmount: number) {
    if (interestAmount == null)
      throw new Error('O valor dos juros é obrigatório');
    if (interestAmount < 0)
      throw new Error('O valor dos juros não pode ser negativo');
  }

  private validateAmortizationAmount(amortizationAmount: number) {
    if (amortizationAmount == null)
      throw new Error('O valor de amortização é obrigatório');
    if (amortizationAmount < 0)
      throw new Error('O valor de amortização não pode ser negativo');
  }

  private validateRemainingBalance(remainingBalance: number) {
    if (remainingBalance == null)
      throw new Error('O saldo devedor é obrigatório');
    if (remainingBalance < 0)
      throw new Error('O saldo devedor não pode ser negativo');
  }

}