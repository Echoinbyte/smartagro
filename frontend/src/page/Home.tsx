import { useUser } from "@/context/UserContext";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import StarGrid from "./landing/StarGrid";
import Products from "@/components/products/Products";
import Bounded from "./landing/Bounded";
import { useEffect, useState } from "react";
import type { UIProduct } from "@/types/Product";
import axios from "axios";
import { API_BASE_URL } from "@/config/apiDetails";
import { products } from "@/config/mockProducts";
import HomeBanner from "@/components/HomeBanner";

function Home() {
  const navigate = useNavigate();
  const { user } = useUser();
  const [productLists, setProductLists] = useState<UIProduct[]>([]);
  const [nearbyProducts, setNearbyProducts] = useState<UIProduct[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/products/get`);
        if (response.status === 200) {
          setProductLists((response.data.data as UIProduct[]) ?? products);
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
  }, []);

  useEffect(() => {
    const getLocalProducts = async () => {
      const response = await axios.get(
        `${API_BASE_URL}/products/getnearestproducts/${user.id}`
      );
      setNearbyProducts(response.data.data);
      console.log("Nearest products:", response.data.data);
    };
    getLocalProducts();
  }, [user.id]);

  if (!user || !user.username) {
    navigate("/login");
    toast.error("Please log in to access the home page.");
    return null;
  }

  return (
    <main>
      <StarGrid />
      <Bounded className="pt-0! mb-16">
        <HomeBanner />
        {nearbyProducts.length > 0 && (
          <div className="w-full flex flex-col items-start justify-start">
            <h3 className="text-lg font-semibold">Nearby Products</h3>
            <Products mode="horizontal" products={nearbyProducts}></Products>
          </div>
        )}
        <Products mode="vertical" products={productLists}></Products>
      </Bounded>
    </main>
  );
}

export default Home;
