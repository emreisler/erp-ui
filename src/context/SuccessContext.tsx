import React, { createContext, useContext, useState, ReactNode } from "react";

interface SuccessContextType {
    success: string | null;
    setSuccess: (message: string | null) => void;
}

interface SuccessProviderProps {
    children: ReactNode; // Explicitly define children as a prop
}

const SuccessContext = createContext<SuccessContextType | undefined>(undefined);

export const SuccessProvider: React.FC<SuccessProviderProps> = ({ children }) => {
    const [success, setSuccess] = useState<string | null>(null);

    return (
        <SuccessContext.Provider value={{ success, setSuccess }}>
            {children}
        </SuccessContext.Provider>
    );
};

export const useSuccess = () => {
    const context = useContext(SuccessContext);
    if (!context) {
        throw new Error("useSuccess must be used within a SuccessProvider");
    }
    return context;
};