import React, { useState } from 'react';
import logoImage from 'figma:asset/1ae61582544012097caca5e917fba8d62808de49.png';
import { useNavigate } from 'react-router';
import { ArrowLeft } from 'lucide-react';

export function SignupLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [consentChecked, setConsentChecked] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!consentChecked) {
      alert('Please consent to the Terms of Service to continue.');
      return;
    }
    // Handle login logic
    console.log('Login:', { email, password });
  };

  const handleSignUp = () => {
    if (!consentChecked) {
      alert('Please consent to the Terms of Service to continue.');
      return;
    }
    // Navigate to join page
    navigate('/join');
  };

  const handleGoogleLogin = () => {
    if (!consentChecked) {
      alert('Please consent to the Terms of Service to continue.');
      return;
    }
    // Handle Google login logic
    console.log('Google login');
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="w-full max-w-[600px]">
        {/* Back Button */}
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 mb-6 text-[#051046] hover:text-[#9473ff] transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">Back to User Role Selection</span>
        </button>

        {/* Logo */}
        <div className="mb-8">
          <img 
            src={logoImage} 
            alt="Klervo Logo" 
            className="h-10"
          />
        </div>

        {/* Login Heading */}
        <h1 className="text-3xl font-semibold mb-8" style={{ color: '#9473ff' }}>
          Login
        </h1>

        <form onSubmit={handleLogin}>
          {/* Email Field */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2" style={{ color: '#051046' }}>
              Email
            </label>
            <input
              type="email"
              placeholder="email@mail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 border border-[#e8e8e8] rounded-[15px] text-sm text-[#051046] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-600"
            />
          </div>

          {/* Password Field */}
          <div className="mb-3">
            <label className="block text-sm font-medium mb-2" style={{ color: '#051046' }}>
              Password
            </label>
            <input
              type="password"
              placeholder="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 border border-[#e8e8e8] rounded-[15px] text-sm text-[#051046] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-600"
            />
          </div>

          {/* Forgot Password Link */}
          <div className="mb-6 text-right">
            <a href="#" className="text-sm" style={{ color: '#9473ff' }}>
              Forgot password?
            </a>
          </div>

          {/* Log In and Sign Up Buttons */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <button
              type="submit"
              className="px-6 py-3 rounded-[32px] font-medium text-white transition-colors"
              style={{ backgroundColor: '#9473ff' }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#7f5fd9'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#9473ff'}
            >
              Log In
            </button>
            <button
              type="button"
              onClick={handleSignUp}
              className="px-6 py-3 border rounded-[32px] font-medium transition-colors"
              style={{ borderColor: '#e8e8e8', color: '#9473ff' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#f8f6ff';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              Sign Up
            </button>
          </div>

          {/* Google Login Button */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            className="w-full px-6 py-3 border rounded-[32px] font-medium transition-colors flex items-center justify-center gap-2 mb-4"
            style={{ borderColor: '#e8e8e8', color: '#9473ff' }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#f8f6ff';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z" fill="#4285F4"/>
              <path d="M9.003 18c2.43 0 4.467-.806 5.956-2.18L12.05 13.56c-.806.54-1.836.86-3.047.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9.003 18z" fill="#34A853"/>
              <path d="M3.964 10.712c-.18-.54-.282-1.117-.282-1.71 0-.593.102-1.17.282-1.71V4.96H.957C.347 6.175 0 7.55 0 9.002c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
              <path d="M9.003 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.464.891 11.428 0 9.002 0 5.482 0 2.438 2.017.957 4.958L3.964 7.29c.708-2.127 2.692-3.71 5.036-3.71z" fill="#EA4335"/>
            </svg>
            Log in with Google
          </button>

          {/* Watch Demo Button */}
          <a
            href="https://youtu.be/CkPb6MgQXlk?si=abT0E7ajp4_ysZqo"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full px-6 py-3 border border-[#e8e8e8] text-[#051046] rounded-[32px] hover:bg-gray-50 transition-colors font-medium flex items-center justify-center gap-2 mb-6"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M10 8.5V15.5L16 12L10 8.5Z" fill="#051046"/>
              <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20Z" fill="#051046"/>
            </svg>
            Watch Demo
          </a>

          {/* Consent Checkbox */}
          <div className="flex items-start gap-3">
            <input
              type="checkbox"
              id="consent"
              checked={consentChecked}
              onChange={(e) => setConsentChecked(e.target.checked)}
              required
              className="mt-1 w-4 h-4 text-[#9473ff] border-gray-300 rounded focus:ring-[#9473ff] cursor-pointer"
            />
            <label htmlFor="consent" className="text-sm leading-relaxed cursor-pointer" style={{ color: '#051046' }}>
              By checking this box, you consent to abide by our{' '}
              <a 
                href="https://klervo.com/terms-and-conditions/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="underline"
                style={{ color: '#9473ff' }}
              >
                Terms of Service
              </a>
              , which includes the mandatory arbitration clause. You also confirm that you have perused our Privacy Policy. Moreover, you consent to the possibility of receiving marketing SMS messages and calls related to our business, facilitated by an automated dialer, to the provided phone number for promotional purposes. Your permission to receive these communications is not a prerequisite for using our services. Should you choose not to grant consent, you have the option to opt-out by dialing{' '}
              <a 
                href="tel:+15127771656"
                className="underline"
                style={{ color: '#9473ff' }}
              >
                (512) 777-1656
              </a>
              .
            </label>
          </div>
        </form>
      </div>
    </div>
  );
}