import BottomNavbar from "@/components/BottomNavbar";
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
import {
  ShoppingCart,
  BookOpen,
  LayoutDashboard,
  ShoppingBasket,
} from "lucide-react";
import { useCart } from "@/hooks/useCart";

function Home() {
  const navigate = useNavigate();
  const { user } = useUser();
  const { getTotalItems } = useCart();
  const [productLists, setProductLists] = useState<UIProduct[]>([]);

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

  if (!user || !user.username) {
    navigate("/login");
    toast.error("Please log in to access the home page.");
    return null;
  }

  return (
    <main>
      <header className="w-full px-6 py-4 flex flex-row items-center justify-between bg-white border-b border-gray-200">
        <div
          className="flex flex-row items-center gap-2 cursor-pointer"
          onClick={() => navigate("/")}
        >
          <ShoppingBasket className="w-6 h-6 text-primary" />
          <span className="text-lg font-semibold text-gray-900">SmartAgro</span>
        </div>

        <nav className="flex flex-row items-center gap-6">
          <button
            onClick={() => navigate("/news")}
            className="flex flex-row items-center gap-1.5 text-gray-700 hover:text-primary transition-colors cursor-pointer"
            aria-label="News"
          >
            <BookOpen className="w-5 h-5" />
            <span className="hidden sm:inline text-sm font-medium">News</span>
          </button>

          {user?.identity === "farmer" && (
            <button
              onClick={() => navigate("/farmer-dashboard")}
              className="flex flex-row items-center gap-1.5 text-gray-700 hover:text-primary transition-colors cursor-pointer"
              aria-label="Farmer Dashboard"
            >
              <LayoutDashboard className="w-5 h-5" />
              <span className="hidden sm:inline text-sm font-medium">
                Dashboard
              </span>
            </button>
          )}

          {user?.username === "admin" && (
            <button
              onClick={() => navigate("/admin-dashboard")}
              className="flex flex-row items-center gap-1.5 text-gray-700 hover:text-primary transition-colors cursor-pointer"
              aria-label="Admin Dashboard"
            >
              <LayoutDashboard className="w-5 h-5" />
              <span className="hidden sm:inline text-sm font-medium">
                Admin
              </span>
            </button>
          )}

          <button
            onClick={() => navigate("/checkout")}
            className="relative flex flex-row items-center gap-1.5 text-gray-700 hover:text-primary transition-colors cursor-pointer"
            aria-label="Checkout"
          >
            <ShoppingCart className="w-5 h-5" />
            {getTotalItems() > 0 && (
              <span className="absolute -top-1 -left-1 bg-primary text-white text-xs font-semibold rounded-full w-4 h-4 flex items-center justify-center">
                {getTotalItems()}
              </span>
            )}
            <span className="hidden sm:inline text-sm font-medium">Cart</span>
          </button>
        </nav>
      </header>

      <StarGrid />

      <Bounded className="pt-0! mb-16">
        <HomeBanner />
        <Products products={productLists}></Products>
      </Bounded>
      <BottomNavbar />
    </main>
  );
}

export default Home;
