export type AuthOutput = {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
};
