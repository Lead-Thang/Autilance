
import { Stripe } from 'stripe'

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is required')
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2025-09-30.clover',
  typescript: true,
})

export async function createEscrowPayment(
  amountCents: number,
  currency: string,
  options?: {
    destinationAccountId?: string
    applicationFeeAmount?: number
  }
) {
  try {
    // Create PaymentIntent with manual capture (escrow)
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountCents,
      currency: currency.toLowerCase(),
      capture_method: 'manual', // This holds funds in escrow
      automatic_payment_methods: {
        enabled: true,
      },
      ...(options?.destinationAccountId
        ? {
            transfer_data: { destination: options.destinationAccountId },
            application_fee_amount: options.applicationFeeAmount,
          }
        : {}),
    })
    // ...

    return {
      paymentIntentId: paymentIntent.id,
      clientSecret: paymentIntent.client_secret,
      status: paymentIntent.status,
    }
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Stripe escrow creation failed: ${error.message}`)
    }
    throw new Error('Stripe escrow creation failed: Unknown error')
  }
}

export async function releaseEscrowFunds(
  paymentIntentId: string,
  amountToCapture?: number
) {
  try {
    // Capture (release) the funds from escrow
    const paymentIntent = await stripe.paymentIntents.capture(
      paymentIntentId,
      amountToCapture ? { amount_to_capture: amountToCapture } : undefined
    )

    return {
      status: paymentIntent.status,
      amountCaptured: paymentIntent.amount_received,
    }
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Stripe escrow release failed: ${error.message}`)
    }
    throw new Error('Stripe escrow release failed: Unknown error')
  }
}

export async function refundEscrow(
  paymentIntentId: string,
  amountCents?: number
) {
  try {
    // Refund the payment intent (return funds to customer)
    const refund = await stripe.refunds.create({
      payment_intent: paymentIntentId,
      amount: amountCents,
    })

    return {
      refundId: refund.id,
      status: refund.status,
      amount: refund.amount,
    }
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Stripe escrow refund failed: ${error.message}`)
    }
    throw new Error('Stripe escrow refund failed: Unknown error')
  }
}

export async function getPaymentIntentStatus(paymentIntentId: string) {
  try {
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId)
    return {
      status: paymentIntent.status,
      amount: paymentIntent.amount,
      amountCaptured: paymentIntent.amount_received,
      amountRefunded: paymentIntent.amount - paymentIntent.amount_received, // Calculate refunded amount
    }
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to get payment status: ${error.message}`)
    }
    throw new Error('Failed to get payment status: Unknown error')
  }
}