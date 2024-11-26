import HomePage from "@/app/(main)/dashboard/page";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

const AuthCallbackPage = async () => {

    try {
        const user = await currentUser();
    
        if (!user?.id || !user.emailAddresses?.[0]?.emailAddress) {
          redirect("/auth/sign-in"); // Redirect if user is invalid or not authenticated
        }
    
        return (
          <div>
           <HomePage />
          </div>
        );
      } catch (error) {
        console.error("Error fetching current user:", error);
        redirect("/auth/sign-in"); // Redirect on error
      }
    };
    
export default AuthCallbackPage