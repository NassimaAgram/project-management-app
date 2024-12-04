"use client";

import { useAppSelector } from "@/state/store"; // Adjust the path if needed

const Page = () => {
  const user = useAppSelector((state) => state.auth.user);

  if (!user) {
    return (
      <p className="flex justify-center text-2xl">Loading user data...</p>
    );
  }

  return (
    <p className="flex justify-center text-2xl">
      Welcome to ProjeXpert {user.username}
    </p>
  );
};

export default Page;
