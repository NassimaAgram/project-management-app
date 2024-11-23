import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher(["/", "/marketing(.*)", "/auth(.*)"]);

export default clerkMiddleware(async (auth, req) => {
    if(!isPublicRoute(req)) {
        auth.protect();
      }
});


export const config = {
    matcher: [
        "/((?!.*\\..*|_next).*)", // Matches all routes except static files or `_next`
        "/main(.*)",              // Matches protected routes
        "/auth(.*)",              // Matches authentication routes
    ],
};
