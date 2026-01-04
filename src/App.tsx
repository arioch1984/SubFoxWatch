import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { SubscriptionProvider } from './context/SubscriptionContext';
import Layout from './components/Layout';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import AddSubscription from './pages/AddSubscription';
import EditSubscription from './pages/EditSubscription';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { isAuthenticated } = useAuth();
    return isAuthenticated ? <Layout>{children}</Layout> : <Navigate to="/login" />;
};

function App() {
    return (
        <AuthProvider>
            <SubscriptionProvider>
                <Router>
                    <Routes>
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route
                            path="/"
                            element={
                                <ProtectedRoute>
                                    <Dashboard />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/add"
                            element={
                                <ProtectedRoute>
                                    <AddSubscription />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/edit/:id"
                            element={
                                <ProtectedRoute>
                                    <EditSubscription />
                                </ProtectedRoute>
                            }
                        />
                    </Routes>
                </Router>
            </SubscriptionProvider>
        </AuthProvider>
    );
}

export default App;
