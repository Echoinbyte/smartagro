import BottomNavbar from "@/components/BottomNavbar";
import { useUser } from "@/context/UserContext";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import StarGrid from "./landing/StarGrid";

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
      <StarGrid />
      <BottomNavbar /> 
    </main>
  );
}

export default Home;
