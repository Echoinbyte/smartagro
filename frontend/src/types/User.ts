export interface User {
  username: string;
  gmail: string;
  contact: string;
  identity: "user" | "farmer";
  latitude: number | null;
  longitude: number | null;
}
