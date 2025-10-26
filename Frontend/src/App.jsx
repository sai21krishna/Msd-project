import React from 'react';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout/Layout';
import Login from './pages/Auth/Login';
import Signup from './pages/Auth/Signup';
import Dashboard from './pages/Dashboard/Dashboard';
import Medications from './pages/Medications/Medications';
import Reminders from './pages/Reminders/Reminders';
import Analytics from './pages/Analytics/Analytics';
import Profile from './pages/Profile/Profile';
import CaregiverDashboard from './pages/Caregiver/CaregiverDashboard';
import HealthJournal from './pages/HealthJournal/HealthJournal';

function App() {
  // Define routes as a plain array; RouterProvider will render them.
  const routes = [
    { path: '/login', element: <Login /> },
    { path: '/signup', element: <Signup /> },

    // Root redirect to dashboard inside protected layout
    {
      path: '/',
      element: (
        <ProtectedRoute>
          <Layout>
            <Navigate to="/dashboard" replace />
          </Layout>
        </ProtectedRoute>
      ),
    },
    {
      path: '/dashboard',
      element: (
        <ProtectedRoute>
          <Layout>
            <Dashboard />
          </Layout>
        </ProtectedRoute>
      ),
    },
    {
      path: '/medications',
      element: (
        <ProtectedRoute>
          <Layout>
            <Medications />
          </Layout>
        </ProtectedRoute>
      ),
    },
    {
      path: '/reminders',
      element: (
        <ProtectedRoute>
          <Layout>
            <Reminders />
          </Layout>
        </ProtectedRoute>
      ),
    },
    {
      path: '/analytics',
      element: (
        <ProtectedRoute>
          <Layout>
            <Analytics />
          </Layout>
        </ProtectedRoute>
      ),
    },
    {
      path: '/health-journal',
      element: (
        <ProtectedRoute>
          <Layout>
            <HealthJournal />
          </Layout>
        </ProtectedRoute>
      ),
    },
    {
      path: '/caregiver',
      element: (
        <ProtectedRoute>
          <Layout>
            <CaregiverDashboard />
          </Layout>
        </ProtectedRoute>
      ),
    },
    {
      path: '/profile',
      element: (
        <ProtectedRoute>
          <Layout>
            <Profile />
          </Layout>
        </ProtectedRoute>
      ),
    },
  ];

  // Create router with v7 future flags enabled to opt-in to upcoming behaviors
  const router = createBrowserRouter(routes, {
    future: { v7_startTransition: true },
  });

  return (
    <AuthProvider>
      <>
        <RouterProvider router={router} future={{ v7_startTransition: true }} />

        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
            },
          }}
        />
      </>
    </AuthProvider>
  );
}

export default App;