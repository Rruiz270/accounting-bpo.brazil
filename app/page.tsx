"use client";

import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import Dashboard from "@/components/Dashboard";
import ClientsPage from "@/components/ClientsPage";
import DeadlinesPage from "@/components/DeadlinesPage";
import DocumentsPage from "@/components/DocumentsPage";
import BillingPage from "@/components/BillingPage";

export default function Home() {
  const [currentPage, setCurrentPage] = useState("dashboard");

  const renderPage = () => {
    switch (currentPage) {
      case "dashboard":
        return <Dashboard />;
      case "clients":
        return <ClientsPage />;
      case "deadlines":
        return <DeadlinesPage />;
      case "documents":
        return <DocumentsPage />;
      case "billing":
        return <BillingPage />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar currentPage={currentPage} setCurrentPage={setCurrentPage} />
      <main className="flex-1 overflow-y-auto">
        {renderPage()}
      </main>
    </div>
  );
}
