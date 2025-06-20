import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ShoppingCart, Heart } from "lucide-react"
import { Product } from "@/types"

interface ProductCardProps {
  product: Product
  onAddToCart: (product: Product) => void
  isInCart: boolean
  onImageClick?: (product: Product) => void
}

export function ProductCard({ product, onAddToCart, isInCart, onImageClick }: ProductCardProps) {
  return (
    <div className="group bg-secondary/10 rounded-lg overflow-hidden border border-secondary/20 hover:border-secondary transition-all duration-200 flex flex-col h-full">
      {/* Image */}
      <div className="aspect-square overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onClick={onImageClick ? () => onImageClick(product) : undefined}
          style={{ cursor: onImageClick ? 'pointer' : undefined }}
        />
      </div>
      
      {/* Content */}
      <div className="p-3 sm:p-4 flex flex-col flex-1">
        <h3 className="font-medium text-primary-foreground mb-1 sm:mb-2 line-clamp-1 text-base sm:text-lg">
          {product.name}
        </h3>
        <p className="text-secondary/70 text-sm mb-2 sm:mb-3 line-clamp-2">
          {product.description}
        </p>
        
        {/* Price and Action */}
        <div className="flex items-center justify-between mt-auto">
          <span className="text-lg sm:text-xl font-bold text-secondary">
            ${product.price.toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  )
} 