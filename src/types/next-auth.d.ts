
import nextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      username: string;
      accessToken: string;
      refreshToken: string;
    };
  }
}