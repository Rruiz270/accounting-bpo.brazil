"use client";

import { TrendingUp, Users, FileText, AlertCircle } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const kpiData = [
  { icon: Users, label: "Total de Clientes", value: "47", color: "bg-blue-500" },
  { icon: FileText, label: "Obrigações Entregues", value: "156", color: "bg-green-500" },
  { icon: AlertCircle, label: "Prazos Próximos", value: "12", color: "bg-yellow-500" },
  { icon: TrendingUp, label: "Faturamento Mensal", value: "R$ 45.780", color: "bg-purple-500" },
];

const revenueData = [
  { month: "Jan", value: 38000 },
  { month: "Fev", value: 42000 },
  { month: "Mar", value: 45000 },
  { month: "Abr", value: 41000 },
  { month: "Mai", value: 44000 },
  { month: "Jun", value: 45780 },
];

const upcomingDeadlines = [
  { client: "Tech Solutions Ltda", obligation: "DCTF", dueDate: "15/07/2024", status: "urgent" },
  { client: "Comércio ABC", obligation: "DAS", dueDate: "20/07/2024", status: "warning" },
  { client: "Consultoria XYZ", obligation: "SPED Fiscal", dueDate: "25/07/2024", status: "normal" },
  { client: "Indústria 123", obligation: "eSocial", dueDate: "07/08/2024", status: "normal" },
];

export default function Dashboard() {
  return (
    <div className="p-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-gray-600 mt-1">Visão geral do seu escritório contábil</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {kpiData.map((kpi, index) => {
          const Icon = kpi.icon;
          return (
            <div key={index} className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className={`${kpi.color} bg-opacity-10 p-3 rounded-lg`}>
                  <Icon className={`h-6 w-6 ${kpi.color.replace('bg-', 'text-')}`} />
                </div>
              </div>
              <p className="text-2xl font-bold text-gray-800">{kpi.value}</p>
              <p className="text-sm text-gray-600">{kpi.label}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Faturamento Mensal</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => `R$ ${value.toLocaleString('pt-BR')}`} />
              <Bar dataKey="value" fill="#3B82F6" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Próximos Vencimentos</h2>
          <div className="space-y-3">
            {upcomingDeadlines.map((deadline, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <p className="font-medium text-gray-800">{deadline.client}</p>
                  <p className="text-sm text-gray-600">{deadline.obligation}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-800">{deadline.dueDate}</p>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    deadline.status === 'urgent' ? 'bg-red-100 text-red-600' :
                    deadline.status === 'warning' ? 'bg-yellow-100 text-yellow-600' :
                    'bg-green-100 text-green-600'
                  }`}>
                    {deadline.status === 'urgent' ? 'Urgente' :
                     deadline.status === 'warning' ? 'Atenção' : 'Normal'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}