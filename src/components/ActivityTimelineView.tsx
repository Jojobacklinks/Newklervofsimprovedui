import { Search, Box, ChevronDown, Wrench, ArrowRightLeft, PackagePlus, RotateCcw, Settings, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';

interface UsageLog {
  id: string;
  itemId: string;
  itemName: string;
  itemSku: string;
  itemCost: number;
  itemCategory: string;
  itemBrand: string;
  itemPhoto?: string;
  usedCount: number;
  usedBy: string;
  jobNumber: string;
  date: string;
  time?: string;
}

interface TransferLog {
  id: string;
  itemId: string;
  itemName: string;
  itemPhoto?: string;
  from: string;
  to: string;
  quantity: number;
  date: string;
  time?: string;
  transferredBy: string;
}

interface StockRestoredLog {
  id: string;
  itemId: string;
  itemName: string;
  itemPhoto?: string;
  quantity: number;
  jobNumber: string;
  reason: 'cancelled' | 'refunded';
  restoredBy: string;
  date: string;
  time: string;
}

interface StockAdjustedLog {
  id: string;
  itemId: string;
  itemName: string;
  itemPhoto?: string;
  oldQuantity: number;
  newQuantity: number;
  reason: string;
  adjustedBy: string;
  date: string;
  time: string;
}

type ActivityType = 'all' | 'usage' | 'transfer' | 'restored' | 'adjusted';

interface ActivityEntry {
  id: string;
  type: 'usage' | 'transfer' | 'restored' | 'adjusted';
  itemName: string;
  itemPhoto?: string;
  quantity: number;
  date: string;
  time: string;
  // Usage specific
  usedBy?: string;
  jobNumber?: string;
  // Transfer specific
  from?: string;
  to?: string;
  transferredBy?: string;
  // Restored specific
  reason?: 'cancelled' | 'refunded';
  restoredBy?: string;
  // Adjusted specific
  oldQuantity?: number;
  newQuantity?: number;
  adjustReason?: string;
  adjustedBy?: string;
}

interface ActivityTimelineViewProps {
  usageLogs: UsageLog[];
  transferLogs: TransferLog[];
  stockRestoredLogs: StockRestoredLog[];
  stockAdjustedLogs: StockAdjustedLog[];
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  sortBy: 'date' | 'name' | 'quantity';
  setSortBy: (value: 'date' | 'name' | 'quantity') => void;
  sortOrder: 'asc' | 'desc';
  setSortOrder: (value: 'asc' | 'desc') => void;
  currentPage: number;
  setCurrentPage: (value: number) => void;
  itemsPerPage: number;
}

export function ActivityTimelineView({ 
  usageLogs,
  transferLogs,
  stockRestoredLogs,
  stockAdjustedLogs,
  searchQuery, 
  setSearchQuery,
  sortBy,
  setSortBy,
  sortOrder,
  setSortOrder,
  currentPage,
  setCurrentPage,
  itemsPerPage
}: ActivityTimelineViewProps) {
  const [activityFilter, setActivityFilter] = useState<ActivityType>('all');

  // Combine all activity logs into unified entries
  const allActivities: ActivityEntry[] = [
    ...(usageLogs || []).map(log => ({
      id: log.id,
      type: 'usage' as const,
      itemName: log.itemName,
      itemPhoto: log.itemPhoto,
      quantity: log.usedCount,
      date: log.date,
      time: log.time || '12:00 PM',
      usedBy: log.usedBy,
      jobNumber: log.jobNumber
    })),
    ...(transferLogs || []).map(log => ({
      id: log.id,
      type: 'transfer' as const,
      itemName: log.itemName,
      itemPhoto: log.itemPhoto,
      quantity: log.quantity,
      date: log.date,
      time: log.time || '12:00 PM',
      from: log.from,
      to: log.to,
      transferredBy: log.transferredBy
    })),
    ...(stockRestoredLogs || []).map(log => ({
      id: log.id,
      type: 'restored' as const,
      itemName: log.itemName,
      itemPhoto: log.itemPhoto,
      quantity: log.quantity,
      date: log.date,
      time: log.time || '12:00 PM',
      jobNumber: log.jobNumber,
      reason: log.reason,
      restoredBy: log.restoredBy
    })),
    ...(stockAdjustedLogs || []).map(log => ({
      id: log.id,
      type: 'adjusted' as const,
      itemName: log.itemName,
      itemPhoto: log.itemPhoto,
      quantity: Math.abs(log.newQuantity - log.oldQuantity),
      date: log.date,
      time: log.time || '12:00 PM',
      oldQuantity: log.oldQuantity,
      newQuantity: log.newQuantity,
      adjustReason: log.reason,
      adjustedBy: log.adjustedBy
    }))
  ];

  // Filter by activity type
  const typeFilteredActivities = allActivities.filter(activity => {
    if (activityFilter === 'all') return true;
    return activity.type === activityFilter;
  });

  // Filter logs based on search query
  const filteredActivities = typeFilteredActivities.filter(activity => {
    const searchLower = searchQuery.toLowerCase();
    return (
      activity.itemName.toLowerCase().includes(searchLower) ||
      (activity.usedBy && activity.usedBy.toLowerCase().includes(searchLower)) ||
      (activity.jobNumber && activity.jobNumber.toLowerCase().includes(searchLower)) ||
      (activity.from && activity.from.toLowerCase().includes(searchLower)) ||
      (activity.to && activity.to.toLowerCase().includes(searchLower)) ||
      (activity.restoredBy && activity.restoredBy.toLowerCase().includes(searchLower)) ||
      (activity.adjustedBy && activity.adjustedBy.toLowerCase().includes(searchLower)) ||
      (activity.transferredBy && activity.transferredBy.toLowerCase().includes(searchLower))
    );
  });

  // Sort activities
  const sortedActivities = [...filteredActivities].sort((a, b) => {
    let compareValue = 0;
    
    if (sortBy === 'date') {
      const dateA = new Date(`${a.date} ${a.time}`).getTime();
      const dateB = new Date(`${b.date} ${b.time}`).getTime();
      compareValue = dateA - dateB;
    } else if (sortBy === 'name') {
      compareValue = a.itemName.localeCompare(b.itemName);
    } else if (sortBy === 'quantity') {
      compareValue = a.quantity - b.quantity;
    }
    
    return sortOrder === 'asc' ? compareValue : -compareValue;
  });

  // Pagination
  const totalPages = Math.ceil(sortedActivities.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedActivities = sortedActivities.slice(startIndex, endIndex);

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxPagesToShow = 10;
    
    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);
      let start = Math.max(2, currentPage - 2);
      let end = Math.min(totalPages - 1, currentPage + 2);
      if (start > 2) pages.push('...');
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
      if (end < totalPages - 1) pages.push('...');
      pages.push(totalPages);
    }
    return pages;
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'usage':
        return <Wrench className="w-3 h-3" />;
      case 'transfer':
        return <ArrowRightLeft className="w-3 h-3" />;
      case 'restored':
        return <RotateCcw className="w-3 h-3" />;
      case 'adjusted':
        return <Settings className="w-3 h-3" />;
      default:
        return <Box className="w-3 h-3" />;
    }
  };

  const getActivityBadgeColor = (type: string) => {
    switch (type) {
      case 'usage':
        return 'text-[#f16a6a]';
      case 'transfer':
        return 'text-[#9473ff]';
      case 'restored':
        return 'text-[#b9df10]';
      case 'adjusted':
        return 'text-[#28bdf2]';
      default:
        return 'text-gray-500';
    }
  };

  const getActivityLabel = (type: string) => {
    switch (type) {
      case 'usage':
        return 'Used';
      case 'transfer':
        return 'Transferred';
      case 'restored':
        return 'Restored';
      case 'adjusted':
        return 'Adjusted';
      default:
        return 'Unknown';
    }
  };

  return (
    <>
      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search activities..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-[#e8e8e8] rounded-[32px] focus:outline-none focus:border-[#9473ff]"
          />
        </div>

        <select
          value={activityFilter}
          onChange={(e) => setActivityFilter(e.target.value as ActivityType)}
          className="px-4 py-2 border border-[#e8e8e8] rounded-[32px] focus:outline-none focus:border-[#9473ff]"
        >
          <option value="all">All Activity</option>
          <option value="usage">Stock Used</option>
          <option value="restored">Stock Restored</option>
          <option value="adjusted">Stock Adjusted</option>
          <option value="transfer">Transfers</option>
        </select>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as any)}
          className="px-4 py-2 border border-[#e8e8e8] rounded-[32px] focus:outline-none focus:border-[#9473ff]"
        >
          <option value="date">Sort by Date</option>
          <option value="name">Sort by Name</option>
          <option value="quantity">Sort by Quantity</option>
        </select>
      </div>

      {/* Activity Timeline Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#e2e8f0]">
              <th className="text-left py-3 px-4 text-sm font-semibold text-[#6a7282] uppercase tracking-wider">Activity</th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-[#6a7282] uppercase tracking-wider">Item</th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-[#6a7282] uppercase tracking-wider">Details</th>
              <th className="text-center py-3 px-4 text-sm font-semibold text-[#6a7282] uppercase tracking-wider">Quantity</th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-[#6a7282] uppercase tracking-wider">Date & Time</th>
            </tr>
          </thead>
          <tbody>
            {paginatedActivities.map((activity) => (
              <tr key={activity.id} className="border-b border-[#e2e8f0] hover:bg-gray-50">
                {/* Activity Type Badge */}
                <td className="py-4 px-4">
                  <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[14px] font-medium ${getActivityBadgeColor(activity.type)}`}>
                    {getActivityIcon(activity.type)}
                    {getActivityLabel(activity.type)}
                  </span>
                </td>

                {/* Item Info */}
                <td className="py-4 px-4">
                  <div className="flex items-center gap-3">
                    {activity.itemPhoto ? (
                      <img 
                        src={activity.itemPhoto} 
                        alt={activity.itemName}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full flex items-center justify-center bg-blue-100">
                        <Box className="w-5 h-5 text-blue-600" />
                      </div>
                    )}
                    <div>
                      <p className="font-medium text-[#051046]">{activity.itemName}</p>
                    </div>
                  </div>
                </td>

                {/* Activity Details */}
                <td className="py-4 px-4">
                  {activity.type === 'usage' && (
                    <div className="text-sm">
                      <p className="text-gray-700">
                        Used by <span className="font-medium text-[#051046]">{activity.usedBy}</span>
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Job #{activity.jobNumber}
                      </p>
                    </div>
                  )}
                  {activity.type === 'transfer' && (
                    <div className="text-sm">
                      <p className="text-gray-700">
                        <span className="font-medium text-[#051046]">{activity.from}</span>
                        <span className="mx-2 text-gray-400">→</span>
                        <span className="font-medium text-[#051046]">{activity.to}</span>
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        By {activity.transferredBy}
                      </p>
                    </div>
                  )}
                  {activity.type === 'restored' && (
                    <div className="text-sm">
                      <p className="text-gray-700">
                        Job #{activity.jobNumber} - <span className="font-medium text-[#051046] capitalize">{activity.reason}</span>
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        By {activity.restoredBy}
                      </p>
                    </div>
                  )}
                  {activity.type === 'adjusted' && (
                    <div className="text-sm">
                      <p className="text-gray-700">
                        <span className="font-medium text-[#051046]">{activity.oldQuantity}</span>
                        <span className="mx-2 text-gray-400">→</span>
                        <span className="font-medium text-[#051046]">{activity.newQuantity}</span>
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {activity.adjustReason} • By {activity.adjustedBy}
                      </p>
                    </div>
                  )}
                </td>

                {/* Quantity */}
                <td className="py-4 px-4 text-center">
                  <span 
                    className="inline-flex items-center justify-center w-16 h-8 bg-gray-100 font-semibold text-[#051046]"
                    style={{ borderRadius: '0.25rem' }}
                  >
                    {activity.quantity}
                  </span>
                </td>

                {/* Date & Time */}
                <td className="py-4 px-4 text-sm text-gray-600">
                  <p className="font-medium text-[#051046]">
                    {new Date(activity.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {paginatedActivities.length === 0 && (
          <div className="text-center py-12">
            <Box className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No activity history found</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-6">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Showing {startIndex + 1} to {Math.min(endIndex, sortedActivities.length)} of {sortedActivities.length} entries
            </p>
            
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
      )}
    </>
  );
}
