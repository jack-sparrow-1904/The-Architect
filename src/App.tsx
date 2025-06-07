import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import DashboardPage from './pages/DashboardPage';
import WeeklyReviewPage from './pages/WeeklyReviewPage';
import { Toaster } from "@/components/ui/sonner"

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/" element={<ProtectedRoute />}>
            <Route index element={<DashboardPage />} />
            <Route path="weekly-review" element={<WeeklyReviewPage />} />
          </Route>
          <Route path="*" element={<Navigate to="/" />} /> 
        </Routes>
        <Toaster richColors theme="dark" />
      </AuthProvider>
    </Router>
  );
}

export default App;
