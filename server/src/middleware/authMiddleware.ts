import { requireAuth } from "@clerk/express";

// Middleware for strict authentication
export const requireAuthentication = requireAuth;
