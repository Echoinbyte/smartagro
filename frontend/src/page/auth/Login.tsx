import InputField from "@/components/shared/InputField";
import Bounded from "../landing/Bounded";
import { FaPhone } from "react-icons/fa6";
import { FaUser } from "react-icons/fa";
import { IoMdMail } from "react-icons/io";
import StarGrid from "../landing/StarGrid";
import Button from "@/components/shared/Button";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export interface GeolocationState {
  latitude: number | null;
  longitude: number | null;
  error: GeolocationPositionError | null;
  loading: boolean;
}

export interface Credentials {
  username: string;
  contact: string;
  gmail: string;
}

function Login() {
  const navigate = useNavigate();

  const [currentLocation, setCurrentLocation] = useState<GeolocationState>({
    latitude: null,
    longitude: null,
    error: null,
    loading: true,
  });

  const [credentials, setCredentials] = useState<Credentials>({
    username: "",
    contact: "",
    gmail: "",
  });

  useEffect(() => {
    if (!navigator.geolocation) {
      setCurrentLocation((prev) => ({
        ...prev,
        error: {
          message: "Geolocation is not supported by your browser.",
        } as GeolocationPositionError,
        loading: false,
      }));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setCurrentLocation({
          latitude,
          longitude,
          error: null,
          loading: false,
        });
        console.log("User location:", { latitude, longitude });
      },
      (error) => {
        setCurrentLocation((prev) => ({ ...prev, error, loading: false }));
        console.error("Geolocation error:", error);
      }
    );
  }, []);

  const handleInputChange = (
    value: string,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name } = e.target;
    setCredentials((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const loginData = {
      username: formData.get("username") as string,
      gmail: formData.get("gmail") as string,
      contact: formData.get("contact") as string,
      latitude: currentLocation.latitude ? currentLocation.latitude : null,
      longitude: currentLocation.longitude ? currentLocation.longitude : null,
    };

    console.log("Login data:", loginData);

    // Backend Logic
    try {
      console.log("Submitting login with:", loginData);

      if (loginData.username && loginData.contact) {
        console.log("Login successful! Redirecting to home page...");
        navigate("/home");
      } else {
        console.error("Login failed: Missing required fields");
      }
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  return (
    <Bounded>
      <form
        onSubmit={handleSubmit}
        className="w-full flex flex-col items-center justify-center gap-8"
      >
        <section className="w-full h-1/6 flex flex-col items-center justify-center">
          <StarGrid></StarGrid>
          <h1 className="text-balance text-5xl font-medium md:text-7xl text-foreground">
            Login
          </h1>
        </section>
        <section className="w-full h-auto flex flex-col items-center justify-start gap-3">
          <InputField
            type="text"
            name="username"
            placeholder="Enter the Username"
            required
            icon={<FaUser />}
            value={credentials.username}
            onChange={handleInputChange}
          />
          <InputField
            type="tel"
            name="contact"
            placeholder="Enter the Contact Number"
            required
            icon={<FaPhone />}
            value={credentials.contact}
            onChange={handleInputChange}
          />
          <InputField
            type="gmail"
            name="gmail"
            placeholder="Enter the Gmail"
            icon={<IoMdMail />}
            value={credentials.gmail}
            onChange={handleInputChange}
          />
        </section>
        <section className="w-full flex flex-row items-center justify-center">
          <Button type="submit" title={"Login"}></Button>
        </section>
      </form>
    </Bounded>
  );
}

export default Login;
