"use client";

import { useUser } from '@clerk/nextjs';
import Header from "@/components/Header";
import React from "react";
import Link from 'next/link';
import { Button } from '@/components/ui/button';

const Settings = () => {
  const { isLoaded, isSignedIn, user } = useUser();

  if (!isLoaded || !isSignedIn) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  const labelStyles = "block text-sm font-medium dark:text-white";
  const textStyles = "mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 dark:text-white";

  return (
    <div className="p-8">
      <Header name="Settings" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="flex justify-center">
          <div className="mx-4">
            <img
              src={user.imageUrl}
              className="rounded-lg"
              width={150}
              height={150}
            />
          </div>
        </div>

        <div className="col-span-2">
          <div className="space-y-4">
            <div>
              <label className={labelStyles}>Username</label>
              <div className={textStyles}>{user.username}</div>
            </div>
            <div>
              <label className={labelStyles}>Email</label>
              <div className={textStyles}>{user.emailAddresses.map(email => (
                <div key={email.emailAddress}>{email.emailAddress}</div>
              ))}</div>
            </div>
            <div className="flex justify-center mt-4">
              <Link href="/update-profile">
                <Button >
                  Update Profile
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
