"use client";

import { Home, Users, Calendar, FileText, CreditCard } from "lucide-react";

interface SidebarProps {
  currentPage: string;
  setCurrentPage: (page: string) => void;
}

const menuItems = [
  { id: "dashboard", label: "Dashboard", icon: Home },
  { id: "clients", label: "Clientes", icon: Users },
  { id: "deadlines", label: "Prazos", icon: Calendar },
  { id: "documents", label: "Documentos", icon: FileText },
  { id: "billing", label: "Faturamento", icon: CreditCard },
];

export default function Sidebar({ currentPage, setCurrentPage }: SidebarProps) {
  return (
    <aside className="w-64 bg-blue-900 text-white h-full flex flex-col">
      <div className="p-6">
        <h1 className="text-2xl font-bold">BPO Contábil</h1>
        <p className="text-blue-200 text-sm mt-1">Sistema de Gestão</p>
      </div>
      
      <nav className="flex-1 px-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.id}>
                <button
                  onClick={() => setCurrentPage(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    currentPage === item.id
                      ? "bg-blue-800 text-white"
                      : "hover:bg-blue-800/50 text-blue-100"
                  }`}
                >
                  <Icon size={20} />
                  <span>{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
      
      <div className="p-4 border-t border-blue-800">
        <div className="text-sm text-blue-200">
          <p>© 2024 BPO Contábil</p>
          <p className="text-xs mt-1">Versão 1.0 MVP</p>
        </div>
      </div>
    </aside>
  );
}