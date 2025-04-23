import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, ShoppingCart } from "lucide-react";
interface ProductCardProps {
  product: {
    id: string;
    name: string;
    price: number;
    original_price: number | null;
    description: string;
    image_url: string | null;
    rating?: number;
    review_count?: number;
    is_new: boolean;
    on_sale: boolean;
  };
}
const ProductCard = ({
  product
}: ProductCardProps) => {
  const {
    id,
    name,
    price,
    original_price,
    description,
    image_url,
    rating = 4.5,
    review_count = 0,
    is_new,
    on_sale
  } = product;

  // Format price to INR
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0
    }).format(price);
  };
  return <div className="group relative overflow-hidden rounded-lg border bg-white transition-all duration-300 hover:shadow-lg">
      {/* Badges */}
      <div className="absolute left-2 top-2 z-10 flex flex-col gap-1">
        {is_new && <Badge className="bg-pythronix-blue text-white hover:bg-pythronix-blue">
            New
          </Badge>}
        {on_sale && <Badge className="bg-red-500 text-white hover:bg-red-500">
            Sale
          </Badge>}
      </div>

      {/* Image */}
      <Link to={`/product/${id}`}>
        <div className="aspect-square overflow-hidden bg-gray-100 p-4">
          <img src={image_url || "/placeholder.svg"} alt={name} className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-105" />
        </div>
      </Link>

      {/* Content */}
      <div className="p-4">
        <Link to={`/product/${id}`}>
          <h3 className="mb-1 text-lg font-medium text-gray-900 group-hover:text-pythronix-blue">
            {name}
          </h3>
        </Link>
        <p className="mb-3 text-sm text-gray-600 line-clamp-2">{description}</p>

        {/* Rating */}
        <div className="mb-3 flex items-center">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => <Star key={i} className={`h-4 w-4 ${i < Math.floor(rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`} />)}
          </div>
          <span className="ml-2 text-xs text-gray-600">({review_count})</span>
        </div>

        {/* Price */}
        <div className="flex items-end justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-semibold text-gray-900">
                {formatPrice(price)}
              </span>
              {original_price && <span className="text-sm text-gray-500 line-through">
                  {formatPrice(original_price)}
                </span>}
            </div>
            {original_price && <span className="text-xs font-medium text-green-600">
                Save {Math.round((original_price - price) / original_price * 100)}%
              </span>}
          </div>
          <Button size="icon" aria-label="Add to cart" className="h-8 w-8 rounded-full bg-pythronix-blue hover:bg-pythronix-dark-blue">
            <ShoppingCart className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>;
};
export default ProductCard;