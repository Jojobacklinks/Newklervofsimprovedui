import { Search, Box, History, ChevronDown, Wrench, ArrowRightLeft } from 'lucide-react';
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
}

interface TransferLog {
  id: string;
  itemId: string;
  itemName: string;
  from: string;
  to: string;
  quantity: number;
  date: string;
  transferredBy: string;
}

type ActivityType = 'all' | 'usage' | 'transfer';

interface ActivityEntry {
  id: string;
  type: 'usage' | 'transfer';
  itemName: string;
  itemSku?: string;
  itemCost?: number;
  itemCategory?: string;
  itemBrand?: string;
  quantity: number;
  date: string;
  // Usage specific
  usedBy?: string;
  jobNumber?: string;
  // Transfer specific
  from?: string;
  to?: string;
  transferredBy?: string;
}

interface UsageHistoryViewProps {
  usageLogs: UsageLog[];
  transferLogs: TransferLog[];
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  sortBy: 'date' | 'name' | 'used';
  setSortBy: (value: 'date' | 'name' | 'used') => void;
  sortOrder: 'asc' | 'desc';
  setSortOrder: (value: 'asc' | 'desc') => void;
  currentPage: number;
  setCurrentPage: (value: number) => void;
  itemsPerPage: number;
}

export function UsageHistoryView({ 
  usageLogs,
  transferLogs = [],
  searchQuery, 
  setSearchQuery,
  sortBy,
  setSortBy,
  sortOrder,
  setSortOrder,
  currentPage,
  setCurrentPage,
  itemsPerPage
}: UsageHistoryViewProps) {
  const [activityFilter, setActivityFilter] = useState<ActivityType>('all');

  // Combine usage and transfer logs into unified activity entries
  const allActivities: ActivityEntry[] = [
    ...(usageLogs || []).map(log => ({
      id: log.id,
      type: 'usage' as const,
      itemName: log.itemName,
      itemSku: log.itemSku,
      itemCost: log.itemCost,
      itemCategory: log.itemCategory,
      itemBrand: log.itemBrand,
      quantity: log.usedCount,
      date: log.date,
      usedBy: log.usedBy,
      jobNumber: log.jobNumber
    })),
    ...(transferLogs || []).map(log => ({
      id: log.id,
      type: 'transfer' as const,
      itemName: log.itemName,
      quantity: log.quantity,
      date: log.date,
      from: log.from,
      to: log.to,
      transferredBy: log.transferredBy
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
      (activity.itemSku && activity.itemSku.toLowerCase().includes(searchLower)) ||
      (activity.usedBy && activity.usedBy.toLowerCase().includes(searchLower)) ||
      (activity.jobNumber && activity.jobNumber.toLowerCase().includes(searchLower)) ||
      (activity.from && activity.from.toLowerCase().includes(searchLower)) ||
      (activity.to && activity.to.toLowerCase().includes(searchLower))
    );
  });

  // Sort activities
  const sortedActivities = [...filteredActivities].sort((a, b) => {
    let compareValue = 0;
    
    if (sortBy === 'date') {
      compareValue = new Date(a.date).getTime() - new Date(b.date).getTime();
    } else if (sortBy === 'name') {
      compareValue = a.itemName.localeCompare(b.itemName);
    } else if (sortBy === 'used') {
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
      // Always show first page
      pages.push(1);
      
      // Calculate range around current page
      let start = Math.max(2, currentPage - 2);
      let end = Math.min(totalPages - 1, currentPage + 2);
      
      if (start > 2) pages.push('...');
      
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
      
      if (end < totalPages - 1) pages.push('...');
      
      // Always show last page
      pages.push(totalPages);
    }
    
    return pages;
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
          <option value="usage">Usage Only</option>
          <option value="transfer">Transfers Only</option>
        </select>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as any)}
          className="px-4 py-2 border border-[#e8e8e8] rounded-[32px] focus:outline-none focus:border-[#9473ff]"
        >
          <option value="date">No sorting</option>
          <option value="name">Sort by Name</option>
          <option value="used">Sort by Quantity</option>
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
              <th className="text-left py-3 px-4 text-sm font-semibold text-[#6a7282] uppercase tracking-wider">Date</th>
            </tr>
          </thead>
          <tbody>
            {paginatedActivities.map((activity) => (
              <tr key={activity.id} className="border-b border-[#e2e8f0] hover:bg-gray-50">
                {/* Activity Type Badge */}
                <td className="py-4 px-4">
                  {activity.type === 'usage' ? (
                    <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-[#f0a041] text-white">
                      <Wrench className="w-3 h-3" />
                      Used
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-[#6366f1] text-white">
                      <ArrowRightLeft className="w-3 h-3" />
                      Transferred
                    </span>
                  )}
                </td>

                {/* Item Info */}
                <td className="py-4 px-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-[10px] flex items-center justify-center bg-blue-100">
                      <Box className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-[#051046]">{activity.itemName}</p>
                    </div>
                  </div>
                </td>

                {/* Activity Details */}
                <td className="py-4 px-4">
                  {activity.type === 'usage' ? (
                    <div className="text-sm">
                      <p className="text-gray-700">
                        <span className="font-medium text-[#051046]">{activity.usedBy}</span>
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Job #{activity.jobNumber}
                      </p>
                    </div>
                  ) : (
                    <div className="text-sm">
                      <p className="text-gray-700">
                        <span className="font-medium text-[#051046]">{activity.from}</span>
                        <span className="mx-2 text-gray-400">→</span>
                        <span className="font-medium text-[#051046]">{activity.to}</span>
                      </p>
                    </div>
                  )}
                </td>

                {/* Quantity */}
                <td className="py-4 px-4 text-center">
                  <span className="inline-flex items-center justify-center w-16 h-8 rounded-full bg-gray-100 font-semibold text-[#051046]">
                    {activity.quantity}
                  </span>
                </td>

                {/* Date */}
                <td className="py-4 px-4 text-sm text-gray-600">
                  {new Date(activity.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {paginatedActivities.length === 0 && (
          <div className="text-center py-12">
            <History className="w-12 h-12 text-gray-300 mx-auto mb-3" />
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
              {getPageNumbers().map((page, index) => {
                if (page === '...') {
                  return (
                    <span key={`ellipsis-${index}`} className="px-3 py-1 text-gray-400">
                      ...
                    </span>
                  );
                }
                
                return (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page as number)}
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                      currentPage === page
                        ? 'bg-[#9473ff] text-white'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {page}
                  </button>
                );
              })}
              
              {currentPage < totalPages && (
                <button
                  onClick={() => setCurrentPage(currentPage + 1)}
                  className="ml-2 w-8 h-8 rounded-full flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors"
                >
                  <ChevronDown className="w-4 h-4 rotate-[-90deg]" />
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
