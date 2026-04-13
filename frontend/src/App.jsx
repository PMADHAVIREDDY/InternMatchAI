import { Routes, Route } from "react-router-dom";

// Routes
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import NotAuthorized from "./pages/NotAuthorized.jsx";
import UserProfile from "./pages/UserProfile.jsx"; // <-- 1. IMPORT IT
import ProtectedRoute from "./components/ProtectedRoute";
import StudentDashboard from "./pages/student/StudentDashboard";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AppWrapper from "./components/AppWrapper";

const App = () => {
  return (
    <Routes>
      {/* --- Public Routes --- */}
      <Route 
        path="/" 
        element={
          <AppWrapper>
            <Home />
          </AppWrapper>
        } 
      />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/not-authorized" element={<NotAuthorized />} />

      {/* --- Student Routes --- */}
      <Route
        path="/student/dashboard"
        element={
          <ProtectedRoute>
            <AppWrapper>
              <StudentDashboard />
            </AppWrapper>
          </ProtectedRoute>
        }
      />
      
      {/* --- 2. ADD THIS PROFILE ROUTE --- */}
      {/* It's protected, so only logged-in users can see it */}
      <Route
        path="/profile"
        element={
          <ProtectedRoute> 
            <AppWrapper>
              <UserProfile />
            </AppWrapper>
          </ProtectedRoute>
        }
      />
      
      {/* --- Admin Route --- */}
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute requiredRole="admin">
            <AppWrapper>
              <AdminDashboard />
            </AppWrapper>
          </ProtectedRoute>
        }
      />
      
      {/* --- Catch-all 404 Route --- */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default App;