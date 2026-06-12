export type User = {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  provider: "local" | "google";
  createdAt: Date;
};