import { PaymentRequest, PaymentResult } from '../types/payment';

/**
 * Mock payment service to process payments
 * In production, this would call a payment gateway API (Stripe, PayPal, etc.)
 */
export class PaymentService {
  /**
   * Processes a payment
   * @param paymentRequest - Payment details including credit card, amount, and description
   * @returns Promise with payment result
   */
  async processPayment(paymentRequest: PaymentRequest): Promise<PaymentResult> {
    // Mock implementation - simulates payment processing
    // In production, this would make an HTTP request to a payment gateway API

    // Simulate API delay (payment processing takes time)
    await new Promise((resolve) => setTimeout(resolve, 200));

    // Validate credit card number (basic Luhn algorithm check)
    if (!this.isValidCreditCard(paymentRequest.creditCardNumber)) {
      return {
        success: false,
        error: 'Invalid credit card number',
      };
    }

    // Validate amount
    if (paymentRequest.amount <= 0) {
      return {
        success: false,
        error: 'Amount must be greater than 0',
      };
    }

    // Mock: Simulate occasional payment failures (5% failure rate)
    const shouldFail = Math.random() < 0.05;
    if (shouldFail) {
      return {
        success: false,
        error: 'Payment processing failed. Please try again.',
      };
    }

    // Generate mock transaction ID
    const transactionId = `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    return {
      success: true,
      transactionId,
    };
  }

  /**
   * Validates credit card number using Luhn algorithm
   * @param cardNumber - Credit card number to validate
   * @returns true if valid, false otherwise
   */
  private isValidCreditCard(cardNumber: string): boolean {
    // Remove spaces and dashes
    const cleaned = cardNumber.replace(/[\s-]/g, '');

    // Check if it's all digits
    if (!/^\d+$/.test(cleaned)) {
      return false;
    }

    // Check length (most cards are 13-19 digits)
    if (cleaned.length < 13 || cleaned.length > 19) {
      return false;
    }

    // Luhn algorithm
    let sum = 0;
    let isEven = false;

    // Process digits from right to left
    for (let i = cleaned.length - 1; i >= 0; i--) {
      let digit = parseInt(cleaned[i], 10);

      if (isEven) {
        digit *= 2;
        if (digit > 9) {
          digit -= 9;
        }
      }

      sum += digit;
      isEven = !isEven;
    }

    return sum % 10 === 0;
  }
}
