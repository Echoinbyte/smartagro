import type { Product } from "@/types/Product";
import ProductListing from "./ProductListing";

const Products = ({ products }: { products?: Product[] }) => {
  return (
    <div className="relative">
      <div className="mt-6 flex items-center w-full">
        <div className="w-full grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 md:grid-cols-2 xl:grid-cols-3 md:gap-y-10 lg:gap-x-8">
          {products?.map((product, i) => (
            <ProductListing key={`product-${i}`} product={product} index={i} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Products;
