import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { SubscriptionProvider } from './context/SubscriptionContext';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import AddSubscription from './pages/AddSubscription';
import EditSubscription from './pages/EditSubscription';
import Settings from './pages/Settings';
import Layout from './components/Layout';

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
                                            <Route path="/edit/:id" element={<EditSubscription />} />
                                            <Route path="/settings" element={<Settings />} />
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
