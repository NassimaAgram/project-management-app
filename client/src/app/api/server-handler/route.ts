import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Export named function for GET request
export async function GET() {
  try {
    // Fetch the current user from Clerk
    const user = await currentUser();

    // If the user is not authenticated, return a 401 Unauthorized response
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Respond with the user details
    return NextResponse.json({
      id: user.id,
      username: user.username || "Unknown",
      email: user.primaryEmailAddress?.emailAddress || "No Email",
      profilePictureUrl: user.imageUrl || "",
    });
  } catch (error: unknown) {
    // Check if error is an instance of Error and has a message
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message || "Unexpected error" }, { status: 500 });
    } else {
      return NextResponse.json({ error: "Unexpected error" }, { status: 500 });
    }
  }
}
