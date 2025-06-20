"use client"

import { useState } from "react"
import { PlanCard } from "@/components/plan-card"
import { Globe, Smartphone, Zap, Shield } from "lucide-react"
import type { PhonePlan } from "@/types"
import { PaymentModal } from "@/components/payment-card"

// Phone plans data for different countries
const phonePlans: PhonePlan[] = [
  {
    id: "1",
    name: "USA Premium",
    price: 45,
    country: "United States",
    countryCode: "US",
    flag: "🇺🇸",
    data: "Unlimited",
    minutes: "Unlimited",
    sms: "Unlimited",
    features: [
      "5G Network Access",
      "International Roaming",
      "Mobile Hotspot 50GB",
      "Netflix & Spotify Included",
      "24/7 Customer Support",
    ],
    popular: true,
    color: "#3B82F6",
  },
  {
    id: "2",
    name: "UK Essential",
    price: 35,
    country: "United Kingdom",
    countryCode: "UK",
    flag: "🇬🇧",
    data: "100GB",
    minutes: "Unlimited",
    sms: "Unlimited",
    features: [
      "4G/5G Network",
      "EU Roaming Included",
      "Mobile Hotspot 20GB",
      "Apple Music 6 months",
      "Online Account Management",
    ],
    color: "#10B981",
  },
  {
    id: "3",
    name: "Canada Unlimited",
    price: 40,
    country: "Canada",
    countryCode: "CA",
    flag: "🇨🇦",
    data: "Unlimited",
    minutes: "Unlimited",
    sms: "Unlimited",
    features: [
      "5G Network Coverage",
      "US Roaming Included",
      "Mobile Hotspot 40GB",
      "Disney+ Included",
      "Family Plan Discounts",
    ],
    color: "#8B5CF6",
  },
  {
    id: "4",
    name: "Australia Connect",
    price: 38,
    country: "Australia",
    countryCode: "AU",
    flag: "🇦🇺",
    data: "80GB",
    minutes: "Unlimited",
    sms: "Unlimited",
    features: ["4G/5G Network", "International Minutes 500", "Mobile Hotspot 25GB", "Stan Streaming", "Data Banking"],
    color: "#F59E0B",
  },
  {
    id: "5",
    name: "Germany Pro",
    price: 32,
    country: "Germany",
    countryCode: "DE",
    flag: "🇩🇪",
    data: "60GB",
    minutes: "Unlimited",
    sms: "Unlimited",
    features: ["5G Network Access", "EU Roaming Free", "Mobile Hotspot 15GB", "Amazon Prime Video", "eSIM Support"],
    color: "#EF4444",
  },
  {
    id: "6",
    name: "Japan Ultra",
    price: 42,
    country: "Japan",
    countryCode: "JP",
    flag: "🇯🇵",
    data: "Unlimited",
    minutes: "Unlimited",
    sms: "Unlimited",
    features: [
      "5G Network Premium",
      "Asia Roaming Package",
      "Mobile Hotspot 60GB",
      "YouTube Premium",
      "AI Translation Service",
    ],
    color: "#06B6D4",
  },
  {
    id: "7",
    name: "France Mobile",
    price: 29,
    country: "France",
    countryCode: "FR",
    flag: "🇫🇷",
    data: "50GB",
    minutes: "Unlimited",
    sms: "Unlimited",
    features: ["4G/5G Network", "EU Roaming 25GB", "Mobile Hotspot 10GB", "Deezer Premium", "Multi-SIM Options"],
    color: "#84CC16",
  },
  {
    id: "8",
    name: "Singapore Smart",
    price: 36,
    country: "Singapore",
    countryCode: "SG",
    flag: "🇸🇬",
    data: "100GB",
    minutes: "Unlimited",
    sms: "Unlimited",
    features: ["5G Network Access", "ASEAN Roaming", "Mobile Hotspot 30GB", "HBO GO Included", "Smart Home Bundle"],
    color: "#F97316",
  },
]

export default function Home() {
  const [selectedPlan, setSelectedPlan] = useState<PhonePlan | null>(null)
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [paymentResult, setPaymentResult] = useState<any | null>(null)

  const regions = ["All", "North America", "Europe", "Asia Pacific"]

  const getRegion = (countryCode: string) => {
    const regionMap: { [key: string]: string } = {
      US: "North America",
      CA: "North America",
      UK: "Europe",
      DE: "Europe",
      FR: "Europe",
      JP: "Asia Pacific",
      AU: "Asia Pacific",
      SG: "Asia Pacific",
    }
    return regionMap[countryCode] || "Other"
  }

  const filteredPlans = phonePlans.filter((plan) => {
    if (selectedCategory === "All") return true
    return getRegion(plan.countryCode) === selectedCategory
  })

  const handleSelectPlan = (plan: PhonePlan) => {
    setSelectedPlan(plan)
    setShowPaymentModal(true)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Hero Header */}
      <header className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 text-white">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative max-w-7xl mx-auto px-6 py-16">
          <div className="text-center space-y-6">
            <div className="flex justify-center items-center space-x-3 mb-4">
              <Globe className="h-8 w-8 animate-pulse" />
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                Global Mobile Plans
              </h1>
            </div>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              Connect anywhere in the world with our premium mobile plans. Choose from the best carriers across
              different countries.
            </p>

            {/* Feature highlights */}
            <div className="flex flex-wrap justify-center gap-6 mt-8">
              <div className="flex items-center space-x-2 bg-white/10 rounded-full px-4 py-2">
                <Zap className="h-4 w-4" />
                <span className="text-sm">5G Network</span>
              </div>
              <div className="flex items-center space-x-2 bg-white/10 rounded-full px-4 py-2">
                <Shield className="h-4 w-4" />
                <span className="text-sm">Secure Connection</span>
              </div>
              <div className="flex items-center space-x-2 bg-white/10 rounded-full px-4 py-2">
                <Smartphone className="h-4 w-4" />
                <span className="text-sm">eSIM Ready</span>
              </div>
            </div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
          <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/5 rounded-full"></div>
          <div className="absolute top-20 -left-8 w-32 h-32 bg-white/5 rounded-full"></div>
          <div className="absolute bottom-10 right-20 w-16 h-16 bg-white/5 rounded-full"></div>
        </div>
      </header>

      {/* Filter Section */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          {regions.map((region) => (
            <button
              key={region}
              onClick={() => setSelectedCategory(region)}
              className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                selectedCategory === region
                  ? "bg-blue-600 text-white shadow-lg transform scale-105"
                  : "bg-white text-gray-700 hover:bg-blue-50 hover:text-blue-600 shadow-md"
              }`}
            >
              {region}
            </button>
          ))}
        </div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredPlans.map((plan) => (
            <PlanCard key={plan.id} plan={plan} onSelectPlan={handleSelectPlan} />
          ))}
        </div>

        {filteredPlans.length === 0 && (
          <div className="text-center py-16">
            <Globe className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <p className="text-xl text-gray-500">No plans found for this region.</p>
          </div>
        )}
      </div>

      {/* Payment Modal */}
      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        onSuccess={(result) => {
          setShowPaymentModal(false)
          setPaymentResult(result)
        }}
        selectedPlan={selectedPlan}
      />

      {/* Payment Result Confirmation */}
      {paymentResult && paymentResult.success && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full text-center space-y-4">
            <h2 className="text-2xl font-bold text-green-600">Payment Successful! 🎉</h2>
            {paymentResult.name && <p className="text-gray-700 text-sm"><strong>Name:</strong> {paymentResult.name}</p>}
            {paymentResult.email && <p className="text-gray-700 text-sm"><strong>Email:</strong> {paymentResult.email}</p>}
            {paymentResult.physicalAddress && <p className="text-gray-700 text-sm"><strong>Physical Address:</strong> {typeof paymentResult.physicalAddress === 'string' ? paymentResult.physicalAddress : JSON.stringify(paymentResult.physicalAddress)}</p>}
            <button
              className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-full font-semibold hover:bg-blue-700 transition"
              onClick={() => setPaymentResult(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
