import { Loader2 } from "lucide-react";
import React from "react";

const Loading = () => {
    return (
        <div className="relative flex flex-col items-center justify-center px-4 min-h-screen">
            <div className="flex flex-col items-center justify-center mx-auto h-screen">
                <div className="flex items-center justify-center flex-col"></div>
                <div className="loading">
                    <Loader2 className="loading__spinner size-24" />
                </div>
            </div>
        </div>
    );
};

export default Loading;