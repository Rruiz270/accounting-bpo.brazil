"use client";

import { useState } from "react";
import { Plus, Search, Edit, Trash2 } from "lucide-react";

interface Client {
  id: string;
  name: string;
  cnpj: string;
  taxRegime: string;
  email: string;
  phone: string;
  monthlyFee: number;
  status: "active" | "inactive";
}

const initialClients: Client[] = [
  {
    id: "1",
    name: "Tech Solutions Ltda",
    cnpj: "12.345.678/0001-90",
    taxRegime: "Lucro Presumido",
    email: "contato@techsolutions.com.br",
    phone: "(11) 98765-4321",
    monthlyFee: 1200,
    status: "active"
  },
  {
    id: "2",
    name: "Comércio ABC",
    cnpj: "23.456.789/0001-01",
    taxRegime: "Simples Nacional",
    email: "financeiro@comercioabc.com.br",
    phone: "(11) 91234-5678",
    monthlyFee: 800,
    status: "active"
  },
  {
    id: "3",
    name: "Consultoria XYZ",
    cnpj: "34.567.890/0001-12",
    taxRegime: "Lucro Presumido",
    email: "admin@consultoriaxyz.com.br",
    phone: "(11) 99876-5432",
    monthlyFee: 1500,
    status: "active"
  }
];

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>(initialClients);
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [formData, setFormData] = useState<Partial<Client>>({
    name: "",
    cnpj: "",
    taxRegime: "Lucro Presumido",
    email: "",
    phone: "",
    monthlyFee: 0,
    status: "active"
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingClient) {
      setClients(clients.map(c => 
        c.id === editingClient.id ? { ...c, ...formData } : c
      ));
    } else {
      const newClient: Client = {
        id: Date.now().toString(),
        name: formData.name!,
        cnpj: formData.cnpj!,
        taxRegime: formData.taxRegime!,
        email: formData.email!,
        phone: formData.phone!,
        monthlyFee: formData.monthlyFee!,
        status: formData.status as "active" | "inactive"
      };
      setClients([...clients, newClient]);
    }
    resetForm();
  };

  const resetForm = () => {
    setShowForm(false);
    setEditingClient(null);
    setFormData({
      name: "",
      cnpj: "",
      taxRegime: "Lucro Presumido",
      email: "",
      phone: "",
      monthlyFee: 0,
      status: "active"
    });
  };

  const handleEdit = (client: Client) => {
    setEditingClient(client);
    setFormData(client);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Tem certeza que deseja excluir este cliente?")) {
      setClients(clients.filter(c => c.id !== id));
    }
  };

  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.cnpj.includes(searchTerm)
  );

  return (
    <div className="p-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Clientes</h1>
        <p className="text-gray-600 mt-1">Gerencie sua carteira de clientes</p>
      </header>

      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4 justify-between mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Buscar por nome ou CNPJ..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus size={20} />
            Novo Cliente
          </button>
        </div>

        {showForm && (
          <form onSubmit={handleSubmit} className="mb-6 p-4 bg-gray-50 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Nome da empresa"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <input
                type="text"
                placeholder="CNPJ"
                value={formData.cnpj}
                onChange={(e) => setFormData({ ...formData, cnpj: e.target.value })}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <select
                value={formData.taxRegime}
                onChange={(e) => setFormData({ ...formData, taxRegime: e.target.value })}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Simples Nacional">Simples Nacional</option>
                <option value="Lucro Presumido">Lucro Presumido</option>
                <option value="Lucro Real">Lucro Real</option>
                <option value="MEI">MEI</option>
              </select>
              <input
                type="email"
                placeholder="E-mail"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <input
                type="tel"
                placeholder="Telefone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <input
                type="number"
                placeholder="Honorário mensal"
                value={formData.monthlyFee}
                onChange={(e) => setFormData({ ...formData, monthlyFee: Number(e.target.value) })}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div className="flex gap-2 mt-4">
              <button
                type="submit"
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                {editingClient ? "Atualizar" : "Adicionar"}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                Cancelar
              </button>
            </div>
          </form>
        )}

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4">Nome</th>
                <th className="text-left py-3 px-4">CNPJ</th>
                <th className="text-left py-3 px-4">Regime</th>
                <th className="text-left py-3 px-4">E-mail</th>
                <th className="text-left py-3 px-4">Telefone</th>
                <th className="text-left py-3 px-4">Honorário</th>
                <th className="text-left py-3 px-4">Status</th>
                <th className="text-left py-3 px-4">Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredClients.map((client) => (
                <tr key={client.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 font-medium">{client.name}</td>
                  <td className="py-3 px-4">{client.cnpj}</td>
                  <td className="py-3 px-4">{client.taxRegime}</td>
                  <td className="py-3 px-4">{client.email}</td>
                  <td className="py-3 px-4">{client.phone}</td>
                  <td className="py-3 px-4">R$ {client.monthlyFee.toLocaleString('pt-BR')}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      client.status === 'active' 
                        ? 'bg-green-100 text-green-600' 
                        : 'bg-red-100 text-red-600'
                    }`}>
                      {client.status === 'active' ? 'Ativo' : 'Inativo'}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(client)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(client.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 size={18} />
                      </button>
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