"use client";

import { useState } from "react";
import { DollarSign, FileText, Download, Send, CheckCircle, Clock } from "lucide-react";

interface Invoice {
  id: string;
  invoiceNumber: string;
  clientName: string;
  month: string;
  amount: number;
  dueDate: Date;
  status: "paid" | "pending" | "overdue";
  services: string[];
}

const initialInvoices: Invoice[] = [
  {
    id: "1",
    invoiceNumber: "2024-001",
    clientName: "Tech Solutions Ltda",
    month: "Junho/2024",
    amount: 1200,
    dueDate: new Date("2024-07-10"),
    status: "paid",
    services: ["Contabilidade", "Folha de Pagamento", "Obrigações Acessórias"]
  },
  {
    id: "2",
    invoiceNumber: "2024-002",
    clientName: "Comércio ABC",
    month: "Junho/2024",
    amount: 800,
    dueDate: new Date("2024-07-10"),
    status: "pending",
    services: ["Contabilidade", "DAS"]
  },
  {
    id: "3",
    invoiceNumber: "2024-003",
    clientName: "Consultoria XYZ",
    month: "Junho/2024",
    amount: 1500,
    dueDate: new Date("2024-06-10"),
    status: "overdue",
    services: ["Contabilidade", "Folha de Pagamento", "SPED Fiscal", "Consultoria Tributária"]
  }
];

export default function BillingPage() {
  const [invoices, setInvoices] = useState<Invoice[]>(initialInvoices);
  const [filter, setFilter] = useState<"all" | "paid" | "pending" | "overdue">("all");

  const handleGenerateInvoice = () => {
    alert("Gerar nova fatura - funcionalidade será implementada com backend");
  };

  const handleSendInvoice = (invoice: Invoice) => {
    alert(`Enviar fatura ${invoice.invoiceNumber} para ${invoice.clientName}`);
  };

  const handleDownloadInvoice = (invoice: Invoice) => {
    alert(`Download da fatura ${invoice.invoiceNumber}`);
  };

  const handleMarkAsPaid = (id: string) => {
    setInvoices(invoices.map(inv => 
      inv.id === id ? { ...inv, status: "paid" as const } : inv
    ));
  };

  const filteredInvoices = invoices.filter(inv => {
    if (filter === "all") return true;
    return inv.status === filter;
  });

  const totalReceived = invoices
    .filter(inv => inv.status === "paid")
    .reduce((sum, inv) => sum + inv.amount, 0);

  const totalPending = invoices
    .filter(inv => inv.status !== "paid")
    .reduce((sum, inv) => sum + inv.amount, 0);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid": return "text-green-600 bg-green-100";
      case "overdue": return "text-red-600 bg-red-100";
      default: return "text-yellow-600 bg-yellow-100";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "paid": return "Pago";
      case "overdue": return "Vencido";
      default: return "Pendente";
    }
  };

  return (
    <div className="p-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Faturamento</h1>
        <p className="text-gray-600 mt-1">Gerencie suas faturas e recebimentos</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-green-100 rounded-lg">
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-800">
            R$ {totalReceived.toLocaleString('pt-BR')}
          </p>
          <p className="text-sm text-gray-600">Total Recebido</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-yellow-100 rounded-lg">
              <Clock className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-800">
            R$ {totalPending.toLocaleString('pt-BR')}
          </p>
          <p className="text-sm text-gray-600">Total Pendente</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <FileText className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-800">{invoices.length}</p>
          <p className="text-sm text-gray-600">Total de Faturas</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex flex-col md:flex-row gap-4 justify-between mb-6">
          <div className="flex gap-2">
            {(["all", "paid", "pending", "overdue"] as const).map((filterOption) => (
              <button
                key={filterOption}
                onClick={() => setFilter(filterOption)}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  filter === filterOption
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {filterOption === "all" ? "Todas" :
                 filterOption === "paid" ? "Pagas" :
                 filterOption === "pending" ? "Pendentes" : "Vencidas"}
              </button>
            ))}
          </div>
          <button
            onClick={handleGenerateInvoice}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <FileText size={20} />
            Gerar Fatura
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4">Nº Fatura</th>
                <th className="text-left py-3 px-4">Cliente</th>
                <th className="text-left py-3 px-4">Mês Ref.</th>
                <th className="text-left py-3 px-4">Valor</th>
                <th className="text-left py-3 px-4">Vencimento</th>
                <th className="text-left py-3 px-4">Status</th>
                <th className="text-left py-3 px-4">Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredInvoices.map((invoice) => (
                <tr key={invoice.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 font-medium">{invoice.invoiceNumber}</td>
                  <td className="py-3 px-4">{invoice.clientName}</td>
                  <td className="py-3 px-4">{invoice.month}</td>
                  <td className="py-3 px-4">R$ {invoice.amount.toLocaleString('pt-BR')}</td>
                  <td className="py-3 px-4">{invoice.dueDate.toLocaleDateString('pt-BR')}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(invoice.status)}`}>
                      {getStatusText(invoice.status)}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleDownloadInvoice(invoice)}
                        className="text-gray-600 hover:text-blue-600"
                        title="Download"
                      >
                        <Download size={18} />
                      </button>
                      <button
                        onClick={() => handleSendInvoice(invoice)}
                        className="text-gray-600 hover:text-green-600"
                        title="Enviar"
                      >
                        <Send size={18} />
                      </button>
                      {invoice.status !== "paid" && (
                        <button
                          onClick={() => handleMarkAsPaid(invoice.id)}
                          className="text-gray-600 hover:text-green-600"
                          title="Marcar como pago"
                        >
                          <CheckCircle size={18} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}