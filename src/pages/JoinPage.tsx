import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { Eye, EyeOff, Upload } from 'lucide-react';
import logoImage from 'figma:asset/1ae61582544012097caca5e917fba8d62808de49.png';

export function JoinPage() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);

  // Stage 1: Create your profile
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');

  // Stage 2: Setup your company
  const [companyName, setCompanyName] = useState('');
  const [address, setAddress] = useState('');
  const [primaryIndustry, setPrimaryIndustry] = useState('');
  const [companySize, setCompanySize] = useState('');
  const [website, setWebsite] = useState('');
  const [googleReviewLink, setGoogleReviewLink] = useState('');
  const [companyLogo, setCompanyLogo] = useState<File | null>(null);
  const [emailLogo, setEmailLogo] = useState<File | null>(null);

  // Stage 3: Set a password
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false);
  const [consentChecked, setConsentChecked] = useState(false);

  const handleContinueStep1 = (e: React.FormEvent) => {
    e.preventDefault();
    if (firstName && lastName && phoneNumber && email) {
      setCurrentStep(2);
    }
  };

  const handleContinueStep2 = (e: React.FormEvent) => {
    e.preventDefault();
    if (companyName && address && primaryIndustry && companySize) {
      setCurrentStep(3);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleFinalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!consentChecked) {
      alert('Please consent to the Terms of Service to continue.');
      return;
    }
    if (password !== passwordConfirmation) {
      alert('Passwords do not match.');
      return;
    }
    // Handle signup completion
    console.log('Signup completed:', {
      firstName, lastName, phoneNumber, email,
      companyName, address, primaryIndustry, companySize, website, googleReviewLink,
      password
    });
    // Navigate to dashboard or login
    navigate('/signup-login');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, setter: React.Dispatch<React.SetStateAction<File | null>>) => {
    if (e.target.files && e.target.files[0]) {
      setter(e.target.files[0]);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="w-full max-w-[600px]">
        {/* Logo */}
        <div className="mb-8">
          <img 
            src={logoImage} 
            alt="Klervo Logo" 
            className="h-10"
          />
        </div>

        {/* Stage 1: Create your profile */}
        {currentStep === 1 && (
          <div>
            <div className="flex items-center gap-3 mb-8">
              <div 
                className="w-12 h-12 rounded-full flex items-center justify-center border-2 text-lg font-semibold"
                style={{ borderColor: '#9473ff', color: '#9473ff' }}
              >
                1
              </div>
              <h1 className="text-2xl font-semibold" style={{ color: '#9473ff' }}>
                Create your profile
              </h1>
            </div>

            <form onSubmit={handleContinueStep1}>
              {/* First name */}
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2" style={{ color: '#051046' }}>
                  First name
                </label>
                <input
                  type="text"
                  placeholder="First name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                  className="w-full px-4 py-2 border border-[#e8e8e8] rounded-[15px] text-sm text-[#051046] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-600"
                />
              </div>

              {/* Last name */}
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2" style={{ color: '#051046' }}>
                  Last name
                </label>
                <input
                  type="text"
                  placeholder="Last name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                  className="w-full px-4 py-2 border border-[#e8e8e8] rounded-[15px] text-sm text-[#051046] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-600"
                />
              </div>

              {/* Phone number */}
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2" style={{ color: '#051046' }}>
                  Phone number
                </label>
                <input
                  type="tel"
                  placeholder="Phone number"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  required
                  className="w-full px-4 py-2 border border-[#e8e8e8] rounded-[15px] text-sm text-[#051046] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-600"
                />
              </div>

              {/* Email */}
              <div className="mb-8">
                <label className="block text-sm font-medium mb-2" style={{ color: '#051046' }}>
                  Email
                </label>
                <input
                  type="email"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-2 border border-[#e8e8e8] rounded-[15px] text-sm text-[#051046] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-600"
                />
              </div>

              {/* Continue Button */}
              <button
                type="submit"
                className="w-full px-6 py-3 rounded-[32px] font-medium text-white transition-colors"
                style={{ backgroundColor: '#9473ff' }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#7f5fd9'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#9473ff'}
              >
                Continue
              </button>
            </form>
          </div>
        )}

        {/* Stage 2: Setup your company */}
        {currentStep === 2 && (
          <div>
            <div className="flex items-center gap-3 mb-8">
              <div 
                className="w-12 h-12 rounded-full flex items-center justify-center border-2 text-lg font-semibold"
                style={{ borderColor: '#9473ff', color: '#9473ff' }}
              >
                2
              </div>
              <h1 className="text-2xl font-semibold" style={{ color: '#9473ff' }}>
                Setup your company
              </h1>
            </div>

            <form onSubmit={handleContinueStep2}>
              {/* Company name */}
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2" style={{ color: '#051046' }}>
                  Company name
                </label>
                <input
                  type="text"
                  placeholder="Company name"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  required
                  className="w-full px-4 py-2 border border-[#e8e8e8] rounded-[15px] text-sm text-[#051046] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-600"
                />
              </div>

              {/* Address */}
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2" style={{ color: '#051046' }}>
                  Address
                </label>
                <input
                  type="text"
                  placeholder="Address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  required
                  className="w-full px-4 py-2 border border-[#e8e8e8] rounded-[15px] text-sm text-[#051046] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-600"
                />
              </div>

              {/* Primary industry */}
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2" style={{ color: '#051046' }}>
                  Primary industry
                </label>
                <select
                  value={primaryIndustry}
                  onChange={(e) => setPrimaryIndustry(e.target.value)}
                  required
                  className="w-full px-4 py-2 border border-[#e8e8e8] rounded-[15px] text-sm text-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-600"
                  style={{ color: primaryIndustry ? '#051046' : undefined }}
                >
                  <option value="">Primary industry</option>
                  <option value="Plumbing">Plumbing</option>
                  <option value="Electrical">Electrical</option>
                  <option value="HVAC">HVAC</option>
                  <option value="Roofing">Roofing</option>
                  <option value="Landscaping">Landscaping</option>
                  <option value="Cleaning Services">Cleaning Services</option>
                  <option value="General Contractor">General Contractor</option>
                  <option value="Painting">Painting</option>
                  <option value="Handyman Services">Handyman Services</option>
                  <option value="Pest Control">Pest Control</option>
                  <option value="Window Cleaning">Window Cleaning</option>
                  <option value="Gutter">Gutter</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* Company size */}
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2" style={{ color: '#051046' }}>
                  Company size
                </label>
                <select
                  value={companySize}
                  onChange={(e) => setCompanySize(e.target.value)}
                  required
                  className="w-full px-4 py-2 border border-[#e8e8e8] rounded-[15px] text-sm text-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-600"
                  style={{ color: companySize ? '#051046' : undefined }}
                >
                  <option value="">Company size</option>
                  <option value="1-10">1-10 employees</option>
                  <option value="11-50">11-50 employees</option>
                  <option value="51-200">51-200 employees</option>
                  <option value="201-500">201-500 employees</option>
                  <option value="500+">500+ employees</option>
                </select>
              </div>

              {/* Website (optional) */}
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2" style={{ color: '#051046' }}>
                  Website (optional)
                </label>
                <input
                  type="url"
                  placeholder="Website"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  className="w-full px-4 py-2 border border-[#e8e8e8] rounded-[15px] text-sm text-[#051046] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-600"
                />
              </div>

              {/* Link to google review */}
              <div className="mb-2">
                <label className="block text-sm font-medium mb-2" style={{ color: '#051046' }}>
                  Link to google review
                </label>
                <input
                  type="url"
                  placeholder="Link"
                  value={googleReviewLink}
                  onChange={(e) => setGoogleReviewLink(e.target.value)}
                  className="w-full px-4 py-2 border border-[#e8e8e8] rounded-[15px] text-sm text-[#051046] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-600"
                />
              </div>

              {/* How to get link? */}
              <div className="mb-6">
                <a href="#" className="text-sm" style={{ color: '#9473ff' }}>
                  How to get link?
                </a>
              </div>

              {/* Company Logo */}
              <div className="mb-6">
                <label className="block text-sm font-medium mb-3" style={{ color: '#051046' }}>
                  Company Logo
                </label>
                <div className="flex justify-center">
                  <label 
                    htmlFor="company-logo-upload"
                    className="w-32 h-32 rounded-full border-2 border-dashed border-[#e8e8e8] flex items-center justify-center cursor-pointer hover:border-[#9473ff] transition-colors"
                  >
                    {companyLogo ? (
                      <span className="text-xs text-center px-4" style={{ color: '#051046' }}>
                        {companyLogo.name}
                      </span>
                    ) : (
                      <Upload className="w-12 h-12" style={{ color: '#c4c4c4' }} />
                    )}
                    <input
                      id="company-logo-upload"
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileChange(e, setCompanyLogo)}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* Logo to show up on email */}
              <div className="mb-8">
                <label className="block text-sm font-medium mb-3" style={{ color: '#051046' }}>
                  Logo to show up on email
                </label>
                <div className="flex justify-center">
                  <label 
                    htmlFor="email-logo-upload"
                    className="w-32 h-32 rounded-full border-2 border-dashed border-[#e8e8e8] flex items-center justify-center cursor-pointer hover:border-[#9473ff] transition-colors"
                  >
                    {emailLogo ? (
                      <span className="text-xs text-center px-4" style={{ color: '#051046' }}>
                        {emailLogo.name}
                      </span>
                    ) : (
                      <Upload className="w-12 h-12" style={{ color: '#c4c4c4' }} />
                    )}
                    <input
                      id="email-logo-upload"
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileChange(e, setEmailLogo)}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* Back and Continue Buttons */}
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={handleBack}
                  className="px-6 py-3 border rounded-[32px] font-medium transition-colors"
                  style={{ borderColor: '#e8e8e8', color: '#051046' }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#f8f6ff';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 rounded-[32px] font-medium text-white transition-colors"
                  style={{ backgroundColor: '#9473ff' }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#7f5fd9'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#9473ff'}
                >
                  Continue
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Stage 3: Set a password */}
        {currentStep === 3 && (
          <div>
            <div className="flex items-center gap-3 mb-8">
              <div 
                className="w-12 h-12 rounded-full flex items-center justify-center border-2 text-lg font-semibold"
                style={{ borderColor: '#9473ff', color: '#9473ff' }}
              >
                3
              </div>
              <h1 className="text-2xl font-semibold" style={{ color: '#9473ff' }}>
                Set a password
              </h1>
            </div>

            <form onSubmit={handleFinalSubmit}>
              {/* Password */}
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2" style={{ color: '#051046' }}>
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full px-4 py-2 pr-12 border border-[#e8e8e8] rounded-[15px] text-sm text-[#051046] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-600"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" style={{ color: '#9473ff' }} />
                    ) : (
                      <Eye className="w-5 h-5" style={{ color: '#9473ff' }} />
                    )}
                  </button>
                </div>
              </div>

              {/* Password Confirmation */}
              <div className="mb-8">
                <label className="block text-sm font-medium mb-2" style={{ color: '#051046' }}>
                  Password Confirmation
                </label>
                <div className="relative">
                  <input
                    type={showPasswordConfirmation ? 'text' : 'password'}
                    placeholder="Re-enter password"
                    value={passwordConfirmation}
                    onChange={(e) => setPasswordConfirmation(e.target.value)}
                    required
                    className="w-full px-4 py-2 pr-12 border border-[#e8e8e8] rounded-[15px] text-sm text-[#051046] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-600"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswordConfirmation(!showPasswordConfirmation)}
                    className="absolute right-4 top-1/2 -translate-y-1/2"
                  >
                    {showPasswordConfirmation ? (
                      <EyeOff className="w-5 h-5" style={{ color: '#9473ff' }} />
                    ) : (
                      <Eye className="w-5 h-5" style={{ color: '#9473ff' }} />
                    )}
                  </button>
                </div>
              </div>

              {/* Consent Checkbox */}
              <div className="flex items-start gap-3 mb-8">
                <input
                  type="checkbox"
                  id="consent"
                  checked={consentChecked}
                  onChange={(e) => setConsentChecked(e.target.checked)}
                  required
                  className="mt-1 w-4 h-4 text-[#9473ff] border-gray-300 rounded focus:ring-[#9473ff] cursor-pointer"
                />
                <label htmlFor="consent" className="text-sm leading-relaxed cursor-pointer" style={{ color: '#051046' }}>
                  By signing in, you consent to abide by our{' '}
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

              {/* Back and Continue Buttons */}
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={handleBack}
                  className="px-6 py-3 border rounded-[32px] font-medium transition-colors"
                  style={{ borderColor: '#e8e8e8', color: '#051046' }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#f8f6ff';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 rounded-[32px] font-medium text-white transition-colors"
                  style={{ backgroundColor: '#9473ff' }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#7f5fd9'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#9473ff'}
                >
                  Continue
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}