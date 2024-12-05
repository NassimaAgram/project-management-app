import { User } from "@/state/api";
import Image from "next/image";
import React from "react";

type Props = {
  user: User;
};

const UserCard = ({ user }: Props) => {
  return (
    <div className="flex items-center rounded-lg bg-white p-6 shadow-lg hover:scale-105 transition-all duration-200 dark:bg-dark-secondary dark:text-white">
      {/* Profile Picture */}
      {user.profilePictureUrl && (
        <div className="relative w-16 h-16">
          <Image
            src={`/p1.jpeg`}
            alt="profile picture"
            width={64}
            height={64}
            className="rounded-full border-2 border-indigo-500 shadow-md hover:scale-105 transition-all duration-200"
          />
        </div>
      )}
      
      {/* User Information */}
      <div className="ml-4">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{user.username}</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">{user.email}</p>
      </div>
    </div>
  );
};

export default UserCard;
