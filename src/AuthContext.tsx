import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { api } from './api';

interface User {
    id: string;
    email: string;
    displayName: string;
    photoURL?: string;
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<void>;
    signup: (email: string, password: string, displayName: string) => Promise<void>;
    logout: () => Promise<void>;
    loginWithGoogle: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check for auth token in URL (from OAuth callback)
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token');

        if (token) {
            api.setAuthToken(token);
            // Remove token from URL
            window.history.replaceState({}, document.title, window.location.pathname);
        }

        // Load current user if token exists
        const loadUser = async () => {
            try {
                const currentUser = await api.getCurrentUser();
                setUser(currentUser);
            } catch (error) {
                // No valid user session
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        loadUser();
    }, []);

    const login = async (email: string, password: string) => {
        const data = await api.login(email, password);
        setUser(data.user);
    };

    const signup = async (email: string, password: string, displayName: string) => {
        const data = await api.signup(email, password, displayName);
        setUser(data.user);
    };

    const logout = async () => {
        await api.logout();
        setUser(null);
    };

    const loginWithGoogle = () => {
        api.initiateGoogleLogin();
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, signup, logout, loginWithGoogle }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
