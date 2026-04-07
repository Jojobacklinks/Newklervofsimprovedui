import { useNavigate } from "react-router";
import { UserCircle, Users, User, LogIn, LayoutGrid } from "lucide-react";

export function UserRoleViewsPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50 p-6">
      <div className="max-w-5xl w-full">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 
            className="text-5xl font-bold mb-4" 
            style={{ color: '#051046' }}
          >
            User Role Views
          </h1>
          <p 
            className="text-xl" 
            style={{ color: '#051046', opacity: 0.7 }}
          >
            Select a user role to view their dashboard experience
          </p>
        </div>

        {/* Role Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Admin Card */}
          <button
            onClick={() => navigate('/admin')}
            className="group relative bg-white p-8 rounded-[20px] border border-[#e2e8f0] hover:border-[#9473ff] transition-all duration-300 hover:shadow-[0_8px_30px_rgba(148,115,255,0.25)] transform hover:scale-105"
          >
            <div className="flex flex-col items-center text-center">
              <div 
                className="w-24 h-24 rounded-full flex items-center justify-center mb-6 transition-all duration-300"
                style={{ 
                  backgroundColor: '#9473ff',
                  boxShadow: '0 4px 20px rgba(148, 115, 255, 0.3)'
                }}
              >
                <UserCircle className="w-12 h-12 text-white" />
              </div>
              <h2 
                className="text-2xl font-bold mb-3"
                style={{ color: '#051046' }}
              >
                Admin
              </h2>
              <p 
                className="text-base mb-6"
                style={{ color: '#051046', opacity: 0.6 }}
              >
                Full access to all features, settings, and management tools
              </p>
              <div 
                className="px-6 py-3 rounded-full font-semibold transition-all duration-300 group-hover:bg-[#7f5fd9]"
                style={{ 
                  backgroundColor: '#9473ff',
                  color: 'white'
                }}
              >
                View Dashboard
              </div>
            </div>
          </button>

          {/* Staff Card */}
          <button
            onClick={() => navigate('/staff')}
            className="group relative bg-white p-8 rounded-[20px] border border-[#e2e8f0] hover:border-[#28bdf2] transition-all duration-300 hover:shadow-[0_8px_30px_rgba(40,189,242,0.25)] transform hover:scale-105"
          >
            <div className="flex flex-col items-center text-center">
              <div 
                className="w-24 h-24 rounded-full flex items-center justify-center mb-6 transition-all duration-300"
                style={{ 
                  backgroundColor: '#28bdf2',
                  boxShadow: '0 4px 20px rgba(40, 189, 242, 0.3)'
                }}
              >
                <Users className="w-12 h-12 text-white" />
              </div>
              <h2 
                className="text-2xl font-bold mb-3"
                style={{ color: '#051046' }}
              >
                Staff
              </h2>
              <p 
                className="text-base mb-6"
                style={{ color: '#051046', opacity: 0.6 }}
              >
                Technician and staff access to jobs, schedules, and tasks
              </p>
              <div 
                className="px-6 py-3 rounded-full font-semibold transition-all duration-300 group-hover:bg-[#1da5d1]"
                style={{ 
                  backgroundColor: '#28bdf2',
                  color: 'white'
                }}
              >
                View Dashboard
              </div>
            </div>
          </button>

          {/* Customer Card */}
          <button
            onClick={() => navigate('/customer')}
            className="group relative bg-white p-8 rounded-[20px] border border-[#e2e8f0] hover:border-[#b9df10] transition-all duration-300 hover:shadow-[0_8px_30px_rgba(185,223,16,0.25)] transform hover:scale-105"
          >
            <div className="flex flex-col items-center text-center">
              <div 
                className="w-24 h-24 rounded-full flex items-center justify-center mb-6 transition-all duration-300"
                style={{ 
                  backgroundColor: '#b9df10',
                  boxShadow: '0 4px 20px rgba(185, 223, 16, 0.3)'
                }}
              >
                <User className="w-12 h-12 text-white" />
              </div>
              <h2 
                className="text-2xl font-bold mb-3"
                style={{ color: '#051046' }}
              >
                Customer
              </h2>
              <p 
                className="text-base mb-6"
                style={{ color: '#051046', opacity: 0.6 }}
              >
                Client portal for viewing services, bookings, and invoices
              </p>
              <div 
                className="px-6 py-3 rounded-full font-semibold transition-all duration-300 group-hover:bg-[#a3c60f]"
                style={{ 
                  backgroundColor: '#b9df10',
                  color: 'white'
                }}
              >
                View Dashboard
              </div>
            </div>
          </button>
        </div>

        {/* Signup/Login and UI Kit Buttons */}
        <div className="mt-8 flex justify-center gap-4">
          <button
            onClick={() => navigate('/signup-login')}
            className="group flex items-center gap-3 bg-white px-8 py-4 rounded-[20px] border border-[#e2e8f0] hover:border-[#9473ff] transition-all duration-300 hover:shadow-[0_8px_30px_rgba(148,115,255,0.25)] transform hover:scale-105"
          >
            <LogIn className="w-5 h-5" style={{ color: '#9473ff' }} />
            <span 
              className="text-lg font-semibold"
              style={{ color: '#9473ff' }}
            >
              Signup / Login
            </span>
          </button>

          <button
            onClick={() => navigate('/ui-kit')}
            className="group flex items-center gap-3 bg-white px-8 py-4 rounded-[20px] border border-[#e2e8f0] hover:border-[#9473ff] transition-all duration-300 hover:shadow-[0_8px_30px_rgba(148,115,255,0.25)] transform hover:scale-105"
          >
            <LayoutGrid className="w-5 h-5" style={{ color: '#9473ff' }} />
            <span 
              className="text-lg font-semibold"
              style={{ color: '#9473ff' }}
            >
              UI Kit
            </span>
          </button>
        </div>

        {/* Footer Note */}
        <div 
          className="mt-12 text-center bg-white p-6 rounded-[20px] border border-[#e2e8f0]"
          style={{ 
            boxShadow: 'rgba(226, 232, 240, 0.5) 0px 2px 16px 2px'
          }}
        >
          <p 
            className="text-sm"
            style={{ color: '#051046', opacity: 0.7 }}
          >
            <span className="font-semibold">UI/UX Mockup for Developers:</span> This interface demonstrates role-based access control and the different dashboard experiences for each user type in the field service management system.
          </p>
        </div>
      </div>
    </div>
  );
}