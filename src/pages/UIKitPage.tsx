import { useState } from 'react';
import { useNavigate } from 'react-router';
import { StatusLabel, getStatusVariant } from '../components/StatusLabel';
import { Search, Plus, X, Check, AlertCircle, Info, Calendar, User, Mail, Phone, CheckCircle, ArrowLeft } from 'lucide-react';

export function UIKitPage() {
  const navigate = useNavigate();
  const [inputValue, setInputValue] = useState('');
  const [textareaValue, setTextareaValue] = useState('');
  const [selectValue, setSelectValue] = useState('option1');
  const [checkboxValue, setCheckboxValue] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 mb-6 text-[#051046] hover:text-[#9473ff] transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">Back to User Role Selection</span>
        </button>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#051046] mb-2">UI Kit</h1>
          <p className="text-gray-600">Klervo's design system reference guide</p>
        </div>

        {/* Colors Section */}
        <section className="bg-white rounded-[20px] border border-[#e2e8f0] p-6 mb-6" style={{ boxShadow: 'rgba(226, 232, 240, 0.5) 0px 2px 16px 2px' }}>
          <h2 className="text-xl font-semibold text-[#051046] mb-4">Color Palette</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            {/* Primary Colors */}
            <div>
              <h3 className="text-sm font-semibold text-gray-600 mb-3 uppercase">Primary Colors</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-[15px] bg-[#9473ff] border border-[#e2e8f0]" style={{ boxShadow: 'rgba(226, 232, 240, 0.5) 0px 2px 8px' }}></div>
                  <div>
                    <p className="text-sm font-medium text-[#051046]">#9473ff</p>
                    <p className="text-xs text-gray-500">Primary Button</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-[15px] bg-[#7f5fd9] border border-[#e2e8f0]" style={{ boxShadow: 'rgba(226, 232, 240, 0.5) 0px 2px 8px' }}></div>
                  <div>
                    <p className="text-sm font-medium text-[#051046]">#7f5fd9</p>
                    <p className="text-xs text-gray-500">Primary Hover</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-[15px] bg-[#051046] border border-[#e2e8f0]" style={{ boxShadow: 'rgba(226, 232, 240, 0.5) 0px 2px 8px' }}></div>
                  <div>
                    <p className="text-sm font-medium text-[#051046]">#051046</p>
                    <p className="text-xs text-gray-500">Text & Headings</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Border Colors */}
            <div>
              <h3 className="text-sm font-semibold text-gray-600 mb-3 uppercase">Border Colors</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-[15px] bg-white border-2 border-[#e2e8f0]" style={{ boxShadow: 'rgba(226, 232, 240, 0.5) 0px 2px 8px' }}></div>
                  <div>
                    <p className="text-sm font-medium text-[#051046]">#e2e8f0</p>
                    <p className="text-xs text-gray-500">Card Border</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-[15px] bg-white border-2 border-[#e8e8e8]" style={{ boxShadow: 'rgba(226, 232, 240, 0.5) 0px 2px 8px' }}></div>
                  <div>
                    <p className="text-sm font-medium text-[#051046]">#e8e8e8</p>
                    <p className="text-xs text-gray-500">Input Border</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Accent Colors */}
            <div>
              <h3 className="text-sm font-semibold text-gray-600 mb-3 uppercase">Accent Colors</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-[15px] bg-[#F8EFFF] border border-[#e2e8f0]" style={{ boxShadow: 'rgba(226, 232, 240, 0.5) 0px 2px 8px' }}></div>
                  <div>
                    <p className="text-sm font-medium text-[#051046]">#F8EFFF</p>
                    <p className="text-xs text-gray-500">Purple Light</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-[15px] bg-[#A6E4FA] border border-[#e2e8f0]" style={{ boxShadow: 'rgba(226, 232, 240, 0.5) 0px 2px 8px' }}></div>
                  <div>
                    <p className="text-sm font-medium text-[#051046]">#A6E4FA</p>
                    <p className="text-xs text-gray-500">Cyan Light</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-[15px] bg-[#FFDBE6] border border-[#e2e8f0]" style={{ boxShadow: 'rgba(226, 232, 240, 0.5) 0px 2px 8px' }}></div>
                  <div>
                    <p className="text-sm font-medium text-[#051046]">#FFDBE6</p>
                    <p className="text-xs text-gray-500">Pink Light</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-[15px] bg-[#E2F685] border border-[#e2e8f0]" style={{ boxShadow: 'rgba(226, 232, 240, 0.5) 0px 2px 8px' }}></div>
                  <div>
                    <p className="text-sm font-medium text-[#051046]">#E2F685</p>
                    <p className="text-xs text-gray-500">Lime Light</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Stage & Priority Colors */}
          <div className="mt-6 pt-6 border-t border-[#e2e8f0]">
            <h3 className="text-sm font-semibold text-gray-600 mb-4 uppercase">Stage & Priority Colors</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {/* New Stage - Blue */}
              <div className="flex flex-col items-center gap-2">
                <div className="w-16 h-16 rounded-[15px] bg-[#399DEB] border border-[#e2e8f0]" style={{ boxShadow: 'rgba(226, 232, 240, 0.5) 0px 2px 8px' }}></div>
                <div className="text-center">
                  <p className="text-xs font-medium text-[#051046]">#399DEB</p>
                  <p className="text-xs text-gray-500">New</p>
                </div>
              </div>
              
              {/* Contacted Stage - Cyan */}
              <div className="flex flex-col items-center gap-2">
                <div className="w-16 h-16 rounded-[15px] bg-[#28BDF2] border border-[#e2e8f0]" style={{ boxShadow: 'rgba(226, 232, 240, 0.5) 0px 2px 8px' }}></div>
                <div className="text-center">
                  <p className="text-xs font-medium text-[#051046]">#28BDF2</p>
                  <p className="text-xs text-gray-500">Contacted</p>
                </div>
              </div>
              
              {/* Price Shared / Low Priority - Lime */}
              <div className="flex flex-col items-center gap-2">
                <div className="w-16 h-16 rounded-[15px] bg-[#B9DF10] border border-[#e2e8f0]" style={{ boxShadow: 'rgba(226, 232, 240, 0.5) 0px 2px 8px' }}></div>
                <div className="text-center">
                  <p className="text-xs font-medium text-[#051046]">#B9DF10</p>
                  <p className="text-xs text-gray-500">Price Shared / Low</p>
                </div>
              </div>
              
              {/* Follow-Up / Medium Priority - Orange */}
              <div className="flex flex-col items-center gap-2">
                <div className="w-16 h-16 rounded-[15px] bg-[#F0A041] border border-[#e2e8f0]" style={{ boxShadow: 'rgba(226, 232, 240, 0.5) 0px 2px 8px' }}></div>
                <div className="text-center">
                  <p className="text-xs font-medium text-[#051046]">#F0A041</p>
                  <p className="text-xs text-gray-500">Follow-Up / Medium</p>
                </div>
              </div>
              
              {/* Won Stage - Purple */}
              <div className="flex flex-col items-center gap-2">
                <div className="w-16 h-16 rounded-[15px] bg-[#9473ff] border border-[#e2e8f0]" style={{ boxShadow: 'rgba(226, 232, 240, 0.5) 0px 2px 8px' }}></div>
                <div className="text-center">
                  <p className="text-xs font-medium text-[#051046]">#9473ff</p>
                  <p className="text-xs text-gray-500">Won</p>
                </div>
              </div>
              
              {/* Lost / High Priority - Red */}
              <div className="flex flex-col items-center gap-2">
                <div className="w-16 h-16 rounded-[15px] bg-[#f16a6a] border border-[#e2e8f0]" style={{ boxShadow: 'rgba(226, 232, 240, 0.5) 0px 2px 8px' }}></div>
                <div className="text-center">
                  <p className="text-xs font-medium text-[#051046]">#f16a6a</p>
                  <p className="text-xs text-gray-500">Lost / High</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Typography Section */}
        <section className="bg-white rounded-[20px] border border-[#e2e8f0] p-6 mb-6" style={{ boxShadow: 'rgba(226, 232, 240, 0.5) 0px 2px 16px 2px' }}>
          <h2 className="text-xl font-semibold text-[#051046] mb-4">Typography</h2>
          <div className="space-y-4">
            <div>
              <h1 className="text-3xl font-bold text-[#051046]">Heading 1 - Poppins Bold</h1>
              <p className="text-sm text-gray-500 mt-1">text-3xl font-bold</p>
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-[#051046]">Heading 2 - Poppins Semibold</h2>
              <p className="text-sm text-gray-500 mt-1">text-2xl font-semibold</p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-[#051046]">Heading 3 - Poppins Semibold</h3>
              <p className="text-sm text-gray-500 mt-1">text-xl font-semibold</p>
            </div>
            <div>
              <p className="text-base text-[#051046]">Body Text - Poppins Regular</p>
              <p className="text-sm text-gray-500 mt-1">text-base</p>
            </div>
            <div>
              <p className="text-sm text-[#051046]">Small Text - Poppins Regular</p>
              <p className="text-sm text-gray-500 mt-1">text-sm</p>
            </div>
            <div>
              <p className="text-xs text-gray-600">Extra Small Text - Poppins Regular</p>
              <p className="text-sm text-gray-500 mt-1">text-xs</p>
            </div>
          </div>
        </section>

        {/* Status Labels Section */}
        <section className="bg-white rounded-[20px] border border-[#e2e8f0] p-6 mb-6" style={{ boxShadow: 'rgba(226, 232, 240, 0.5) 0px 2px 16px 2px' }}>
          <h2 className="text-xl font-semibold text-[#051046] mb-4">Status Labels</h2>
          <p className="text-sm text-gray-600 mb-4">
            Use the <code className="px-2 py-0.5 bg-gray-100 rounded text-purple-600">&lt;StatusLabel&gt;</code> component for consistent status displays across the application.
          </p>
          
          <div className="space-y-6">
            {/* Lead Statuses */}
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Lead Statuses</h3>
              <div className="flex flex-wrap gap-3">
                <StatusLabel variant={getStatusVariant.leadNew} showDot>New</StatusLabel>
                <StatusLabel variant={getStatusVariant.leadContacted} showDot>Contacted</StatusLabel>
                <StatusLabel variant={getStatusVariant.leadPriceShared} showDot>Price Shared</StatusLabel>
                <StatusLabel variant={getStatusVariant.leadFollowUp} showDot>Follow-Up</StatusLabel>
                <StatusLabel variant={getStatusVariant.leadWon} showDot>Won</StatusLabel>
                <StatusLabel variant={getStatusVariant.leadLost} showDot>Lost</StatusLabel>
              </div>
            </div>

            {/* Estimate Statuses - Job Details Style */}
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Estimate Statuses (Job Details Style)</h3>
              <p className="text-xs text-gray-500 mb-3">Simple dot + text style from Job Details page</p>
              <div className="flex flex-wrap gap-4">
                {/* Approved */}
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[#b9df10]"></div>
                  <span className="text-sm text-[#051046]">Approved</span>
                </div>
                {/* Pending */}
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[#f0a041]"></div>
                  <span className="text-sm text-[#051046]">Pending</span>
                </div>
                {/* Declined */}
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[#f16a6a]"></div>
                  <span className="text-sm text-[#051046]">Declined</span>
                </div>
                {/* Unsent */}
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-gray-400"></div>
                  <span className="text-sm text-[#051046]">Unsent</span>
                </div>
              </div>
              <div className="bg-gray-50 p-3 rounded-[15px] border border-[#e2e8f0] mt-3 max-w-2xl">
                <p className="text-xs font-semibold text-[#051046] mb-2">Usage Example:</p>
                <pre className="text-xs text-gray-700 overflow-x-auto">
{`<div className="flex items-center gap-2">
  <div className="w-2 h-2 rounded-full bg-[#b9df10]"></div>
  <span className="text-sm text-[#051046]">Approved</span>
</div>`}
                </pre>
              </div>
            </div>

            {/* Code Example */}
            <div className="bg-gray-50 p-4 rounded-[15px] border border-[#e2e8f0] mt-4">
              <p className="text-sm font-semibold text-[#051046] mb-2">Usage Example:</p>
              <pre className="text-xs text-gray-700 overflow-x-auto">
{`import { StatusLabel, getStatusVariant } from '../components/StatusLabel';

// Using predefined status variants
<StatusLabel variant={getStatusVariant.estimatePending} showDot>
  Pending
</StatusLabel>

<StatusLabel variant={getStatusVariant.jobCompleted} showDot>
  Completed
</StatusLabel>

// Available helper statuses:
// estimateUnsent, estimatePending, estimateApproved, estimateDeclined
// jobScheduled, jobDepositCollected, jobInProgress, jobCompleted, jobCancelled
// invoiceUnpaid, invoicePaid, invoicePartiallyPaid, invoiceOverdue
// leadNew, leadContacted, leadPriceShared, leadFollowUp, leadWon, leadLost`}
              </pre>
            </div>
          </div>
        </section>

        {/* Buttons Section */}
        <section className="bg-white rounded-[20px] border border-[#e2e8f0] p-6 mb-6" style={{ boxShadow: 'rgba(226, 232, 240, 0.5) 0px 2px 16px 2px' }}>
          <h2 className="text-xl font-semibold text-[#051046] mb-4">Buttons</h2>
          
          <div className="space-y-6">
            {/* Primary Button */}
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Primary Button</h3>
              <div className="flex flex-wrap gap-3">
                <button className="px-6 py-2.5 bg-[#9473ff] text-white rounded-[32px] hover:bg-[#7f5fd9] transition-colors">
                  Primary Button
                </button>
                <button className="px-6 py-2.5 bg-[#9473ff] text-white rounded-[32px] hover:bg-[#7f5fd9] transition-colors flex items-center gap-2">
                  <Plus className="w-5 h-5" />
                  With Icon
                </button>
                <button className="px-6 py-2.5 bg-[#9473ff] text-white rounded-[32px] hover:bg-[#7f5fd9] transition-colors opacity-50 cursor-not-allowed" disabled>
                  Disabled
                </button>
              </div>
              <div className="bg-gray-50 p-3 rounded-[15px] border border-[#e2e8f0] mt-3">
                <code className="text-xs text-gray-700">
                  className="px-6 py-2.5 bg-[#9473ff] text-white rounded-[32px] hover:bg-[#7f5fd9] transition-colors"
                </code>
              </div>
            </div>

            {/* Secondary Button */}
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Secondary Button</h3>
              <div className="flex flex-wrap gap-3">
                <button className="px-6 py-2.5 border border-[#e8e8e8] text-[#051046] rounded-[20px] hover:bg-gray-50 transition-colors">
                  Secondary Button
                </button>
                <button className="px-6 py-2.5 border border-[#e8e8e8] text-[#051046] rounded-[20px] hover:bg-gray-50 transition-colors flex items-center gap-2">
                  <X className="w-5 h-5" />
                  Cancel
                </button>
              </div>
              <div className="bg-gray-50 p-3 rounded-[15px] border border-[#e2e8f0] mt-3">
                <code className="text-xs text-gray-700">
                  className="px-6 py-2.5 border border-[#e8e8e8] text-[#051046] rounded-[20px] hover:bg-gray-50 transition-colors"
                </code>
              </div>
            </div>

            {/* Icon Button */}
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Icon Button</h3>
              <div className="flex flex-wrap gap-3">
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <Plus className="w-5 h-5 text-[#051046]" />
                </button>
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <Search className="w-5 h-5 text-[#051046]" />
                </button>
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <X className="w-5 h-5 text-[#051046]" />
                </button>
              </div>
              <div className="bg-gray-50 p-3 rounded-[15px] border border-[#e2e8f0] mt-3">
                <code className="text-xs text-gray-700">
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                </code>
              </div>
            </div>

            {/* Button Sizes */}
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Button Sizes</h3>
              <div className="flex flex-wrap items-center gap-3">
                <button className="px-3 py-1.5 text-sm bg-[#9473ff] text-white rounded-[32px] hover:bg-[#7f5fd9] transition-colors">
                  Small
                </button>
                <button className="px-6 py-2.5 bg-[#9473ff] text-white rounded-[32px] hover:bg-[#7f5fd9] transition-colors">
                  Default
                </button>
                <button className="px-8 py-3 text-lg bg-[#9473ff] text-white rounded-[32px] hover:bg-[#7f5fd9] transition-colors">
                  Large
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Form Inputs Section */}
        <section className="bg-white rounded-[20px] border border-[#e2e8f0] p-6 mb-6" style={{ boxShadow: 'rgba(226, 232, 240, 0.5) 0px 2px 16px 2px' }}>
          <h2 className="text-xl font-semibold text-[#051046] mb-4">Form Inputs</h2>
          
          <div className="space-y-6">
            {/* Text Input */}
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Text Input</h3>
              <input
                type="text"
                placeholder="Enter text..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="w-full max-w-md px-4 py-2.5 border border-[#e8e8e8] rounded-[15px] focus:outline-none focus:ring-2 focus:ring-[#9473ff] text-[#051046] bg-white"
              />
              <div className="bg-gray-50 p-3 rounded-[15px] border border-[#e2e8f0] mt-3 max-w-2xl">
                <code className="text-xs text-gray-700 break-all">
                  className="w-full px-4 py-2.5 border border-[#e8e8e8] rounded-[15px] focus:outline-none focus:ring-2 focus:ring-[#9473ff] text-[#051046] bg-white"
                </code>
              </div>
            </div>

            {/* Input with Icon */}
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Input with Icon</h3>
              <div className="relative w-full max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-full pl-10 pr-4 py-2.5 border border-[#e8e8e8] rounded-[15px] focus:outline-none focus:ring-2 focus:ring-[#9473ff] text-[#051046] bg-white"
                />
              </div>
            </div>

            {/* Select Dropdown */}
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Select Dropdown</h3>
              <select
                value={selectValue}
                onChange={(e) => setSelectValue(e.target.value)}
                className="w-full max-w-md px-4 py-2.5 border border-[#e8e8e8] rounded-[15px] focus:outline-none focus:ring-2 focus:ring-[#9473ff] text-[#051046] bg-white"
              >
                <option value="option1">Option 1</option>
                <option value="option2">Option 2</option>
                <option value="option3">Option 3</option>
              </select>
              <div className="bg-gray-50 p-3 rounded-[15px] border border-[#e2e8f0] mt-3 max-w-2xl">
                <code className="text-xs text-gray-700 break-all">
                  className="w-full px-4 py-2.5 border border-[#e8e8e8] rounded-[15px] focus:outline-none focus:ring-2 focus:ring-[#9473ff] text-[#051046] bg-white"
                </code>
              </div>
            </div>

            {/* Textarea */}
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Textarea</h3>
              <textarea
                placeholder="Enter longer text..."
                value={textareaValue}
                onChange={(e) => setTextareaValue(e.target.value)}
                rows={4}
                className="w-full max-w-md px-4 py-2.5 border border-[#e8e8e8] rounded-[15px] focus:outline-none focus:ring-2 focus:ring-[#9473ff] text-[#051046] bg-white resize-none"
              />
            </div>

            {/* Checkbox */}
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Checkbox</h3>
              <label className="flex items-center gap-2 cursor-pointer max-w-md">
                <input
                  type="checkbox"
                  checked={checkboxValue}
                  onChange={(e) => setCheckboxValue(e.target.checked)}
                  className="w-5 h-5 text-[#9473ff] border-[#e8e8e8] rounded focus:ring-2 focus:ring-[#9473ff]"
                />
                <span className="text-[#051046]">Checkbox Label</span>
              </label>
            </div>
          </div>
        </section>

        {/* Cards Section */}
        <section className="bg-white rounded-[20px] border border-[#e2e8f0] p-6 mb-6" style={{ boxShadow: 'rgba(226, 232, 240, 0.5) 0px 2px 16px 2px' }}>
          <h2 className="text-xl font-semibold text-[#051046] mb-4">Cards</h2>
          
          <div className="space-y-6">
            {/* Standard Card */}
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Standard Card</h3>
              <div className="bg-white rounded-[20px] border border-[#e2e8f0] p-6 max-w-md" style={{ boxShadow: 'rgba(226, 232, 240, 0.5) 0px 2px 16px 2px' }}>
                <h4 className="text-lg font-semibold text-[#051046] mb-2">Card Title</h4>
                <p className="text-sm text-gray-600">This is a standard card with consistent border radius, border color, and soft shadow.</p>
              </div>
              <div className="bg-gray-50 p-3 rounded-[15px] border border-[#e2e8f0] mt-3 max-w-2xl">
                <code className="text-xs text-gray-700 break-all">
                  className="bg-white rounded-[20px] border border-[#e2e8f0] p-6"<br />
                  style={`{{ boxShadow: 'rgba(226, 232, 240, 0.5) 0px 2px 16px 2px' }}`}
                </code>
              </div>
            </div>

            {/* Metric Card */}
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Metric Cards</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="rounded-[20px] border border-[#e2e8f0] p-6 bg-[#F8EFFF]" style={{ boxShadow: 'rgba(226, 232, 240, 0.5) 0px 2px 16px 2px' }}>
                  <p className="text-sm text-gray-600 mb-2">Total</p>
                  <p className="text-3xl font-bold text-[#051046]">1,234</p>
                </div>
                <div className="rounded-[20px] border border-[#e2e8f0] p-6 bg-[#A6E4FA]" style={{ boxShadow: 'rgba(226, 232, 240, 0.5) 0px 2px 16px 2px' }}>
                  <p className="text-sm text-gray-700 mb-2">Active</p>
                  <p className="text-3xl font-bold text-[#051046]">567</p>
                </div>
                <div className="rounded-[20px] border border-[#e2e8f0] p-6 bg-[#FFDBE6]" style={{ boxShadow: 'rgba(226, 232, 240, 0.5) 0px 2px 16px 2px' }}>
                  <p className="text-sm text-gray-700 mb-2">Pending</p>
                  <p className="text-3xl font-bold text-[#051046]">89</p>
                </div>
                <div className="rounded-[20px] border border-[#e2e8f0] p-6 bg-[#E2F685]" style={{ boxShadow: 'rgba(226, 232, 240, 0.5) 0px 2px 16px 2px' }}>
                  <p className="text-sm text-gray-700 mb-2">Complete</p>
                  <p className="text-3xl font-bold text-[#051046]">578</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Border Radius Section */}
        <section className="bg-white rounded-[20px] border border-[#e2e8f0] p-6 mb-6" style={{ boxShadow: 'rgba(226, 232, 240, 0.5) 0px 2px 16px 2px' }}>
          <h2 className="text-xl font-semibold text-[#051046] mb-4">Border Radius</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Cards & Modals</h3>
              <div className="bg-white border border-[#e2e8f0] p-4 rounded-[20px]" style={{ boxShadow: 'rgba(226, 232, 240, 0.5) 0px 2px 8px' }}>
                <p className="text-sm text-[#051046]">20px border radius</p>
                <code className="text-xs text-purple-600">rounded-[20px]</code>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Form Inputs</h3>
              <div className="bg-white border border-[#e2e8f0] p-4 rounded-[15px]" style={{ boxShadow: 'rgba(226, 232, 240, 0.5) 0px 2px 8px' }}>
                <p className="text-sm text-[#051046]">15px border radius</p>
                <code className="text-xs text-purple-600">rounded-[15px]</code>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Primary Buttons</h3>
              <div className="bg-white border border-[#e2e8f0] p-4 rounded-[32px]" style={{ boxShadow: 'rgba(226, 232, 240, 0.5) 0px 2px 8px' }}>
                <p className="text-sm text-[#051046]">32px border radius</p>
                <code className="text-xs text-purple-600">rounded-[32px]</code>
              </div>
            </div>
          </div>
        </section>

        {/* Shadows Section */}
        <section className="bg-white rounded-[20px] border border-[#e2e8f0] p-6 mb-6" style={{ boxShadow: 'rgba(226, 232, 240, 0.5) 0px 2px 16px 2px' }}>
          <h2 className="text-xl font-semibold text-[#051046] mb-4">Shadows</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Standard Shadow</h3>
              <div className="bg-white rounded-[20px] border border-[#e2e8f0] p-6" style={{ boxShadow: 'rgba(226, 232, 240, 0.5) 0px 2px 16px 2px' }}>
                <p className="text-sm text-[#051046] mb-2">Cards, Modals, Dropdowns</p>
                <code className="text-xs text-gray-700 break-all">
                  boxShadow: 'rgba(226, 232, 240, 0.5) 0px 2px 16px 2px'
                </code>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Light Shadow</h3>
              <div className="bg-white rounded-[20px] border border-[#e2e8f0] p-6" style={{ boxShadow: 'rgba(226, 232, 240, 0.5) 0px 2px 8px' }}>
                <p className="text-sm text-[#051046] mb-2">Subtle elevation</p>
                <code className="text-xs text-gray-700 break-all">
                  boxShadow: 'rgba(226, 232, 240, 0.5) 0px 2px 8px'
                </code>
              </div>
            </div>
          </div>
        </section>

        {/* Icons Section */}
        <section className="bg-white rounded-[20px] border border-[#e2e8f0] p-6 mb-6" style={{ boxShadow: 'rgba(226, 232, 240, 0.5) 0px 2px 16px 2px' }}>
          <h2 className="text-xl font-semibold text-[#051046] mb-4">Icons</h2>
          <p className="text-sm text-gray-600 mb-4">Using Lucide React icons throughout the application.</p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            <div className="flex flex-col items-center gap-2 p-4 border border-[#e2e8f0] rounded-[15px]">
              <User className="w-6 h-6 text-[#051046]" />
              <span className="text-xs text-gray-600">User</span>
            </div>
            <div className="flex flex-col items-center gap-2 p-4 border border-[#e2e8f0] rounded-[15px]">
              <Search className="w-6 h-6 text-[#051046]" />
              <span className="text-xs text-gray-600">Search</span>
            </div>
            <div className="flex flex-col items-center gap-2 p-4 border border-[#e2e8f0] rounded-[15px]">
              <Plus className="w-6 h-6 text-[#051046]" />
              <span className="text-xs text-gray-600">Plus</span>
            </div>
            <div className="flex flex-col items-center gap-2 p-4 border border-[#e2e8f0] rounded-[15px]">
              <X className="w-6 h-6 text-[#051046]" />
              <span className="text-xs text-gray-600">Close</span>
            </div>
            <div className="flex flex-col items-center gap-2 p-4 border border-[#e2e8f0] rounded-[15px]">
              <Check className="w-6 h-6 text-[#051046]" />
              <span className="text-xs text-gray-600">Check</span>
            </div>
            <div className="flex flex-col items-center gap-2 p-4 border border-[#e2e8f0] rounded-[15px]">
              <Calendar className="w-6 h-6 text-[#051046]" />
              <span className="text-xs text-gray-600">Calendar</span>
            </div>
            <div className="flex flex-col items-center gap-2 p-4 border border-[#e2e8f0] rounded-[15px]">
              <Mail className="w-6 h-6 text-[#051046]" />
              <span className="text-xs text-gray-600">Mail</span>
            </div>
            <div className="flex flex-col items-center gap-2 p-4 border border-[#e2e8f0] rounded-[15px]">
              <Phone className="w-6 h-6 text-[#051046]" />
              <span className="text-xs text-gray-600">Phone</span>
            </div>
            <div className="flex flex-col items-center gap-2 p-4 border border-[#e2e8f0] rounded-[15px]">
              <AlertCircle className="w-6 h-6 text-[#051046]" />
              <span className="text-xs text-gray-600">Alert</span>
            </div>
            <div className="flex flex-col items-center gap-2 p-4 border border-[#e2e8f0] rounded-[15px]">
              <Info className="w-6 h-6 text-[#051046]" />
              <span className="text-xs text-gray-600">Info</span>
            </div>
            <div className="flex flex-col items-center gap-2 p-4 border border-[#e2e8f0] rounded-[15px]">
              <CheckCircle className="w-6 h-6 text-[#051046]" />
              <span className="text-xs text-gray-600">Check Circle</span>
            </div>
          </div>
        </section>

        {/* Notification Popups */}
        <section className="bg-white rounded-[20px] border border-[#e2e8f0] p-6" style={{ boxShadow: 'rgba(226, 232, 240, 0.5) 0px 2px 16px 2px' }}>
          <h2 className="text-xl font-semibold text-[#051046] mb-6">Notification Popups</h2>
          
          <div className="space-y-8">
            {/* Job Scheduled */}
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Success Notification (when job is scheduled)</h3>
              <div className="bg-white rounded-[20px] border border-[#e2e8f0] p-8 max-w-md" style={{ boxShadow: 'rgba(226, 232, 240, 0.5) 0px 2px 16px 2px' }}>
                {/* Icon */}
                <div className="flex justify-center mb-6">
                  <div className="w-20 h-20 bg-[#b9df10] rounded-full flex items-center justify-center">
                    <CheckCircle className="w-10 h-10 text-white" />
                  </div>
                </div>
                
                {/* Message */}
                <h3 className="text-xl font-semibold text-[#051046] mb-3 text-center">
                  Job Scheduled Successfully!
                </h3>
                <p className="text-sm text-[#051046] leading-relaxed mb-6 text-center">
                  Notifications have been sent to the customer and assigned technician.
                </p>
                
                {/* Close Button */}
                <button className="w-full px-6 py-2.5 bg-[#9473ff] text-white rounded-[32px] hover:bg-[#7f5fd9] transition-colors">
                  Close
                </button>
              </div>
            </div>

            {/* Estimate Sent */}
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Estimate Sent</h3>
              <div className="bg-white rounded-[20px] border border-[#e2e8f0] p-8 max-w-md" style={{ boxShadow: 'rgba(226, 232, 240, 0.5) 0px 2px 16px 2px' }}>
                <div className="flex justify-center mb-6">
                  <div className="w-20 h-20 bg-[#b9df10] rounded-full flex items-center justify-center">
                    <CheckCircle className="w-10 h-10 text-white" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-[#051046] mb-3 text-center">
                  Estimate Sent Successfully!
                </h3>
                <p className="text-sm text-[#051046] leading-relaxed mb-6 text-center">
                  Customer has been notified via email.
                </p>
                <button className="w-full px-6 py-2.5 bg-[#9473ff] text-white rounded-[32px] hover:bg-[#7f5fd9] transition-colors">
                  Close
                </button>
              </div>
            </div>

            {/* Invoice Sent */}
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Invoice Sent</h3>
              <div className="bg-white rounded-[20px] border border-[#e2e8f0] p-8 max-w-md" style={{ boxShadow: 'rgba(226, 232, 240, 0.5) 0px 2px 16px 2px' }}>
                <div className="flex justify-center mb-6">
                  <div className="w-20 h-20 bg-[#b9df10] rounded-full flex items-center justify-center">
                    <CheckCircle className="w-10 h-10 text-white" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-[#051046] mb-3 text-center">
                  Invoice Sent Successfully!
                </h3>
                <p className="text-sm text-[#051046] leading-relaxed mb-6 text-center">
                  Customer has been notified via email.
                </p>
                <button className="w-full px-6 py-2.5 bg-[#9473ff] text-white rounded-[32px] hover:bg-[#7f5fd9] transition-colors">
                  Close
                </button>
              </div>
            </div>

            {/* Payment Recorded */}
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Payment Recorded</h3>
              <div className="bg-white rounded-[20px] border border-[#e2e8f0] p-8 max-w-md" style={{ boxShadow: 'rgba(226, 232, 240, 0.5) 0px 2px 16px 2px' }}>
                <div className="flex justify-center mb-6">
                  <div className="w-20 h-20 bg-[#b9df10] rounded-full flex items-center justify-center">
                    <CheckCircle className="w-10 h-10 text-white" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-[#051046] mb-3 text-center">
                  Payment Recorded Successfully!
                </h3>
                <p className="text-sm text-[#051046] leading-relaxed mb-6 text-center">
                  Invoice status has been updated to Paid.
                </p>
                <button className="w-full px-6 py-2.5 bg-[#9473ff] text-white rounded-[32px] hover:bg-[#7f5fd9] transition-colors">
                  Close
                </button>
              </div>
            </div>

            {/* Lead Created */}
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Lead Created</h3>
              <div className="bg-white rounded-[20px] border border-[#e2e8f0] p-8 max-w-md" style={{ boxShadow: 'rgba(226, 232, 240, 0.5) 0px 2px 16px 2px' }}>
                <div className="flex justify-center mb-6">
                  <div className="w-20 h-20 bg-[#b9df10] rounded-full flex items-center justify-center">
                    <CheckCircle className="w-10 h-10 text-white" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-[#051046] mb-3 text-center">
                  Lead Created Successfully!
                </h3>
                <p className="text-sm text-[#051046] leading-relaxed mb-6 text-center">
                  You can now track this opportunity in your pipeline.
                </p>
                <button className="w-full px-6 py-2.5 bg-[#9473ff] text-white rounded-[32px] hover:bg-[#7f5fd9] transition-colors">
                  Close
                </button>
              </div>
            </div>

            {/* Client Added */}
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Client Added</h3>
              <div className="bg-white rounded-[20px] border border-[#e2e8f0] p-8 max-w-md" style={{ boxShadow: 'rgba(226, 232, 240, 0.5) 0px 2px 16px 2px' }}>
                <div className="flex justify-center mb-6">
                  <div className="w-20 h-20 bg-[#b9df10] rounded-full flex items-center justify-center">
                    <CheckCircle className="w-10 h-10 text-white" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-[#051046] mb-3 text-center">
                  Client Added Successfully!
                </h3>
                <p className="text-sm text-[#051046] leading-relaxed mb-6 text-center">
                  You can now create jobs and estimates for this client.
                </p>
                <button className="w-full px-6 py-2.5 bg-[#9473ff] text-white rounded-[32px] hover:bg-[#7f5fd9] transition-colors">
                  Close
                </button>
              </div>
            </div>

            {/* Team Member Invited */}
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Team Member Invited</h3>
              <div className="bg-white rounded-[20px] border border-[#e2e8f0] p-8 max-w-md" style={{ boxShadow: 'rgba(226, 232, 240, 0.5) 0px 2px 16px 2px' }}>
                <div className="flex justify-center mb-6">
                  <div className="w-20 h-20 bg-[#b9df10] rounded-full flex items-center justify-center">
                    <CheckCircle className="w-10 h-10 text-white" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-[#051046] mb-3 text-center">
                  Team Member Invited Successfully!
                </h3>
                <p className="text-sm text-[#051046] leading-relaxed mb-6 text-center">
                  They will receive an email invitation to join your team.
                </p>
                <button className="w-full px-6 py-2.5 bg-[#9473ff] text-white rounded-[32px] hover:bg-[#7f5fd9] transition-colors">
                  Close
                </button>
              </div>
            </div>

            {/* Reminder Sent */}
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Reminder Sent</h3>
              <div className="bg-white rounded-[20px] border border-[#e2e8f0] p-8 max-w-md" style={{ boxShadow: 'rgba(226, 232, 240, 0.5) 0px 2px 16px 2px' }}>
                <div className="flex justify-center mb-6">
                  <div className="w-20 h-20 bg-[#b9df10] rounded-full flex items-center justify-center">
                    <CheckCircle className="w-10 h-10 text-white" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-[#051046] mb-3 text-center">
                  Reminder Sent!
                </h3>
                <p className="text-sm text-[#051046] leading-relaxed mb-6 text-center">
                  Customer has been notified about the pending estimate.
                </p>
                <button className="w-full px-6 py-2.5 bg-[#9473ff] text-white rounded-[32px] hover:bg-[#7f5fd9] transition-colors">
                  Close
                </button>
              </div>
            </div>

            {/* Service Plan Created */}
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Service Plan Created</h3>
              <div className="bg-white rounded-[20px] border border-[#e2e8f0] p-8 max-w-md" style={{ boxShadow: 'rgba(226, 232, 240, 0.5) 0px 2px 16px 2px' }}>
                <div className="flex justify-center mb-6">
                  <div className="w-20 h-20 bg-[#b9df10] rounded-full flex items-center justify-center">
                    <CheckCircle className="w-10 h-10 text-white" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-[#051046] mb-3 text-center">
                  Service Plan Created Successfully!
                </h3>
                <p className="text-sm text-[#051046] leading-relaxed mb-6 text-center">
                  The service plan is now active and ready to use.
                </p>
                <button className="w-full px-6 py-2.5 bg-[#9473ff] text-white rounded-[32px] hover:bg-[#7f5fd9] transition-colors">
                  Close
                </button>
              </div>
            </div>

            {/* Code Example */}
            <div className="bg-gray-50 p-4 rounded-[15px] border border-[#e2e8f0] mt-4">
              <p className="text-sm font-semibold text-[#051046] mb-2">Usage Example:</p>
              <pre className="text-xs text-gray-700 overflow-x-auto">
{`// Import the reusable component
import { SuccessPopup } from '../components/SuccessPopup';

// Add state
const [showSuccess, setShowSuccess] = useState(false);
const [successMsg, setSuccessMsg] = useState({ title: '', description: '' });

// Trigger in your handler
const handleAction = () => {
  setSuccessMsg({
    title: 'Action Successful!',
    description: 'Your action has been completed successfully.'
  });
  setShowSuccess(true);
};

// Add to JSX
<SuccessPopup
  isOpen={showSuccess}
  title={successMsg.title}
  description={successMsg.description}
  onClose={() => setShowSuccess(false)}
/>`}
              </pre>
            </div>
          </div>
        </section>

        {/* Spacing Guidelines */}
        <section className="bg-white rounded-[20px] border border-[#e2e8f0] p-6" style={{ boxShadow: 'rgba(226, 232, 240, 0.5) 0px 2px 16px 2px' }}>
          <h2 className="text-xl font-semibold text-[#051046] mb-4">Spacing Guidelines</h2>
          
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-2">Page Padding</h3>
              <p className="text-sm text-gray-600">p-8 (32px)</p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-2">Card Padding</h3>
              <p className="text-sm text-gray-600">p-6 (24px)</p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-2">Section Margins</h3>
              <p className="text-sm text-gray-600">mb-6 or mb-8 (24px or 32px)</p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-2">Element Gaps</h3>
              <p className="text-sm text-gray-600">gap-2 to gap-6 (8px to 24px)</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}