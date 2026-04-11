import { X, Calendar, DollarSign, User, MapPin, Phone, Mail, Edit2 } from 'lucide-react';
import { useNavigate } from 'react-router';
import { useJobs } from '../contexts/JobsContext';

interface ServicePlan {
  id: string;
  customerId: string;
  clientName: string;
  clientEmail: string;
  propertyAddress: string;
  phone: string;
  serviceName: string;
  serviceDescription: string;
  price: number;
  currency: string;
  billingInterval: 'day' | 'week' | 'month' | 'year';
  intervalCount: number;
  startDate: string;
  trialDays: number;
  cancelAt: string | null;
  autoRenew: boolean;
  collectionMethod: 'charge_automatically' | 'send_invoice';
  paymentMethod: string;
  paymentType?: 'card' | 'cash' | 'other';
  discount: number;
  status: 'pending' | 'approved' | 'active' | 'canceled' | 'failed' | 'declined';
  nextBillingDate: string;
  createdAt: string;
  upsoldBy?: { name: string; type: 'T' | 'A' } | null;
  totalVisits: number;
  visitsUsed: number;
}

interface PlanDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan: ServicePlan | null;
  onScheduleJob?: (planData: {
    clientName: string;
    clientEmail: string;
    clientPhone: string;
    address: string;
    serviceName: string;
    serviceDescription: string;
    servicePlanId: string;
  }) => void;
  onEditPlan?: (plan: ServicePlan) => void;
  onPayNow?: (plan: ServicePlan) => void;
  onViewInvoice?: (plan: ServicePlan) => void;
}

export function PlanDetailsModal({ isOpen, onClose, plan, onScheduleJob, onEditPlan, onPayNow, onViewInvoice }: PlanDetailsModalProps) {
  const navigate = useNavigate();
  const { jobs } = useJobs();

  if (!isOpen || !plan) return null;

  const visitsRemaining = plan.totalVisits - plan.visitsUsed;

  // Get jobs linked to this service plan
  const planJobs = jobs.filter(job => (job as any).servicePlanId === plan.id);

  const formatBillingInterval = (interval: string, count: number) => {
    const intervalText = interval === 'month' ? 'Monthly' : 
                        interval === 'year' ? 'Yearly' : 
                        interval === 'week' ? 'Weekly' : 
                        interval === 'day' ? 'Daily' : interval;
    
    if (count === 1) return intervalText;
    return `Every ${count} ${interval}s`;
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'text-[#051046]';
      case 'pending':
        return 'text-[#051046]';
      case 'approved':
        return 'text-white';
      case 'canceled':
        return 'text-white';
      default:
        return 'text-[#051046]';
    }
  };

  const getStatusBadgeBackground = (status: string) => {
    switch (status) {
      case 'active':
        return '#b9df10';
      case 'pending':
        return '#28bdf2';
      case 'approved':
        return '#9473ff';
      case 'canceled':
        return '#f16a6a';
      default:
        return '#e2e8f0';
    }
  };

  const getStatusDotColor = (status: string) => {
    switch (status) {
      case 'active':
        return '#b9df10';
      case 'pending':
        return '#28bdf2';
      case 'approved':
        return '#9473ff';
      case 'canceled':
        return '#f16a6a';
      case 'failed':
        return '#f97316'; // Orange for failed
      case 'declined':
        return '#f16a6a'; // Red for declined
      default:
        return '#9ca3af';
    }
  };

  const handleScheduleJob = () => {
    if (onScheduleJob) {
      onScheduleJob({
        clientName: plan.clientName,
        clientEmail: plan.clientEmail,
        clientPhone: plan.phone,
        address: plan.propertyAddress,
        serviceName: plan.serviceName,
        serviceDescription: plan.serviceDescription,
        servicePlanId: plan.id,
      });
    }
  };

  const handleJobClick = (jobId: string) => {
    navigate(`/admin/jobs/details/${encodeURIComponent(jobId)}`);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div 
        className="bg-white rounded-[20px] w-full max-w-4xl border border-[#e2e8f0] overflow-hidden max-h-[90vh] overflow-y-auto"
        style={{ boxShadow: 'rgba(226, 232, 240, 0.5) 0px 2px 16px 2px' }}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-[#e2e8f0] px-6 py-4 z-10 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-[#051046]">Service Plan Details</h2>
            <p className="text-sm text-gray-500 mt-1">{plan.id}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-[#051046]" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Status and Visits Card */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded-[15px] border border-[#e2e8f0] p-4">
              <p className="text-sm text-gray-500 mb-2">Plan Status</p>
              <div className="flex items-center gap-2">
                <div 
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: getStatusDotColor(plan.status) }}
                />
                <span className="text-sm text-[#051046]">
                  {plan.status.charAt(0).toUpperCase() + plan.status.slice(1).replace('_', ' ')}
                </span>
              </div>
            </div>
            <div className="bg-gray-50 rounded-[15px] border border-[#e2e8f0] p-4">
              <p className="text-sm text-gray-500 mb-2">Visits</p>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-[#051046]">{visitsRemaining}</span>
                <span className="text-sm text-gray-500">remaining ({plan.visitsUsed}/{plan.totalVisits} used)</span>
              </div>
            </div>
          </div>

          {/* Client Information */}
          <div className="bg-white rounded-[15px] border border-[#e2e8f0] p-6">
            <h3 className="text-lg font-semibold text-[#051046] mb-4">Client Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <User className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-[#051046]">{plan.clientName}</p>
                  <p className="text-xs text-gray-500">Client</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-[#051046]">{plan.clientEmail}</p>
                  <p className="text-xs text-gray-500">Email</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-[#051046]">{plan.phone}</p>
                  <p className="text-xs text-gray-500">Phone</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-[#051046]">{plan.propertyAddress}</p>
                  <p className="text-xs text-gray-500">Address</p>
                </div>
              </div>
            </div>
          </div>

          {/* Service Details */}
          <div className="bg-white rounded-[15px] border border-[#e2e8f0] p-6">
            <h3 className="text-lg font-semibold text-[#051046] mb-4">Service Details</h3>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-500">Service</p>
                <p className="text-sm font-medium text-[#051046]">{plan.serviceName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Description</p>
                <p className="text-sm font-medium text-[#051046]">{plan.serviceDescription}</p>
              </div>
            </div>
          </div>

          {/* Billing Information */}
          <div className="bg-white rounded-[15px] border border-[#e2e8f0] p-6">
            <h3 className="text-lg font-semibold text-[#051046] mb-4">Billing Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Price</p>
                <p className="text-lg font-semibold text-[#051046]">${plan.price} {plan.currency}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Billing Cycle</p>
                <p className="text-sm font-medium text-[#051046]">{formatBillingInterval(plan.billingInterval, plan.intervalCount)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Next Billing Date</p>
                <p className="text-sm font-medium text-[#051046]">{plan.nextBillingDate}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Payment Method</p>
                <p className="text-sm font-medium text-[#051046]">
                  {plan.paymentMethod.includes('_') 
                    ? `Card ending in ${plan.paymentMethod.split('_').pop()}` 
                    : plan.paymentMethod}
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {onEditPlan && (
              <button
                onClick={() => onEditPlan(plan)}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-white text-[#9473ff] border border-[#9473ff] rounded-[32px] hover:bg-[#f8f5ff] transition-colors"
              >
                <Edit2 className="w-5 h-5" />
                Edit
              </button>
            )}

            {/* View Button - Show for approved and active statuses */}
            {(plan.status === 'approved' || plan.status === 'active') && (
              <button
                onClick={() => {
                  if (onViewInvoice) {
                    onViewInvoice(plan);
                  }
                }}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-white text-[#9473ff] border border-[#9473ff] rounded-[32px] hover:bg-[#f8f5ff] transition-colors"
              >
                View
              </button>
            )}

            {/* Pay Now Button - Only show if plan status is approved */}
            {plan.status === 'approved' && (
              <button
                onClick={() => {
                  if (onPayNow) {
                    onPayNow(plan);
                  }
                }}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-[#9473ff] text-white rounded-[32px] hover:bg-[#7f5fd9] transition-colors"
              >
                <DollarSign className="w-5 h-5" />
                Pay Now
              </button>
            )}

            {/* Schedule Job Button - Only show if plan status is active */}
            {plan.status === 'active' && (
              <button
                onClick={handleScheduleJob}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-[#9473ff] text-white rounded-[32px] hover:bg-[#7f5fd9] transition-colors"
              >
                <Calendar className="w-5 h-5" />
                Schedule Job
              </button>
            )}
          </div>

          {/* Timeline / Visit History */}
          <div className="bg-white rounded-[15px] border border-[#e2e8f0] p-6">
            <h3 className="text-lg font-semibold text-[#051046] mb-4">Visit Timeline</h3>
            {planJobs.length > 0 ? (
              <div className="space-y-3">
                {planJobs.map((job, index) => (
                  <div
                    key={job.id}
                    onClick={() => handleJobClick(job.id)}
                    className="flex items-start gap-4 p-4 border border-[#e2e8f0] rounded-[15px] hover:bg-gray-50 cursor-pointer transition-colors"
                  >
                    <div className="flex-shrink-0">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        job.jobStatus === 'Done' ? 'bg-[#b9df10]' : 
                        job.jobStatus === 'In Progress' ? 'bg-[#28bdf2]' : 
                        job.jobStatus === 'Scheduled' ? 'bg-[#9473ff]' : 
                        'bg-gray-300'
                      }`}>
                        <span className="text-white text-sm font-bold">{index + 1}</span>
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-sm font-semibold text-[#051046]">{job.jobType}</p>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          job.jobStatus === 'Done' ? 'bg-[#b9df10] text-[#051046]' : 
                          job.jobStatus === 'In Progress' ? 'bg-[#28bdf2] text-white' : 
                          job.jobStatus === 'Scheduled' ? 'bg-[#9473ff] text-white' : 
                          'bg-gray-200 text-gray-700'
                        }`}>
                          {job.jobStatus || 'Unscheduled'}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">{job.scheduled}</p>
                      {job.tech && (
                        <p className="text-xs text-gray-600 mt-1">Tech: {job.tech}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-sm text-gray-500">No visits scheduled yet</p>
                <p className="text-xs text-gray-400 mt-1">Click "Schedule Job" to schedule the first visit</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
