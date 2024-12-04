import { currentUser } from "@clerk/nextjs/server";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    // Fetch the current user from Clerk
    const user = await currentUser();

    // If the user is not authenticated, return 401 Unauthorized
    if (!user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // Respond with user details
    res.status(200).json({
      id: user.id,
      username: user.username || "Unknown",
      email: user.primaryEmailAddress?.emailAddress || "No Email",
      profilePictureUrl: user.imageUrl || "",
    });
  } catch (error: any) {
    // Handle any unexpected errors
    res.status(500).json({ error: error.message || "Unexpected error" });
  }
}
