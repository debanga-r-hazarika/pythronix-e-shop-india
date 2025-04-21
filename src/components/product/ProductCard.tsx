
import { Link } from "react-router-dom";
import { Product } from "@/lib/data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, ShoppingCart } from "lucide-react";

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const {
    id,
    name,
    price,
    originalPrice,
    shortDescription,
    image,
    rating,
    reviewCount,
    isNew,
    onSale,
  } = product;

  // Format price to INR
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="group relative overflow-hidden rounded-lg border bg-white transition-all duration-300 hover:shadow-lg">
      {/* Badges */}
      <div className="absolute left-2 top-2 z-10 flex flex-col gap-1">
        {isNew && (
          <Badge className="bg-pythronix-blue text-white hover:bg-pythronix-blue">
            New
          </Badge>
        )}
        {onSale && (
          <Badge className="bg-red-500 text-white hover:bg-red-500">
            Sale
          </Badge>
        )}
      </div>

      {/* Image */}
      <Link to={`/product/${id}`}>
        <div className="aspect-square overflow-hidden bg-gray-100 p-4">
          <img
            src={image}
            alt={name}
            className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-105"
          />
        </div>
      </Link>

      {/* Content */}
      <div className="p-4">
        <Link to={`/product/${id}`}>
          <h3 className="mb-1 text-lg font-medium text-gray-900 group-hover:text-pythronix-blue">
            {name}
          </h3>
        </Link>
        <p className="mb-3 text-sm text-gray-600 line-clamp-2">{shortDescription}</p>

        {/* Rating */}
        <div className="mb-3 flex items-center">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-4 w-4 ${
                  i < Math.floor(rating)
                    ? "text-yellow-400 fill-yellow-400"
                    : "text-gray-300"
                }`}
              />
            ))}
          </div>
          <span className="ml-2 text-xs text-gray-600">({reviewCount})</span>
        </div>

        {/* Price */}
        <div className="flex items-end justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-semibold text-gray-900">
                {formatPrice(price)}
              </span>
              {originalPrice && (
                <span className="text-sm text-gray-500 line-through">
                  {formatPrice(originalPrice)}
                </span>
              )}
            </div>
            {originalPrice && (
              <span className="text-xs font-medium text-green-600">
                Save {Math.round(((originalPrice - price) / originalPrice) * 100)}%
              </span>
            )}
          </div>
          <Button
            size="icon"
            className="h-8 w-8 rounded-full bg-pythronix-blue hover:bg-pythronix-dark-blue"
            aria-label="Add to cart"
          >
            <ShoppingCart className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
