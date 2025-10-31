import { useUser } from "@/context/UserContext";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

function Home() {
  const navigate = useNavigate();
  const { user } = useUser();

  if (!user || !user.username) {
    navigate("/login");
    toast.error("Please log in to access the home page.");
    return null;
  }
  return <div>Home</div>;
}

export default Home;
