"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Check, Smartphone, MessageCircle, Phone, Wifi } from "lucide-react"
import type { PhonePlan } from "@/types"

interface PlanCardProps {
  plan: PhonePlan
  onSelectPlan: (plan: PhonePlan) => void
}

export function PlanCard({ plan, onSelectPlan }: PlanCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <Card
      className={`relative overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl cursor-pointer group ${
        plan.popular ? "ring-2 ring-blue-500 shadow-lg" : ""
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onSelectPlan(plan)}
    >
      {plan.popular && (
        <div className="absolute top-0 right-0 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-3 py-1 text-xs font-bold rounded-bl-lg">
          POPULAR
        </div>
      )}

      <div
        className={`absolute inset-0 bg-gradient-to-br opacity-5 transition-opacity duration-300 ${
          isHovered ? "opacity-10" : "opacity-5"
        }`}
        style={{ background: `linear-gradient(135deg, ${plan.color}20, ${plan.color}10)` }}
      />

      <CardContent className="relative p-6 space-y-4">
        {/* Country Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="text-2xl">{plan.flag}</div>
            <div>
              <h3 className="font-bold text-lg text-gray-900">{plan.country}</h3>
              <p className="text-sm text-gray-500">{plan.name}</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold" style={{ color: plan.color }}>
              ${plan.price}
            </div>
            <div className="text-xs text-gray-500">per month</div>
          </div>
        </div>

        {/* Plan Details */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center space-x-2">
            <Wifi className="h-4 w-4" style={{ color: plan.color }} />
            <div>
              <div className="font-semibold text-sm">{plan.data}</div>
              <div className="text-xs text-gray-500">Data</div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Phone className="h-4 w-4" style={{ color: plan.color }} />
            <div>
              <div className="font-semibold text-sm">{plan.minutes}</div>
              <div className="text-xs text-gray-500">Minutes</div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <MessageCircle className="h-4 w-4" style={{ color: plan.color }} />
            <div>
              <div className="font-semibold text-sm">{plan.sms}</div>
              <div className="text-xs text-gray-500">SMS</div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Smartphone className="h-4 w-4" style={{ color: plan.color }} />
            <div>
              <div className="font-semibold text-sm">4G/5G</div>
              <div className="text-xs text-gray-500">Network</div>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="space-y-2">
          <h4 className="font-semibold text-sm text-gray-700">Features:</h4>
          <div className="space-y-1">
            {plan.features.slice(0, 3).map((feature, index) => (
              <div key={index} className="flex items-center space-x-2">
                <Check className="h-3 w-3 text-green-500" />
                <span className="text-xs text-gray-600">{feature}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Action Button */}
        <Button
          className={`w-full transition-all duration-300 ${isHovered ? "shadow-lg transform translate-y-[-1px]" : ""}`}
          style={{
            backgroundColor: plan.color,
            borderColor: plan.color,
          }}
        >
          Select Plan
        </Button>
      </CardContent>
    </Card>
  )
} 