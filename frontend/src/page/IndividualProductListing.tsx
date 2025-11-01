import { API_BASE_URL } from "@/config/apiDetails";
import { products } from "@/config/mockProducts";
import { useUser } from "@/context/UserContext";
import type { IndividualProduct } from "@/types/Product";
import axios from "axios";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import Bounded from "./landing/Bounded";
import { Separator } from "@/components/ui/separator";
import { formatSmartValue } from "@/lib/formatSmartValue";
import StarGrid from "./landing/StarGrid";
import Button from "@/components/shared/Button";
import { FaLocationDot } from "react-icons/fa6";

function IndividualProductListing() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useUser();
  const [productItem, setProductItem] = useState<IndividualProduct>();
  const [isLoading, setIsLoading] = useState(false);
  const [UiState, setUiState] = useState<"detail" | "checkout">("detail");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/products/getproduct/${location.pathname.replace(
            "/product/",
            ""
          )}`
        );
        console.log("Response", response);
        if (response.status === 200) {
          setProductItem(response.data.data ?? products[0]);
          console.log("Fetched products:", response.data.data);
        } else {
          toast.error("Failed to fetch products.");
        }
      } catch (error: unknown) {
        console.error("Error fetching products:", error);
        toast.error("An error occurred while fetching products.");
      }
    };

    fetchProducts();
  }, [location.pathname]);

  if (!user || !user.username) {
    navigate("/login");
    toast.error("Please log in to access the home page.");
    return null;
  }

  const handleBuyNow = () => {
    setIsLoading(true);

    try {
      setUiState("checkout");
    } catch (error) {
      console.error("Error during Buy Now:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (UiState === "checkout") {
    return <></>;
  }

  return (
    <>
      <Bounded>
        <StarGrid></StarGrid>
        <main className="h-full w-full flex flex-col items-center justify-center gap-4">
          <div className="relative w-full aspect-video md:h-[350px] lg:h-[400px]">
            <img
              src={productItem?.productImage}
              className="w-full h-full object-cover rounded-xl"
              loading="lazy"
            />
          </div>
          <div className="w-full flex flex-col items-start justify-center gap-2">
            <div className="w-full flex flex-row items-center justify-between">
              <h2 className="text-2xl font-semibold">
                {productItem?.productName}
              </h2>
              <span className="">4.5/5</span>
            </div>
            <p className="text-gray-700">{productItem?.description}</p>
            <p className="text-gray-700 flex flex-row items-center justify-center gap-2">
              Farmer is at
              <FaLocationDot className="text-primary" />
              {productItem?.seller.address}
            </p>
            <Separator />
            <h2 className="font-semibold">
              मूल्य :{" "}
              {formatSmartValue(productItem?.price || "").includes("रू")
                ? formatSmartValue(productItem?.price || "")
                : "रू. " + formatSmartValue(productItem?.price || "")}
            </h2>
            <span className="font-semibold">
              उपलब्ध : {formatSmartValue(productItem?.quantity || "")}
            </span>
            <Separator />
            <Button
              isLoading={isLoading}
              onClick={handleBuyNow}
              containerClass="my-4"
              title="Buy Now"
            ></Button>
          </div>
        </main>
      </Bounded>
    </>
  );
}

export default IndividualProductListing;
