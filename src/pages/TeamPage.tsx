import { useState } from 'react';
import { Search, Edit2, Trash2, Plus, X, Info, User } from 'lucide-react';
import { useNavigate } from 'react-router';

interface TeamMember {
  id: string;
  fullName: string;
  email: string;
  joinDate: string;
  userType: string;
  isRegistered: boolean;
  firstName?: string;
  lastName?: string;
  phone?: string;
  address?: string;
  birthday?: string;
  permissions?: {
    addEditJobs: boolean;
    deleteJobs: boolean;
    cancelJobs: boolean;
    createEstimatesInvoices: boolean;
    addEditViewClients: boolean;
  };
}

export function TeamPage() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState('no-sorting');
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [showEditMemberModal, setShowEditMemberModal] = useState(false);
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);
  
  // Calculate days until birthday and age
  const getBirthdayInfo = (birthday?: string) => {
    if (!birthday) return null;
    
    const today = new Date();
    const [month, day, year] = birthday.split('/').map(Number);
    const birthDate = new Date(year, month - 1, day);
    const nextBirthday = new Date(today.getFullYear(), month - 1, day);
    
    // If birthday already passed this year, use next year
    if (nextBirthday < today) {
      nextBirthday.setFullYear(today.getFullYear() + 1);
    }
    
    // Calculate days until birthday
    const daysUntil = Math.ceil((nextBirthday.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    
    // Calculate age they'll turn
    const age = nextBirthday.getFullYear() - birthDate.getFullYear();
    
    // Format birthday display - full date (e.g., "January 15, 1990")
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const birthdayDisplay = `${monthNames[month - 1]} ${day}, ${year}`;
    
    return { daysUntil, age, birthdayDisplay };
  };

  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([
    {
      id: '1',
      fullName: 'Mike Bailey',
      firstName: 'Mike',
      lastName: 'Bailey',
      email: 'mikebobaile@yolx@gmail.com',
      phone: '+1 234 567 8900',
      address: '123 Main St, City, State',
      joinDate: 'Feb 13, 2025',
      userType: 'Staff',
      birthday: '01/15/1990',
      isRegistered: true,
      permissions: {
        addEditJobs: true,
        deleteJobs: false,
        cancelJobs: true,
        createEstimatesInvoices: false,
        addEditViewClients: true,
      }
    },
    {
      id: '2',
      fullName: 'Miche Oper',
      firstName: 'Miche',
      lastName: 'Oper',
      email: 'tachemail2ive@email.com',
      phone: '+1 234 567 8901',
      address: '456 Oak Ave, City, State',
      joinDate: 'Jan 25, 2025',
      userType: 'Staff',
      birthday: '03/20/1985',
      isRegistered: false,
      permissions: {
        addEditJobs: false,
        deleteJobs: false,
        cancelJobs: false,
        createEstimatesInvoices: false,
        addEditViewClients: false,
      }
    },
  ]);

  const handleResendEmail = (memberId: string) => {
    console.log('Resend email to:', memberId);
  };

  const handleViewDetails = (memberId: string) => {
    setSelectedMemberId(memberId);
    setShowDetailsModal(true);
  };

  const handleEditMember = (memberId: string) => {
    setSelectedMemberId(memberId);
    setShowEditMemberModal(true);
  };

  const handleDeleteClick = (memberId: string) => {
    setSelectedMemberId(memberId);
    setShowDeleteConfirmModal(true);
  };

  const handleConfirmDelete = () => {
    if (selectedMemberId) {
      setTeamMembers(prev => prev.filter(member => member.id !== selectedMemberId));
      console.log('Deleted member:', selectedMemberId);
    }
    setShowDeleteConfirmModal(false);
    setSelectedMemberId(null);
  };

  const selectedMember = teamMembers.find(m => m.id === selectedMemberId);

  return (
    <div className="p-4 md:p-8">
      <div className="bg-white rounded-[20px] border border-[#e2e8f0] p-4 md:p-6" style={{ boxShadow: 'rgba(226, 232, 240, 0.5) 0px 2px 16px 2px' }}>
        {/* Search and Filter Bar */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          {/* Search Input */}
          <div className="relative w-full md:w-[180px]">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-[#e8e8e8] rounded-[15px] focus:outline-none focus:border-[#9473ff] transition-colors"
              style={{ color: '#051046' }}
            />
          </div>

          {/* Sort Dropdown */}
          <div className="w-full md:w-48">
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="w-full px-4 py-2.5 border border-[#e8e8e8] rounded-[15px] focus:outline-none focus:border-[#9473ff] transition-colors"
              style={{ color: '#051046' }}
            >
              <option value="no-sorting">No sorting</option>
              <option value="name-asc">Name (A-Z)</option>
              <option value="name-desc">Name (Z-A)</option>
              <option value="date-newest">Newest First</option>
              <option value="date-oldest">Oldest First</option>
            </select>
          </div>

          {/* Add Member Button */}
          <button
            onClick={() => setShowAddMemberModal(true)}
            className="flex items-center justify-center gap-2 px-6 py-2.5 text-white rounded-[32px] transition-all whitespace-nowrap font-medium hover:shadow-lg md:ml-auto"
            style={{ backgroundColor: '#9473ff' }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#7f5fd9'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#9473ff'}
          >
            <Plus className="w-4 h-4" />
            <span className="text-[#e5e8f8] text-[#e6e9f9] text-[#eaedfb] text-[#eef0fe] text-[#f9faff] text-[#ffffff] text-[#ffffff] text-[#ffffff] text-[#ffffff] text-[#ffffff] text-[#ffffff] text-[#ffffff] text-[#ffffff] text-[#ffffff] text-[#ffffff] text-[#ffffff] text-[#ffffff] text-[#ffffff] text-[#ffffff] text-[#ffffff] text-[#ffffff] text-[#ffffff] text-[#ffffff] text-[#ffffff] text-[#ffffff] text-[#ffffff] text-[#ffffff] text-[#ffffff] text-[#ffffff] text-[#ffffff] text-[#ffffff]">Add member</span>
          </button>
        </div>

        {/* Desktop Table View */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-xs font-medium text-[#6a7282] uppercase tracking-wider">Full Name</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-[#6a7282] uppercase tracking-wider">Email</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-[#6a7282] uppercase tracking-wider">Join Date</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-[#6a7282] uppercase tracking-wider">Birthday</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-[#6a7282] uppercase tracking-wider">User Type</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-[#6a7282] uppercase tracking-wider">Register Status</th>
                <th className="text-right py-3 px-4 text-xs font-medium text-[#6a7282] uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {teamMembers.map((member) => {
                const birthdayInfo = getBirthdayInfo(member.birthday);
                return (
                <tr 
                  key={member.id} 
                  className="border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer"
                  onClick={() => handleViewDetails(member.id)}
                >
                  <td className="py-4 px-4" style={{ color: '#051046' }}>{member.fullName}</td>
                  <td className="py-4 px-4" style={{ color: '#051046' }}>{member.email}</td>
                  <td className="py-4 px-4" style={{ color: '#051046' }}>{member.joinDate}</td>
                  <td className="py-4 px-4" style={{ color: '#051046' }}>
                    {birthdayInfo ? (
                      <div className="text-sm">
                        <div className="font-medium">{birthdayInfo.birthdayDisplay}</div>
                        <div className="text-xs text-gray-500 mt-0.5">Going to be {birthdayInfo.age} in {birthdayInfo.daysUntil} days</div>
                      </div>
                    ) : (
                      <span className="text-gray-400 text-sm">—</span>
                    )}
                  </td>
                  <td className="py-4 px-4" style={{ color: '#051046' }}>{member.userType}</td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: member.isRegistered ? '#10b981' : '#ef4444' }}
                      />
                      <span style={{ color: '#051046' }}>
                        {member.isRegistered ? 'Registered' : 'Not registered'}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center justify-end gap-3" onClick={(e) => e.stopPropagation()}>
                      {!member.isRegistered && (
                        <div className="relative inline-block">
                          <button
                            onClick={() => handleResendEmail(member.id)}
                            className="text-sm font-medium px-4 py-1.5 border rounded-[32px] transition-all flex items-center gap-2 group"
                            style={{ 
                              borderColor: '#e2e8f0', 
                              color: '#051046',
                              backgroundColor: '#ffffff'
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.backgroundColor = '#f8f9fa';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.backgroundColor = '#ffffff';
                            }}
                          >
                            <div className="relative">
                              <Info className="w-3.5 h-3.5 text-gray-500" />
                              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all pointer-events-none z-50">
                                Resend invitation email to this team member
                                <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-gray-900"></div>
                              </div>
                            </div>
                            <span>Resend Email</span>
                          </button>
                        </div>
                      )}
                      <button
                        onClick={() => navigate(`/admin/team/${member.id}`)}
                        className="text-gray-600 hover:text-gray-900 transition-colors"
                        title="View Profile"
                      >
                        <User className="w-4 h-4" style={{ color: '#8a8a8a' }} />
                      </button>
                      <button
                        onClick={() => handleEditMember(member.id)}
                        className="text-[#9473ff] hover:text-[#7f5fd9] transition-colors"
                        title="Edit"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(member.id)}
                        className="text-red-500 hover:text-red-700 transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              )})}
            </tbody>
          </table>
        </div>

        {/* Mobile/Tablet Card View */}
        <div className="lg:hidden space-y-4">
          {teamMembers.map((member) => {
            const birthdayInfo = getBirthdayInfo(member.birthday);
            return (
            <div
              key={member.id}
              className="bg-white border border-[#e2e8f0] rounded-[15px] p-4 cursor-pointer hover:shadow-md transition-shadow"
              style={{ boxShadow: 'rgba(226, 232, 240, 0.3) 0px 1px 8px 1px' }}
              onClick={() => handleViewDetails(member.id)}
            >
              {/* Name and Status */}
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold mb-1" style={{ color: '#051046' }}>{member.fullName}</h3>
                  <div className="flex items-center gap-2 mb-2">
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: member.isRegistered ? '#10b981' : '#ef4444' }}
                    />
                    <span className="text-sm" style={{ color: '#051046' }}>
                      {member.isRegistered ? 'Registered' : 'Not registered'}
                    </span>
                  </div>
                </div>
                <span className="text-sm px-2 py-1 bg-gray-100 rounded" style={{ color: '#051046' }}>
                  {member.userType}
                </span>
              </div>

              {/* Email */}
              <div className="mb-2">
                <span className="text-xs text-gray-500 uppercase">Email</span>
                <p className="text-sm" style={{ color: '#051046' }}>{member.email}</p>
              </div>

              {/* Join Date */}
              <div className="mb-2">
                <span className="text-xs text-gray-500 uppercase">Join Date</span>
                <p className="text-sm" style={{ color: '#051046' }}>{member.joinDate}</p>
              </div>

              {/* Birthday Info */}
              {birthdayInfo && (
                <div className="mb-4">
                  <span className="text-xs text-gray-500 uppercase">Birthday</span>
                  <div className="text-sm" style={{ color: '#051046' }}>
                    <div className="font-medium">{birthdayInfo.birthdayDisplay}</div>
                    <div className="text-xs text-gray-500 mt-0.5">Going to be {birthdayInfo.age} in {birthdayInfo.daysUntil} days</div>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center gap-3 pt-3 border-t border-gray-100" onClick={(e) => e.stopPropagation()}>
                {!member.isRegistered && (
                  <div className="relative inline-block">
                    <button
                      onClick={() => handleResendEmail(member.id)}
                      className="text-sm font-medium px-4 py-1.5 border rounded-[32px] transition-all flex items-center gap-2 group"
                      style={{ 
                        borderColor: '#e2e8f0', 
                        color: '#051046',
                        backgroundColor: '#ffffff'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#f8f9fa';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = '#ffffff';
                      }}
                    >
                      <div className="relative">
                        <Info className="w-3.5 h-3.5 text-gray-500" />
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all pointer-events-none z-50">
                          Resend invitation email to this team member
                          <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-gray-900"></div>
                        </div>
                      </div>
                      <span>Resend Email</span>
                    </button>
                  </div>
                )}
                <div className="flex items-center gap-3 ml-auto">
                  <button
                    onClick={() => handleEditMember(member.id)}
                    className="text-[#9473ff] hover:text-[#7f5fd9] transition-colors"
                    title="Edit"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteClick(member.id)}
                    className="text-red-500 hover:text-red-700 transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )})}
        </div>

        {/* Pagination */}
        <div className="mt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-600">
            Showing 1 to {teamMembers.length} of {teamMembers.length} entries
          </p>
          <div className="flex gap-2">
            <button
              className="w-8 h-8 flex items-center justify-center rounded-[10px] text-white transition-colors"
              style={{ backgroundColor: '#9473ff' }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#7f5fd9'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#9473ff'}
            >
              1
            </button>
          </div>
        </div>
      </div>

      {/* Add Member Modal */}
      {showAddMemberModal && (
        <AddMemberModal 
          onClose={() => setShowAddMemberModal(false)} 
          onSave={(newMember) => {
            const member: TeamMember = {
              id: String(teamMembers.length + 1),
              fullName: `${newMember.firstName} ${newMember.lastName}`,
              firstName: newMember.firstName,
              lastName: newMember.lastName,
              email: newMember.email,
              phone: newMember.phone,
              address: newMember.address,
              joinDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
              userType: newMember.role,
              birthday: newMember.birthday,
              isRegistered: false,
              permissions: newMember.permissions,
            };
            setTeamMembers(prev => [...prev, member]);
          }}
        />
      )}

      {/* Team Member Details Modal */}
      {showDetailsModal && selectedMember && (
        <TeamMemberDetailsModal
          member={selectedMember}
          onClose={() => {
            setShowDetailsModal(false);
            setSelectedMemberId(null);
          }}
          getBirthdayInfo={getBirthdayInfo}
        />
      )}

      {/* Edit Member Modal */}
      {showEditMemberModal && selectedMember && (
        <EditMemberModal 
          member={selectedMember}
          onClose={() => {
            setShowEditMemberModal(false);
            setSelectedMemberId(null);
          }}
          onSave={(updatedData) => {
            setTeamMembers(prev => prev.map(member => 
              member.id === selectedMemberId 
                ? {
                    ...member,
                    fullName: `${updatedData.firstName} ${updatedData.lastName}`,
                    firstName: updatedData.firstName,
                    lastName: updatedData.lastName,
                    email: updatedData.email,
                    phone: updatedData.phone,
                    address: updatedData.address,
                    userType: updatedData.role,
                    birthday: updatedData.birthday,
                    permissions: updatedData.permissions,
                  }
                : member
            ));
          }}
        />
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirmModal && selectedMember && (
        <DeleteConfirmModal
          memberName={selectedMember.fullName}
          onClose={() => {
            setShowDeleteConfirmModal(false);
            setSelectedMemberId(null);
          }}
          onConfirm={handleConfirmDelete}
        />
      )}
    </div>
  );
}

// Add Member Modal Component
interface AddMemberModalProps {
  onClose: () => void;
  onSave: (member: any) => void;
}

function AddMemberModal({ onClose, onSave }: AddMemberModalProps) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [role, setRole] = useState('');
  const [birthday, setBirthday] = useState('');
  const [permissions, setPermissions] = useState({
    addEditJobs: false,
    deleteJobs: false,
    cancelJobs: false,
    createEstimatesInvoices: false,
    addEditViewClients: false,
  });

  const handlePermissionChange = (key: keyof typeof permissions) => {
    setPermissions(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ firstName, lastName, email, phone, address, role, birthday, permissions });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div
        className="bg-white rounded-[20px] border border-[#e2e8f0] p-6 w-full max-w-md max-h-[90vh] overflow-y-auto"
        style={{ boxShadow: 'rgba(226, 232, 240, 0.5) 0px 2px 16px 2px' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold" style={{ color: '#051046' }}>Add team member</h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-[10px] transition-colors">
            <X className="w-5 h-5" style={{ color: '#051046' }} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* First Name */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2" style={{ color: '#051046' }}>
              First Name
            </label>
            <input
              type="text"
              placeholder="First name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
              className="w-full px-4 py-2.5 border border-[#e8e8e8] rounded-[15px] focus:outline-none focus:border-[#9473ff] transition-colors placeholder:text-gray-400"
              style={{ color: '#051046' }}
            />
          </div>

          {/* Last Name */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2" style={{ color: '#051046' }}>
              Last name
            </label>
            <input
              type="text"
              placeholder="Last name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
              className="w-full px-4 py-2.5 border border-[#e8e8e8] rounded-[15px] focus:outline-none focus:border-[#9473ff] transition-colors placeholder:text-gray-400"
              style={{ color: '#051046' }}
            />
          </div>

          {/* Email */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2" style={{ color: '#051046' }}>
              Email
            </label>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2.5 border border-[#e8e8e8] rounded-[15px] focus:outline-none focus:border-[#9473ff] transition-colors placeholder:text-gray-400"
              style={{ color: '#051046' }}
            />
          </div>

          {/* Phone */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2" style={{ color: '#051046' }}>
              Phone
            </label>
            <input
              type="tel"
              placeholder="Phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-4 py-2.5 border border-[#e8e8e8] rounded-[15px] focus:outline-none focus:border-[#9473ff] transition-colors placeholder:text-gray-400"
              style={{ color: '#051046' }}
            />
          </div>

          {/* Address */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2" style={{ color: '#051046' }}>
              Address
            </label>
            <input
              type="text"
              placeholder="Address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full px-4 py-2.5 border border-[#e8e8e8] rounded-[15px] focus:outline-none focus:border-[#9473ff] transition-colors placeholder:text-gray-400"
              style={{ color: '#051046' }}
            />
          </div>

          {/* Role */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2" style={{ color: '#051046' }}>
              Role
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              required
              className="w-full px-4 py-2.5 border border-[#e8e8e8] rounded-[15px] focus:outline-none focus:border-[#9473ff] transition-colors"
              style={{ color: role ? '#051046' : '#9ca3af' }}
            >
              <option value="">Role</option>
              <option value="Admin">Admin</option>
              <option value="Staff">Staff</option>
            </select>
          </div>

          {/* Birthday */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2" style={{ color: '#051046' }}>
              Birthday
            </label>
            <input
              type="text"
              placeholder="mm/dd/yyyy"
              value={birthday}
              onChange={(e) => setBirthday(e.target.value)}
              className="w-full px-4 py-2.5 border border-[#e8e8e8] rounded-[15px] focus:outline-none focus:border-[#9473ff] transition-colors placeholder:text-gray-400"
              style={{ color: '#051046' }}
            />
          </div>

          {/* Image Upload */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2" style={{ color: '#051046' }}>
              Image
            </label>
            <div className="flex items-center justify-center w-24 h-24 rounded-full border-2 border-dashed border-gray-300 cursor-pointer hover:border-[#9473ff] transition-colors">
              <span className="text-xs text-gray-400 text-center px-2">Click to upload<br />an image</span>
            </div>
          </div>

          {/* Admin Note */}
          {role === 'Admin' && (
            <div className="mb-6 p-4 rounded-[15px] bg-[#f8f9ff]" style={{ border: '1px solid #e2e8f0' }}>
              <p className="text-sm" style={{ color: '#051046' }}>
                Admins have full access to all permissions by default.
              </p>
            </div>
          )}

          {/* Permissions - Only show for Staff role */}
          {role === 'Staff' && (
            <div className="mb-6">
              <label className="block text-sm font-medium mb-3" style={{ color: '#051046' }}>
                Permissions
              </label>
              <div className="space-y-3">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={permissions.addEditJobs}
                    onChange={() => handlePermissionChange('addEditJobs')}
                    className="w-5 h-5 rounded border-gray-300 text-[#9473ff] focus:ring-[#9473ff]"
                    style={{ accentColor: '#9473ff' }}
                  />
                  <span className="text-sm" style={{ color: '#051046' }}>Add/edit jobs</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={permissions.deleteJobs}
                    onChange={() => handlePermissionChange('deleteJobs')}
                    className="w-5 h-5 rounded border-gray-300 text-[#9473ff] focus:ring-[#9473ff]"
                    style={{ accentColor: '#9473ff' }}
                  />
                  <span className="text-sm" style={{ color: '#051046' }}>Delete jobs</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={permissions.cancelJobs}
                    onChange={() => handlePermissionChange('cancelJobs')}
                    className="w-5 h-5 rounded border-gray-300 text-[#9473ff] focus:ring-[#9473ff]"
                    style={{ accentColor: '#9473ff' }}
                  />
                  <span className="text-sm" style={{ color: '#051046' }}>Cancel jobs</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={permissions.createEstimatesInvoices}
                    onChange={() => handlePermissionChange('createEstimatesInvoices')}
                    className="w-5 h-5 rounded border-gray-300 text-[#9473ff] focus:ring-[#9473ff]"
                    style={{ accentColor: '#9473ff' }}
                  />
                  <span className="text-sm" style={{ color: '#051046' }}>Create estimates/invoices</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={permissions.addEditViewClients}
                    onChange={() => handlePermissionChange('addEditViewClients')}
                    className="w-5 h-5 rounded border-gray-300 text-[#9473ff] focus:ring-[#9473ff]"
                    style={{ accentColor: '#9473ff' }}
                  />
                  <span className="text-sm" style={{ color: '#051046' }}>Add/edit/view clients</span>
                </label>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-[#e8e8e8] rounded-[32px] font-medium text-[#051046] hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 text-white rounded-[32px] font-medium transition-colors"
              style={{ backgroundColor: '#9473ff' }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#7f5fd9'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#9473ff'}
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Edit Member Modal Component
interface EditMemberModalProps {
  member: TeamMember;
  onClose: () => void;
  onSave: (member: any) => void;
}

function EditMemberModal({ member, onClose, onSave }: EditMemberModalProps) {
  const [firstName, setFirstName] = useState(member.firstName || '');
  const [lastName, setLastName] = useState(member.lastName || '');
  const [email, setEmail] = useState(member.email);
  const [phone, setPhone] = useState(member.phone || '');
  const [address, setAddress] = useState(member.address || '');
  const [role, setRole] = useState(member.userType);
  const [birthday, setBirthday] = useState(member.birthday || '');
  const [permissions, setPermissions] = useState(member.permissions || {
    addEditJobs: false,
    deleteJobs: false,
    cancelJobs: false,
    createEstimatesInvoices: false,
    addEditViewClients: false,
  });

  const handlePermissionChange = (key: keyof typeof permissions) => {
    setPermissions(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ firstName, lastName, email, phone, address, role, birthday, permissions });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div
        className="bg-white rounded-[20px] border border-[#e2e8f0] p-6 w-full max-w-md max-h-[90vh] overflow-y-auto"
        style={{ boxShadow: 'rgba(226, 232, 240, 0.5) 0px 2px 16px 2px' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold" style={{ color: '#051046' }}>Edit team member</h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-[10px] transition-colors">
            <X className="w-5 h-5" style={{ color: '#051046' }} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* First Name */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2" style={{ color: '#051046' }}>
              First Name
            </label>
            <input
              type="text"
              placeholder="First name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
              className="w-full px-4 py-2.5 border border-[#e8e8e8] rounded-[15px] focus:outline-none focus:border-[#9473ff] transition-colors placeholder:text-gray-400"
              style={{ color: '#051046' }}
            />
          </div>

          {/* Last Name */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2" style={{ color: '#051046' }}>
              Last name
            </label>
            <input
              type="text"
              placeholder="Last name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
              className="w-full px-4 py-2.5 border border-[#e8e8e8] rounded-[15px] focus:outline-none focus:border-[#9473ff] transition-colors placeholder:text-gray-400"
              style={{ color: '#051046' }}
            />
          </div>

          {/* Email */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2" style={{ color: '#051046' }}>
              Email
            </label>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2.5 border border-[#e8e8e8] rounded-[15px] focus:outline-none focus:border-[#9473ff] transition-colors placeholder:text-gray-400"
              style={{ color: '#051046' }}
            />
          </div>

          {/* Phone */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2" style={{ color: '#051046' }}>
              Phone
            </label>
            <input
              type="tel"
              placeholder="Phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-4 py-2.5 border border-[#e8e8e8] rounded-[15px] focus:outline-none focus:border-[#9473ff] transition-colors placeholder:text-gray-400"
              style={{ color: '#051046' }}
            />
          </div>

          {/* Address */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2" style={{ color: '#051046' }}>
              Address
            </label>
            <input
              type="text"
              placeholder="Address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full px-4 py-2.5 border border-[#e8e8e8] rounded-[15px] focus:outline-none focus:border-[#9473ff] transition-colors placeholder:text-gray-400"
              style={{ color: '#051046' }}
            />
          </div>

          {/* Role */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2" style={{ color: '#051046' }}>
              Role
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              required
              className="w-full px-4 py-2.5 border border-[#e8e8e8] rounded-[15px] focus:outline-none focus:border-[#9473ff] transition-colors"
              style={{ color: role ? '#051046' : '#9ca3af' }}
            >
              <option value="">Role</option>
              <option value="Admin">Admin</option>
              <option value="Staff">Staff</option>
            </select>
          </div>

          {/* Birthday */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2" style={{ color: '#051046' }}>
              Birthday
            </label>
            <input
              type="text"
              placeholder="mm/dd/yyyy"
              value={birthday}
              onChange={(e) => setBirthday(e.target.value)}
              className="w-full px-4 py-2.5 border border-[#e8e8e8] rounded-[15px] focus:outline-none focus:border-[#9473ff] transition-colors placeholder:text-gray-400"
              style={{ color: '#051046' }}
            />
          </div>

          {/* Image Upload */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2" style={{ color: '#051046' }}>
              Image
            </label>
            <div className="flex items-center justify-center w-24 h-24 rounded-full border-2 border-dashed border-gray-300 cursor-pointer hover:border-[#9473ff] transition-colors">
              <span className="text-xs text-gray-400 text-center px-2">Click to upload<br />an image</span>
            </div>
          </div>

          {/* Admin Note */}
          {role === 'Admin' && (
            <div className="mb-6 p-4 rounded-[15px] bg-[#f8f9ff]" style={{ border: '1px solid #e2e8f0' }}>
              <p className="text-sm" style={{ color: '#051046' }}>
                Admins have full access to all permissions by default.
              </p>
            </div>
          )}

          {/* Permissions - Only show for Staff role */}
          {role === 'Staff' && (
            <div className="mb-6">
              <label className="block text-sm font-medium mb-3" style={{ color: '#051046' }}>
                Permissions
              </label>
              <div className="space-y-3">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={permissions.addEditJobs}
                    onChange={() => handlePermissionChange('addEditJobs')}
                    className="w-5 h-5 rounded border-gray-300 text-[#9473ff] focus:ring-[#9473ff]"
                    style={{ accentColor: '#9473ff' }}
                  />
                  <span className="text-sm" style={{ color: '#051046' }}>Add/edit jobs</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={permissions.deleteJobs}
                    onChange={() => handlePermissionChange('deleteJobs')}
                    className="w-5 h-5 rounded border-gray-300 text-[#9473ff] focus:ring-[#9473ff]"
                    style={{ accentColor: '#9473ff' }}
                  />
                  <span className="text-sm" style={{ color: '#051046' }}>Delete jobs</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={permissions.cancelJobs}
                    onChange={() => handlePermissionChange('cancelJobs')}
                    className="w-5 h-5 rounded border-gray-300 text-[#9473ff] focus:ring-[#9473ff]"
                    style={{ accentColor: '#9473ff' }}
                  />
                  <span className="text-sm" style={{ color: '#051046' }}>Cancel jobs</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={permissions.createEstimatesInvoices}
                    onChange={() => handlePermissionChange('createEstimatesInvoices')}
                    className="w-5 h-5 rounded border-gray-300 text-[#9473ff] focus:ring-[#9473ff]"
                    style={{ accentColor: '#9473ff' }}
                  />
                  <span className="text-sm" style={{ color: '#051046' }}>Create estimates/invoices</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={permissions.addEditViewClients}
                    onChange={() => handlePermissionChange('addEditViewClients')}
                    className="w-5 h-5 rounded border-gray-300 text-[#9473ff] focus:ring-[#9473ff]"
                    style={{ accentColor: '#9473ff' }}
                  />
                  <span className="text-sm" style={{ color: '#051046' }}>Add/edit/view clients</span>
                </label>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-[#e8e8e8] rounded-[32px] font-medium text-[#051046] hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 text-white rounded-[32px] font-medium transition-colors"
              style={{ backgroundColor: '#9473ff' }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#7f5fd9'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#9473ff'}
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Delete Confirmation Modal Component
interface DeleteConfirmModalProps {
  memberName: string;
  onClose: () => void;
  onConfirm: () => void;
}

function DeleteConfirmModal({ memberName, onClose, onConfirm }: DeleteConfirmModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div
        className="bg-white rounded-[20px] border border-[#e2e8f0] p-6 w-full max-w-md"
        style={{ boxShadow: 'rgba(226, 232, 240, 0.5) 0px 2px 16px 2px' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold" style={{ color: '#051046' }}>Confirm Deletion</h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-[10px] transition-colors">
            <X className="w-5 h-5" style={{ color: '#051046' }} />
          </button>
        </div>

        {/* Content */}
        <p className="text-sm mb-6" style={{ color: '#051046' }}>
          Are you sure you want to delete <strong>{memberName}</strong>? This action cannot be undone.
        </p>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-6 py-3 rounded-[15px] font-medium transition-colors"
            style={{ color: '#051046', backgroundColor: '#f3f4f6' }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#e5e7eb'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#f3f4f6'}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="flex-1 px-6 py-3 text-white rounded-[15px] font-medium transition-colors"
            style={{ backgroundColor: '#ef4444' }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#dc2626'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#ef4444'}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

// Team Member Details Modal Component
interface TeamMemberDetailsModalProps {
  member: TeamMember;
  onClose: () => void;
  getBirthdayInfo: (birthday?: string) => { daysUntil: number; age: number; birthdayDisplay: string } | null;
}

function TeamMemberDetailsModal({ member, onClose, getBirthdayInfo }: TeamMemberDetailsModalProps) {
  const birthdayInfo = getBirthdayInfo(member.birthday);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div
        className="bg-white rounded-[20px] border border-[#e2e8f0] p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        style={{ boxShadow: 'rgba(226, 232, 240, 0.5) 0px 2px 16px 2px' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold" style={{ color: '#051046' }}>Team Member Details</h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-[10px] transition-colors">
            <X className="w-5 h-5" style={{ color: '#051046' }} />
          </button>
        </div>

        {/* Member Details */}
        <div className="space-y-5">
          {/* Full Name */}
          <div>
            <label className="block text-xs font-medium text-gray-500 uppercase mb-1">Full Name</label>
            <p className="text-base font-medium" style={{ color: '#051046' }}>{member.fullName}</p>
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs font-medium text-gray-500 uppercase mb-1">Email</label>
            <p className="text-base" style={{ color: '#051046' }}>{member.email}</p>
          </div>

          {/* Phone */}
          {member.phone && (
            <div>
              <label className="block text-xs font-medium text-gray-500 uppercase mb-1">Phone</label>
              <p className="text-base" style={{ color: '#051046' }}>{member.phone}</p>
            </div>
          )}

          {/* Address */}
          {member.address && (
            <div>
              <label className="block text-xs font-medium text-gray-500 uppercase mb-1">Address</label>
              <p className="text-base" style={{ color: '#051046' }}>{member.address}</p>
            </div>
          )}

          {/* Join Date & User Type */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-500 uppercase mb-1">Join Date</label>
              <p className="text-base" style={{ color: '#051046' }}>{member.joinDate}</p>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 uppercase mb-1">User Type</label>
              <p className="text-base" style={{ color: '#051046' }}>{member.userType}</p>
            </div>
          </div>

          {/* Birthday */}
          {birthdayInfo && (
            <div>
              <label className="block text-xs font-medium text-gray-500 uppercase mb-1">Birthday</label>
              <div className="text-base" style={{ color: '#051046' }}>
                <div className="font-medium">{birthdayInfo.birthdayDisplay}</div>
                <div className="text-sm text-gray-500 mt-1">Going to be {birthdayInfo.age} in {birthdayInfo.daysUntil} days</div>
              </div>
            </div>
          )}

          {/* Register Status */}
          <div>
            <label className="block text-xs font-medium text-gray-500 uppercase mb-1">Registration Status</label>
            <div className="flex items-center gap-2">
              <div
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: member.isRegistered ? '#10b981' : '#ef4444' }}
              />
              <span style={{ color: '#051046' }}>
                {member.isRegistered ? 'Registered' : 'Not registered'}
              </span>
            </div>
          </div>

          {/* Permissions */}
          {member.permissions && (
            <div>
              <label className="block text-xs font-medium text-gray-500 uppercase mb-2">Permissions</label>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div
                    className="w-4 h-4 rounded flex items-center justify-center"
                    style={{ backgroundColor: member.permissions.addEditJobs ? '#9473ff' : '#e5e7eb' }}
                  >
                    {member.permissions.addEditJobs && (
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                  <span className="text-sm" style={{ color: '#051046' }}>Add/edit jobs</span>
                </div>
                <div className="flex items-center gap-2">
                  <div
                    className="w-4 h-4 rounded flex items-center justify-center"
                    style={{ backgroundColor: member.permissions.deleteJobs ? '#9473ff' : '#e5e7eb' }}
                  >
                    {member.permissions.deleteJobs && (
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                  <span className="text-sm" style={{ color: '#051046' }}>Delete jobs</span>
                </div>
                <div className="flex items-center gap-2">
                  <div
                    className="w-4 h-4 rounded flex items-center justify-center"
                    style={{ backgroundColor: member.permissions.cancelJobs ? '#9473ff' : '#e5e7eb' }}
                  >
                    {member.permissions.cancelJobs && (
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                  <span className="text-sm" style={{ color: '#051046' }}>Cancel jobs</span>
                </div>
                <div className="flex items-center gap-2">
                  <div
                    className="w-4 h-4 rounded flex items-center justify-center"
                    style={{ backgroundColor: member.permissions.createEstimatesInvoices ? '#9473ff' : '#e5e7eb' }}
                  >
                    {member.permissions.createEstimatesInvoices && (
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                  <span className="text-sm" style={{ color: '#051046' }}>Create estimates/invoices</span>
                </div>
                <div className="flex items-center gap-2">
                  <div
                    className="w-4 h-4 rounded flex items-center justify-center"
                    style={{ backgroundColor: member.permissions.addEditViewClients ? '#9473ff' : '#e5e7eb' }}
                  >
                    {member.permissions.addEditViewClients && (
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                  <span className="text-sm" style={{ color: '#051046' }}>Add/edit/view clients</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Close Button */}
        <div className="mt-6 pt-4 border-t border-gray-200">
          <button
            type="button"
            onClick={onClose}
            className="w-full px-6 py-3 text-white rounded-[15px] font-medium transition-colors"
            style={{ backgroundColor: '#9473ff' }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#7f5fd9'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#9473ff'}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
