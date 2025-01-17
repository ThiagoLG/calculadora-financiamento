import { AmortizationType } from "@/shared/types/amortization-type";
import { BaseEntity } from "./base-entity";
import { Installment } from "./installments";

export class Financing extends BaseEntity {
  private readonly loanAmount: number;
  private readonly downPayment: number;
  private readonly installmentCount: number;
  private readonly interestRate: number;
  private readonly amortizationType: AmortizationType;
  private totalFinancingCost: number | undefined;
  private installments: Installment[];

  constructor(
    loanAmount: number,
    downPayment: number,
    installmentCount: number,
    interestRate: number,
    amortizationType: AmortizationType,
    // totalFinancingCost: number
  ) {
    super();

    this.validateLoanAmount(loanAmount);
    this.validateDownPayment(downPayment, loanAmount);
    this.validateinstallmentCount(installmentCount);
    this.validateInterestRate(interestRate);
    this.validateAmortizationType(amortizationType);
    // this.validatetotalFinancingCost(totalFinancingCost);

    this.loanAmount = loanAmount;
    this.downPayment = downPayment;
    this.installmentCount = installmentCount;
    this.interestRate = interestRate;
    this.amortizationType = amortizationType;
    this.installments = [];
    // this.totalFinancingCost = totalFinancingCost || 0;
  }

  public calculateInstallments() {
    if (this.amortizationType === 'SAC') {
      const financing = this.calculateBySAC();
      this.installments = financing.installments;
      this.totalFinancingCost = financing.totalFinancingCost;
    }
  }

  /**
   * O conceito e cálculo de financiamento pela tabela SAC (Sistema de Amortização Constante) consiste em:
   * 
   * 1. Amortização Constante: O valor da amortização é constante ao longo de todas as parcelas.
   *    A amortização é calculada dividindo o valor financiado (valor do empréstimo menos a entrada) 
   *    pelo número total de parcelas.
   * 
   * 2. Juros Decrescentes: Os juros são calculados sobre o saldo devedor, que diminui a cada parcela
   *    paga. Portanto, o valor dos juros é maior nas primeiras parcelas e vai diminuindo ao longo do tempo.
   * 
   * 3. Parcelas Decrescentes: Como a amortização é constante e os juros são decrescentes, o valor total
   *    das parcelas (amortização + juros) também diminui ao longo do tempo.
   * 
   * O método `calculateBySAC` realiza o cálculo das parcelas e do valor total do financiamento utilizando
   * a tabela SAC, retornando um objeto contendo o valor total do financiamento e uma lista de parcelas.
   * Cada parcela inclui o número da parcela, o valor da parcela, o valor dos juros, o valor da amortização
   * e o saldo devedor após o pagamento da parcela.
   */
  private calculateBySAC() {
    const financingValue = this.loanAmount - this.downPayment;
    const monthlyInterestRate = this.interestRate / 12 / 100;
    const amortization = financingValue / this.installmentCount;
    let balance = financingValue;
    let totalFinancingCost = 0;
    const installments: Installment[] = [];

    for (let i = 1; i <= this.installmentCount; i++) {
      const interestAmount = balance * monthlyInterestRate;
      const installmentAmount = amortization + interestAmount;
      balance -= amortization;
      totalFinancingCost += installmentAmount;

      if (balance < 0) balance = 0;

      const installment = new Installment(i, installmentAmount, interestAmount, amortization, balance);

      installments.push(installment);
    }

    return {
      totalFinancingCost: parseFloat(totalFinancingCost.toFixed(2)),
      installments: installments
    };
  }

  private validateLoanAmount(loanAmount: number) {
    if (loanAmount == null)
      throw new Error('O valor total do financiamento é obrigatório');
    if (loanAmount < 1_000)
      throw new Error('O valor total do financiamento não pode ser menor que R$ 1.000,00')
  }

  private validateDownPayment(downPayment: number, loanAmount: number) {
    if (downPayment == null)
      throw new Error('O valor de entrada deve ser informado obrigatoriamente')
    if (downPayment > loanAmount * 0.8)
      throw new Error('O valor de entrada não pode ser maior que 80% do valor do financiamento')
    if (downPayment < loanAmount * 0.1)
      throw new Error('O valor de entrada não pode ser menor que 10% do valor do financiamento')
  }

  private validateinstallmentCount(installmentCount: number) {
    if (installmentCount == null)
      throw new Error('A quantidade de parcelas do financiamento é obrigatória')
    if (installmentCount > 420)
      throw new Error('O financiamento não pode ser realizado para mais de 35 anos')
    if (installmentCount < 12)
      throw new Error('O financiamento não pode ser realizado para menos de 1 ano')
  }

  private validateInterestRate(interestRate: number) {
    if (interestRate == null)
      throw new Error('A taxa de juros é obrigatória');
    if (interestRate < 0)
      throw new Error('A taxa de juros não pode ser negativa')
    if (interestRate > 100)
      throw new Error('A taxa de juros não pode ser maior que 100%')
  }

  private validateAmortizationType(amortizationType: AmortizationType) {
    if (!amortizationType)
      throw new Error('O tipo de amortização deve ser informado obrigatoriamente')
    if (amortizationType !== 'SAC' && amortizationType != 'Price')
      throw new Error('O tipo de amortização deve ser SAC ou Price')
  }

  public getInstallments(): Installment[] {
    return this.installments;
  }

  public getLoanAmount(): number {
    return this.loanAmount;
  }

  public getDownPayment(): number {
    return this.downPayment;
  }

}