import { X, Phone, Mail, DollarSign, Calendar, MessageSquare, FileText, Bell, Clock, Edit, CheckCircle, CreditCard, ArrowRightCircle } from 'lucide-react';
import { Lead } from './LeadCard';
import { useState } from 'react';
import { DeveloperNotesPopup } from './DeveloperNotesPopup';
import { useNavigate, useLocation } from 'react-router';
import { useJobs } from '../contexts/JobsContext';

interface LeadDetailModalProps {
  lead: Lead | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateStage: (leadId: string, newStage: Lead['stage']) => void;
  onUpdateLead?: (leadId: string, updatedData: Partial<Lead>) => void;
}

export function LeadDetailModal({ lead, isOpen, onClose, onUpdateStage, onUpdateLead }: LeadDetailModalProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { addJob } = useJobs();
  const [showAddNote, setShowAddNote] = useState(false);
  const [noteText, setNoteText] = useState('');
  const [showCallNote, setShowCallNote] = useState(false);
  const [callNoteText, setCallNoteText] = useState('');
  const [showReopenNote, setShowReopenNote] = useState(false);
  const [reopenNoteText, setReopenNoteText] = useState('');
  const [showDevNotes, setShowDevNotes] = useState(false);
  const [devNotesContent, setDevNotesContent] = useState<React.ReactNode>(null);
  const [devNotesTitle, setDevNotesTitle] = useState('Developer Notes');
  const [showEditForm, setShowEditForm] = useState(false);
  const [showConvertConfirmation, setShowConvertConfirmation] = useState(false);
  
  // Edit form states
  const [editClientName, setEditClientName] = useState('');
  const [editServiceType, setEditServiceType] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editEstimatedValue, setEditEstimatedValue] = useState('');
  const [editPriority, setEditPriority] = useState<'High' | 'Medium' | 'Low'>('Medium');
  const [editNotes, setEditNotes] = useState('');
  
  if (!isOpen || !lead) return null;

  const stages: Lead['stage'][] = ['New', 'Contacted', 'Price Shared', 'Follow-Up', 'Won', 'Lost'];

  const formatDate = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const formatTime = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  };

  const getActivityIcon = (type?: string) => {
    switch (type) {
      case 'email':
        return <Mail className="w-4 h-4 text-purple-600" />;
      case 'call':
        return <Phone className="w-4 h-4 text-purple-600" />;
      case 'note':
        return <FileText className="w-4 h-4 text-purple-600" />;
      case 'stage_change':
        return <ArrowRightCircle className="w-4 h-4 text-purple-600" />;
      case 'price_shared':
        return <DollarSign className="w-4 h-4 text-purple-600" />;
      case 'converted':
        return <CheckCircle className="w-4 h-4 text-purple-600" />;
      case 'payment':
        return <CreditCard className="w-4 h-4 text-purple-600" />;
      default:
        return <MessageSquare className="w-4 h-4 text-purple-600" />;
    }
  };

  const handleAddNote = () => {
    if (noteText.trim()) {
      // In a real app, this would be handled server-side and the note would be added to the database
      // The UI would then re-fetch or update via state management
      // For this mockup, we're showing the intended UX flow
      
      alert('Note saved successfully (In production, this would update the database)');
      
      // Reset and close
      setNoteText('');
      setShowAddNote(false);
    }
  };

  const handleEditLead = () => {
    // Populate form with current lead data
    setEditClientName(lead.clientName);
    setEditServiceType(lead.serviceType);
    setEditPhone(lead.phone);
    setEditEmail(lead.email);
    setEditEstimatedValue(lead.estimatedValue.toString());
    setEditPriority(lead.priority);
    setEditNotes(lead.notes);
    setShowEditForm(true);
  };

  const handleSaveEdit = () => {
    // Validation
    if (!editClientName.trim()) {
      alert('Client name is required');
      return;
    }
    if (!editServiceType.trim()) {
      alert('Service type is required');
      return;
    }
    if (!editPhone.trim()) {
      alert('Phone is required');
      return;
    }
    if (!editEmail.trim()) {
      alert('Email is required');
      return;
    }
    if (!editEstimatedValue.trim() || isNaN(Number(editEstimatedValue))) {
      alert('Please enter a valid estimated value');
      return;
    }

    const updatedData: Partial<Lead> = {
      clientName: editClientName.trim(),
      serviceType: editServiceType.trim(),
      phone: editPhone.trim(),
      email: editEmail.trim(),
      estimatedValue: Number(editEstimatedValue),
      priority: editPriority,
      notes: editNotes.trim(),
    };

    // Call the update function if provided
    if (onUpdateLead) {
      onUpdateLead(lead.id, updatedData);
    }

    // Close edit form
    setShowEditForm(false);
    
    alert('Lead updated successfully (In production, this would update the database)');
  };

  const handleCancelEdit = () => {
    setShowEditForm(false);
    // Reset form fields
    setEditClientName('');
    setEditServiceType('');
    setEditPhone('');
    setEditEmail('');
    setEditEstimatedValue('');
    setEditPriority('Medium');
    setEditNotes('');
  };

  const handleCallMade = () => {
    // Show the call note input form
    setShowCallNote(true);
  };

  const handleSaveCallNote = () => {
    if (callNoteText.trim()) {
      // In a real app, call activity would be added server-side
      // For this mockup, we're showing the UX flow
      
      // Auto-move to "Contacted" only if current stage is "New"
      if (lead.stage === 'New') {
        onUpdateStage(lead.id, 'Contacted');
      }
      
      // Pass the call note to be added to the timeline
      if (onUpdateLead) {
        // Generate unique activity ID
        const baseTimestamp = Date.now();
        const activityId = `activity-call-${baseTimestamp}-${lead.id}`;
        
        // Create the call activity entry
        const callActivity = {
          id: activityId,
          type: 'call' as const,
          description: callNoteText.trim(),
          timestamp: new Date().toISOString(),
          user: 'Current User' // This would come from auth context in real app
        };
        
        // Add the call activity to the lead's timeline
        const updatedLead = {
          ...lead,
          activityTimeline: [callActivity, ...(lead.activityTimeline || [])]
        };
        
        // Update the lead with the new activity
        onUpdateLead(lead.id, { activityTimeline: updatedLead.activityTimeline });
      }
      
      // Reset and close
      setCallNoteText('');
      setShowCallNote(false);
      
      // Show confirmation
      const statusMessage = lead.stage === 'New' ? ' and lead moved to Contacted' : '';
      alert('Call logged successfully' + statusMessage + ' (In production, this would update the database)');
    }
  };

  const handleReopenLead = () => {
    // Show the reopen note input form
    setShowReopenNote(true);
  };

  const handleSaveReopenNote = () => {
    if (!reopenNoteText.trim()) {
      alert('Please enter a reason for reopening the lead.');
      return;
    }

    // In a real app, these reopen activities would be added server-side
    // For now, we're only updating the stage, which will add a "Stage changed to Follow-Up" activity
    // The reopen reason would be stored separately and displayed in the lead details
    
    // Move to "Follow-Up" stage (per documentation)
    onUpdateStage(lead.id, 'Follow-Up');
    
    // Reset and close
    setReopenNoteText('');
    setShowReopenNote(false);
    
    // Show Developer Notes popup
    setDevNotesContent(getReopenDevNotes());
    setDevNotesTitle('Developer Notes - Reopen Lead Logic');
    setShowDevNotes(true);
  };

  const getReopenDevNotes = () => (
    <div className="text-[#051046] space-y-4">
      <div>
        <div className="font-semibold mb-3">⚡ Trigger: "Reopen Lead" button clicked</div>
      </div>
      
      <div className="bg-white p-4 rounded-[15px] border border-[#e2e8f0]">
        <div className="font-semibold mb-2">🔒 When to Show Reopen Button:</div>
        <div className="space-y-2 ml-4">
          <div>• Lead status = <strong>Lost</strong></div>
          <div>• User role = <strong>Admin</strong> (only admins can reopen leads)</div>
          <div>• Reopen button <strong>replaces</strong> the "Convert to Job" button</div>
        </div>
      </div>

      <div className="bg-white p-4 rounded-[15px] border border-[#e2e8f0]">
        <div className="font-semibold mb-2">🔄 Status Update:</div>
        <div className="space-y-2 ml-4">
          <div>• Set lead status → <strong>Follow-Up</strong></div>
          <div>• Reset Days in Stage to <strong>0</strong></div>
        </div>
      </div>

      <div className="bg-white p-4 rounded-[15px] border border-[#e2e8f0]">
        <div className="font-semibold mb-2">🤖 Automation Restart:</div>
        <div className="space-y-2 ml-4">
          <div>📅 Create new follow-up task</div>
          <div>⏱️ Reset inactivity timer for Follow-Up stage</div>
          <div>🔄 Restart Follow-Up automation cycle</div>
        </div>
      </div>

      <div className="bg-white p-4 rounded-[15px] border border-[#e2e8f0]">
        <div className="font-semibold mb-2">📝 Activity Timeline Logging:</div>
        <div className="space-y-2 ml-4">
          <div>• Log activity: <strong>"Lead reopened - {'{'}reopen reason{'}'}\"</strong></div>
          <div>• Log activity: <strong>"Follow-Up automation cycle restarted (new task + inactivity timer reset)"</strong></div>
          <div>• Include timestamp and user name</div>
        </div>
      </div>

      <div className="bg-white p-4 rounded-[15px] border border-[#e2e8f0]">
        <div className="font-semibold mb-2">⚠️ What Reopen Does NOT Do:</div>
        <div className="space-y-2 ml-4">
          <div>• Does <strong>NOT</strong> automatically create a job</div>
          <div>• Does <strong>NOT</strong> automatically send SMS or email</div>
          <div>• Does <strong>NOT</strong> remove the original decline reason</div>
          <div>• Does <strong>NOT</strong> delete any history (all activity timeline remains intact)</div>
        </div>
      </div>

      <div className="bg-white p-4 rounded-[15px] border border-[#e2e8f0]">
        <div className="font-semibold mb-2">⚠️ Guardrails:</div>
        <div className="space-y-2 ml-4">
          <div>• Lost lead can be reopened <strong>multiple times</strong></div>
          <div>• No time restrictions on reopening</div>
          <div>• Only <strong>admin users</strong> can reopen leads</div>
          <div>• Reopen note is <strong>required</strong> (cannot be empty)</div>
          <div>• All previous Lost reasons remain in activity timeline</div>
          <div>• Reopen always moves to <strong>Follow-Up</strong> (not to original stage)</div>
        </div>
      </div>

      <div className="bg-white p-4 rounded-[15px] border border-[#e2e8f0]">
        <div className="font-semibold mb-2">🔒 Permission Check:</div>
        <div className="space-y-2 ml-4">
          <div>• Verify user role = <strong>Admin</strong></div>
          <div>• If not admin, show error message: <em>"Only administrators can reopen leads."</em></div>
        </div>
      </div>
    </div>
  );

  const handleDevNotes = () => {
    // This would open a modal or form to add developer notes
    setDevNotesContent(
      <div className="p-4 bg-gray-50 rounded-[20px]">
        <h3 className="text-sm font-semibold text-[#051046] mb-3">Developer Notes</h3>
        <p className="text-sm text-gray-600">This is a placeholder for developer notes. In a real application, this could be a form to add detailed notes about the lead for internal use.</p>
        <button
          className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-[32px] hover:bg-purple-700 transition-colors text-sm font-medium"
          onClick={() => setShowDevNotes(false)}
        >
          Close
        </button>
      </div>
    );
    setShowDevNotes(true);
  };

  const handleConvertToJobClick = () => {
    // Show custom confirmation modal
    setShowConvertConfirmation(true);
  };

  const handleConfirmConversion = () => {
    // Close confirmation modal
    setShowConvertConfirmation(false);
    
    // Proceed with conversion
    handleConvertToJob();
  };

  const handleConvertToJob = () => {
    // Generate unique job ID
    const timestamp = Date.now();
    const jobId = `#L${lead.id.replace('#', '')}-${timestamp}`;
    
    // Create new job from lead data
    const newJob = {
      id: jobId,
      tags: [], // Empty tags - user can add later
      client: lead.clientName,
      clientEmail: lead.email,
      clientPhone: lead.phone,
      jobType: lead.serviceType, // Auto-populate from service type
      jobStatus: '' as any, // NO STATUS - will be set to "Scheduled" on first update
      duration: '',
      scheduled: '',
      scheduledStart: '',
      scheduledEnd: '',
      tech: '', // Empty - user will assign
      address: lead.address || '', // Auto-populate if available
      jobDescription: lead.notes || '', // Auto-populate notes if available
      jobSource: `(L) ${lead.leadSource}`, // Indicate this was a lead with (L) prefix
      techNotes: '',
      isNew: true,
      hasUpsell: false,
      arrivedLate: false,
      scheduledByStaff: true,
      isAllDay: false,
    };
    
    // Add job to context
    addJob(newJob);
    
    // Add the converted activity to the timeline
    if (onUpdateLead) {
      const baseTimestamp = Date.now();
      const activityId = `activity-convert-${baseTimestamp}-${lead.id}`;
      
      const convertActivity = {
        id: activityId,
        type: 'converted' as const,
        description: `Lead converted to job ${jobId}`,
        timestamp: new Date().toISOString(),
        user: 'Current User'
      };
      
      const updatedLead = {
        ...lead,
        activityTimeline: [convertActivity, ...(lead.activityTimeline || [])]
      };
      
      onUpdateLead(lead.id, { activityTimeline: updatedLead.activityTimeline });
    }
    
    // Close the modal
    onClose();
    
    // Determine the correct route based on current path
    const basePath = location.pathname.startsWith('/staff') ? '/staff' : '/admin';
    
    // Navigate to the job details page
    navigate(`${basePath}/jobs/details/${encodeURIComponent(jobId)}`);
  };

  const getConvertToJobDevNotes = () => (
    <div className="text-[#051046] space-y-4">
      <div>
        <div className="font-semibold mb-3">⚡ Trigger: "Convert to Job" button clicked</div>
      </div>
      
      <div className="bg-white p-4 rounded-[15px] border border-[#e2e8f0]">
        <div className="font-semibold mb-2">🔒 When to Show "Convert to Job" Button:</div>
        <div className="space-y-2 ml-4">
          <div>• Lead is <strong>NOT</strong> Lost</div>
          <div>• Lead is <strong>NOT</strong> Won</div>
          <div>• Lead has <strong>NOT</strong> already been converted to a job</div>
        </div>
      </div>

      <div className="bg-white p-4 rounded-[15px] border border-[#e2e8f0]">
        <div className="font-semibold mb-2">🔄 What Happens on Conversion:</div>
        <div className="space-y-2 ml-4">
          <div>1. Create a new job record in the system</div>
          <div>2. Copy lead details to job (client name, contact info, service type, estimated value)</div>
          <div>3. Link the job to the original lead for tracking</div>
          <div>4. Set job status to <strong>Scheduled</strong> (default)</div>
          <div>5. Mark lead as "converted" (flag in database)</div>
        </div>
      </div>

      <div className="bg-white p-4 rounded-[15px] border border-[#e2e8f0]">
        <div className="font-semibold mb-2">📝 Activity Timeline Logging:</div>
        <div className="space-y-2 ml-4">
          <div>• Log activity: <strong>"Lead converted to job - {'{'}conversion reason{'}'}\"</strong></div>
          <div>• Include timestamp and user name</div>
          <div>• Store conversion note for future reference</div>
        </div>
      </div>

      <div className="bg-white p-4 rounded-[15px] border border-[#e2e8f0]">
        <div className="font-semibold mb-2">🤖 Auto Status Update (If Estimate Added):</div>
        <div className="space-y-2 ml-4">
          <div>⚡ <strong>Trigger:</strong> Job has at least one estimate</div>
          <div>🔄 <strong>Action:</strong> If lead status is "New" or "Contacted" → set to "Price Shared"</div>
          <div>• If lead status is already "Price Shared", "Follow-Up", "Won", or "Lost" → do nothing</div>
        </div>
      </div>

      <div className="bg-white p-4 rounded-[15px] border border-[#e2e8f0]">
        <div className="font-semibold mb-2">🔔 Notifications:</div>
        <div className="space-y-2 ml-4">
          <div>• Create in-app notification: <em>"New job created from lead [Lead Name]\"</em></div>
          <div>• Notify assigned technician (if any)</div>
          <div>• Add to calendar (if scheduled date/time provided)</div>
        </div>
      </div>

      <div className="bg-white p-4 rounded-[15px] border border-[#e2e8f0]">
        <div className="font-semibold mb-2">⚠️ Guardrails:</div>
        <div className="space-y-2 ml-4">
          <div>• Lead can only be converted <strong>once</strong></div>
          <div>• Converted leads cannot be converted again (button is hidden)</div>
          <div>• Lead status does <strong>NOT</strong> automatically change to Won on conversion</div>
          <div>• Lead remains in current stage unless manually changed or payment received</div>
          <div>• Conversion note is <strong>optional</strong> but recommended</div>
          <div>• All lead history remains intact and visible in job details</div>
        </div>
      </div>

      <div className="bg-white p-4 rounded-[15px] border border-[#e2e8f0]">
        <div className="font-semibold mb-2">💾 Database Updates:</div>
        <div className="space-y-2 ml-4">
          <div>• Set <code>lead.converted</code> flag to <strong>true</strong></div>
          <div>• Store <code>lead.jobId</code> (reference to created job)</div>
          <div>• Create job record with status "Scheduled"</div>
          <div>• Link job back to lead with <code>job.leadId</code></div>
        </div>
      </div>

      <div className="bg-white p-4 rounded-[15px] border border-[#e2e8f0]">
        <div className="font-semibold mb-2">🔗 Job-Lead Relationship:</div>
        <div className="space-y-2 ml-4">
          <div>• Job inherits: Client name, email, phone, address, service type</div>
          <div>• Job does NOT inherit: Lead stage, days in stage, lead source</div>
          <div>• All lead activity history is accessible from job details</div>
          <div>• Lead remains visible in Leads page (marked as "Converted")</div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div 
        className="bg-white rounded-[20px] border border-[#e2e8f0] w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col"
        style={{ boxShadow: 'rgba(226, 232, 240, 0.5) 0px 2px 16px 2px' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-semibold text-[#051046]">{lead.clientName}</h2>
            <p className="text-sm text-gray-600 mt-1">{lead.serviceType}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Edit Lead Form */}
          {showEditForm ? (
            <div className="max-w-2xl mx-auto">
              <div className="bg-white rounded-[20px] p-6 border border-[#e2e8f0]" style={{ boxShadow: 'rgba(226, 232, 240, 0.5) 0px 2px 16px 2px' }}>
                <h3 className="text-lg font-semibold text-[#051046] mb-6">Edit Lead Details</h3>
                
                <div className="space-y-4">
                  {/* Client Name */}
                  <div>
                    <label className="block text-sm font-medium text-[#051046] mb-2">
                      Client Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={editClientName}
                      onChange={(e) => setEditClientName(e.target.value)}
                      className="w-full px-4 py-2 bg-white border border-[#e8e8e8] rounded-[15px] text-sm text-[#051046] focus:outline-none focus:ring-2 focus:ring-purple-600"
                      placeholder="Enter client name"
                    />
                  </div>

                  {/* Service Type */}
                  <div>
                    <label className="block text-sm font-medium text-[#051046] mb-2">
                      Service Type <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={editServiceType}
                      onChange={(e) => setEditServiceType(e.target.value)}
                      className="w-full px-4 py-2 bg-white border border-[#e8e8e8] rounded-[15px] text-sm text-[#051046] focus:outline-none focus:ring-2 focus:ring-purple-600"
                      placeholder="Enter service type"
                    />
                  </div>

                  {/* Phone and Email in Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-[#051046] mb-2">
                        Phone <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        value={editPhone}
                        onChange={(e) => setEditPhone(e.target.value)}
                        className="w-full px-4 py-2 bg-white border border-[#e8e8e8] rounded-[15px] text-sm text-[#051046] focus:outline-none focus:ring-2 focus:ring-purple-600"
                        placeholder="(555) 555-5555"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[#051046] mb-2">
                        Email <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        value={editEmail}
                        onChange={(e) => setEditEmail(e.target.value)}
                        className="w-full px-4 py-2 bg-white border border-[#e8e8e8] rounded-[15px] text-sm text-[#051046] focus:outline-none focus:ring-2 focus:ring-purple-600"
                        placeholder="email@example.com"
                      />
                    </div>
                  </div>

                  {/* Estimated Value and Priority in Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-[#051046] mb-2">
                        Estimated Value <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        value={editEstimatedValue}
                        onChange={(e) => setEditEstimatedValue(e.target.value)}
                        className="w-full px-4 py-2 bg-white border border-[#e8e8e8] rounded-[15px] text-sm text-[#051046] focus:outline-none focus:ring-2 focus:ring-purple-600"
                        placeholder="5000"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[#051046] mb-2">
                        Priority <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={editPriority}
                        onChange={(e) => setEditPriority(e.target.value as 'High' | 'Medium' | 'Low')}
                        className="w-full px-4 py-2 bg-white border border-[#e8e8e8] rounded-[15px] text-sm text-[#051046] focus:outline-none focus:ring-2 focus:ring-purple-600"
                      >
                        <option value="High">High</option>
                        <option value="Medium">Medium</option>
                        <option value="Low">Low</option>
                      </select>
                    </div>
                  </div>

                  {/* Notes */}
                  <div>
                    <label className="block text-sm font-medium text-[#051046] mb-2">
                      Notes
                    </label>
                    <textarea
                      value={editNotes}
                      onChange={(e) => setEditNotes(e.target.value)}
                      rows={4}
                      className="w-full px-4 py-2 bg-white border border-[#e8e8e8] rounded-[15px] text-sm text-[#051046] focus:outline-none focus:ring-2 focus:ring-purple-600"
                      placeholder="Enter any notes about this lead..."
                    />
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3 pt-4">
                    <button
                      onClick={handleSaveEdit}
                      className="flex-1 px-6 py-3 bg-purple-600 text-white rounded-[32px] hover:bg-purple-700 transition-colors text-sm font-medium"
                    >
                      Save Changes
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="flex-1 px-6 py-3 border border-[#e8e8e8] bg-white text-[#051046] rounded-[32px] hover:bg-gray-50 transition-colors text-sm font-medium"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column - Main Info */}
              <div className="lg:col-span-2 space-y-6">
                {/* Contact Information */}
                <div className="bg-gray-50 rounded-[20px] p-4">
                  <h3 className="text-sm font-semibold text-[#051046] mb-3">Contact Information</h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <Phone className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-[#051046]">{lead.phone}</span>
                      <button className="ml-auto text-xs text-purple-600 hover:text-purple-700 font-medium">
                        Call
                      </button>
                    </div>
                    <div className="flex items-center gap-3">
                      <Mail className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-[#051046]">{lead.email}</span>
                      <button className="ml-auto text-xs text-purple-600 hover:text-purple-700 font-medium">
                        Email
                      </button>
                    </div>
                  </div>
                </div>

                {/* Lead Details */}
                <div className="bg-gray-50 rounded-[20px] p-4">
                  <h3 className="text-sm font-semibold text-[#051046] mb-3">Lead Details</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Estimated Value</p>
                      <span className="text-sm font-semibold text-[#051046]">
                        ${lead.estimatedValue.toLocaleString()}
                      </span>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Priority</p>
                      <span className="text-sm font-semibold text-[#051046]">{lead.priority}</span>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Created Date</p>
                      <span className="text-sm text-[#051046]">{lead.createdDate}</span>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Days in Stage</p>
                      <span className="text-sm text-[#051046]">{lead.daysInStage} days</span>
                    </div>
                  </div>
                </div>

                {/* Notes */}
                <div className="bg-gray-50 rounded-[20px] p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-semibold text-[#051046]">Notes</h3>
                    <button className="text-xs text-purple-600 hover:text-purple-700 font-medium" onClick={() => setShowAddNote(!showAddNote)}>
                      Add Note
                    </button>
                  </div>
                  <p className="text-sm text-gray-600">{lead.notes}</p>
                  {showAddNote && (
                    <div className="mt-4">
                      <textarea
                        value={noteText}
                        onChange={(e) => setNoteText(e.target.value)}
                        className="w-full px-3 py-2 border border-[#e8e8e8] rounded-[15px] text-sm text-[#051046] focus:outline-none focus:ring-2 focus:ring-purple-600"
                        placeholder="Enter your note here..."
                      ></textarea>
                      <div className="flex gap-2 mt-2">
                        <button
                          className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium"
                          onClick={handleAddNote}
                        >
                          Save Note
                        </button>
                        <button
                          className="flex-1 px-4 py-2 border border-[#e8e8e8] bg-white text-[#051046] rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
                          onClick={() => {
                            setNoteText('');
                            setShowAddNote(false);
                          }}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Activity Timeline */}
                <div className="bg-gray-50 rounded-[20px] p-4">
                  <h3 className="text-sm font-semibold text-[#051046] mb-4">Activity Timeline</h3>
                  <div className="space-y-4">
                    {lead.activityTimeline.map((activity, index) => (
                      <div key={activity.id} className="flex gap-3">
                        <div className="flex flex-col items-center">
                          <div className="w-8 h-8 bg-purple-50 rounded-full flex items-center justify-center">
                            {getActivityIcon(activity.type)}
                          </div>
                          {index !== lead.activityTimeline.length - 1 && (
                            <div className="w-0.5 h-full bg-gray-300 mt-1"></div>
                          )}
                        </div>
                        <div className="flex-1 pb-4">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-medium text-[#051046]">{formatDate(activity.timestamp)}</span>
                            <span className="text-xs text-gray-400">{formatTime(activity.timestamp)}</span>
                          </div>
                          <p className="text-sm text-gray-600">{activity.description}</p>
                          {activity.user && (
                            <p className="text-xs text-gray-400 mt-1">by {activity.user}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column - Actions & Automations */}
              <div className="space-y-6">
                {/* Stage Management */}
                <div className="bg-gray-50 rounded-[20px] p-4">
                  <h3 className="text-sm font-semibold text-[#051046] mb-3">Current Stage</h3>
                  <select
                    value={lead.stage}
                    onChange={(e) => onUpdateStage(lead.id, e.target.value as Lead['stage'])}
                    className="w-full px-3 py-2 border border-[#e8e8e8] rounded-[15px] text-sm text-[#051046] focus:outline-none focus:ring-2 focus:ring-purple-600"
                  >
                    {stages.map((stage) => (
                      <option key={stage} value={stage}>
                        {stage}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Quick Actions */}
                <div className="bg-gray-50 rounded-[20px] p-4">
                  <h3 className="text-sm font-semibold text-[#051046] mb-3">Quick Actions</h3>
                  <div className="space-y-2">
                    {/* Edit Lead Button - Always visible */}
                    <button 
                      onClick={handleEditLead}
                      className="w-full px-4 py-2 bg-white text-[#051046] border border-[#e8e8e8] rounded-[32px] hover:bg-gray-50 transition-colors text-sm font-medium flex items-center justify-center gap-2"
                    >
                      <Edit className="w-4 h-4" />
                      Edit Lead
                    </button>
                    
                    {/* Call Made Button - Show for all stages except Won */}
                    {lead.stage !== 'Won' && (
                      <>
                        <button
                          onClick={handleCallMade}
                          className="w-full px-4 py-2 bg-white text-[#051046] border border-[#e8e8e8] rounded-[32px] hover:bg-gray-50 transition-colors text-sm font-medium"
                        >
                          Call Made
                        </button>
                        
                        {/* Call Note Input - Show when user clicks Call Made */}
                        {showCallNote && (
                          <div className="mt-2 p-3 bg-white rounded-lg border border-[#e2e8f0]">
                            <label className="block text-xs font-medium text-[#051046] mb-2">Call Notes</label>
                            <textarea
                              value={callNoteText}
                              onChange={(e) => setCallNoteText(e.target.value)}
                              className="w-full px-3 py-2 border border-[#e8e8e8] rounded-[15px] text-sm text-[#051046] focus:outline-none focus:ring-2 focus:ring-green-600"
                              placeholder="What happened on the call?"
                              rows={3}
                            ></textarea>
                            <div className="flex gap-2 mt-2">
                              <button
                                className="flex-1 px-3 py-1.5 bg-green-600 text-white rounded-[32px] hover:bg-green-700 transition-colors text-xs font-medium"
                                onClick={handleSaveCallNote}
                              >
                                Save Call
                              </button>
                              <button
                                className="flex-1 px-3 py-1.5 border border-[#e8e8e8] bg-white text-[#051046] rounded-[32px] hover:bg-gray-50 transition-colors text-xs font-medium"
                                onClick={() => {
                                  setCallNoteText('');
                                  setShowCallNote(false);
                                }}
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        )}
                      </>
                    )}
                    
                    {/* Convert to Job Button - Show when NOT Lost and NOT Won and NOT already converted */}
                    {lead.stage !== 'Lost' && lead.stage !== 'Won' && (
                      <button
                        onClick={handleConvertToJobClick}
                        className="w-full px-4 py-2 text-white rounded-[32px] hover:bg-[#7f5fd9] transition-colors text-sm font-medium"
                        style={{ backgroundColor: '#9473ff' }}
                      >
                        Convert to Job
                      </button>
                    )}
                    
                    {/* Reopen Lead Button - Only show when Lost (Admin only) */}
                    {lead.stage === 'Lost' && (
                      <button
                        onClick={handleReopenLead}
                        className="w-full px-4 py-2 bg-[#9473ff] text-white rounded-[32px] hover:bg-[#7f5fd9] transition-colors text-sm font-medium"
                      >
                        Reopen
                      </button>
                    )}
                  </div>
                </div>

                {/* Reopen Note Input - Show when user clicks Reopen */}
                {showReopenNote && (
                  <div className="mt-2 p-3 bg-white rounded-lg border border-[#e2e8f0]">
                    <label className="block text-xs font-medium text-[#051046] mb-2">Reopen Notes</label>
                    <textarea
                      value={reopenNoteText}
                      onChange={(e) => setReopenNoteText(e.target.value)}
                      className="w-full px-3 py-2 border border-[#e8e8e8] rounded-[15px] text-sm text-[#051046] focus:outline-none focus:ring-2 focus:ring-green-600"
                      placeholder="Reason for reopening the lead?"
                      rows={3}
                    ></textarea>
                    <div className="flex gap-2 mt-2">
                      <button
                        className="flex-1 px-3 py-1.5 bg-green-600 text-white rounded-[32px] hover:bg-green-700 transition-colors text-xs font-medium"
                        onClick={handleSaveReopenNote}
                      >
                        Reopen Lead
                      </button>
                      <button
                        className="flex-1 px-3 py-1.5 border border-[#e8e8e8] bg-white text-[#051046] rounded-[32px] hover:bg-gray-50 transition-colors text-xs font-medium"
                        onClick={() => {
                          setReopenNoteText('');
                          setShowReopenNote(false);
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}

                {/* Active Automations */}
                <div className="bg-gray-50 rounded-[20px] p-4">
                  <h3 className="text-sm font-semibold text-[#051046] mb-3">Active Automations</h3>
                  <div className="space-y-3">
                    <div className="flex items-start gap-2">
                      <Bell className="w-4 h-4 text-purple-600 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-xs text-[#051046]">Follow-up SMS scheduled after 24 hours</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <Bell className="w-4 h-4 text-purple-600 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-xs text-[#051046]">Auto task creation if no activity after 4 hours</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Developer Notes Popup */}
      <DeveloperNotesPopup
        isOpen={showDevNotes}
        onClose={() => setShowDevNotes(false)}
        title={devNotesTitle}
        content={devNotesContent}
      />
      
      {/* Convert Confirmation Modal */}
      {showConvertConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60]">
          <div 
            className="bg-white rounded-[20px] p-6 border border-[#e2e8f0] w-full max-w-md"
            style={{ boxShadow: 'rgba(226, 232, 240, 0.5) 0px 2px 16px 2px' }}
          >
            <h2 className="text-lg font-semibold text-[#051046] mb-4">Confirm Conversion</h2>
            <p className="text-sm text-gray-600 mb-6">
              Are you sure you want to convert this lead to a job? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleConfirmConversion}
                className="flex-1 px-6 py-3 text-white rounded-[32px] hover:bg-[#7f5fd9] transition-colors text-sm font-medium"
                style={{ backgroundColor: '#9473ff' }}
              >
                Convert to Job
              </button>
              <button
                onClick={() => setShowConvertConfirmation(false)}
                className="flex-1 px-6 py-3 border border-[#e8e8e8] bg-white text-[#051046] rounded-[32px] hover:bg-gray-50 transition-colors text-sm font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}