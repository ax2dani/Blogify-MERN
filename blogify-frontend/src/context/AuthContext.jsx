import { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Hydrate from local storage
        const userInfo = localStorage.getItem('userInfo');
        if (userInfo) {
            setUser(JSON.parse(userInfo));
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        try {
            const config = { headers: { 'Content-Type': 'application/json' } };
            const { data } = await axios.post('/api/auth/login', { email, password }, config);
            setUser(data);
            localStorage.setItem('userInfo', JSON.stringify(data));
            return data;
        } catch (error) {
            throw error.response && error.response.data.message
                ? error.response.data.message
                : error.message;
        }
    };

    const register = async (username, email, password) => {
        try {
            const config = { headers: { 'Content-Type': 'application/json' } };
            const { data } = await axios.post('/api/auth/register', { username, email, password }, config);
            setUser(data);
            localStorage.setItem('userInfo', JSON.stringify(data));
            return data;
        } catch (error) {
            throw error.response && error.response.data.message
                ? error.response.data.message
                : error.message;
        }
    };

    const logout = () => {
        localStorage.removeItem('userInfo');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
