"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Lock, Smartphone, Check, Wallet, Mail, MapPin, Loader2, Shield } from "lucide-react"
import type { PhonePlan } from "@/types"
import { Checkbox } from "@/components/ui/checkbox"
import { useConnect } from "wagmi"
import { ProviderInterface } from "@coinbase/wallet-sdk"
import { encodeFunctionData, erc20Abi, numberToHex, parseUnits } from "viem"

interface PaymentModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: (result: any) => void
  selectedPlan: PhonePlan | null
}

export function PaymentModal({ isOpen, onClose, onSuccess, selectedPlan }: PaymentModalProps) {
  const [provider, setProvider] = useState<ProviderInterface | undefined>(undefined)
  const [dataToRequest, setDataToRequest] = useState({
    email: true,
    address: true,
  })
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<any | null>(null)
  const { connectors } = useConnect()

  // Initialize provider from Coinbase Wallet connector
  useEffect(() => {
    async function getProvider() {
      const coinbaseConnector = connectors.find(c => c.name === 'Coinbase Wallet')
      if (coinbaseConnector) {
        const provider = await coinbaseConnector.getProvider()
        setProvider(provider as ProviderInterface)
      }
    }
    getProvider()
  }, [connectors])

  function getCallbackURL() {
    // Use your deployed backend URL or local API route
    return "/api/data-validation"
  }

  async function handlePayment() {
    try {
      setIsLoading(true)
      setResult(null)
      // Build requests array based on checkboxes
      const requests = []
      if (dataToRequest.email) requests.push({ type: "email", optional: false })
      if (dataToRequest.address) requests.push({ type: "phoneNumber", optional: false })
      if (requests.length === 0) {
        setResult({ success: false, error: "Select at least one data type" })
        setIsLoading(false)
        return
      }
      // Send USDC transfer and request data
      const response: any = await provider?.request({
        method: "wallet_sendCalls",
        params: [{
          version: "1.0",
          chainId: numberToHex(84532), // Base Sepolia
          calls: [
            {
              to: "0x036CbD53842c5426634e7929541eC2318f3dCF7e", // USDC contract address on Base Sepolia
              data: encodeFunctionData({
                abi: erc20Abi,
                functionName: "transfer",
                args: [
                  "0xd8da6bf26964af9d7eed9e03e53415d37aa96045", // Recipient address
                  parseUnits("0.01", 6), // 0.01 USDC
                ],
              }),
            },
          ],
          capabilities: {
            dataCallback: {
              requests: requests,
              callbackURL: getCallbackURL(),
            },
          },
        }],
      })
      // Handle response
      if (response && (response.callsId || (typeof response === 'string' && response.startsWith('0x')))) {
        // Simulate fetching user data from callback (in real app, backend would process and return)
        const paymentResult = { success: true, ...response?.requestedInfo }
        setResult(paymentResult)
        onSuccess(paymentResult)
      } else {
        setResult({ success: false, error: "Payment or data sharing failed" })
      }
    } catch (error: any) {
      setResult({ success: false, error: error.message || "Transaction failed" })
    } finally {
      setIsLoading(false)
    }
  }

  if (!selectedPlan) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md bg-white">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-gray-900">
            <Smartphone className="h-5 w-5" style={{ color: selectedPlan.color }} />
            Activate Your Plan
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          {/* Plan Summary */}
          <div className="bg-gray-50 rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="text-xl">{selectedPlan.flag}</div>
                <div>
                  <h3 className="font-semibold text-gray-900">{selectedPlan.country}</h3>
                  <p className="text-sm text-gray-600">{selectedPlan.name}</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xl font-bold" style={{ color: selectedPlan.color }}>
                  ${selectedPlan.price}
                </div>
                <div className="text-xs text-gray-500">per month</div>
              </div>
            </div>
            <Separator />
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="font-semibold text-sm">{selectedPlan.data}</div>
                <div className="text-xs text-gray-500">Data</div>
              </div>
              <div>
                <div className="font-semibold text-sm">{selectedPlan.minutes}</div>
                <div className="text-xs text-gray-500">Minutes</div>
              </div>
              <div>
                <div className="font-semibold text-sm">{selectedPlan.sms}</div>
                <div className="text-xs text-gray-500">SMS</div>
              </div>
            </div>
            <div className="space-y-1">
              {selectedPlan.features.map((feature, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <Check className="h-3 w-3 text-green-500" />
                  <span className="text-xs text-gray-600">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Share Profile Data & Payment */}
          <div className="space-y-4">
            {/* Profile Data Selection */}
            <div className="space-y-3">
              <h3 className="text-sm font-medium">Share Profile Data:</h3>
              <div className="flex items-center space-x-3">
                <Checkbox
                  id="email"
                  checked={dataToRequest.email}
                  onCheckedChange={(checked) => setDataToRequest(prev => ({ ...prev, email: !!checked }))}
                />
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4 text-gray-400" />
                  <label htmlFor="email" className="text-xs text-gray-600 font-semibold cursor-pointer">Email Address</label>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Checkbox
                  id="address"
                  checked={dataToRequest.address}
                  onCheckedChange={(checked) => setDataToRequest(prev => ({ ...prev, address: !!checked }))}
                />
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4 text-gray-400" />
                  <label htmlFor="address" className="text-xs text-gray-600 font-semibold cursor-pointer">Phone Number</label>
                </div>
              </div>
            </div>
            {/* Payment Button */}
            <Button
              onClick={handlePayment}
              disabled={isLoading}
              className="w-full"
              style={{ backgroundColor: selectedPlan.color, color: '#fff' }}
              size="lg"
            >
              {isLoading ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Processing...</>
              ) : (
                <><Wallet className="mr-2 h-4 w-4" />Pay ${selectedPlan.price} & Share Profile</>
              )}
            </Button>
            {/* Results Display */}
            {result && (
              <div className={`p-3 rounded-lg ${
                result.success
                  ? 'bg-green-100 border border-green-300'
                  : 'bg-red-100 border border-red-300'
              }`}>
                {result.success ? (
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium text-green-700">Payment Successful! 🎉</h3>
                    {result.name && <p className="text-xs"><strong>Name:</strong> {result.name}</p>}
                    {result.email && <p className="text-xs"><strong>Email:</strong> {result.email}</p>}
                    {result.phoneNumber && <p className="text-xs"><strong>Phone Number:</strong> {result.phoneNumber}</p>}
                  </div>
                ) : (
                  <div>
                    <h3 className="text-sm font-medium text-red-700">Error</h3>
                    <p className="text-xs text-red-600">{result.error}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
} 