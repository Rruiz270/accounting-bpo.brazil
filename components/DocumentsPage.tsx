"use client";

import { useState } from "react";
import { Upload, Download, FileText, Folder, Search, Eye, Trash2 } from "lucide-react";

interface Document {
  id: string;
  name: string;
  clientName: string;
  category: string;
  uploadDate: Date;
  size: string;
  type: string;
}

const documentCategories = [
  "Notas Fiscais",
  "Contratos",
  "Folha de Pagamento",
  "Certidões",
  "Declarações",
  "Balanços",
  "DRE",
  "Livros Fiscais",
  "Comprovantes",
  "Outros"
];

const initialDocuments: Document[] = [
  {
    id: "1",
    name: "NF-e 2024-001234.xml",
    clientName: "Tech Solutions Ltda",
    category: "Notas Fiscais",
    uploadDate: new Date("2024-06-15"),
    size: "125 KB",
    type: "XML"
  },
  {
    id: "2",
    name: "Contrato_Prestacao_Servicos.pdf",
    clientName: "Comércio ABC",
    category: "Contratos",
    uploadDate: new Date("2024-06-10"),
    size: "2.3 MB",
    type: "PDF"
  },
  {
    id: "3",
    name: "Folha_Pagamento_Junho_2024.pdf",
    clientName: "Consultoria XYZ",
    category: "Folha de Pagamento",
    uploadDate: new Date("2024-06-30"),
    size: "456 KB",
    type: "PDF"
  }
];

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<Document[]>(initialDocuments);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedClient, setSelectedClient] = useState("all");

  const handleUpload = () => {
    alert("Funcionalidade de upload será implementada com backend");
  };

  const handleDownload = (doc: Document) => {
    alert(`Download do arquivo: ${doc.name}`);
  };

  const handleView = (doc: Document) => {
    alert(`Visualizar arquivo: ${doc.name}`);
  };

  const handleDelete = (id: string) => {
    if (confirm("Tem certeza que deseja excluir este documento?")) {
      setDocuments(documents.filter(d => d.id !== id));
    }
  };

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.clientName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || doc.category === selectedCategory;
    const matchesClient = selectedClient === "all" || doc.clientName === selectedClient;
    
    return matchesSearch && matchesCategory && matchesClient;
  });

  const uniqueClients = [...new Set(documents.map(d => d.clientName))];

  return (
    <div className="p-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Documentos</h1>
        <p className="text-gray-600 mt-1">Gerencie todos os documentos dos seus clientes</p>
      </header>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex flex-col lg:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Buscar documentos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Todas as categorias</option>
            {documentCategories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>

          <select
            value={selectedClient}
            onChange={(e) => setSelectedClient(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Todos os clientes</option>
            {uniqueClients.map(client => (
              <option key={client} value={client}>{client}</option>
            ))}
          </select>

          <button
            onClick={handleUpload}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Upload size={20} />
            Upload
          </button>
        </div>

        <div className="grid gap-4">
          {filteredDocuments.map((doc) => (
            <div
              key={doc.id}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <FileText className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">{doc.name}</h3>
                  <p className="text-sm text-gray-600">
                    {doc.clientName} • {doc.category} • {doc.size}
                  </p>
                  <p className="text-xs text-gray-500">
                    Enviado em {doc.uploadDate.toLocaleDateString('pt-BR')}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleView(doc)}
                  className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  title="Visualizar"
                >
                  <Eye size={20} />
                </button>
                <button
                  onClick={() => handleDownload(doc)}
                  className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                  title="Download"
                >
                  <Download size={20} />
                </button>
                <button
                  onClick={() => handleDelete(doc.id)}
                  className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Excluir"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredDocuments.length === 0 && (
          <div className="text-center py-12">
            <Folder className="h-12 w-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-500">Nenhum documento encontrado</p>
          </div>
        )}
      </div>
    </div>
  );
}