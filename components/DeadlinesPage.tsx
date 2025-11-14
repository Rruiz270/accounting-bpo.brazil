"use client";

import { useState } from "react";
import { Calendar, AlertTriangle, CheckCircle, Clock } from "lucide-react";
import { format, addDays, isBefore } from "date-fns";
import { ptBR } from "date-fns/locale";

interface Deadline {
  id: string;
  clientName: string;
  obligation: string;
  dueDate: Date;
  status: "pending" | "completed" | "overdue";
  description: string;
}

const brazilianObligations = [
  "DAS - Documento de Arrecadação do Simples Nacional",
  "DCTF - Declaração de Débitos e Créditos Tributários Federais",
  "SPED Fiscal - Sistema Público de Escrituração Digital",
  "SPED Contábil",
  "EFD-Contribuições",
  "EFD-Reinf",
  "eSocial",
  "DIRF - Declaração do Imposto de Renda Retido na Fonte",
  "ECF - Escrituração Contábil Fiscal",
  "DARF - Documento de Arrecadação de Receitas Federais",
  "GPS - Guia da Previdência Social",
  "FGTS - Fundo de Garantia do Tempo de Serviço",
  "IRPJ - Imposto de Renda Pessoa Jurídica",
  "CSLL - Contribuição Social sobre o Lucro Líquido",
  "PIS/COFINS",
  "ISS - Imposto Sobre Serviços",
  "ICMS - Imposto sobre Circulação de Mercadorias e Serviços"
];

const initialDeadlines: Deadline[] = [
  {
    id: "1",
    clientName: "Tech Solutions Ltda",
    obligation: "DCTF",
    dueDate: addDays(new Date(), 5),
    status: "pending",
    description: "Declaração mensal de tributos federais"
  },
  {
    id: "2",
    clientName: "Comércio ABC",
    obligation: "DAS",
    dueDate: addDays(new Date(), 10),
    status: "pending",
    description: "Pagamento mensal do Simples Nacional"
  },
  {
    id: "3",
    clientName: "Consultoria XYZ",
    obligation: "SPED Fiscal",
    dueDate: addDays(new Date(), 15),
    status: "pending",
    description: "Escrituração fiscal digital"
  },
  {
    id: "4",
    clientName: "Indústria 123",
    obligation: "eSocial",
    dueDate: addDays(new Date(), -2),
    status: "overdue",
    description: "Folha de pagamento digital"
  }
];

export default function DeadlinesPage() {
  const [deadlines, setDeadlines] = useState<Deadline[]>(initialDeadlines);
  const [filter, setFilter] = useState<"all" | "pending" | "overdue" | "completed">("all");
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    clientName: "",
    obligation: "",
    dueDate: "",
    description: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newDeadline: Deadline = {
      id: Date.now().toString(),
      clientName: formData.clientName,
      obligation: formData.obligation,
      dueDate: new Date(formData.dueDate),
      status: "pending",
      description: formData.description
    };
    setDeadlines([...deadlines, newDeadline]);
    setFormData({ clientName: "", obligation: "", dueDate: "", description: "" });
    setShowForm(false);
  };

  const handleComplete = (id: string) => {
    setDeadlines(deadlines.map(d => 
      d.id === id ? { ...d, status: "completed" as const } : d
    ));
  };


  const filteredDeadlines = deadlines.filter(d => {
    if (filter === "all") return true;
    return d.status === filter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "text-green-600 bg-green-100";
      case "overdue": return "text-red-600 bg-red-100";
      default: return "text-yellow-600 bg-yellow-100";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed": return <CheckCircle size={16} />;
      case "overdue": return <AlertTriangle size={16} />;
      default: return <Clock size={16} />;
    }
  };

  return (
    <div className="p-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Prazos e Obrigações</h1>
        <p className="text-gray-600 mt-1">Acompanhe todos os prazos fiscais e tributários</p>
      </header>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex flex-col md:flex-row gap-4 justify-between mb-6">
          <div className="flex gap-2">
            {(["all", "pending", "overdue", "completed"] as const).map((filterOption) => (
              <button
                key={filterOption}
                onClick={() => setFilter(filterOption)}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  filter === filterOption
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {filterOption === "all" ? "Todos" :
                 filterOption === "pending" ? "Pendentes" :
                 filterOption === "overdue" ? "Vencidos" : "Concluídos"}
              </button>
            ))}
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Calendar size={20} />
            Nova Obrigação
          </button>
        </div>

        {showForm && (
          <form onSubmit={handleSubmit} className="mb-6 p-4 bg-gray-50 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Nome do cliente"
                value={formData.clientName}
                onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <select
                value={formData.obligation}
                onChange={(e) => setFormData({ ...formData, obligation: e.target.value })}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Selecione a obrigação</option>
                {brazilianObligations.map((obligation) => (
                  <option key={obligation} value={obligation.split(" - ")[0]}>
                    {obligation}
                  </option>
                ))}
              </select>
              <input
                type="date"
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <input
                type="text"
                placeholder="Descrição"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex gap-2 mt-4">
              <button
                type="submit"
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Adicionar
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                Cancelar
              </button>
            </div>
          </form>
        )}

        <div className="grid gap-4">
          {filteredDeadlines.map((deadline) => (
            <div
              key={deadline.id}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <h3 className="font-semibold text-gray-800">{deadline.clientName}</h3>
                  <span className={`flex items-center gap-1 px-2 py-1 text-xs rounded-full ${getStatusColor(deadline.status)}`}>
                    {getStatusIcon(deadline.status)}
                    {deadline.status === "completed" ? "Concluído" :
                     deadline.status === "overdue" ? "Vencido" : "Pendente"}
                  </span>
                </div>
                <p className="text-gray-600">{deadline.obligation}</p>
                <p className="text-sm text-gray-500">{deadline.description}</p>
              </div>
              <div className="text-right">
                <p className="font-medium text-gray-800">
                  {format(deadline.dueDate, "dd/MM/yyyy", { locale: ptBR })}
                </p>
                {deadline.status !== "completed" && (
                  <button
                    onClick={() => handleComplete(deadline.id)}
                    className="mt-2 text-sm text-blue-600 hover:text-blue-800"
                  >
                    Marcar como concluído
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}