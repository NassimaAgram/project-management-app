"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCreateUserMutation, useGetUsersQuery } from "@/state/api";
import { toast } from "sonner";
import { useUser } from "@clerk/nextjs";

const AuthCallbackPage = () => {
 
  const router = useRouter();
  const { user } = useUser(); // Clerk hook to get user info
  const [createUser] = useCreateUserMutation();
  const { data: users } = useGetUsersQuery();
  console.log("front API Response:", users); // Debugging
  const [hasRun, setHasRun] = useState(false); // Prevent running the logic multiple times

  useEffect(() => {
    // Prevent the logic from running multiple times and ensure user data is available
    if (!user ) {
      return; // Avoid running if not signed in or data is missing
    }

    console.log("Fetched data:", users);

    const handleAuthCallback = async () => {
      if ( !users) {
        return; // Prevent logic from running if users data is not loaded yet
      }

      console.log("Fetched data after user:", users);
      // Check if the user already exists based on their email
      const existingUser = users?.find((existingUser) => existingUser.email === user.emailAddresses[0]?.emailAddress);

      if (existingUser) {
        // User exists, simply sign them in and redirect
        console.log("User already exists:", existingUser);
        router.push("/dashboard"); // Redirect to dashboard or a suitable page
      } else {
        // User doesn't exist, create them in the system
        const userData = {
          clerkId: user.id,
          username: user.username || user.firstName || user.lastName || "Unknown",
          email: user.emailAddresses[0]?.emailAddress,
          profilePictureUrl: user.imageUrl,
          teamId: 1, // Default team ID or fetch dynamically if needed
        };

        try {
          console.log("Creating new user:", userData);
          const result = await createUser(userData).unwrap(); // Call your mutation to create user

          if (result?.data) {
            toast.success("User created successfully");
            router.push("/dashboard"); // Redirect after successful user creation
          }
        } catch (error) {
          console.error("Error creating user:", error);
          toast.error("User creation failed");
          router.push("/auth/signin"); // Redirect to sign-in if error occurs
        }
      }
    };

    handleAuthCallback();
  }, [ user, users, createUser, router]);

  return (
    <div className="flex items-center justify-center flex-col h-screen relative">
      <div className="border-[3px] border-neutral-800 rounded-full border-b-neutral-200 animate-loading w-8 h-8"></div>
      <p className="text-lg font-medium text-center mt-3">
        Verifying your account...
      </p>
    </div>
  );
};

export default AuthCallbackPage;
