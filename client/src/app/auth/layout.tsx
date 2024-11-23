import Image from "next/image";
import React from 'react';

interface Props {
    children: React.ReactNode
}

const AuthLayout = ({ children }: Props) => {
    return (
        <main className="relative w-full h-screen select-none">
            <div className="absolute inset-x-0 top-0 size-full hidden lg:hidden opacity-50 -z-10">
                <Image
                    src="/images/bas.svg"
                    alt="Auth background"
                    width={1920}
                    height={1080}
                    className="select-none h-full pointer-events-none"
                />
            </div>
            {children}
        </main>
    );
};

export default AuthLayout