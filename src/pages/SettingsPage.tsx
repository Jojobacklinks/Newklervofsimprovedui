import { useState } from 'react';
import { Settings, CreditCard, Palette, Plug, Upload, Eye, EyeOff, Edit2, Trash2, Plus, Info, Settings2, Tag, Copy, Check } from 'lucide-react';
import { useLocation } from 'react-router';
import userAvatar from 'figma:asset/f42899e907ff2d454cb3bd2c065e1b8acf0167d3.png';
import companyLogo from 'figma:asset/aca027096500e73cd5bed4fe884cd790206b222e.png';
import { usePromotions } from '../contexts/PromotionsContext';

export function SettingsPage() {
  const location = useLocation();
  const isStaffView = location.pathname.startsWith('/staff');
  const [activeTab, setActiveTab] = useState('settings');
  const { promotions, setPromotions } = usePromotions();
  
  // Settings Tab States
  const [stripeStatus, setStripeStatus] = useState<'not-connected' | 'incomplete' | 'connected'>('not-connected');
  const [firstName, setFirstName] = useState('John');
  const [lastName, setLastName] = useState('Smith');
  const [email, setEmail] = useState('john.smith@example.com');
  const [phone, setPhone] = useState('(512) 555-0123');
  const [address, setAddress] = useState('123 Main St, Austin, TX 78701');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [companyName, setCompanyName] = useState('My Plumber Company');
  const [companySize, setCompanySize] = useState('2 - 5');
  const [googleReviewLink, setGoogleReviewLink] = useState('');
  const [companyAddress, setCompanyAddress] = useState('456 Business Blvd, Austin, TX 78701');
  const [primaryIndustry, setPrimaryIndustry] = useState('Plumbing');
  const [website, setWebsite] = useState('www.abcservices.com');
  const [greenThreshold, setGreenThreshold] = useState('0-3');
  const [orangeThreshold, setOrangeThreshold] = useState('4-7');
  const [redThreshold, setRedThreshold] = useState('8-11');
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showPaymentMethodModal, setShowPaymentMethodModal] = useState(false);
  
  // Payment Method States
  const [paymentMethod, setPaymentMethod] = useState({
    type: 'Visa',
    last4: '4242',
    expiryMonth: '12',
    expiryYear: '2027',
    nameOnCard: 'John Smith'
  });
  const [newCardNumber, setNewCardNumber] = useState('');
  const [newExpiryMonth, setNewExpiryMonth] = useState('');
  const [newExpiryYear, setNewExpiryYear] = useState('');
  const [newCVV, setNewCVV] = useState('');
  const [newNameOnCard, setNewNameOnCard] = useState('');
  
  // Customization Tab States
  const [scheduleJobHours, setScheduleJobHours] = useState('24');
  const [estimateHours, setEstimateHours] = useState('48');
  const [birthdayDays, setBirthdayDays] = useState('7');
  const [invoiceOverdueHours, setInvoiceOverdueHours] = useState('48');
  const [defaultTechnicianCommission, setDefaultTechnicianCommission] = useState('15');
  const [checklistName, setChecklistName] = useState('');
  const [checklistItems, setChecklistItems] = useState<string[]>([]);
  const [currentItemInput, setCurrentItemInput] = useState('');
  const [isChecklistMandatory, setIsChecklistMandatory] = useState(false);
  const [isCreatingChecklist, setIsCreatingChecklist] = useState(false);
  const [existingChecklist, setExistingChecklist] = useState<{name: string, items: string[], mandatory: boolean} | null>({
    name: 'Pre-Job Checklist',
    items: [
      'Review job details and customer notes',
      'Confirm customer contact information',
      'Inspect work area and identify access points',
      'Verify all required tools and equipment are available',
      'Introduce yourself to the customer',
      'Explain the scope of work to the customer',
      'Take photos of the work area (before)',
      'Set up safety barriers if needed',
      'Locate shut-off valves and electrical panels',
      'Confirm customer expectations and timeline'
    ],
    mandatory: true
  });
  const [isEditingChecklist, setIsEditingChecklist] = useState(false);
  const [editingChecklistName, setEditingChecklistName] = useState('');
  const [editingChecklistItems, setEditingChecklistItems] = useState<string[]>([]);
  const [editingChecklistMandatory, setEditingChecklistMandatory] = useState(false);
  
  // Tax Rates States
  const [taxRates, setTaxRates] = useState<Array<{id: number, name: string, rate: string}>>([
    { id: 1, name: 'Standard Tax', rate: '8.25' },
    { id: 2, name: 'Austin Tax', rate: '8.25' },
  ]);
  const [newTaxName, setNewTaxName] = useState('');
  const [newTaxRate, setNewTaxRate] = useState('');
  const [editingTaxId, setEditingTaxId] = useState<number | null>(null);
  const [editingTaxName, setEditingTaxName] = useState('');
  const [editingTaxRate, setEditingTaxRate] = useState('');
  
  // Promotions States (promotions comes from context)
  const [isCreatingPromotion, setIsCreatingPromotion] = useState(false);
  const [editingPromotionId, setEditingPromotionId] = useState<number | null>(null);
  const [promotionForm, setPromotionForm] = useState({
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    discountType: '$' as '$' | '%',
    discountValue: '',
    targetAudience: 'All Clients' as 'All Clients' | 'New Clients Only' | 'Existing Clients Only',
    promoCode: '',
    isActive: true
  });
  
  // Mock subscription data
  const [subscriptions] = useState([
    { plan: 'Premium', status: 'Active', startDate: 'Jan 1, 2026', endDate: 'Current', billingCycle: 'Yearly', price: '$1,200.00' },
    { plan: 'Basic', status: 'Inactive', startDate: 'Jan 1, 2025', endDate: 'Dec 31, 2025', billingCycle: 'Yearly', price: '$600.00' },
  ]);

  const handleStripeConnect = () => {
    if (stripeStatus === 'not-connected') {
      // Simulate going to Stripe
      setStripeStatus('incomplete');
    } else if (stripeStatus === 'incomplete') {
      // Simulate continuing onboarding
      setStripeStatus('connected');
    }
  };

  const handleChangePassword = () => {
    // Validate password
    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError('Error: All fields are required.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('Error: Current password is incorrect or new password and confirm password did not match.');
      return;
    }
    // Success
    setPasswordError('');
    alert('Password changed successfully!');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  const handleResetPassword = () => {
    alert('Password reset email has been sent to ' + email);
  };

  const handleUpdatePaymentMethod = () => {
    // Validate payment fields
    if (!newCardNumber || !newExpiryMonth || !newExpiryYear || !newCVV || !newNameOnCard) {
      alert('Error: All payment fields are required.');
      return;
    }
    
    // Get card type from first digit (simplified)
    let cardType = 'Card';
    if (newCardNumber.startsWith('4')) cardType = 'Visa';
    else if (newCardNumber.startsWith('5')) cardType = 'Mastercard';
    else if (newCardNumber.startsWith('3')) cardType = 'Amex';
    
    // Update payment method
    setPaymentMethod({
      type: cardType,
      last4: newCardNumber.slice(-4),
      expiryMonth: newExpiryMonth,
      expiryYear: newExpiryYear,
      nameOnCard: newNameOnCard
    });
    
    // Clear form and close modal
    setNewCardNumber('');
    setNewExpiryMonth('');
    setNewExpiryYear('');
    setNewCVV('');
    setNewNameOnCard('');
    setShowPaymentMethodModal(false);
    
    alert('Payment method updated successfully!');
  };

  const handleAddChecklistItem = () => {
    if (currentItemInput.trim() && checklistItems.length < 10) {
      setChecklistItems([...checklistItems, currentItemInput.trim()]);
      setCurrentItemInput('');
    }
  };

  const handleRemoveChecklistItem = (index: number) => {
    setChecklistItems(checklistItems.filter((_, i) => i !== index));
  };

  const handleDoneChecklist = () => {
    if (checklistName.trim() && checklistItems.length > 0) {
      setExistingChecklist({
        name: checklistName,
        items: checklistItems,
        mandatory: isChecklistMandatory
      });
      setIsCreatingChecklist(false);
      setChecklistName('');
      setChecklistItems([]);
      setCurrentItemInput('');
      setIsChecklistMandatory(false);
    }
  };

  const handleEditChecklist = () => {
    if (existingChecklist) {
      setIsEditingChecklist(true);
      setEditingChecklistName(existingChecklist.name);
      setEditingChecklistItems([...existingChecklist.items]);
      setEditingChecklistMandatory(existingChecklist.mandatory);
    }
  };

  const handleSaveChecklistEdit = () => {
    if (editingChecklistName.trim() && editingChecklistItems.length > 0) {
      setExistingChecklist({
        name: editingChecklistName,
        items: editingChecklistItems,
        mandatory: editingChecklistMandatory
      });
      setIsEditingChecklist(false);
    }
  };

  const handleCancelChecklistEdit = () => {
    setIsEditingChecklist(false);
    setEditingChecklistName('');
    setEditingChecklistItems([]);
    setEditingChecklistMandatory(false);
  };

  const handleAddEditingItem = () => {
    if (currentItemInput.trim() && editingChecklistItems.length < 10) {
      setEditingChecklistItems([...editingChecklistItems, currentItemInput.trim()]);
      setCurrentItemInput('');
    }
  };

  const handleRemoveEditingItem = (index: number) => {
    setEditingChecklistItems(editingChecklistItems.filter((_, i) => i !== index));
  };

  // Tax Rates Handlers
  const handleAddTaxRate = () => {
    if (newTaxName.trim() && newTaxRate.trim()) {
      const newId = taxRates.length > 0 ? Math.max(...taxRates.map(t => t.id)) + 1 : 1;
      setTaxRates([...taxRates, { id: newId, name: newTaxName.trim(), rate: newTaxRate.trim() }]);
      setNewTaxName('');
      setNewTaxRate('');
    }
  };

  const handleEditTaxRate = (id: number) => {
    const tax = taxRates.find(t => t.id === id);
    if (tax) {
      setEditingTaxId(id);
      setEditingTaxName(tax.name);
      setEditingTaxRate(tax.rate);
    }
  };

  const handleSaveTaxRate = () => {
    if (editingTaxId !== null && editingTaxName.trim() && editingTaxRate.trim()) {
      setTaxRates(taxRates.map(t => 
        t.id === editingTaxId 
          ? { ...t, name: editingTaxName.trim(), rate: editingTaxRate.trim() }
          : t
      ));
      setEditingTaxId(null);
      setEditingTaxName('');
      setEditingTaxRate('');
    }
  };

  const handleCancelEditTaxRate = () => {
    setEditingTaxId(null);
    setEditingTaxName('');
    setEditingTaxRate('');
  };

  const handleDeleteTaxRate = (id: number) => {
    setTaxRates(taxRates.filter(t => t.id !== id));
  };

  // Promotions Handlers
  const handleAddPromotion = () => {
    if (promotions.length >= 3) {
      alert('Maximum of 3 promotions allowed');
      return;
    }
    if (!promotionForm.title.trim() || !promotionForm.description.trim() || !promotionForm.startDate || !promotionForm.endDate) {
      alert('Please fill in all required fields');
      return;
    }
    const newId = promotions.length > 0 ? Math.max(...promotions.map(p => p.id)) + 1 : 1;
    setPromotions([...promotions, { 
      id: newId, 
      ...promotionForm,
      promoCode: promotionForm.promoCode.trim() || undefined
    }]);
    setPromotionForm({
      title: '',
      description: '',
      startDate: '',
      endDate: '',
      discountType: '$',
      discountValue: '',
      targetAudience: 'All Clients',
      promoCode: '',
      isActive: true
    });
    setIsCreatingPromotion(false);
  };

  const handleEditPromotion = (id: number) => {
    const promo = promotions.find(p => p.id === id);
    if (promo) {
      setEditingPromotionId(id);
      setPromotionForm({
        title: promo.title,
        description: promo.description,
        startDate: promo.startDate,
        endDate: promo.endDate,
        discountType: promo.discountType,
        discountValue: promo.discountValue,
        targetAudience: promo.targetAudience,
        promoCode: promo.promoCode || '',
        isActive: promo.isActive
      });
      setIsCreatingPromotion(true);
    }
  };

  const handleSaveEditPromotion = () => {
    if (editingPromotionId !== null) {
      if (!promotionForm.title.trim() || !promotionForm.description.trim() || !promotionForm.startDate || !promotionForm.endDate) {
        alert('Please fill in all required fields');
        return;
      }
      setPromotions(promotions.map(p => 
        p.id === editingPromotionId 
          ? { ...p, ...promotionForm, promoCode: promotionForm.promoCode.trim() || undefined }
          : p
      ));
      setEditingPromotionId(null);
      setPromotionForm({
        title: '',
        description: '',
        startDate: '',
        endDate: '',
        discountType: '$',
        discountValue: '',
        targetAudience: 'All Clients',
        promoCode: '',
        isActive: true
      });
      setIsCreatingPromotion(false);
    }
  };

  const handleCancelPromotion = () => {
    setIsCreatingPromotion(false);
    setEditingPromotionId(null);
    setPromotionForm({
      title: '',
      description: '',
      startDate: '',
      endDate: '',
      discountType: '$',
      discountValue: '',
      targetAudience: 'All Clients',
      promoCode: '',
      isActive: true
    });
  };

  const handleDeletePromotion = (id: number) => {
    setPromotions(promotions.filter(p => p.id !== id));
  };

  const handleTogglePromotionStatus = (id: number) => {
    setPromotions(promotions.map(p => 
      p.id === id ? { ...p, isActive: !p.isActive } : p
    ));
  };

  return (
    <div className="p-8">
      <div className="bg-white rounded-[20px] border border-[#e2e8f0] p-6" style={{ boxShadow: 'rgba(226, 232, 240, 0.5) 0px 2px 16px 2px' }}>
        
        {/* Tabs */}
        <div className="flex items-center gap-6 border-b border-gray-200 mb-6">
          <button
            onClick={() => setActiveTab('settings')}
            className={`pb-3 px-2 text-sm font-medium transition-colors ${
              activeTab === 'settings'
                ? 'text-[#9473ff] border-b-2 border-[#9473ff]'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <div className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Settings
            </div>
          </button>
          {!isStaffView && (
            <>
              <button
                onClick={() => setActiveTab('customization')}
                className={`pb-3 px-2 text-sm font-medium transition-colors ${
                  activeTab === 'customization'
                    ? 'text-[#9473ff] border-b-2 border-[#9473ff]'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Settings2 className="w-4 h-4" />
                  Customization
                </div>
              </button>
              <button
                onClick={() => setActiveTab('integrations')}
                className={`pb-3 px-2 text-sm font-medium transition-colors ${
                  activeTab === 'integrations'
                    ? 'text-[#9473ff] border-b-2 border-[#9473ff]'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Plug className="w-4 h-4" />
                  Integrations
                </div>
              </button>
            </>
          )}
        </div>

        {/* SETTINGS TAB */}
        {activeTab === 'settings' && (
          <div className="space-y-8">
            {/* Customer Number */}
            {!isStaffView && (
              <div className="flex justify-end">
                <div className="text-sm text-[#051046]">
                  <span className="font-semibold">Customer #:</span> K-10245
                </div>
              </div>
            )}

            {/* Your Data */}
            <div className="bg-gray-50 rounded-[20px] border border-[#e2e8f0] p-6">
              <h3 className="text-lg font-semibold text-[#051046] mb-4">Your Data</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-[#051046] mb-2">First name</label>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full px-4 py-2 border border-[#e8e8e8] rounded-[15px] text-sm text-[#051046] focus:outline-none focus:ring-2 focus:ring-purple-600"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#051046] mb-2">Last name</label>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full px-4 py-2 border border-[#e8e8e8] rounded-[15px] text-sm text-[#051046] focus:outline-none focus:ring-2 focus:ring-purple-600"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#051046] mb-2">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2 border border-[#e8e8e8] rounded-[15px] text-sm text-[#051046] focus:outline-none focus:ring-2 focus:ring-purple-600"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#051046] mb-2">Phone</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-4 py-2 border border-[#e8e8e8] rounded-[15px] text-sm text-[#051046] focus:outline-none focus:ring-2 focus:ring-purple-600"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-[#051046] mb-2">Address</label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Uses Google API"
                    className="w-full px-4 py-2 border border-[#e8e8e8] rounded-[15px] text-sm text-[#051046] focus:outline-none focus:ring-2 focus:ring-purple-600"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-[#051046] mb-2">Your Photo</label>
                  <p className="text-xs text-gray-500 mb-2">Note: This image will appear in your email notifications.</p>
                  <div className="flex items-center gap-4">
                    <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                      <img src={userAvatar} alt="User Avatar" className="w-full h-full object-cover" />
                    </div>
                    <button className="px-4 py-2 border border-[#e8e8e8] rounded-[32px] text-sm text-[#051046] hover:bg-gray-100 transition-colors flex items-center gap-2">
                      <Upload className="w-4 h-4" />
                      Upload Photo
                    </button>
                  </div>
                </div>
              </div>
              <button
                className="px-6 py-2 rounded-[32px] text-white font-medium transition-colors"
                style={{ backgroundColor: '#9473ff' }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#7f5fd9'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#9473ff'}
                onClick={() => alert('Data updated successfully!')}
              >
                Update Data
              </button>
            </div>

            {/* Change Password */}
            <div className="bg-gray-50 rounded-[20px] border border-[#e2e8f0] p-6">
              <h3 className="text-lg font-semibold text-[#051046] mb-4">Change Password</h3>
              <div className="space-y-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-[#051046] mb-2">Current password</label>
                  <div className="relative">
                    <input
                      type={showCurrentPassword ? 'text' : 'password'}
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="w-full px-4 py-2 pr-10 border border-[#e8e8e8] rounded-[15px] text-sm text-[#051046] focus:outline-none focus:ring-2 focus:ring-purple-600"
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#051046] mb-2">New password</label>
                  <div className="relative">
                    <input
                      type={showNewPassword ? 'text' : 'password'}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full px-4 py-2 pr-10 border border-[#e8e8e8] rounded-[15px] text-sm text-[#051046] focus:outline-none focus:ring-2 focus:ring-purple-600"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#051046] mb-2">Confirm password</label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full px-4 py-2 pr-10 border border-[#e8e8e8] rounded-[15px] text-sm text-[#051046] focus:outline-none focus:ring-2 focus:ring-purple-600"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>
              {passwordError && (
                <p className="text-sm text-red-500 mb-4">{passwordError}</p>
              )}
              <div className="flex items-center gap-4">
                <button
                  onClick={handleChangePassword}
                  className="px-6 py-2 rounded-[32px] text-white font-medium transition-colors"
                  style={{ backgroundColor: '#9473ff' }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#7f5fd9'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#9473ff'}
                >
                  Change Password
                </button>
                <div className="relative group">
                  <button
                    onClick={handleResetPassword}
                    className="px-6 py-2 border border-[#e8e8e8] rounded-[32px] text-[#051046] font-medium hover:bg-gray-100 transition-colors flex items-center gap-2"
                  >
                    Reset Password
                    <Info className="w-4 h-4 text-gray-400" />
                  </button>
                  <div className="absolute left-0 top-full mt-2 hidden group-hover:block bg-gray-900 text-white text-xs rounded-lg px-3 py-2 z-10" style={{ width: '280px', whiteSpace: 'normal' }}>
                    Request email with link sent to the user to reset their password.
                    <div className="absolute bottom-full left-4 w-0 h-0 border-l-4 border-r-4 border-b-4 border-transparent border-b-gray-900"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Your Company Data - Admin Only */}
            {!isStaffView && (
              <div className="bg-gray-50 rounded-[20px] border border-[#e2e8f0] p-6">
                <h3 className="text-lg font-semibold text-[#051046] mb-4">Your Company Data</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-[#051046] mb-2">Company Name</label>
                    <input
                      type="text"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      className="w-full px-4 py-2 border border-[#e8e8e8] rounded-[15px] text-sm text-[#051046] focus:outline-none focus:ring-2 focus:ring-purple-600"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#051046] mb-2">Company size</label>
                    <select
                      value={companySize}
                      onChange={(e) => setCompanySize(e.target.value)}
                      className="w-full px-4 py-2 border border-[#e8e8e8] rounded-[15px] text-sm text-[#051046] focus:outline-none focus:ring-2 focus:ring-purple-600"
                    >
                      <option value="Owner/Operator">Owner/Operator</option>
                      <option value="2 - 5">2 - 5</option>
                      <option value="6 - 10">6 - 10</option>
                      <option value="11+">11+</option>
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-[#051046] mb-2">
                      Google review link{' '}
                      <a href="https://support.google.com/business/answer/7035772" target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:text-purple-700 text-xs">
                        (How to get link?)
                      </a>
                    </label>
                    <input
                      type="text"
                      value={googleReviewLink}
                      onChange={(e) => setGoogleReviewLink(e.target.value)}
                      className="w-full px-4 py-2 border border-[#e8e8e8] rounded-[15px] text-sm text-[#051046] focus:outline-none focus:ring-2 focus:ring-purple-600"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-[#051046] mb-2">Company logo</label>
                    <div className="flex items-center gap-4">
                      <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                        <img src={companyLogo} alt="Company Logo" className="w-full h-full object-contain rounded-full" />
                      </div>
                      <button className="px-4 py-2 border border-[#e8e8e8] rounded-[32px] text-sm text-[#051046] hover:bg-gray-100 transition-colors flex items-center gap-2">
                        <Upload className="w-4 h-4" />
                        Upload Logo
                      </button>
                    </div>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-[#051046] mb-2">Address</label>
                    <input
                      type="text"
                      value={companyAddress}
                      onChange={(e) => setCompanyAddress(e.target.value)}
                      placeholder="Uses Google maps API"
                      className="w-full px-4 py-2 border border-[#e8e8e8] rounded-[15px] text-sm text-[#051046] focus:outline-none focus:ring-2 focus:ring-purple-600"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#051046] mb-2">Primary industry</label>
                    <select
                      value={primaryIndustry}
                      onChange={(e) => setPrimaryIndustry(e.target.value)}
                      className="w-full px-4 py-2 border border-[#e8e8e8] rounded-[15px] text-sm text-[#051046] focus:outline-none focus:ring-2 focus:ring-purple-600"
                    >
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
                  <div>
                    <label className="block text-sm font-medium text-[#051046] mb-2">Website (optional)</label>
                    <input
                      type="text"
                      value={website}
                      onChange={(e) => setWebsite(e.target.value)}
                      className="w-full px-4 py-2 border border-[#e8e8e8] rounded-[15px] text-sm text-[#051046] focus:outline-none focus:ring-2 focus:ring-purple-600"
                    />
                  </div>
                </div>
                <button
                  className="px-6 py-2 rounded-[32px] text-white font-medium transition-colors"
                  style={{ backgroundColor: '#9473ff' }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#7f5fd9'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#9473ff'}
                  onClick={() => alert('Company data updated successfully!')}
                >
                  Update Company Data
                </button>
              </div>
            )}

            {/* Subscription - Admin Only */}
            {!isStaffView && (
              <div className="bg-gray-50 rounded-[20px] border border-[#e2e8f0] p-6">
                <h3 className="text-lg font-semibold text-[#051046] mb-4">Subscription</h3>
                
                {/* Current Payment Method */}
                <div className="bg-white rounded-[15px] border border-[#e2e8f0] p-4 mb-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-[#051046] mb-1">Current Payment Method</p>
                      <div className="flex items-center gap-2">
                        <CreditCard className="w-4 h-4 text-gray-500" />
                        <p className="text-sm text-[#051046]">
                          {paymentMethod.type} ending in {paymentMethod.last4}
                        </p>
                        <span className="text-xs text-gray-500">
                          • Expires {paymentMethod.expiryMonth}/{paymentMethod.expiryYear}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        {paymentMethod.nameOnCard}
                      </p>
                    </div>
                    <button
                      onClick={() => setShowPaymentMethodModal(true)}
                      className="px-4 py-2 border border-[#e8e8e8] rounded-[32px] text-sm font-medium text-[#051046] hover:bg-gray-50 transition-colors"
                    >
                      Update
                    </button>
                  </div>
                </div>

                <div className="flex gap-4 mb-6">
                  <button
                    onClick={() => setShowSubscriptionModal(true)}
                    className="px-6 py-2 rounded-[32px] text-white font-medium transition-colors"
                    style={{ backgroundColor: '#9473ff' }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#7f5fd9'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#9473ff'}
                  >
                    Choose plan
                  </button>
                  <button
                    onClick={() => setShowCancelModal(true)}
                    className="px-6 py-2 border border-red-500 rounded-[32px] text-red-500 font-medium hover:bg-red-50 transition-colors"
                  >
                    Cancel
                  </button>
                </div>

                <h4 className="text-base font-semibold text-[#051046] mb-3">Your past subscriptions</h4>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 text-sm font-semibold text-[#6a7282] uppercase tracking-wider">Plan</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-[#6a7282] uppercase tracking-wider">Status</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-[#6a7282] uppercase tracking-wider">Start Date</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-[#6a7282] uppercase tracking-wider">End Date</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-[#6a7282] uppercase tracking-wider">Billing Cycle</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-[#6a7282] uppercase tracking-wider">Price</th>
                      </tr>
                    </thead>
                    <tbody>
                      {subscriptions.map((sub, index) => (
                        <tr key={index} className="border-b border-gray-100 last:border-0">
                          <td className="py-3 px-4 text-sm text-[#051046]">{sub.plan}</td>
                          <td className="py-3 px-4">
                            <span className={`text-sm ${sub.status === 'Active' ? 'text-green-600' : 'text-gray-500'}`}>
                              {sub.status}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-sm text-[#051046]">{sub.startDate}</td>
                          <td className="py-3 px-4 text-sm text-[#051046]">{sub.endDate}</td>
                          <td className="py-3 px-4 text-sm text-[#051046]">Monthly</td>
                          <td className="py-3 px-4 text-sm text-[#051046]">{sub.price}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* CUSTOMIZATION TAB */}
        {activeTab === 'customization' && !isStaffView && (
          <div className="space-y-8">
            <p className="text-sm text-gray-600">Configure your application's preferences</p>

            {/* Notifications */}
            <div className="bg-gray-50 rounded-[20px] border border-[#e2e8f0] p-6">
              <h3 className="text-lg font-semibold text-[#051046] mb-2">Notifications</h3>
              <p className="text-xs text-gray-500 mb-4">Note: You can adjust when these email notifications are sent.</p>
              
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <label className="text-sm font-medium text-[#051046]">
                        Reminder - "Scheduled Job Details"
                      </label>
                      <div className="relative group">
                        <Info className="w-4 h-4 text-gray-400 cursor-help" />
                        <div className="absolute left-0 top-full mt-2 hidden group-hover:block bg-gray-900 text-white text-xs rounded-lg px-3 py-2 whitespace-nowrap z-10">
                          Sent before a scheduled job
                          <div className="absolute bottom-full left-4 w-0 h-0 border-l-4 border-r-4 border-b-4 border-transparent border-b-gray-900"></div>
                        </div>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Sent <input
                        type="number"
                        value={scheduleJobHours}
                        onChange={(e) => setScheduleJobHours(e.target.value)}
                        className="w-16 px-2 py-1 border border-[#e8e8e8] rounded-[10px] text-xs text-[#051046] focus:outline-none focus:ring-1 focus:ring-purple-600 mx-1"
                      /> hours before a scheduled job.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <label className="text-sm font-medium text-[#051046]">
                        Reminder - "Your Estimate Is Now Available"
                      </label>
                      <div className="relative group">
                        <Info className="w-4 h-4 text-gray-400 cursor-help" />
                        <div className="absolute left-0 top-full mt-2 hidden group-hover:block bg-gray-900 text-white text-xs rounded-lg px-3 py-2 whitespace-nowrap z-10">
                          Sent after estimate is pending
                          <div className="absolute bottom-full left-4 w-0 h-0 border-l-4 border-r-4 border-b-4 border-transparent border-b-gray-900"></div>
                        </div>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Sent <input
                        type="number"
                        value={estimateHours}
                        onChange={(e) => setEstimateHours(e.target.value)}
                        className="w-16 px-2 py-1 border border-[#e8e8e8] rounded-[10px] text-xs text-[#051046] focus:outline-none focus:ring-1 focus:ring-purple-600 mx-1"
                      /> hours after an estimate has been in a "Pending" status.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <label className="text-sm font-medium text-[#051046]">
                        "Friendly Reminder: Invoice Overdue"
                      </label>
                      <div className="relative group">
                        <Info className="w-4 h-4 text-gray-400 cursor-help" />
                        <div className="absolute left-0 top-full mt-2 hidden group-hover:block bg-gray-900 text-white text-xs rounded-lg px-3 py-2 whitespace-nowrap z-10">
                          Sent when invoice is overdue
                          <div className="absolute bottom-full left-4 w-0 h-0 border-l-4 border-r-4 border-b-4 border-transparent border-b-gray-900"></div>
                        </div>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Sent <input
                        type="number"
                        value={invoiceOverdueHours}
                        onChange={(e) => setInvoiceOverdueHours(e.target.value)}
                        className="w-16 px-2 py-1 border border-[#e8e8e8] rounded-[10px] text-xs text-[#051046] focus:outline-none focus:ring-1 focus:ring-purple-600 mx-1"
                      /> hours after an invoice has been in a "Due" or "Unpaid" status.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <label className="text-sm font-medium text-[#051046]">
                        Up Coming Birthday
                      </label>
                      <div className="relative group">
                        <Info className="w-4 h-4 text-gray-400 cursor-help" />
                        <div className="absolute left-0 top-full mt-2 hidden group-hover:block bg-gray-900 text-white text-xs rounded-lg px-3 py-2 whitespace-nowrap z-10">
                          Reminder before team member birthday
                          <div className="absolute bottom-full left-4 w-0 h-0 border-l-4 border-r-4 border-b-4 border-transparent border-b-gray-900"></div>
                        </div>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Sent <input
                        type="number"
                        value={birthdayDays}
                        onChange={(e) => setBirthdayDays(e.target.value)}
                        className="w-16 px-2 py-1 border border-[#e8e8e8] rounded-[10px] text-xs text-[#051046] focus:outline-none focus:ring-1 focus:ring-purple-600 mx-1"
                      /> days in advance to the admin before a team members birthday.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex items-center gap-3">
                <button
                  className="px-6 py-2 rounded-[32px] text-white font-medium transition-colors"
                  style={{ backgroundColor: '#9473ff' }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#7f5fd9'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#9473ff'}
                  onClick={() => alert('Notification settings updated successfully!')}
                >
                  Save Notification Settings
                </button>
                <button
                  className="px-6 py-2 rounded-[32px] font-medium transition-colors border"
                  style={{ backgroundColor: 'white', borderColor: '#e2e8f0', color: '#051046' }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8f9fa'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
                  onClick={() => {
                    setScheduleJobHours('24');
                    setEstimateHours('48');
                    setInvoiceOverdueHours('48');
                    setBirthdayDays('7');
                  }}
                >
                  Restore Defaults
                </button>
              </div>
            </div>

            {/* Commission Settings */}
            <div className="bg-gray-50 rounded-[20px] border border-[#e2e8f0] p-6">
              <h3 className="text-lg font-semibold text-[#051046] mb-2">Commission Settings</h3>
              <p className="text-xs text-gray-500 mb-4">Set default commission rates for technician upsells.</p>
              
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <label className="text-sm font-medium text-[#051046]">
                        Default Technician Commission
                      </label>
                      <div className="relative group">
                        <Info className="w-4 h-4 text-gray-400 cursor-help" />
                        <div className="absolute left-0 top-full mt-2 hidden group-hover:block bg-gray-900 text-white text-xs rounded-lg px-3 py-2 whitespace-nowrap z-10">
                          Applied to all technician upsells unless manually overridden
                          <div className="absolute bottom-full left-4 w-0 h-0 border-l-4 border-r-4 border-b-4 border-transparent border-b-gray-900"></div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <input
                        type="number"
                        min="0"
                        max="100"
                        step="0.5"
                        value={defaultTechnicianCommission}
                        onChange={(e) => setDefaultTechnicianCommission(e.target.value)}
                        className="w-20 px-3 py-2 border border-[#e8e8e8] rounded-[15px] text-sm text-[#051046] focus:outline-none focus:ring-2 focus:ring-purple-600"
                      />
                      <span className="text-sm text-gray-500">%</span>
                      <span className="text-xs text-gray-400 ml-2">(This applies to both job item upsells and service plan upsells)</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex items-center gap-3">
                <button
                  className="px-6 py-2 rounded-[32px] text-white font-medium transition-colors"
                  style={{ backgroundColor: '#9473ff' }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#7f5fd9'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#9473ff'}
                  onClick={() => alert('Commission settings updated successfully!')}
                >
                  Save Commission Settings
                </button>
                <button
                  className="px-6 py-2 rounded-[32px] font-medium transition-colors border"
                  style={{ backgroundColor: 'white', borderColor: '#e2e8f0', color: '#051046' }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8f9fa'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
                  onClick={() => setDefaultTechnicianCommission('15')}
                >
                  Restore Default (15%)
                </button>
              </div>
            </div>

            {/* Promotions */}
            <div className="bg-gray-50 rounded-[20px] border border-[#e2e8f0] p-6">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="text-lg font-semibold text-[#051046]">Promotions</h3>
                  <p className="text-xs text-gray-500 mt-1">Create and manage promotional offers for your staff to share with clients (Maximum 3 promotions).</p>
                </div>
                <span className="text-xs font-medium text-[#051046] bg-white px-3 py-1 rounded-full border border-[#e2e8f0]">
                  {promotions.length}/3
                </span>
              </div>
              
              <div className="mt-4 mb-4 p-3 border border-blue-200 rounded-[15px] bg-[#a6e4fa59]">
                <p className="text-xs text-[#399deb]">
                  <Info className="w-3 h-3 inline mr-1" />
                  When you update promotions, they will go live on the staff dashboard page where your team can view and share them with clients.
                </p>
              </div>

              {/* Existing Promotions */}
              {promotions.length > 0 && (
                <div className="space-y-3 mb-4">
                  {promotions.map((promo) => (
                    <div key={promo.id} className="bg-white rounded-[15px] border border-[#e2e8e8] p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="text-sm font-semibold text-[#051046]">{promo.title}</h4>
                            <span 
                              className={`text-xs px-2 py-0.5 rounded-full ${promo.isActive ? '' : 'bg-gray-100 text-gray-600'}`}
                              style={promo.isActive ? { backgroundColor: '#b9df10', color: '#051046' } : undefined}
                            >
                              {promo.isActive ? 'Active' : 'Inactive'}
                            </span>
                          </div>
                          <p className="text-xs text-gray-600 mb-2">{promo.description}</p>
                          <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500">
                            <span>📅 {promo.startDate} - {promo.endDate}</span>
                            <span>💰 {promo.discountType === '%' ? `${promo.discountValue}%` : `$${promo.discountValue}`}</span>
                            <span>👥 {promo.targetAudience}</span>
                            {promo.promoCode && <span>🏷️ Code: <span className="font-medium text-purple-600">{promo.promoCode}</span></span>}
                          </div>
                        </div>
                        <div className="flex items-center gap-2 ml-3">
                          <button
                            onClick={() => handleTogglePromotionStatus(promo.id)}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${promo.isActive ? '' : 'bg-gray-300'}`}
                            style={promo.isActive ? { backgroundColor: '#9473ff' } : undefined}
                            title={promo.isActive ? 'Active' : 'Inactive'}
                          >
                            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${promo.isActive ? 'translate-x-6' : 'translate-x-1'}`} />
                          </button>
                          <button
                            onClick={() => handleEditPromotion(promo.id)}
                            className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeletePromotion(promo.id)}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Create/Edit Promotion Form */}
              {isCreatingPromotion ? (
                <div className="bg-white rounded-[15px] border border-[#e8e8e8] p-4 space-y-3">
                  <h4 className="text-sm font-semibold text-[#051046] mb-3">
                    {editingPromotionId !== null ? 'Edit Promotion' : 'Create New Promotion'}
                  </h4>
                  
                  <div>
                    <label className="block text-xs font-medium text-[#051046] mb-1">Promotion Title *</label>
                    <input
                      type="text"
                      value={promotionForm.title}
                      onChange={(e) => setPromotionForm({...promotionForm, title: e.target.value})}
                      placeholder="e.g., 20% Off HVAC Maintenance"
                      className="w-full px-3 py-2 border border-[#e8e8e8] rounded-[15px] text-sm text-[#051046] focus:outline-none focus:ring-2 focus:ring-purple-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#051046] mb-1">Description *</label>
                    <textarea
                      value={promotionForm.description}
                      onChange={(e) => setPromotionForm({...promotionForm, description: e.target.value})}
                      placeholder="Describe the promotion details..."
                      rows={3}
                      className="w-full px-3 py-2 border border-[#e8e8e8] rounded-[15px] text-sm text-[#051046] focus:outline-none focus:ring-2 focus:ring-purple-600"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-[#051046] mb-1">Start Date *</label>
                      <input
                        type="date"
                        value={promotionForm.startDate}
                        onChange={(e) => setPromotionForm({...promotionForm, startDate: e.target.value})}
                        className="w-full px-3 py-2 border border-[#e8e8e8] rounded-[15px] text-sm text-[#051046] focus:outline-none focus:ring-2 focus:ring-purple-600"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-[#051046] mb-1">End Date *</label>
                      <input
                        type="date"
                        value={promotionForm.endDate}
                        onChange={(e) => setPromotionForm({...promotionForm, endDate: e.target.value})}
                        className="w-full px-3 py-2 border border-[#e8e8e8] rounded-[15px] text-sm text-[#051046] focus:outline-none focus:ring-2 focus:ring-purple-600"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-[#051046] mb-1">Discount Amount *</label>
                      <div className="flex gap-2">
                        <select
                          value={promotionForm.discountType}
                          onChange={(e) => setPromotionForm({...promotionForm, discountType: e.target.value as '$' | '%'})}
                          className="w-20 px-3 py-2 border border-[#e8e8e8] rounded-[15px] text-sm text-[#051046] focus:outline-none focus:ring-2 focus:ring-purple-600"
                        >
                          <option value="$">$</option>
                          <option value="%">%</option>
                        </select>
                        <input
                          type="number"
                          placeholder="Enter amount"
                          value={promotionForm.discountValue}
                          onChange={(e) => setPromotionForm({...promotionForm, discountValue: e.target.value})}
                          className="flex-1 px-3 py-2 border border-[#e8e8e8] rounded-[15px] text-sm text-[#051046] focus:outline-none focus:ring-2 focus:ring-purple-600"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-[#051046] mb-1">Target Audience *</label>
                      <select
                        value={promotionForm.targetAudience}
                        onChange={(e) => setPromotionForm({...promotionForm, targetAudience: e.target.value as any})}
                        className="w-full px-3 py-2 border border-[#e8e8e8] rounded-[15px] text-sm text-[#051046] focus:outline-none focus:ring-2 focus:ring-purple-600"
                      >
                        <option value="All Clients">All Clients</option>
                        <option value="New Clients Only">New Clients Only</option>
                        <option value="Existing Clients Only">Existing Clients Only</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#051046] mb-1">Promo Code (Optional)</label>
                    <input
                      type="text"
                      value={promotionForm.promoCode}
                      onChange={(e) => setPromotionForm({...promotionForm, promoCode: e.target.value.toUpperCase()})}
                      placeholder="e.g., SAVE20"
                      className="w-full px-3 py-2 border border-[#e8e8e8] rounded-[15px] text-sm text-[#051046] focus:outline-none focus:ring-2 focus:ring-purple-600"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-sm text-[#051046]">Active</span>
                    <button
                      onClick={() => setPromotionForm({...promotionForm, isActive: !promotionForm.isActive})}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${promotionForm.isActive ? '' : 'bg-gray-300'}`}
                      style={promotionForm.isActive ? { backgroundColor: '#9473ff' } : undefined}
                    >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${promotionForm.isActive ? 'translate-x-6' : 'translate-x-1'}`} />
                    </button>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button
                      onClick={handleCancelPromotion}
                      className="px-4 py-2 border border-[#e8e8e8] rounded-[32px] text-sm text-[#051046] font-medium hover:bg-gray-100 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={editingPromotionId !== null ? handleSaveEditPromotion : handleAddPromotion}
                      className="px-4 py-2 rounded-[32px] text-sm font-medium transition-colors text-white"
                      style={{ backgroundColor: '#9473ff' }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#7f5fd9'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#9473ff'}
                    >
                      {editingPromotionId !== null ? 'Save Changes' : 'Create Promotion'}
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => {
                    if (promotions.length >= 3) {
                      alert('Maximum of 3 promotions allowed');
                      return;
                    }
                    setIsCreatingPromotion(true);
                  }}
                  disabled={promotions.length >= 3}
                  className={`px-4 py-2 rounded-[32px] text-sm font-medium transition-colors flex items-center gap-2 ${
                    promotions.length >= 3
                      ? 'text-gray-400 bg-gray-200 cursor-not-allowed'
                      : 'text-white'
                  }`}
                  style={promotions.length < 3 ? { backgroundColor: '#9473ff' } : {}}
                  onMouseEnter={(e) => {
                    if (promotions.length < 3) {
                      e.currentTarget.style.backgroundColor = '#7f5fd9';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (promotions.length < 3) {
                      e.currentTarget.style.backgroundColor = '#9473ff';
                    }
                  }}
                >
                  <Plus className="w-4 h-4" />
                  Create New Promotion
                </button>
              )}
            </div>

            {/* Tax Rates */}
            <div className="bg-gray-50 rounded-[20px] border border-[#e2e8f0] p-6">
              <h3 className="text-lg font-semibold text-[#051046] mb-2">Tax Rates</h3>
              <p className="text-xs text-gray-500 mb-4">Configure tax rates that will be available when creating estimates and invoices.</p>
              
              {/* Existing Tax Rates */}
              <div className="space-y-3 mb-4">
                {taxRates.map((tax) => (
                  <div key={tax.id} className="bg-white rounded-[15px] border border-[#e8e8e8] p-4">
                    {editingTaxId === tax.id ? (
                      <div className="space-y-3">
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-medium text-[#051046] mb-1">Tax Name</label>
                            <input
                              type="text"
                              value={editingTaxName}
                              onChange={(e) => setEditingTaxName(e.target.value)}
                              placeholder="Standard Tax"
                              className="w-full px-3 py-2 border border-[#e8e8e8] rounded-[15px] text-sm text-[#051046] focus:outline-none focus:ring-2 focus:ring-purple-600"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-[#051046] mb-1">Tax Rate (%)</label>
                            <input
                              type="number"
                              step="0.01"
                              value={editingTaxRate}
                              onChange={(e) => setEditingTaxRate(e.target.value)}
                              placeholder="e.g., 8.25"
                              className="w-full px-3 py-2 border border-[#e8e8e8] rounded-[15px] text-sm text-[#051046] focus:outline-none focus:ring-2 focus:ring-purple-600"
                            />
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={handleSaveTaxRate}
                            disabled={!editingTaxName.trim() || !editingTaxRate.trim()}
                            className={`px-4 py-2 rounded-[32px] text-sm font-medium transition-colors ${
                              editingTaxName.trim() && editingTaxRate.trim()
                                ? 'text-white'
                                : 'text-gray-400 bg-gray-200 cursor-not-allowed'
                            }`}
                            style={editingTaxName.trim() && editingTaxRate.trim() ? { backgroundColor: '#9473ff' } : {}}
                            onMouseEnter={(e) => {
                              if (editingTaxName.trim() && editingTaxRate.trim()) {
                                e.currentTarget.style.backgroundColor = '#7f5fd9';
                              }
                            }}
                            onMouseLeave={(e) => {
                              if (editingTaxName.trim() && editingTaxRate.trim()) {
                                e.currentTarget.style.backgroundColor = '#9473ff';
                              }
                            }}
                          >
                            Save
                          </button>
                          <button
                            onClick={handleCancelEditTaxRate}
                            className="px-4 py-2 border border-[#e8e8e8] rounded-[32px] text-sm text-[#051046] font-medium hover:bg-gray-100 transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-semibold text-[#051046]">{tax.name}</p>
                          <p className="text-xs text-gray-500">{tax.rate}%</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleEditTaxRate(tax.id)}
                            className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteTaxRate(tax.id)}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Add New Tax Rate */}
              <div className="bg-white rounded-[15px] border border-[#e8e8e8] p-4">
                <h4 className="text-sm font-semibold text-[#051046] mb-3">Add New Tax Rate</h4>
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div>
                    <label className="block text-xs font-medium text-[#051046] mb-1">Tax Name</label>
                    <input
                      type="text"
                      value={newTaxName}
                      onChange={(e) => setNewTaxName(e.target.value)}
                      placeholder="e.g., Standard Sales Tax"
                      className="w-full px-3 py-2 border border-[#e8e8e8] rounded-[15px] text-sm text-[#051046] focus:outline-none focus:ring-2 focus:ring-purple-600"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#051046] mb-1">Tax Rate (%)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={newTaxRate}
                      onChange={(e) => setNewTaxRate(e.target.value)}
                      placeholder="e.g., 8.25"
                      className="w-full px-3 py-2 border border-[#e8e8e8] rounded-[15px] text-sm text-[#051046] focus:outline-none focus:ring-2 focus:ring-purple-600"
                    />
                  </div>
                </div>
                <button
                  onClick={handleAddTaxRate}
                  disabled={!newTaxName.trim() || !newTaxRate.trim()}
                  className={`px-4 py-2 rounded-[32px] text-sm font-medium transition-colors flex items-center gap-2 ${
                    newTaxName.trim() && newTaxRate.trim()
                      ? 'text-white'
                      : 'text-gray-400 bg-gray-200 cursor-not-allowed'
                  }`}
                  style={newTaxName.trim() && newTaxRate.trim() ? { backgroundColor: '#9473ff' } : {}}
                  onMouseEnter={(e) => {
                    if (newTaxName.trim() && newTaxRate.trim()) {
                      e.currentTarget.style.backgroundColor = '#7f5fd9';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (newTaxName.trim() && newTaxRate.trim()) {
                      e.currentTarget.style.backgroundColor = '#9473ff';
                    }
                  }}
                >
                  <Plus className="w-4 h-4" />
                  Add Tax Rate
                </button>
              </div>
            </div>

            {/* Checklist */}
            <div className="bg-gray-50 rounded-[20px] border border-[#e2e8f0] p-6">
              <h3 className="text-lg font-semibold text-[#051046] mb-4">Checklist</h3>

              {/* Existing Checklist or Create New */}
              {!existingChecklist && !isCreatingChecklist && (
                <button
                  onClick={() => setIsCreatingChecklist(true)}
                  className="px-6 py-2 rounded-[32px] text-white font-medium transition-colors"
                  style={{ backgroundColor: '#9473ff' }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#7f5fd9'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#9473ff'}
                >
                  Create Checklist
                </button>
              )}

              {/* Creating New Checklist */}
              {isCreatingChecklist && (
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <input
                      type="text"
                      value={checklistName}
                      onChange={(e) => setChecklistName(e.target.value)}
                      placeholder="Checklist Name"
                      className="flex-1 px-4 py-2 border border-[#e8e8e8] rounded-[15px] text-sm text-[#051046] focus:outline-none focus:ring-2 focus:ring-purple-600"
                    />
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-[#051046]">Mandatory</span>
                      <button
                        onClick={() => setIsChecklistMandatory(!isChecklistMandatory)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          isChecklistMandatory ? 'bg-purple-600' : 'bg-gray-300'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            isChecklistMandatory ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                  </div>

                  {checklistItems.map((item, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <span className="text-sm text-[#051046]">{item}</span>
                      <button onClick={() => handleRemoveChecklistItem(index)} className="text-red-500 hover:text-red-700">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}

                  {checklistItems.length < 10 && (
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={currentItemInput}
                        onChange={(e) => setCurrentItemInput(e.target.value)}
                        placeholder="Item Name"
                        className="flex-1 px-4 py-2 border border-[#e8e8e8] rounded-[15px] text-sm text-[#051046] focus:outline-none focus:ring-2 focus:ring-purple-600"
                      />
                      <button
                        onClick={handleAddChecklistItem}
                        disabled={!currentItemInput.trim()}
                        className={`text-sm px-4 py-2 rounded-[32px] transition-colors flex items-center gap-1 ${
                          currentItemInput.trim()
                            ? 'text-purple-600 hover:bg-purple-50'
                            : 'text-gray-400 cursor-not-allowed'
                        }`}
                      >
                        <Plus className="w-4 h-4" />
                        Add Item
                      </button>
                    </div>
                  )}

                  <div className="flex gap-2 pt-4">
                    <button
                      onClick={() => {
                        setIsCreatingChecklist(false);
                        setChecklistName('');
                        setChecklistItems([]);
                        setCurrentItemInput('');
                        setIsChecklistMandatory(false);
                      }}
                      className="px-6 py-2 border border-gray-300 rounded-[32px] text-gray-700 font-medium hover:bg-gray-100 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleDoneChecklist}
                      disabled={!checklistName.trim() || checklistItems.length === 0}
                      className={`px-6 py-2 rounded-[32px] font-medium transition-colors ${
                        checklistName.trim() && checklistItems.length > 0
                          ? 'text-white'
                          : 'text-gray-400 bg-gray-200 cursor-not-allowed'
                      }`}
                      style={checklistName.trim() && checklistItems.length > 0 ? { backgroundColor: '#9473ff' } : {}}
                      onMouseEnter={(e) => {
                        if (checklistName.trim() && checklistItems.length > 0) {
                          e.currentTarget.style.backgroundColor = '#7f5fd9';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (checklistName.trim() && checklistItems.length > 0) {
                          e.currentTarget.style.backgroundColor = '#9473ff';
                        }
                      }}
                    >
                      Done
                    </button>
                  </div>
                </div>
              )}

              {/* Display Existing Checklist */}
              {existingChecklist && !isEditingChecklist && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <h4 className="text-base font-semibold text-[#051046]">{existingChecklist.name}</h4>
                      <button onClick={handleEditChecklist} className="text-purple-600 hover:text-purple-700">
                        <Edit2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-[#051046]">Mandatory</span>
                      <button
                        onClick={() => setExistingChecklist({...existingChecklist, mandatory: !existingChecklist.mandatory})}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          existingChecklist.mandatory ? 'bg-[#9473ff]' : 'bg-gray-300'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            existingChecklist.mandatory ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                  <div className="space-y-2 max-h-[300px] overflow-y-auto">
                    {existingChecklist.items.map((item, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <span className="text-sm text-[#051046]">• {item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Edit Existing Checklist */}
              {isEditingChecklist && (
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <input
                      type="text"
                      value={editingChecklistName}
                      onChange={(e) => setEditingChecklistName(e.target.value)}
                      placeholder="Checklist Name"
                      className="flex-1 px-4 py-2 border border-[#e8e8e8] rounded-[15px] text-sm text-[#051046] focus:outline-none focus:ring-2 focus:ring-purple-600"
                    />
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-[#051046]">Mandatory</span>
                      <button
                        onClick={() => setEditingChecklistMandatory(!editingChecklistMandatory)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          editingChecklistMandatory ? 'bg-purple-600' : 'bg-gray-300'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            editingChecklistMandatory ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2 max-h-[300px] overflow-y-auto">
                    {editingChecklistItems.map((item, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <button className="text-purple-600 hover:text-purple-700">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <span className="text-sm text-[#051046] flex-1">{item}</span>
                        <button onClick={() => handleRemoveEditingItem(index)} className="text-red-500 hover:text-red-700">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>

                  {editingChecklistItems.length < 10 && (
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={currentItemInput}
                        onChange={(e) => setCurrentItemInput(e.target.value)}
                        placeholder="Item Name"
                        className="flex-1 px-4 py-2 border border-[#e8e8e8] rounded-[15px] text-sm text-[#051046] focus:outline-none focus:ring-2 focus:ring-purple-600"
                      />
                      <button
                        onClick={handleAddEditingItem}
                        disabled={!currentItemInput.trim()}
                        className={`text-sm px-4 py-2 rounded-[32px] transition-colors flex items-center gap-1 ${
                          currentItemInput.trim()
                            ? 'text-purple-600 hover:bg-purple-50'
                            : 'text-gray-400 cursor-not-allowed'
                        }`}
                      >
                        <Plus className="w-4 h-4" />
                        Add Item
                      </button>
                    </div>
                  )}

                  <div className="flex gap-2 pt-4">
                    <button
                      onClick={handleCancelChecklistEdit}
                      className="px-6 py-2 border border-gray-300 rounded-[32px] text-gray-700 font-medium hover:bg-gray-100 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveChecklistEdit}
                      disabled={!editingChecklistName.trim() || editingChecklistItems.length === 0}
                      className={`px-6 py-2 rounded-[32px] font-medium transition-colors ${
                        editingChecklistName.trim() && editingChecklistItems.length > 0
                          ? 'text-white'
                          : 'text-gray-400 bg-gray-200 cursor-not-allowed'
                      }`}
                      style={editingChecklistName.trim() && editingChecklistItems.length > 0 ? { backgroundColor: '#9473ff' } : {}}
                      onMouseEnter={(e) => {
                        if (editingChecklistName.trim() && editingChecklistItems.length > 0) {
                          e.currentTarget.style.backgroundColor = '#7f5fd9';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (editingChecklistName.trim() && editingChecklistItems.length > 0) {
                          e.currentTarget.style.backgroundColor = '#9473ff';
                        }
                      }}
                    >
                      Save
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Team Workload Color Threshold */}
            <div className="bg-gray-50 rounded-[20px] border border-[#e2e8f0] p-6">
              <h3 className="text-lg font-semibold text-[#051046] mb-6">Team Workload Color Threshold</h3>
              <div className="grid grid-cols-3 gap-6">
                {/* Less Busy */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-5 h-5 rounded bg-[#b9df10]"></div>
                    <div className="text-sm font-medium text-[#051046]">Less Busy</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div>
                      <input
                        type="number"
                        value={greenThreshold.split('-')[0]}
                        onChange={(e) => setGreenThreshold(e.target.value + '-' + greenThreshold.split('-')[1])}
                        className="w-16 px-3 py-2 border border-[#e8e8e8] rounded-[15px] text-sm text-[#051046] focus:outline-none focus:ring-2 focus:ring-purple-600 text-center"
                      />
                      <div className="text-xs text-gray-500 text-center mt-1">Min.</div>
                    </div>
                    <div>
                      <input
                        type="number"
                        value={greenThreshold.split('-')[1]}
                        onChange={(e) => setGreenThreshold(greenThreshold.split('-')[0] + '-' + e.target.value)}
                        className="w-16 px-3 py-2 border border-[#e8e8e8] rounded-[15px] text-sm text-[#051046] focus:outline-none focus:ring-2 focus:ring-purple-600 text-center"
                      />
                      <div className="text-xs text-gray-500 text-center mt-1">Max.</div>
                    </div>
                  </div>
                </div>
                
                {/* Medium Busy */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-5 h-5 rounded bg-[#f0a041]"></div>
                    <div className="text-sm font-medium text-[#051046]">Medium Busy</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div>
                      <input
                        type="number"
                        value={orangeThreshold.split('-')[0]}
                        onChange={(e) => setOrangeThreshold(e.target.value + '-' + orangeThreshold.split('-')[1])}
                        className="w-16 px-3 py-2 border border-[#e8e8e8] rounded-[15px] text-sm text-[#051046] focus:outline-none focus:ring-2 focus:ring-purple-600 text-center"
                      />
                      <div className="text-xs text-gray-500 text-center mt-1">Min.</div>
                    </div>
                    <div>
                      <input
                        type="number"
                        value={orangeThreshold.split('-')[1]}
                        onChange={(e) => setOrangeThreshold(orangeThreshold.split('-')[0] + '-' + e.target.value)}
                        className="w-16 px-3 py-2 border border-[#e8e8e8] rounded-[15px] text-sm text-[#051046] focus:outline-none focus:ring-2 focus:ring-purple-600 text-center"
                      />
                      <div className="text-xs text-gray-500 text-center mt-1">Max.</div>
                    </div>
                  </div>
                </div>
                
                {/* Very Busy */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-5 h-5 rounded bg-[#f16a6a]"></div>
                    <div className="text-sm font-medium text-[#051046]">Very Busy</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div>
                      <input
                        type="number"
                        value={redThreshold.split('-')[0]}
                        onChange={(e) => setRedThreshold(e.target.value + '-' + redThreshold.split('-')[1])}
                        className="w-16 px-3 py-2 border border-[#e8e8e8] rounded-[15px] text-sm text-[#051046] focus:outline-none focus:ring-2 focus:ring-purple-600 text-center"
                      />
                      <div className="text-xs text-gray-500 text-center mt-1">Min.</div>
                    </div>
                    <div>
                      <input
                        type="number"
                        value={redThreshold.split('-')[1]}
                        onChange={(e) => setRedThreshold(redThreshold.split('-')[0] + '-' + e.target.value)}
                        className="w-16 px-3 py-2 border border-[#e8e8e8] rounded-[15px] text-sm text-[#051046] focus:outline-none focus:ring-2 focus:ring-purple-600 text-center"
                      />
                      <div className="text-xs text-gray-500 text-center mt-1">Max.</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* INTEGRATIONS TAB */}
        {activeTab === 'integrations' && !isStaffView && (
          <div className="space-y-8">
            {/* Stripe Connect */}
            <div className="bg-gray-50 rounded-[20px] border border-[#e2e8f0] p-6">
              <h3 className="text-lg font-semibold text-[#051046] mb-4">Stripe Connect</h3>
              
              {stripeStatus === 'not-connected' && (
                <div>
                  <p className="text-sm text-[#051046] mb-4">
                    Connect enables you to handle payments from your customers. Simply click "Start" button to continue
                  </p>
                  <button
                    onClick={handleStripeConnect}
                    className="px-6 py-2 rounded-[32px] text-white font-medium transition-colors"
                    style={{ backgroundColor: '#9473ff' }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#7f5fd9'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#9473ff'}
                  >
                    Start
                  </button>
                </div>
              )}

              {stripeStatus === 'incomplete' && (
                <div>
                  <p className="text-sm text-[#051046] mb-4">
                    Seems like that you have not finished your Stripe account. You can proceed your onboarding any time, simply click "Continue Onboarding" to continue
                  </p>
                  <button
                    onClick={handleStripeConnect}
                    className="px-6 py-2 rounded-[32px] text-white font-medium transition-colors"
                    style={{ backgroundColor: '#9473ff' }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#7f5fd9'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#9473ff'}
                  >
                    Continue Onboarding
                  </button>
                </div>
              )}

              {stripeStatus === 'connected' && (
                <div>
                  <p className="text-sm text-[#051046] mb-4">
                    Your account was set with success.
                  </p>
                  <button
                    onClick={() => window.open('https://connect.stripe.com', '_blank')}
                    className="px-6 py-2 rounded-[32px] text-white font-medium transition-colors"
                    style={{ backgroundColor: '#9473ff' }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#7f5fd9'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#9473ff'}
                  >
                    Login Link
                  </button>
                </div>
              )}
            </div>

            {/* Expert On Deck */}
            <div className="bg-gray-50 rounded-[20px] border border-[#e2e8f0] p-6">
              <h3 className="text-lg font-semibold text-[#051046] mb-4">Integrated with Expert On Deck</h3>
              <p className="text-sm text-[#051046] mb-4">
                When you sign up for the premium package, you also appear on EOD as a paid user for free.
              </p>
              <div className="bg-white rounded-[15px] border border-[#e2e8f0] p-4">
                <h4 className="text-sm font-semibold text-[#051046] mb-2">Premium User Benefits:</h4>
                <ul className="text-sm text-[#051046] space-y-1 list-disc list-inside">
                  <li>Automatically listed on Expert On Deck platform</li>
                  <li>Leads from EOD appear automatically in Lead Management</li>
                  <li>Lead source displays as "Expert On Deck"</li>
                  <li>Receive discount code for Klervo registration</li>
                </ul>
              </div>
              <div className="mt-4">
                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-[15px] text-sm" style={{ backgroundColor: '#fee2e2', color: '#991b1b' }}>
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#f16a6a' }}></div>
                  Not Connected
                </span>
              </div>
            </div>

            {/* Quickbooks */}
            <div className="bg-gray-50 rounded-[20px] border border-[#e2e8f0] p-6">
              <h3 className="text-lg font-semibold text-[#051046] mb-4">Integrated with Quickbooks</h3>
              <p className="text-sm text-[#051046] mb-4">
                Quickbooks API - fully integrated with Klervo
              </p>
              <div className="bg-white rounded-[15px] border border-[#e2e8f0] p-4">
                <h4 className="text-sm font-semibold text-[#051046] mb-2">Integration Features:</h4>
                <ul className="text-sm text-[#051046] space-y-1 list-disc list-inside">
                  <li>Sync invoices automatically</li>
                  <li>Export financial reports</li>
                  <li>Customer data synchronization</li>
                  <li>Real-time accounting updates</li>
                </ul>
              </div>
              <div className="mt-4 flex gap-4">
                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-[15px] text-sm" style={{ backgroundColor: '#E2F685', color: '#051046' }}>
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#b9df10' }}></div>
                  Connected
                </span>
                <button
                  className="px-6 py-2 border border-[#e8e8e8] rounded-[32px] text-sm text-[#051046] hover:bg-gray-100 transition-colors"
                >
                  Sync Now
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Subscription Modal */}
      {showSubscriptionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-[20px] border border-[#e2e8f0] p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto" style={{ boxShadow: 'rgba(226, 232, 240, 0.5) 0px 2px 16px 2px' }}>
            <h3 className="text-xl font-semibold text-[#051046] mb-6">Choose Your Plan</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Basic Plan */}
              <div className="border border-[#e2e8f0] rounded-[20px] p-6">
                <h4 className="text-lg font-semibold text-[#051046] mb-2">Basic</h4>
                <p className="text-3xl font-bold text-[#051046] mb-4">$50<span className="text-sm font-normal">/month</span></p>
                <ul className="space-y-2 mb-6 text-sm text-[#051046]">
                  <li>✓ Up to 5 team members</li>
                  <li>✓ Basic features</li>
                  <li>✓ Email support</li>
                </ul>
                <button
                  onClick={() => {
                    alert('Redirecting to Stripe payment...');
                    setShowSubscriptionModal(false);
                  }}
                  className="w-full px-6 py-2 rounded-[32px] text-white font-medium transition-colors"
                  style={{ backgroundColor: '#9473ff' }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#7f5fd9'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#9473ff'}
                >
                  Get Started
                </button>
              </div>

              {/* Premium Plan */}
              <div className="border border-purple-500 rounded-[20px] p-6 relative">
                <div className="absolute top-0 right-0 bg-purple-500 text-white text-xs px-3 py-1 rounded-bl-[15px] rounded-tr-[20px]">
                  Popular
                </div>
                <h4 className="text-lg font-semibold text-[#051046] mb-2">Premium</h4>
                <p className="text-3xl font-bold text-[#051046] mb-4">$100<span className="text-sm font-normal">/month</span></p>
                <ul className="space-y-2 mb-6 text-sm text-[#051046]">
                  <li>✓ Up to 20 team members</li>
                  <li>✓ All features</li>
                  <li>✓ Priority support</li>
                  <li>✓ Expert On Deck integration</li>
                </ul>
                <button
                  onClick={() => {
                    alert('Redirecting to Stripe payment...');
                    setShowSubscriptionModal(false);
                  }}
                  className="w-full px-6 py-2 rounded-[32px] text-white font-medium transition-colors"
                  style={{ backgroundColor: '#9473ff' }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#7f5fd9'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#9473ff'}
                >
                  Get Started
                </button>
              </div>

              {/* Enterprise Plan */}
              <div className="border border-[#e2e8f0] rounded-[20px] p-6">
                <h4 className="text-lg font-semibold text-[#051046] mb-2">Enterprise</h4>
                <p className="text-3xl font-bold text-[#051046] mb-4">$200<span className="text-sm font-normal">/month</span></p>
                <ul className="space-y-2 mb-6 text-sm text-[#051046]">
                  <li>✓ Unlimited team members</li>
                  <li>✓ All features + Custom</li>
                  <li>✓ 24/7 dedicated support</li>
                  <li>✓ Custom integrations</li>
                </ul>
                <button
                  onClick={() => {
                    alert('Redirecting to Stripe payment...');
                    setShowSubscriptionModal(false);
                  }}
                  className="w-full px-6 py-2 rounded-[32px] text-white font-medium transition-colors"
                  style={{ backgroundColor: '#9473ff' }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#7f5fd9'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#9473ff'}
                >
                  Get Started
                </button>
              </div>
            </div>
            <button
              onClick={() => setShowSubscriptionModal(false)}
              className="mt-6 px-6 py-2 border border-gray-300 rounded-[32px] text-gray-700 font-medium hover:bg-gray-100 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Cancel Subscription Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-[20px] border border-[#e2e8f0] p-6 max-w-md w-full" style={{ boxShadow: 'rgba(226, 232, 240, 0.5) 0px 2px 16px 2px' }}>
            <h3 className="text-xl font-semibold text-[#051046] mb-4">Cancel Subscription</h3>
            <p className="text-sm text-[#051046] mb-6">
              Are you sure you want to cancel your Klervo subscription?
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => {
                  alert('Subscription has been canceled. You will receive a confirmation email.');
                  setShowCancelModal(false);
                }}
                className="flex-1 px-6 py-2 bg-red-500 rounded-[32px] text-white font-medium hover:bg-red-600 transition-colors"
              >
                Yes, Cancel Subscription
              </button>
              <button
                onClick={() => setShowCancelModal(false)}
                className="flex-1 px-6 py-2 border border-gray-300 rounded-[32px] text-gray-700 font-medium hover:bg-gray-100 transition-colors"
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Update Payment Method Modal */}
      {showPaymentMethodModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-[20px] border border-[#e2e8f0] p-6 max-w-lg w-full" style={{ boxShadow: 'rgba(226, 232, 240, 0.5) 0px 2px 16px 2px' }}>
            <h3 className="text-xl font-semibold text-[#051046] mb-4">Update Payment Method</h3>
            <p className="text-sm text-gray-600 mb-6">
              Enter your new payment card details below. Your card will be securely processed through Stripe.
            </p>

            <div className="space-y-4">
              {/* Card Number */}
              <div>
                <label className="block text-sm font-medium text-[#051046] mb-2">
                  Card Number
                </label>
                <input
                  type="text"
                  value={newCardNumber}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '');
                    if (value.length <= 16) setNewCardNumber(value);
                  }}
                  placeholder="1234 5678 9012 3456"
                  className="w-full px-4 py-2 border border-[#e8e8e8] rounded-[15px] text-[#051046] focus:outline-none focus:ring-2 focus:ring-purple-600"
                  maxLength={16}
                />
              </div>

              {/* Name on Card */}
              <div>
                <label className="block text-sm font-medium text-[#051046] mb-2">
                  Name on Card
                </label>
                <input
                  type="text"
                  value={newNameOnCard}
                  onChange={(e) => setNewNameOnCard(e.target.value)}
                  placeholder="John Smith"
                  className="w-full px-4 py-2 border border-[#e8e8e8] rounded-[15px] text-[#051046] focus:outline-none focus:ring-2 focus:ring-purple-600"
                />
              </div>

              {/* Expiry and CVV */}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#051046] mb-2">
                    Month
                  </label>
                  <input
                    type="text"
                    value={newExpiryMonth}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '');
                      if (value.length <= 2 && (value === '' || (parseInt(value) >= 1 && parseInt(value) <= 12))) {
                        setNewExpiryMonth(value);
                      }
                    }}
                    placeholder="MM"
                    className="w-full px-4 py-2 border border-[#e8e8e8] rounded-[15px] text-[#051046] focus:outline-none focus:ring-2 focus:ring-purple-600"
                    maxLength={2}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#051046] mb-2">
                    Year
                  </label>
                  <input
                    type="text"
                    value={newExpiryYear}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '');
                      if (value.length <= 4) setNewExpiryYear(value);
                    }}
                    placeholder="YYYY"
                    className="w-full px-4 py-2 border border-[#e8e8e8] rounded-[15px] text-[#051046] focus:outline-none focus:ring-2 focus:ring-purple-600"
                    maxLength={4}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#051046] mb-2">
                    CVV
                  </label>
                  <input
                    type="text"
                    value={newCVV}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '');
                      if (value.length <= 4) setNewCVV(value);
                    }}
                    placeholder="123"
                    className="w-full px-4 py-2 border border-[#e8e8e8] rounded-[15px] text-[#051046] focus:outline-none focus:ring-2 focus:ring-purple-600"
                    maxLength={4}
                  />
                </div>
              </div>

              {/* Security Notice */}
              <div className="bg-purple-50 border border-purple-200 rounded-[15px] p-4">
                <p className="text-xs text-purple-900 flex items-start gap-2">
                  <CreditCard className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <span>
                    Your payment information is securely encrypted and processed by Stripe. We never store your full card details.
                  </span>
                </p>
              </div>
            </div>

            <div className="flex gap-4 mt-6">
              <button
                onClick={handleUpdatePaymentMethod}
                className="flex-1 px-6 py-2 rounded-[32px] text-white font-medium transition-colors"
                style={{ backgroundColor: '#9473ff' }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#7f5fd9'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#9473ff'}
              >
                Update Payment Method
              </button>
              <button
                onClick={() => {
                  setShowPaymentMethodModal(false);
                  setNewCardNumber('');
                  setNewExpiryMonth('');
                  setNewExpiryYear('');
                  setNewCVV('');
                  setNewNameOnCard('');
                }}
                className="flex-1 px-6 py-2 border border-gray-300 rounded-[32px] text-gray-700 font-medium hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
