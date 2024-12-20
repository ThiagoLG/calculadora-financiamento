const totalValue = 300_000;
const downPayment = 80_000;
const numberOfInstallments = 360;
const annualInterestRate = 9.75;
const condoMonthlyFee = 600;
const targetPaymentTerm = 60;
const extraPayment = 30_000; // valor exta a ser pago durante o período estipulado (não entra nas parcelas, deve ser pago a parte)


function simulateFinancing(totalValue, annualInterestRate, numberOfInstallments, downPayment) {
  // Error handling
  if (typeof totalValue !== 'number' || totalValue <= 0) {
    throw new Error('Invalid total property value.');
  }
  if (typeof annualInterestRate !== 'number' || annualInterestRate < 0) {
    throw new Error('Invalid annual interest rate.');
  }
  if (!Number.isInteger(numberOfInstallments) || numberOfInstallments <= 0) {
    throw new Error('Invalid number of installments.');
  }
  if (typeof downPayment !== 'number' || downPayment < 0 || downPayment > totalValue) {
    throw new Error('Invalid down payment value.');
  }

  const principal = totalValue - downPayment;
  const monthlyInterestRate = annualInterestRate / 12 / 100;
  const amortization = principal / numberOfInstallments;
  let balance = principal;
  let totalFinancing = 0;
  const installments = [];

  for (let i = 1; i <= numberOfInstallments; i++) {
    const interest = balance * monthlyInterestRate;
    const installmentTotal = amortization + interest;
    balance -= amortization;
    totalFinancing += installmentTotal;

    installments.push({
      installmentNumber: i,
      totalValue: parseFloat(installmentTotal.toFixed(2)),
      interest: parseFloat(interest.toFixed(2)),
      amortization: parseFloat(amortization.toFixed(2)),
      balanceDue: parseFloat(balance.toFixed(2))
    });
  }

  return {
    totalFinancing: parseFloat(totalFinancing.toFixed(2)),
    installments: installments
  };
}

function formatCurrency(value) {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function calculateAverageInstallmentValue(financing, term) {
  const total = financing.installments.slice(0, term).reduce((acc, installment) => acc + installment.totalValue, 0);
  return parseFloat((total / term).toFixed(2));
}

function calculateTotalPaidUtilTerm(financing, term) {
  return financing.installments.slice(0, term).reduce((acc, installment) => acc + installment.totalValue, 0);
}

function calculateTotalInterestPaidUtilTerm(financing, term) {
  return financing.installments.slice(0, term).reduce((acc, installment) => acc + installment.interest, 0);
}

const financing = simulateFinancing(totalValue, annualInterestRate, numberOfInstallments, downPayment);
console.log(financing)
console.log("****** SIMULAÇÃO DE FINANCIAMENTO ******");
console.log('------- Dados de Entrada ------');
console.log("Valor total do imóvel: ", formatCurrency(totalValue));
console.log("Valor da entrada: ", formatCurrency(downPayment));
console.log("Valor total financiado: ", formatCurrency(totalValue - downPayment));
console.log("Número de parcelas:", numberOfInstallments);
console.log("Taxa de juros anual:", annualInterestRate, "%");
console.log('Tempo esperado para quitar o financiamento:', targetPaymentTerm, 'meses');
console.log('-------------------------------');
console.log('------- Dados de Saída ------');
console.log("Valor total do financiamento (parcelas + juros): ", formatCurrency(financing.totalFinancing));
console.log("Valor da primeira parcela:", formatCurrency(financing.installments[0].totalValue));
console.log("Valor da última parcela:", formatCurrency(financing.installments[numberOfInstallments - 1].totalValue));
console.log("Valor de amortização mensal (desconto a cada parcela):", formatCurrency(financing.installments[0].amortization));
console.log('Valor médio das parcelas no tempo estipulado:', formatCurrency(calculateAverageInstallmentValue(financing, targetPaymentTerm)));
console.log('Total gasto no pagamento de parcelas no tempo estipulado:', formatCurrency(calculateTotalPaidUtilTerm(financing, targetPaymentTerm)));
console.log('Total pago de juros no tempo estipulado: ', formatCurrency(calculateTotalInterestPaidUtilTerm(financing, targetPaymentTerm)));
console.log('Valor total amortizado por parcelas no tempo estipulado:', formatCurrency(financing.installments[targetPaymentTerm - 1].amortization * targetPaymentTerm));
console.log('Total pendente de pagamento (valor a ser amortizado):', formatCurrency(financing.installments[targetPaymentTerm - 1].balanceDue));
console.log('Valor médio mensal para pagar amortização no tempo estipulado', formatCurrency(financing.installments[targetPaymentTerm - 1].balanceDue / targetPaymentTerm));
console.log('Valor médio mensal para quitar no tempo estipulado:', formatCurrency(financing.installments[targetPaymentTerm - 1].balanceDue / targetPaymentTerm + calculateAverageInstallmentValue(financing, targetPaymentTerm)));
console.log("Gasto médio mensal para quitar no tempo estipulado (+ gasto de condominio)", formatCurrency(financing.installments[targetPaymentTerm - 1].balanceDue / targetPaymentTerm + calculateAverageInstallmentValue(financing, targetPaymentTerm) + condoMonthlyFee));
console.log('Valor médio mensal para quitar no tempo estipulado (com gasto extra)', formatCurrency(financing.installments[targetPaymentTerm - 1].balanceDue / targetPaymentTerm + calculateAverageInstallmentValue(financing, targetPaymentTerm) + condoMonthlyFee + (extraPayment / targetPaymentTerm)));
console.log('-----------------------------');
console.log('****************************************');