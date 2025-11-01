import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import ImageSlider from "./ImageSlider";
import { Skeleton } from "../ui/skeleton";
import type { UIProduct } from "@/types/Product";
import { formatDistanceToNow } from "date-fns";

interface productListingProps {
  product: UIProduct | null;
  index: number;
}

const formatSmartValue = (value: string | number): string => {
  if (value == null) return "N/A";

  const str = String(value).trim();

  if (/[a-zA-Z₹$€£/]/.test(str)) {
    return str.replace(/\s+/g, " ");
  }

  const num = parseFloat(str);
  if (isNaN(num)) return str;

  const formatted = num.toFixed(2).replace(/\.?0+$/, "");
  return formatted;
};

const ProductListing = ({ product, index }: productListingProps) => {
  const [isVisible, setIsVisible] = useState<boolean>(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, index * 75);

    return () => clearTimeout(timer);
  }, [index]);

  if (!product || !isVisible) return <ProductPlaceholder />;

  if (isVisible && product) {
    return (
      <a
        className={cn("invisible h-full w-full cursor-pointer group/main", {
          "visible animate-in fade-in-5": isVisible,
        })}
        href={`/product/${product.productId}`}
      >
        <div className="flex flex-col w-full">
          <ImageSlider url={product.productImage} />

          <div className="flex flex-col w-full px-2 pb-4 rounded-b-xl bg-primary/5">
            <h3 className="mt-4 font-semibold text-xl text-gray-700 line-clamp-2 flex flex-row items-center justify-between">
              {product.productName}
            </h3>
            <p className="mt-1 text-xs text-gray-500 line-clamp-2">
              {product.description}
            </p>
            <p className="mt-1 text-sm text-gray-900 flex flex-col md:flex-row items-start md:items-center justify-between">
              <span className="font-medium">
                {formatSmartValue(product.price).includes("रू")
                  ? formatSmartValue(product.price)
                  : "रू. " + formatSmartValue(product.price)}
              </span>
              <div className="font-medium">
                उपलब्ध : {formatSmartValue(product.quantity)}
              </div>
              <span className="text-[10px] font-light mt-1">
                {formatDistanceToNow(product.createdAt ?? new Date(), {
                  addSuffix: true,
                })}
              </span>
            </p>
          </div>
        </div>
      </a>
    );
  }
};

const ProductPlaceholder = () => {
  return (
    <div className="flex flex-col w-full">
      <div className="relative bg-zinc-100 aspect-video w-full overflow-hidden rounded-xl">
        <Skeleton className="h-full w-full" />
      </div>
      <Skeleton className="mt-4 w-2/3 h-4 rounded-lg" />
      <Skeleton className="mt-2 w-16 h-4 rounded-lg" />
      <Skeleton className="mt-2 w-12 h-4 rounded-lg" />
    </div>
  );
};

export default ProductListing;
