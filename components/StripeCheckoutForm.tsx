'use client'

import { useState } from 'react'
import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2 } from 'lucide-react'

interface CheckoutFormProps {
  clientSecret: string
  amount: number
  currency: string
  onSuccess: () => void
  onCancel: () => void
}

export default function CheckoutForm({
  clientSecret,
  amount,
  currency,
  onSuccess,
  onCancel
}: CheckoutFormProps) {
  const stripe = useStripe()
  const elements = useElements()

  const [isProcessing, setIsProcessing] = useState(false)
  const [message, setMessage] = useState<string>('')

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    if (!stripe || !elements) {
      return
    }

    setIsProcessing(true)

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/dashboard/payments/escrow`,
      },
      redirect: 'if_required',
    })

    if (error) {
      setMessage(error.message || 'An error occurred.')
      setIsProcessing(false)
    } else if (paymentIntent && paymentIntent.status === 'succeeded') {
      setMessage('Payment succeeded!')
      onSuccess()
    } else {
      setMessage('Unexpected state')
      setIsProcessing(false)
    }
  }

  const options = {
    clientSecret,
    appearance: {
      theme: 'stripe' as const,
    },
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Complete Payment</CardTitle>
        <p className="text-sm text-gray-600">
          Amount: ${(amount / 100).toFixed(2)} {currency.toUpperCase()}
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <Elements stripe={stripePromise} options={options}>
            <PaymentElement />
          </Elements>

          <div className="space-y-2 mt-6">
            <Button
              disabled={!stripe || isProcessing}
              className="w-full"
              type="submit"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                `Pay $${(amount / 100).toFixed(2)}`
              )}
            </Button>

            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={onCancel}
              disabled={isProcessing}
            >
              Cancel
            </Button>
          </div>

          {message && (
            <p className={`text-sm mt-4 ${
              message.includes('succeeded')
                ? 'text-green-600'
                : 'text-red-600'
            }`}>
              {message}
            </p>
          )}
        </form>
      </CardContent>
    </Card>
  )
}