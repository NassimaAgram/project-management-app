"use client";

import { ClerkProvider } from '@clerk/nextjs';
import React from 'react'

interface Props {
    children: React.ReactNode;
}

const AuthProvider = ({ children }: Props) => {
    return (
        <ClerkProvider>
            {children}
        </ClerkProvider>
    )
}

export default AuthProvider;