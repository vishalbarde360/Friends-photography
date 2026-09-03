import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./pages/Home";
import Portfolio from "./pages/Portfolio";
import PortfolioDetail from "./pages/PortfolioDetail";
import Contact from "./pages/Contact";
import ClientGallery from "./pages/ClientGallery";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";

import Dashboard from "./pages/admin/Dashboard";
import Inquiries from "./pages/admin/Inquiries";
import Clients from "./pages/admin/Clients";
import Events from "./pages/admin/Events";
import Albums from "./pages/admin/Albums";
import Photos from "./pages/admin/Photos";
import PortfolioAdmin from "./pages/admin/PortfolioAdmin";
import Galleries from "./pages/admin/Galleries";

function PublicLayout({ children }) {
  return (
    <div className="flex min-h-screen flex-col bg-ivory">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      {/* Public site */}
      <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
      <Route path="/portfolio" element={<PublicLayout><Portfolio /></PublicLayout>} />
      <Route path="/portfolio/:id" element={<PublicLayout><PortfolioDetail /></PublicLayout>} />
      <Route path="/contact" element={<PublicLayout><Contact /></PublicLayout>} />
      <Route path="/gallery" element={<PublicLayout><ClientGallery /></PublicLayout>} />
      <Route path="/gallery/:token" element={<PublicLayout><ClientGallery /></PublicLayout>} />
      <Route path="/login" element={<PublicLayout><Login /></PublicLayout>} />
      <Route path="/register" element={<PublicLayout><Register /></PublicLayout>} />

      {/* Admin (protected) */}
      <Route path="/admin" element={<ProtectedRoute adminOnly><Dashboard /></ProtectedRoute>} />
      <Route path="/admin/inquiries" element={<ProtectedRoute adminOnly><Inquiries /></ProtectedRoute>} />
      <Route path="/admin/clients" element={<ProtectedRoute adminOnly><Clients /></ProtectedRoute>} />
      <Route path="/admin/events" element={<ProtectedRoute adminOnly><Events /></ProtectedRoute>} />
      <Route path="/admin/albums" element={<ProtectedRoute adminOnly><Albums /></ProtectedRoute>} />
      <Route path="/admin/photos" element={<ProtectedRoute adminOnly><Photos /></ProtectedRoute>} />
      <Route path="/admin/portfolio" element={<ProtectedRoute adminOnly><PortfolioAdmin /></ProtectedRoute>} />
      <Route path="/admin/galleries" element={<ProtectedRoute adminOnly><Galleries /></ProtectedRoute>} />

      <Route path="*" element={<PublicLayout><NotFound /></PublicLayout>} />
    </Routes>
  );
}
