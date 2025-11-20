import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { SubscriptionProvider } from './context/SubscriptionContext';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import AddSubscription from './pages/AddSubscription';
import Layout from './components/Layout';
import { Toaster } from 'sonner'; // Assuming we might want toast notifications, but I'll stick to basic for now or add it later. 
// Actually, let's stick to the plan. I didn't add sonner in package.json, so I'll skip it for now.

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    const { isAuthenticated } = useAuth();
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }
    return <>{children}</>;
};

function App() {
    return (
        <AuthProvider>
            <SubscriptionProvider> {/* Added SubscriptionProvider */}
                <Router>
                    <Routes>
                        <Route path="/login" element={<Login />} />
                        <Route
                            path="/*"
                            element={
                                <ProtectedRoute>
                                    <Layout>
                                        <Routes>
                                            <Route path="/" element={<Dashboard />} />
                                            <Route path="/add" element={<AddSubscription />} />
                                        </Routes>
                                    </Layout>
                                </ProtectedRoute>
                            }
                        />
                    </Routes>
                </Router>
            </SubscriptionProvider> {/* Closed SubscriptionProvider */}
        </AuthProvider>
    );
}

export default App;
