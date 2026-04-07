import React from 'react';
import { CheckCircle, Clock, AlertTriangle, AlertCircle } from 'lucide-react';

export default function TechnicianIndicatorDemo() {
  const technicians = [
    { name: 'Mike Bailey', status: 'available', capacity: 25 },
    { name: 'John Tom', status: 'semi-busy', capacity: 60 },
    { name: 'Sarah Wilson', status: 'very-busy', capacity: 95 },
    { name: 'David Chen', status: 'double-booked', capacity: 120 },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-[#051046] mb-8">Technician Availability Indicator Options</h1>
        
        <div className="space-y-8">
          
          {/* Option 1: Current - Circle Dots */}
          <div className="bg-white p-6 rounded-[20px] border border-[#e2e8f0] shadow-sm">
            <h2 className="text-xl font-semibold text-[#051046] mb-4">1. Circle Dots (Current)</h2>
            <div className="space-y-2">
              <div className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg">
                <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: '#b9df10' }}></span>
                <span className="text-sm text-[#051046]">Mike Bailey</span>
              </div>
              <div className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg">
                <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: '#f0a041' }}></span>
                <span className="text-sm text-[#051046]">John Tom</span>
              </div>
              <div className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg">
                <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: '#f16a6a' }}></span>
                <span className="text-sm text-[#051046]">Sarah Wilson</span>
              </div>
              <div className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg">
                <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: '#f16a6a' }}></span>
                <span className="flex items-center gap-2 flex-1 text-sm text-[#051046]">
                  David Chen
                  <span className="text-xs text-[#f16a6a] font-medium">Double Booking</span>
                </span>
              </div>
            </div>
          </div>

          {/* Option 2: Status Badges */}
          <div className="bg-white p-6 rounded-[20px] border border-[#e2e8f0] shadow-sm">
            <h2 className="text-xl font-semibold text-[#051046] mb-4">2. Status Badges</h2>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg">
                <span className="text-sm text-[#051046]">Mike Bailey</span>
                <span className="px-3 py-1 rounded-full text-xs font-medium" style={{ backgroundColor: '#b9df10', color: '#051046' }}>Available</span>
              </div>
              <div className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg">
                <span className="text-sm text-[#051046]">John Tom</span>
                <span className="px-3 py-1 rounded-full text-xs font-medium" style={{ backgroundColor: '#f0a041', color: '#fff' }}>Busy</span>
              </div>
              <div className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg">
                <span className="text-sm text-[#051046]">Sarah Wilson</span>
                <span className="px-3 py-1 rounded-full text-xs font-medium" style={{ backgroundColor: '#f16a6a', color: '#fff' }}>Very Busy</span>
              </div>
              <div className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg">
                <span className="text-sm text-[#051046]">David Chen</span>
                <span className="px-3 py-1 rounded-full text-xs font-medium" style={{ backgroundColor: '#f16a6a', color: '#fff' }}>Double Booked</span>
              </div>
            </div>
          </div>

          {/* Option 3: Vertical Color Bars */}
          <div className="bg-white p-6 rounded-[20px] border border-[#e2e8f0] shadow-sm">
            <h2 className="text-xl font-semibold text-[#051046] mb-4">3. Vertical Color Bars</h2>
            <div className="space-y-2">
              <div className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg border-l-4" style={{ borderLeftColor: '#b9df10' }}>
                <span className="text-sm text-[#051046]">Mike Bailey</span>
              </div>
              <div className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg border-l-4" style={{ borderLeftColor: '#f0a041' }}>
                <span className="text-sm text-[#051046]">John Tom</span>
              </div>
              <div className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg border-l-4" style={{ borderLeftColor: '#f16a6a' }}>
                <span className="text-sm text-[#051046]">Sarah Wilson</span>
              </div>
              <div className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg border-l-4" style={{ borderLeftColor: '#f16a6a' }}>
                <span className="flex items-center gap-2 flex-1 text-sm text-[#051046]">
                  David Chen
                  <span className="text-xs text-[#f16a6a] font-medium">Double Booking</span>
                </span>
              </div>
            </div>
          </div>

          {/* Option 4: Icon-based Indicators */}
          <div className="bg-white p-6 rounded-[20px] border border-[#e2e8f0] shadow-sm">
            <h2 className="text-xl font-semibold text-[#051046] mb-4">4. Icon-based Indicators</h2>
            <div className="space-y-2">
              <div className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg">
                <CheckCircle className="w-4 h-4 flex-shrink-0" style={{ color: '#b9df10' }} />
                <span className="text-sm text-[#051046]">Mike Bailey</span>
              </div>
              <div className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg">
                <Clock className="w-4 h-4 flex-shrink-0" style={{ color: '#f0a041' }} />
                <span className="text-sm text-[#051046]">John Tom</span>
              </div>
              <div className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg">
                <AlertTriangle className="w-4 h-4 flex-shrink-0" style={{ color: '#f16a6a' }} />
                <span className="text-sm text-[#051046]">Sarah Wilson</span>
              </div>
              <div className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg">
                <AlertCircle className="w-4 h-4 flex-shrink-0" style={{ color: '#f16a6a' }} />
                <span className="flex items-center gap-2 flex-1 text-sm text-[#051046]">
                  David Chen
                  <span className="text-xs text-[#f16a6a] font-medium">Double Booking</span>
                </span>
              </div>
            </div>
          </div>

          {/* Option 5: Progress/Capacity Bars */}
          <div className="bg-white p-6 rounded-[20px] border border-[#e2e8f0] shadow-sm">
            <h2 className="text-xl font-semibold text-[#051046] mb-4">5. Capacity Progress Bars</h2>
            <div className="space-y-3">
              <div className="p-3 hover:bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-[#051046]">Mike Bailey</span>
                  <span className="text-xs text-gray-500">25% booked</span>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: '25%', backgroundColor: '#b9df10' }}></div>
                </div>
              </div>
              <div className="p-3 hover:bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-[#051046]">John Tom</span>
                  <span className="text-xs text-gray-500">60% booked</span>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: '60%', backgroundColor: '#f0a041' }}></div>
                </div>
              </div>
              <div className="p-3 hover:bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-[#051046]">Sarah Wilson</span>
                  <span className="text-xs text-gray-500">95% booked</span>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: '95%', backgroundColor: '#f16a6a' }}></div>
                </div>
              </div>
              <div className="p-3 hover:bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-[#051046]">David Chen</span>
                  <span className="text-xs font-medium" style={{ color: '#f16a6a' }}>120% - Double Booked!</span>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: '100%', backgroundColor: '#f16a6a' }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Option 6: Colored Background Rows */}
          <div className="bg-white p-6 rounded-[20px] border border-[#e2e8f0] shadow-sm">
            <h2 className="text-xl font-semibold text-[#051046] mb-4">6. Colored Background Rows</h2>
            <div className="space-y-2">
              <div className="flex items-center gap-3 p-3 rounded-lg" style={{ backgroundColor: 'rgba(185, 223, 16, 0.1)' }}>
                <span className="text-sm text-[#051046] font-medium">Mike Bailey</span>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg" style={{ backgroundColor: 'rgba(240, 160, 65, 0.1)' }}>
                <span className="text-sm text-[#051046] font-medium">John Tom</span>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg" style={{ backgroundColor: 'rgba(241, 106, 106, 0.1)' }}>
                <span className="text-sm text-[#051046] font-medium">Sarah Wilson</span>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg" style={{ backgroundColor: 'rgba(241, 106, 106, 0.15)' }}>
                <span className="flex items-center gap-2 flex-1 text-sm text-[#051046] font-medium">
                  David Chen
                  <span className="text-xs text-[#f16a6a] font-medium">Double Booking</span>
                </span>
              </div>
            </div>
          </div>

          {/* Option 7: Battery-style Indicators */}
          <div className="bg-white p-6 rounded-[20px] border border-[#e2e8f0] shadow-sm">
            <h2 className="text-xl font-semibold text-[#051046] mb-4">7. Battery-style Indicators</h2>
            <div className="space-y-2">
              <div className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg">
                <div className="flex items-center gap-1 border-2 rounded px-1 py-0.5" style={{ borderColor: '#b9df10' }}>
                  <div className="w-1.5 h-3 rounded-sm" style={{ backgroundColor: '#b9df10' }}></div>
                  <div className="w-1.5 h-3 rounded-sm bg-gray-200"></div>
                  <div className="w-1.5 h-3 rounded-sm bg-gray-200"></div>
                  <div className="w-1.5 h-3 rounded-sm bg-gray-200"></div>
                </div>
                <span className="text-sm text-[#051046]">Mike Bailey</span>
              </div>
              <div className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg">
                <div className="flex items-center gap-1 border-2 rounded px-1 py-0.5" style={{ borderColor: '#f0a041' }}>
                  <div className="w-1.5 h-3 rounded-sm" style={{ backgroundColor: '#f0a041' }}></div>
                  <div className="w-1.5 h-3 rounded-sm" style={{ backgroundColor: '#f0a041' }}></div>
                  <div className="w-1.5 h-3 rounded-sm" style={{ backgroundColor: '#f0a041' }}></div>
                  <div className="w-1.5 h-3 rounded-sm bg-gray-200"></div>
                </div>
                <span className="text-sm text-[#051046]">John Tom</span>
              </div>
              <div className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg">
                <div className="flex items-center gap-1 border-2 rounded px-1 py-0.5" style={{ borderColor: '#f16a6a' }}>
                  <div className="w-1.5 h-3 rounded-sm" style={{ backgroundColor: '#f16a6a' }}></div>
                  <div className="w-1.5 h-3 rounded-sm" style={{ backgroundColor: '#f16a6a' }}></div>
                  <div className="w-1.5 h-3 rounded-sm" style={{ backgroundColor: '#f16a6a' }}></div>
                  <div className="w-1.5 h-3 rounded-sm" style={{ backgroundColor: '#f16a6a' }}></div>
                </div>
                <span className="text-sm text-[#051046]">Sarah Wilson</span>
              </div>
              <div className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg">
                <div className="flex items-center gap-1 border-2 rounded px-1 py-0.5 relative" style={{ borderColor: '#f16a6a' }}>
                  <div className="w-1.5 h-3 rounded-sm" style={{ backgroundColor: '#f16a6a' }}></div>
                  <div className="w-1.5 h-3 rounded-sm" style={{ backgroundColor: '#f16a6a' }}></div>
                  <div className="w-1.5 h-3 rounded-sm" style={{ backgroundColor: '#f16a6a' }}></div>
                  <div className="w-1.5 h-3 rounded-sm" style={{ backgroundColor: '#f16a6a' }}></div>
                  <AlertCircle className="w-3 h-3 absolute -top-1 -right-1" style={{ color: '#f16a6a' }} />
                </div>
                <span className="flex items-center gap-2 flex-1 text-sm text-[#051046]">
                  David Chen
                  <span className="text-xs text-[#f16a6a] font-medium">Double Booking</span>
                </span>
              </div>
            </div>
          </div>

          {/* Option 8: Combination - Dot + Background */}
          <div className="bg-white p-6 rounded-[20px] border border-[#e2e8f0] shadow-sm">
            <h2 className="text-xl font-semibold text-[#051046] mb-4">8. Combination (Dot + Background Tint)</h2>
            <div className="space-y-2">
              <div className="flex items-center gap-3 p-3 rounded-lg" style={{ backgroundColor: 'rgba(185, 223, 16, 0.05)' }}>
                <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: '#b9df10' }}></span>
                <span className="text-sm text-[#051046]">Mike Bailey</span>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg" style={{ backgroundColor: 'rgba(240, 160, 65, 0.05)' }}>
                <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: '#f0a041' }}></span>
                <span className="text-sm text-[#051046]">John Tom</span>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg" style={{ backgroundColor: 'rgba(241, 106, 106, 0.05)' }}>
                <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: '#f16a6a' }}></span>
                <span className="text-sm text-[#051046]">Sarah Wilson</span>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg" style={{ backgroundColor: 'rgba(241, 106, 106, 0.08)' }}>
                <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: '#f16a6a' }}></span>
                <span className="flex items-center gap-2 flex-1 text-sm text-[#051046]">
                  David Chen
                  <span className="text-xs text-[#f16a6a] font-medium">Double Booking</span>
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
