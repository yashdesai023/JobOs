import { Navigate, Outlet } from 'react-router-dom';
import { pb } from '../lib/pocketbase';

export default function ProtectedRoute() {
    const isAuth = pb.authStore.isValid;
    return isAuth ? <Outlet /> : <Navigate to="/login" replace />;
}
