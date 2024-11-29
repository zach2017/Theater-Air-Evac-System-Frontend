import Login from "../components/Pages/Login";
import { useAuth } from "../context/AuthContext";

 const ProtectedRoute = ({ children }) => {
    const { auth } = useAuth();

    if (!auth.isAuthenticated) {
        return (
            <div className="p-4">
                <Login />
            </div>
        );
    }


    return children;
};

export default ProtectedRoute;