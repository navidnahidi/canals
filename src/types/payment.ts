export interface PaymentRequest {
  creditCardNumber: string;
  amount: number;
  description: string;
}

export interface PaymentResult {
  success: boolean;
  transactionId?: string;
  error?: string;
}
