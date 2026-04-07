import { Phone, Mail, Clock, DollarSign } from 'lucide-react';
import { useDrag } from 'react-dnd';

export interface Lead {
  id: string;
  clientName: string;
  email: string;
  phone: string;
  address?: string;
  serviceType: string;
  estimatedValue: number;
  priority: 'High' | 'Medium' | 'Low';
  daysInStage: number;
  stage: 'New' | 'Contacted' | 'Price Shared' | 'Follow-Up' | 'Won' | 'Lost';
  leadSource: string;
  activityTimeline: Array<{
    id: string;
    type: 'email' | 'call' | 'note' | 'stage_change' | 'price_shared' | 'converted' | 'payment';
    description: string;
    timestamp: string;
    user?: string;
  }>;
  notes: string;
  createdDate: string;
}

interface LeadCardProps {
  lead: Lead;
  onClick: () => void;
}

export function LeadCard({ lead, onClick }: LeadCardProps) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'LEAD',
    item: { id: lead.id, currentStage: lead.stage },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  const priorityColors = {
    High: 'bg-red-100 text-red-700 border-red-200',
    Medium: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    Low: 'bg-green-100 text-green-700 border-green-200',
  };

  return (
    <div
      ref={drag}
      onClick={onClick}
      className="bg-white rounded-[20px] border border-[#e2e8f0] p-3 mb-2 cursor-pointer hover:shadow-md transition-shadow"
      style={{
        boxShadow: isDragging ? 'rgba(226, 232, 240, 0.8) 0px 4px 20px 4px' : 'rgba(226, 232, 240, 0.5) 0px 2px 16px 2px',
        opacity: isDragging ? 0.5 : 1,
      }}
    >
      {/* Header with Name */}
      <div className="mb-2">
        <h3 className="text-sm font-semibold text-[#051046] mb-0.5 truncate">{lead.clientName}</h3>
        <p className="text-xs text-gray-500 truncate">{lead.serviceType}</p>
      </div>

      {/* Estimated Value */}
      <div className="flex items-center gap-1.5 mb-2">
        <DollarSign className="w-3.5 h-3.5 text-green-600" />
        <span className="text-sm font-semibold text-[#051046]">
          ${lead.estimatedValue.toLocaleString()}
        </span>
      </div>

      {/* Contact Info */}
      <div className="space-y-1.5 mb-2">
        <div className="flex items-center gap-1.5">
          <Phone className="w-3 h-3 text-gray-400 flex-shrink-0" />
          <span className="text-xs text-gray-600 truncate">{lead.phone}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Mail className="w-3 h-3 text-gray-400 flex-shrink-0" />
          <span className="text-xs text-gray-600 truncate">{lead.email}</span>
        </div>
      </div>

      {/* Days in Stage & Priority */}
      <div className="flex items-center gap-2 pt-2 border-t border-gray-100">
        <div className="flex items-center gap-1 text-xs text-gray-500">
          <Clock className="w-3 h-3" />
          <span>{lead.daysInStage}d</span>
        </div>
        <span className={`text-xs px-1.5 py-0.5 rounded-full border whitespace-nowrap ${priorityColors[lead.priority]}`}>
          {lead.priority}
        </span>
      </div>
    </div>
  );
}