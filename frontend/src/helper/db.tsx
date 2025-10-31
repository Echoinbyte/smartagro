import type { User } from "@/types/User";

export const createUser = async (user: User): Promise<void> => {
  await localStorage.setItem("userCredentials", JSON.stringify(user));
};

export const getCredentials = async (): Promise<User | null> => {
  const user = await localStorage.getItem("userCredentials");
  return user ? (JSON.parse(user) as User) : null;
};

export const updateCurrentUser = async (
  updates: Partial<User>
): Promise<void> => {
  const currentUser = await getCredentials();
  const updatedUser = currentUser ? { ...currentUser, ...updates } : updates;
  await localStorage.setItem("userCredentials", JSON.stringify(updatedUser));
};
