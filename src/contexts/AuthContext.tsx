import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authService } from '@/services';
import type { LoginRequest, RegisterRequest } from '@/types/api.types';

interface User {
    id: number;
    email: string;
    username: string;
    role: string;
}

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    isAdmin: boolean;
    loading: boolean;
    login: (credentials: LoginRequest) => Promise<void>;
    register: (data: RegisterRequest) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    // Check for existing auth on mount
    useEffect(() => {
        const token = localStorage.getItem('token');
        const userStr = localStorage.getItem('user');

        if (token && userStr) {
            try {
                const userData = JSON.parse(userStr);
                setUser(userData);
            } catch (error) {
                console.error('Failed to parse user data:', error);
                localStorage.removeItem('token');
                localStorage.removeItem('user');
            }
        }
        setLoading(false);
    }, []);

    const login = async (credentials: LoginRequest) => {
        try {
            const response = await authService.login(credentials);

            // Store token
            localStorage.setItem('token', response.token);

            // Store user info - response is LoginResponse
            const userData: User = {
                id: response.id || 0, // Use 0 if id not provided
                email: response.email,
                username: response.username,
                role: response.role,
            };
            localStorage.setItem('user', JSON.stringify(userData));

            setUser(userData);

            // Dispatch custom event for auth change
            window.dispatchEvent(new Event('auth-change'));
        } catch (error) {
            console.error('Login failed:', error);
            throw error;
        }
    };

    const register = async (data: RegisterRequest) => {
        try {
            await authService.register(data);
            // Registration successful, but user needs to login manually
        } catch (error) {
            console.error('Registration failed:', error);
            throw error;
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);

        // Dispatch custom event for auth change
        window.dispatchEvent(new Event('auth-change'));

        window.location.href = '/';
    };

    const value: AuthContextType = {
        user,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'ADMIN' || user?.role === 'ROLE_ADMIN',
        loading,
        login,
        register,
        logout,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
