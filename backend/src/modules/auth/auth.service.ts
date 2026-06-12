import bcrypt from "bcryptjs";
import { OAuth2Client } from "google-auth-library";
import User from "../user/user.model";
import { ApiError } from "../../utils/api-error";
import { RegisterInput, LoginInput } from "./auth.types";

export const registerUser = async (input: RegisterInput) => {
  const email = input.email.trim().toLowerCase();

  const exists = await User.findOne({ email });
  if (exists) {
    throw new ApiError(409, "Email already in use");
  }

  return User.create({ ...input, email });
};

export const loginUser = async (input: LoginInput) => {
  const email = input.email.trim().toLowerCase();

  const user = await User.findOne({ email }).select("+password");
  if (!user || !user.password || !(await bcrypt.compare(input.password, user.password))) {
    throw new ApiError(401, "Invalid email or password");
  }

  return user;
};

export const googleLogin = async (code: string) => {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    throw new ApiError(500, "Google sign-in is not configured");
  }

  const client = new OAuth2Client(clientId, clientSecret, "postmessage");

  let payload;
  try {
    const { tokens } = await client.getToken(code);
    if (!tokens.id_token) {
      throw new Error("no id token");
    }
    const ticket = await client.verifyIdToken({
      idToken: tokens.id_token,
      audience: clientId,
    });
    payload = ticket.getPayload();
  } catch {
    throw new ApiError(401, "Google sign-in failed");
  }

  if (!payload?.email || !payload.email_verified) {
    throw new ApiError(401, "Google account email is not verified");
  }

  const email = payload.email.toLowerCase();
  let user = await User.findOne({ email });
  if (!user) {
    user = await User.create({
      firstName: payload.given_name || payload.name || "Google",
      lastName: payload.family_name || "User",
      email,
      avatar: payload.picture || "",
    });
  }

  return user;
};
