export function ReportPage() {
  return (
    <div className="p-4 md:p-8">
      <div className="bg-white rounded-[20px] border border-[#e2e8f0] p-4 md:p-6" style={{ boxShadow: 'rgba(226, 232, 240, 0.5) 0px 2px 16px 2px' }}>
        {/* Page Title and Description */}
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-[#051046] mb-2">Reports</h1>
          <p className="text-gray-600">View detailed analytics and insights about your business performance</p>
        </div>

        <p className="text-gray-600">Report content here...</p>
      </div>
    </div>
  );
}