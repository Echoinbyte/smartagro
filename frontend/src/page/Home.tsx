import BottomNavbar from "@/components/BottomNavbar";
import { useUser } from "@/context/UserContext";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import StarGrid from "./landing/StarGrid";
import Products from "@/components/products/Products";
import { products } from "@/config/mockProducts";
import Bounded from "./landing/Bounded";

function Home() {
  const navigate = useNavigate();
  const { user } = useUser();

  if (!user || !user.username) {
    navigate("/login");
    toast.error("Please log in to access the home page.");
    return null;
  }
  return (
    <main>
      <header className="w-full h-8 flex flex-row items-center justify-between gap-4 bg-primary"></header>

      <StarGrid />

      <Bounded className="mb-16">
        <Products products={products}></Products>
      </Bounded>
      <BottomNavbar />
    </main>
  );
}

export default Home;
