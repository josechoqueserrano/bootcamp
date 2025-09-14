const calculator = require('../src/calculator');

describe('Calculator Tests', () => {
  describe('Addition', () => {
    test('should add two positive numbers', () => {
      expect(calculator.add(2, 3)).toBe(5);
    });

    test('should add negative numbers', () => {
      expect(calculator.add(-2, -3)).toBe(-5);
    });

    test('should add positive and negative numbers', () => {
      expect(calculator.add(5, -3)).toBe(2);
    });

    test('should handle zero', () => {
      expect(calculator.add(0, 5)).toBe(5);
      expect(calculator.add(5, 0)).toBe(5);
    });

    test('should throw error with non-number arguments', () => {
      expect(() => calculator.add('a', 2)).toThrow('Los argumentos deben ser números');
      expect(() => calculator.add(2, null)).toThrow('Los argumentos deben ser números');
    });
  });

  describe('Subtraction', () => {
    test('should subtract two positive numbers', () => {
      expect(calculator.subtract(5, 3)).toBe(2);
    });

    test('should handle negative results', () => {
      expect(calculator.subtract(3, 5)).toBe(-2);
    });

    test('should throw error with non-number arguments', () => {
      expect(() => calculator.subtract('a', 2)).toThrow('Los argumentos deben ser números');
    });
  });

  describe('Multiplication', () => {
    test('should multiply two positive numbers', () => {
      expect(calculator.multiply(3, 4)).toBe(12);
    });

    test('should handle zero multiplication', () => {
      expect(calculator.multiply(5, 0)).toBe(0);
      expect(calculator.multiply(0, 5)).toBe(0);
    });

    test('should handle negative numbers', () => {
      expect(calculator.multiply(-3, 4)).toBe(-12);
      expect(calculator.multiply(-3, -4)).toBe(12);
    });
  });

  describe('Division', () => {
    test('should divide two positive numbers', () => {
      expect(calculator.divide(10, 2)).toBe(5);
    });

    test('should handle decimal results', () => {
      expect(calculator.divide(10, 3)).toBeCloseTo(3.333, 3);
    });

    test('should throw error when dividing by zero', () => {
      expect(() => calculator.divide(10, 0)).toThrow('No se puede dividir por cero');
    });

    test('should handle negative numbers', () => {
      expect(calculator.divide(-10, 2)).toBe(-5);
      expect(calculator.divide(-10, -2)).toBe(5);
    });
  });

  describe('Factorial', () => {
    test('should calculate factorial of positive numbers', () => {
      expect(calculator.factorial(0)).toBe(1);
      expect(calculator.factorial(1)).toBe(1);
      expect(calculator.factorial(5)).toBe(120);
    });

    test('should throw error for negative numbers', () => {
      expect(() => calculator.factorial(-1)).toThrow('El argumento debe ser un número entero no negativo');
    });

    test('should throw error for non-integers', () => {
      expect(() => calculator.factorial(3.5)).toThrow('El argumento debe ser un número entero no negativo');
    });
  });

  describe('Prime Number Check', () => {
    test('should identify prime numbers', () => {
      expect(calculator.isPrime(2)).toBe(true);
      expect(calculator.isPrime(3)).toBe(true);
      expect(calculator.isPrime(5)).toBe(true);
      expect(calculator.isPrime(17)).toBe(true);
    });

    test('should identify non-prime numbers', () => {
      expect(calculator.isPrime(1)).toBe(false);
      expect(calculator.isPrime(4)).toBe(false);
      expect(calculator.isPrime(9)).toBe(false);
      expect(calculator.isPrime(15)).toBe(false);
    });

    test('should handle edge cases', () => {
      expect(calculator.isPrime(0)).toBe(false);
      expect(calculator.isPrime(-5)).toBe(false);
      expect(calculator.isPrime(3.5)).toBe(false);
    });
  });
});