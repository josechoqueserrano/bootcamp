/**
 * Calculadora simple para demostrar testing en CI/CD
 */

function add(a, b) {
  if (typeof a !== 'number' || typeof b !== 'number') {
    throw new Error('Los argumentos deben ser números');
  }
  return a + b;
}

function subtract(a, b) {
  if (typeof a !== 'number' || typeof b !== 'number') {
    throw new Error('Los argumentos deben ser números');
  }
  return a - b;
}

function multiply(a, b) {
  if (typeof a !== 'number' || typeof b !== 'number') {
    throw new Error('Los argumentos deben ser números');
  }
  return a * b;
}

function divide(a, b) {
  if (typeof a !== 'number' || typeof b !== 'number') {
    throw new Error('Los argumentos deben ser números');
  }
  if (b === 0) {
    throw new Error('No se puede dividir por cero');
  }
  return a / b;
}

function factorial(n) {
  if (typeof n !== 'number' || n < 0 || !Number.isInteger(n)) {
    throw new Error('El argumento debe ser un número entero no negativo');
  }
  if (n === 0 || n === 1) {
    return 1;
  }
  return n * factorial(n - 1);
}

function isPrime(n) {
  if (typeof n !== 'number' || n < 2 || !Number.isInteger(n)) {
    return false;
  }
  for (let i = 2; i <= Math.sqrt(n); i++) {
    if (n % i === 0) {
      return false;
    }
  }
  return true;
}

module.exports = {
  add,
  subtract,
  multiply,
  divide,
  factorial,
  isPrime
};