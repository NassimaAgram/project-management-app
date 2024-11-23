import { inter, satoshi } from "@/constants";
import "@/styles/globals.css";
import { cn, generateMetadata } from "@/functions";
import { Toaster } from "@/components/ui/sonner";
import { ClerkProvider } from "@clerk/nextjs";

export const metadata = generateMetadata();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={cn(
        "min-h-screen bg-background text-foreground antialiased font-default overflow-x-hidden !scrollbar-hide",
        inter.variable,
        satoshi.variable,
      )}
      >
        <ClerkProvider>
          <Toaster
            richColors
            theme="dark"
            position="top-right"
          />
          {children}
        </ClerkProvider>
      </body>
    </html>
  );
}
