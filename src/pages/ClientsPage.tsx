import { useState, useRef, useEffect } from 'react';
import { Search, Plus, ChevronDown, MapPin, Phone, Calendar, Edit, Trash2, Eye, User, Building2, Tag, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router';
import { AddClientModal } from '../components/AddClientModal';

interface Client {
  id: string;
  name: string;
  company: string;
  servicePlan: string;
  tags: string[];
  totalJobs: number;
  address: string;
  phone: string;
  email: string;
  created: string;
}

// Mock data for clients
const mockClients: Client[] = [
  {
    id: 'C-101',
    name: 'Michael Roberts',
    company: 'Roberts Construction',
    servicePlan: 'Premium Maintenance',
    tags: ['VIP', 'Commercial'],
    totalJobs: 12,
    address: '123 Main St, Anytown, USA',
    phone: '(555) 123-4567',
    email: 'michael@robertsconstruction.com',
    created: '2024-01-15',
  },
  {
    id: 'C-102',
    name: 'Sarah Martinez',
    company: '',
    servicePlan: '',
    tags: ['Residential'],
    totalJobs: 3,
    address: '456 Elm St, Othertown, USA',
    phone: '(555) 987-6543',
    email: 'sarah.martinez@email.com',
    created: '2024-02-20',
  },
  {
    id: 'C-103',
    name: 'David Chen',
    company: 'Chen Industries',
    servicePlan: 'Basic Service',
    tags: ['Commercial', 'Regular'],
    totalJobs: 8,
    address: '789 Oak St, Thirtown, USA',
    phone: '(555) 456-7890',
    email: 'david@chenindustries.com',
    created: '2024-01-10',
  },
  {
    id: 'C-104',
    name: 'Jennifer Wilson',
    company: '',
    servicePlan: '',
    tags: ['Residential', 'New'],
    totalJobs: 1,
    address: '101 Pine St, Fourtown, USA',
    phone: '(555) 321-6547',
    email: 'jennifer.wilson@email.com',
    created: '2024-03-05',
  },
  {
    id: 'C-105',
    name: 'Robert Thompson',
    company: 'Thompson Enterprises',
    servicePlan: 'Premium Maintenance',
    tags: ['VIP', 'Commercial'],
    totalJobs: 15,
    address: '202 Maple St, Fivetown, USA',
    phone: '(555) 654-3210',
    email: 'robert@thompsonent.com',
    created: '2023-12-01',
  },
  {
    id: 'C-106',
    name: 'Amanda Lee',
    company: '',
    servicePlan: 'Basic Service',
    tags: ['Residential'],
    totalJobs: 5,
    address: '303 Birch St, Sixtown, USA',
    phone: '(555) 111-2222',
    email: 'amanda.lee@email.com',
    created: '2024-02-14',
  },
  {
    id: 'C-107',
    name: 'James Patterson',
    company: 'Patterson Holdings',
    servicePlan: '',
    tags: ['Commercial'],
    totalJobs: 2,
    address: '404 Cedar St, Seventown, USA',
    phone: '(555) 222-3333',
    email: 'james@pattersonholdings.com',
    created: '2024-03-10',
  },
  {
    id: 'C-108',
    name: 'Emily Davis',
    company: '',
    servicePlan: 'Premium Maintenance',
    tags: ['Residential', 'VIP'],
    totalJobs: 9,
    address: '505 Walnut St, Eighttown, USA',
    phone: '(555) 333-4444',
    email: 'emily.davis@email.com',
    created: '2024-01-25',
  },
  {
    id: 'C-109',
    name: 'Christopher Moore',
    company: 'Moore Solutions',
    servicePlan: 'Basic Service',
    tags: ['Commercial', 'Regular'],
    totalJobs: 6,
    address: '606 Spruce St, Ninetown, USA',
    phone: '(555) 444-5555',
    email: 'chris@mooresolutions.com',
    created: '2024-02-01',
  },
  {
    id: 'C-110',
    name: 'Lisa Anderson',
    company: '',
    servicePlan: '',
    tags: ['Residential', 'New'],
    totalJobs: 1,
    address: '707 Ash St, Tentown, USA',
    phone: '(555) 555-6666',
    email: 'lisa.anderson@email.com',
    created: '2024-03-15',
  },
  {
    id: 'C-111',
    name: 'Daniel Brown',
    company: 'Brown & Associates',
    servicePlan: 'Premium Maintenance',
    tags: ['Commercial', 'VIP'],
    totalJobs: 11,
    address: '808 Poplar St, Eleventown, USA',
    phone: '(555) 666-7777',
    email: 'daniel@brownassociates.com',
    created: '2024-01-05',
  },
];

export function ClientsPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [clients, setClients] = useState<Client[]>(mockClients);
  const [isAddClientModalOpen, setIsAddClientModalOpen] = useState(false);
  const [isManageDropdownOpen, setIsManageDropdownOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isTagDropdownOpen, setIsTagDropdownOpen] = useState(false);
  const tagDropdownRef = useRef<HTMLDivElement>(null);

  // Close tag dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (tagDropdownRef.current && !tagDropdownRef.current.contains(event.target as Node)) {
        setIsTagDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Get all unique tags from clients
  const allTags = Array.from(new Set(clients.flatMap(client => client.tags))).sort();

  // Toggle tag selection
  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  // Remove a specific tag
  const removeTag = (tag: string) => {
    setSelectedTags(selectedTags.filter(t => t !== tag));
  };

  // Calculate metrics
  const totalClients = clients.length;
  const clientsWithServicePlans = clients.filter((c) => c.servicePlan).length;
  const totalJobsCount = clients.reduce((sum, c) => sum + c.totalJobs, 0);
  const avgJobsPerClient = totalClients > 0 ? (totalJobsCount / totalClients).toFixed(1) : '0.0';

  // Filter clients based on search
  const filteredClients = clients.filter((client) => {
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch = 
      client.name.toLowerCase().includes(searchLower) ||
      client.company.toLowerCase().includes(searchLower) ||
      client.id.toLowerCase().includes(searchLower) ||
      client.email.toLowerCase().includes(searchLower) ||
      client.tags.some((tag) => tag.toLowerCase().includes(searchLower));
    
    const matchesTag = selectedTags.length === 0 || client.tags.some(tag => selectedTags.includes(tag));
    
    return matchesSearch && matchesTag;
  });

  // Pagination
  const totalPages = Math.ceil(filteredClients.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentClients = filteredClients.slice(startIndex, endIndex);

  const handleDeleteClient = (clientId: string) => {
    if (confirm('Are you sure you want to delete this client?')) {
      setClients(clients.filter((c) => c.id !== clientId));
    }
  };

  const handleAddClient = (clientData: {
    name: string;
    company: string;
    servicePlan: string;
    tags: string[];
    address: string;
    phone: string;
    email: string;
  }) => {
    const newClient: Client = {
      id: `CL-${1000 + clients.length + 1}`,
      name: clientData.name,
      company: clientData.company,
      servicePlan: clientData.servicePlan,
      tags: clientData.tags,
      address: clientData.address,
      phone: clientData.phone,
      email: clientData.email,
      totalJobs: 0,
      created: new Date().toISOString().split('T')[0],
    };
    setClients([newClient, ...clients]);
    setIsAddClientModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      {/* Search Bar and Action Buttons */}
      <div
        className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 mb-6 md:mb-8 bg-white rounded-[20px] border border-[#e2e8f0] p-4 md:p-6"
        style={{ boxShadow: 'rgba(226, 232, 240, 0.5) 0px 2px 16px 2px' }}
      >
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 md:gap-4 flex-1">
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search clients..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-[180px] h-[44px] pl-10 pr-4 border border-[#e8e8e8] rounded-[15px] focus:outline-none focus:ring-2 focus:ring-blue-500 text-[#051046] bg-white"
              />
            </div>

            {/* Search by tags */}
            <div className="relative" ref={tagDropdownRef}>
              <button
                onClick={() => setIsTagDropdownOpen(!isTagDropdownOpen)}
                className="w-[180px] h-[44px] px-4 border border-[#e8e8e8] rounded-[15px] text-sm focus:outline-none focus:ring-2 focus:ring-purple-600 hover:bg-gray-50 transition-colors text-left"
              >
                {selectedTags.length > 0 ? (
                  <div className="flex flex-wrap gap-1">
                    {selectedTags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center gap-1 px-2 py-0.5 bg-gray-200 text-gray-700 text-xs rounded"
                      >
                        <X
                          className="w-3 h-3 cursor-pointer hover:text-red-500"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeTag(tag);
                          }}
                        />
                        {tag}
                      </span>
                    ))}
                  </div>
                ) : (
                  <span className="text-gray-400">Search by tags</span>
                )}
              </button>

              {/* Tag Dropdown */}
              {isTagDropdownOpen && (
                <div className="absolute top-full left-0 mt-2 z-50 bg-white border border-[#e2e8f0] rounded-[20px] shadow-lg min-w-[200px]" style={{ boxShadow: 'rgba(226, 232, 240, 0.5) 0px 2px 16px 2px' }}>
                  <div className="p-3 border-b border-gray-100">
                    <div className="text-xs font-semibold text-gray-500 uppercase mb-2">Available Tags</div>
                  </div>
                  <div className="max-h-60 overflow-y-auto p-2">
                    {allTags.length === 0 ? (
                      <div className="px-3 py-2 text-sm text-gray-400">No tags available</div>
                    ) : (
                      allTags.map(tag => (
                        <label
                          key={tag}
                          className="flex items-center gap-2 px-3 py-2 hover:bg-gray-50 rounded-[10px] cursor-pointer transition-colors"
                        >
                          <input
                            type="checkbox"
                            checked={selectedTags.includes(tag)}
                            onChange={() => toggleTag(tag)}
                            className="rounded border-gray-300 text-[#8b5cf6] focus:ring-[#8b5cf6]"
                          />
                          <span className="text-sm text-[#051046]">{tag}</span>
                        </label>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-3 ml-auto">
            {/* Manage Clients Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsManageDropdownOpen(!isManageDropdownOpen)}
                className="w-full sm:w-auto px-6 py-2.5 bg-white border border-[#e8e8e8] text-[#051046] rounded-[32px] hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
              >
                Manage Clients
                <ChevronDown className="w-4 h-4" />
              </button>

              {isManageDropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setIsManageDropdownOpen(false)}
                  />
                  <div
                    className="absolute top-full right-0 mt-2 w-48 bg-white border border-[#e2e8f0] rounded-[15px] shadow-lg z-20 overflow-hidden"
                    style={{ boxShadow: 'rgba(226, 232, 240, 0.5) 0px 2px 16px 2px' }}
                  >
                    <button className="w-full px-4 py-3 text-left text-sm text-[#051046] hover:bg-gray-50 transition-colors border-b border-[#e2e8f0]">
                      Import Clients
                    </button>
                    <button className="w-full px-4 py-3 text-left text-sm text-[#051046] hover:bg-gray-50 transition-colors">
                      Export Clients
                    </button>
                  </div>
                </>
              )}
            </div>

            <button
              className="w-[160px] bg-[#9473ff] hover:bg-[#7f5fd9] text-white rounded-[32px] flex items-center justify-center gap-2 text-[16px] px-[24px] py-[10px] transition-colors"
              onClick={() => setIsAddClientModalOpen(true)}
            >
              <Plus className="w-5 h-5" />
              Add Client
            </button>
          </div>
        </div>
      </div>

      {/* Clients Table */}
      <div
        className="bg-white rounded-[20px] border border-[#e2e8f0] overflow-hidden"
        style={{ boxShadow: 'rgba(226, 232, 240, 0.5) 0px 2px 16px 2px' }}
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-[#e2e8f0]">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Service Plan
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Tags
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Company
                </th>
                <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Total Jobs
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Contact Info
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Created
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e2e8f0]">
              {currentClients.map((client) => (
                <tr
                  key={client.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  {/* ID Column */}
                  <td className="px-6 py-4">
                    <p className="text-sm font-medium text-[#051046]">{client.id}</p>
                  </td>

                  {/* Service Plan Column */}
                  <td className="px-4 md:px-6 py-3 md:py-4 whitespace-nowrap">
                    {client.servicePlan ? (
                      <span
                        className="px-2 py-0.5 bg-gray-200 text-xs"
                        style={{ borderRadius: '0.25rem', color: '#051046' }}
                      >
                        {client.servicePlan}
                      </span>
                    ) : (
                      <span className="text-xs text-gray-400">—</span>
                    )}
                  </td>

                  {/* Tags Column */}
                  <td className="px-6 py-4">
                    {client.tags.length > 0 ? (
                      <div className="flex gap-1 flex-wrap">
                        {client.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="px-2 py-0.5 bg-gray-200 text-xs rounded"
                            style={{ color: '#051046' }}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span className="text-xs text-gray-400">—</span>
                    )}
                  </td>

                  {/* Name Column */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div>
                        <button
                          onClick={() => navigate(`${location.pathname.startsWith('/staff') ? '/staff' : '/admin'}/clients/${client.id}`)}
                          className="font-medium hover:underline cursor-pointer text-left"
                          style={{ color: '#9473ff' }}
                        >
                          {client.name}
                        </button>
                        <p className="text-sm" style={{ color: '#6a7282' }}>{client.email}</p>
                      </div>
                    </div>
                  </td>

                  {/* Company Column */}
                  <td className="px-6 py-4">
                    {client.company ? (
                      <div className="flex items-center gap-2">
                        <p className="text-sm text-[#051046]">{client.company}</p>
                      </div>
                    ) : (
                      <span className="text-sm text-gray-400">—</span>
                    )}
                  </td>

                  {/* Total Jobs Column */}
                  <td className="px-6 py-4 text-center">
                    <p className="text-sm font-semibold text-[#051046]">{client.totalJobs}</p>
                  </td>

                  {/* Contact Info Column */}
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-gray-400" />
                        <p className="text-sm text-[#051046]">{client.phone}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        <p className="text-sm text-[#051046] max-w-[200px] truncate">{client.address}</p>
                      </div>
                    </div>
                  </td>

                  {/* Created Column */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <p className="text-sm text-[#051046]">
                        {new Date(client.created).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </p>
                    </div>
                  </td>

                  {/* Actions Column */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        className="p-2 hover:bg-blue-50 rounded-lg transition-colors group cursor-pointer"
                        title="View Client Details"
                        onClick={() => navigate(`${location.pathname.startsWith('/staff') ? '/staff' : '/admin'}/clients/${client.id}`)}
                      >
                        <User className="w-4 h-4" style={{ color: '#9473ff' }} />
                      </button>
                      <button
                        type="button"
                        className="p-2 hover:bg-red-50 rounded-lg transition-colors group"
                        title="Delete Client"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteClient(client.id);
                        }}
                      >
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="border-t border-[#e2e8f0] px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-600">
              Showing {startIndex + 1} to {Math.min(endIndex, filteredClients.length)} of {filteredClients.length} entries
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-[#051046]">Rows per page:</span>
              <select
                value={itemsPerPage}
                onChange={(e) => {
                  setItemsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="px-3 py-1.5 border border-[#e8e8e8] rounded-[15px] text-sm text-[#051046] focus:outline-none focus:ring-2 focus:ring-purple-600"
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-[10px] border border-[#e2e8f0] text-[#051046] hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            
            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }
                
                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`w-8 h-8 rounded-[10px] text-sm font-medium transition-colors ${
                      currentPage === pageNum
                        ? 'bg-[#9473ff] text-white'
                        : 'border border-[#e2e8f0] text-[#051046] hover:bg-gray-50'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="p-2 rounded-[10px] border border-[#e2e8f0] text-[#051046] hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Add Client Modal */}
      <AddClientModal
        isOpen={isAddClientModalOpen}
        onClose={() => setIsAddClientModalOpen(false)}
        onAddClient={handleAddClient}
      />
    </div>
  );
}
