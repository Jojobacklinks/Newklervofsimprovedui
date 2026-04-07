import { useState, useRef, useEffect } from 'react';
import { Send, User, Bot } from 'lucide-react';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: string;
}

interface ChatHistory {
  id: string;
  title: string;
  messages: Message[];
  timestamp: string;
}

export function KlervoAIPage() {
  const [activeTab, setActiveTab] = useState<'chat' | 'history'>('chat');
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [chatHistories, setChatHistories] = useState<ChatHistory[]>([]);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const aiResponseTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (aiResponseTimerRef.current) {
        clearTimeout(aiResponseTimerRef.current);
      }
    };
  }, []);

  // Comprehensive AI responses - System, Help/Navigation, and General ChatGPT-style
  const getAIResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();
    
    // ===== SYSTEM QUESTIONS =====
    // Jobs & Scheduling
    if (lowerMessage.includes('jobs scheduled') || lowerMessage.includes('jobs today')) {
      return "Based on your schedule, you have 3 jobs scheduled for today:\n\n1. Kitchen Remodel (9:00 AM) - Sarah Wilson\n2. Bathroom Installation (1:00 PM) - Michael Chen\n3. Emergency Plumbing (4:30 PM) - David Rodriguez\n\nWould you like me to show you details for any specific job?";
    }
    if (lowerMessage.includes('pending invoice') || lowerMessage.includes('unpaid invoice')) {
      return "You currently have 4 pending invoices:\n\n• Invoice #INV-1047 - $850.00 (Sarah Wilson) - Due in 5 days\n• Invoice #INV-1046 - $1,200.00 (Michael Chen) - Due in 12 days\n• Invoice #INV-1044 - $425.00 (Emily Rodriguez) - Overdue by 3 days\n• Invoice #INV-1042 - $675.00 (Robert Kim) - Due today\n\nTotal pending: $3,150.00\n\nWould you like me to help you send payment reminders?";
    }
    if (lowerMessage.includes('lead status') || lowerMessage.includes('status of lead')) {
      const leadIdMatch = userMessage.match(/#?\d{4}/);
      const leadId = leadIdMatch ? leadIdMatch[0] : '1234';
      return `Lead ${leadId} is currently in the "Follow-Up" stage with High priority. Last contacted 2 days ago via phone. Estimated value: $5,200. Next action: Follow-up call scheduled for tomorrow at 10:00 AM.`;
    }
    if (lowerMessage.includes('how many client') || lowerMessage.includes('total client') || lowerMessage.includes('number of client')) {
      return "You currently have 248 active clients in your Klervo system:\n\n• Residential: 186 clients (75%)\n• Commercial: 62 clients (25%)\n• New this month: 12 clients\n• High-value clients (>$10k lifetime): 34 clients\n\nYour client base has grown by 8% compared to last month!";
    }
    if (lowerMessage.includes('revenue this month') || lowerMessage.includes('total revenue') || lowerMessage.includes('monthly revenue')) {
      return "Your revenue summary for this month:\n\n💰 Total Revenue: $48,750\n📈 Compared to last month: +12% ($5,200 increase)\n\nBreakdown:\n• Completed Jobs: $32,400 (66%)\n• Service Plans: $11,850 (24%)\n• Deposits: $4,500 (10%)\n\nTop services:\n1. Kitchen Remodels - $15,200\n2. Bathroom Installations - $12,800\n3. HVAC Repairs - $8,950\n\nYou're on track to exceed your monthly goal! 🎯";
    }
    if (lowerMessage.includes('overdue') || lowerMessage.includes('late payment')) {
      return "You have 2 overdue invoices requiring attention:\n\n⚠️ Invoice #INV-1044 - Emily Rodriguez\n   Amount: $425.00 | Overdue: 3 days\n\n⚠️ Invoice #INV-1039 - Jennifer Martinez  \n   Amount: $1,150.00 | Overdue: 8 days\n\nTotal overdue: $1,575.00\n\nRecommendation: I can help you draft a professional payment reminder email. Would you like me to do that?";
    }

    // ===== HELP & NAVIGATION =====
    if (lowerMessage.includes('how do i create') && lowerMessage.includes('job')) {
      return "To create a new job in Klervo:\n\n1. Click the \"+\" button in the sidebar\n2. Select \"New Job\" from the menu\n3. Fill in the required fields:\n   - Client (select existing or create new)\n   - Service Type\n   - Scheduled Date & Time\n   - Assigned Team Member\n   - Job Description\n4. Click \"Create Job\"\n\nPro tip: You can also convert leads directly to jobs from the Lead Detail modal using the \"Convert to Job\" button!";
    }
    if (lowerMessage.includes('where') && (lowerMessage.includes('payment') || lowerMessage.includes('invoice'))) {
      return "You can find payment and invoice information in two places:\n\n📍 Main Location: Go to Reports → Select \"Payment Reports\"\n   Here you can see all payment history, filter by type, and export reports.\n\n📍 Client Profile: Navigate to Clients → Select a client → Invoices tab\n   This shows all invoices specific to that client.\n\n📍 Job Details: From any job card → View invoice and payment status\n\nWould you like me to show you how to track a specific payment?";
    }
    if (lowerMessage.includes('how') && lowerMessage.includes('mark') && lowerMessage.includes('complete')) {
      return "To mark a job as completed:\n\n1. Go to the Jobs page (sidebar → Jobs)\n2. Find the job you want to complete\n3. Click on the job card to open details\n4. Change the Status dropdown to \"Completed\"\n5. Click \"Save Changes\"\n\nAlternatively:\n• From the Calendar view, click on the job → Change status to \"Completed\"\n\nOnce marked complete, you can generate the final invoice and request payment. The job will move to your completed jobs list for record-keeping.";
    }
    if (lowerMessage.includes('how') && lowerMessage.includes('add') && (lowerMessage.includes('client') || lowerMessage.includes('customer'))) {
      return "To add a new client:\n\n1. Click the \"+\" button in the sidebar\n2. Select \"New Client\"\n3. Enter client information:\n   - Name (required)\n   - Email & Phone (required)\n   - Address\n   - Company (optional)\n   - Client Type (Residential/Commercial)\n4. Click \"Add Client\"\n\nPro tip: You can also create clients on-the-fly when creating a new job or converting a lead. The system will automatically create the client profile!";
    }
    if (lowerMessage.includes('where') && (lowerMessage.includes('reports') || lowerMessage.includes('analytics'))) {
      return "The Reports page is located in your main sidebar:\n\n📊 Navigation: Sidebar → Reports\n\nAvailable reports:\n• Payment Reports (Credit Card, Cash, Other, Failed)\n• Revenue Analytics\n• Job Performance\n• Team Productivity\n• Client Insights\n\nYou can filter by date range, export to CSV, and view detailed breakdowns. The Reports page gives you a complete overview of your business performance!";
    }

    // ===== GENERAL CHATGPT-STYLE QUESTIONS =====
    // Business advice
    if (lowerMessage.includes('explain') && lowerMessage.includes('hvac')) {
      return "Here's how to explain HVAC efficiency to customers in simple terms:\n\n**SEER Rating (Seasonal Energy Efficiency Ratio)**\n• Higher SEER = Lower energy bills\n• Old units: 8-10 SEER\n• Modern units: 14-25+ SEER\n• Example: Upgrading from 10 to 16 SEER can save 37% on cooling costs\n\n**Customer-Friendly Explanation:**\n\"Think of SEER like your car's MPG - a 16 SEER unit is like getting 16 miles per gallon of electricity. The higher the number, the less it costs to run. A modern 18 SEER system can pay for itself in 5-7 years through energy savings alone.\"\n\n**Key Talking Points:**\n✓ Lower monthly utility bills\n✓ Better temperature control\n✓ Quieter operation\n✓ Environmental benefits\n✓ Potential tax credits/rebates\n\nWould you like tips on how to present pricing for HVAC upgrades?";
    }
    if (lowerMessage.includes('calculate') && lowerMessage.includes('square foot')) {
      return "Here's how to calculate square footage for pricing:\n\n**Basic Room Calculation:**\nLength × Width = Square Footage\nExample: 12 ft × 10 ft = 120 sq ft\n\n**For Irregular Shapes:**\n1. Divide into rectangles\n2. Calculate each section\n3. Add them together\n\n**Common Pricing Methods:**\n\n📐 **Flooring:** $3-12 per sq ft (material + labor)\n📐 **Painting:** $2-6 per sq ft\n📐 **Tile:** $8-25 per sq ft\n📐 **Carpet:** $4-8 per sq ft\n\n**Pro Formula for Estimates:**\nMaterial Cost + (Labor Rate × Hours) + Overhead (15-20%) + Profit Margin (20-30%)\n\n**Example:**\n• 200 sq ft bathroom tile job\n• Tile: $8/sq ft = $1,600\n• Labor: 16 hours × $65/hr = $1,040\n• Total: $2,640 + 20% overhead + 25% profit = $3,960\n\nNeed help calculating a specific project?";
    }
    if (lowerMessage.includes('write') && (lowerMessage.includes('quote') || lowerMessage.includes('estimate'))) {
      return "Here's a professional quote template:\n\n---\n\n**Subject: Quote for [Service] - [Client Name]**\n\nDear [Client Name],\n\nThank you for considering [Your Company] for your [service type] project. I'm pleased to provide you with the following quote:\n\n**Project Details:**\n• Service: [Specific service description]\n• Location: [Address]\n• Timeline: [Estimated duration]\n\n**Investment:**\n• Materials: $[amount]\n• Labor: $[amount]\n• Total Project Cost: $[total]\n\n**What's Included:**\n✓ [Specific deliverable 1]\n✓ [Specific deliverable 2]\n✓ [Specific deliverable 3]\n✓ Professional cleanup\n✓ [Warranty/guarantee details]\n\n**Next Steps:**\nThis quote is valid for 30 days. To proceed, simply reply to this email or call me at [phone]. I'm happy to answer any questions!\n\nBest regards,\n[Your Name]\n[Your Company]\n[Contact Info]\n\n---\n\nWould you like me to customize this for a specific project?";
    }
    if (lowerMessage.includes('difficult customer') || lowerMessage.includes('angry customer')) {
      return "Here are proven strategies for handling difficult customers:\n\n**1. Listen First, Don't Defend**\n• Let them fully explain their concern\n• Don't interrupt or make excuses\n• Take notes to show you're taking it seriously\n\n**2. Empathize & Acknowledge**\n\"I completely understand your frustration. If I were in your position, I'd feel the same way.\"\n\n**3. Take Ownership**\n\"Let me make this right for you. Here's what I'm going to do...\"\n\n**4. Offer Solutions, Not Excuses**\n• Present 2-3 options they can choose from\n• Focus on what you CAN do, not what you can't\n• Be specific about timeline and actions\n\n**5. Follow Through Immediately**\n• Do exactly what you promised\n• Update them proactively\n• Over-deliver if possible\n\n**Magic Phrases:**\n✓ \"I appreciate you bringing this to my attention\"\n✓ \"Let me fix this right away\"\n✓ \"What would make this right for you?\"\n✓ \"I'm going to personally ensure this gets resolved\"\n\n**What NOT to Say:**\n✗ \"That's our policy\"\n✗ \"Calm down\"\n✗ \"There's nothing I can do\"\n✗ \"You should have...\"\n\nRemember: One handled complaint can turn an angry customer into your biggest advocate!\n\nNeed help with a specific situation?";
    }
    if (lowerMessage.includes('improve') && lowerMessage.includes('retention')) {
      return "Here's how to improve customer retention in field service:\n\n**1. Service Plans & Subscriptions (60% retention boost)**\n• Offer maintenance plans with recurring visits\n• Provide priority scheduling for members\n• Include exclusive discounts (10-15% off)\n• Example: \"Annual HVAC Maintenance Plan - 2 visits/year\"\n\n**2. Follow-Up Communication**\n• 24-hour post-service check-in call\n• 30-day satisfaction survey\n• Seasonal maintenance reminders\n• Birthday/anniversary cards\n\n**3. Loyalty Rewards Program**\n• Point system: $1 spent = 1 point\n• Redeem points for discounts\n• Referral bonuses (give $50, get $50)\n\n**4. Proactive Outreach**\n• Remind about seasonal services\n• Alert about equipment lifespan\n• Share maintenance tips\n• Offer inspection specials\n\n**5. Exceptional Service Delivery**\n• Always arrive on time\n• Text/call 30 min before arrival\n• Leave area cleaner than you found it\n• Provide detailed service notes\n• Offer warranty on work\n\n**6. Make It Easy**\n• Online booking system\n• Text message confirmations\n• Digital invoices & payments\n• Save customer preferences\n\n**Metrics to Track:**\n📊 Repeat customer rate\n📊 Average customer lifetime value\n📊 Referral rate\n📊 Service plan enrollment rate\n\n**Quick Win:** Start a quarterly email newsletter with maintenance tips and exclusive offers. Costs almost nothing but keeps you top-of-mind!\n\nWant specific strategies for your service type?";
    }
    if (lowerMessage.includes('hire') || lowerMessage.includes('hiring')) {
      return "Here's a guide to hiring reliable field service technicians:\n\n**1. Where to Find Candidates**\n• Trade schools (partner for apprenticeships)\n• Industry associations\n• Indeed, LinkedIn, ZipRecruiter\n• Employee referrals (offer $500-1000 bonus)\n• Local community colleges\n\n**2. Essential Screening**\n✓ Valid driver's license & clean record\n✓ Background check\n✓ Drug screening\n✓ License/certification verification\n✓ Reference checks (minimum 3)\n\n**3. Interview Questions That Matter**\n• \"Describe a time you dealt with an angry customer\"\n• \"What do you do when you don't know how to fix something?\"\n• \"Tell me about a mistake you made and how you handled it\"\n• \"How do you stay organized with multiple jobs per day?\"\n\n**4. Red Flags to Watch For**\n🚩 Can't explain gaps in employment\n🚩 Speaks negatively about previous employers\n🚩 Lacks basic tools or unwilling to invest in equipment\n🚩 No questions about the job or company\n🚩 Late to interview without calling\n\n**5. Test Their Skills**\n• Paid working interview (half-day ride-along)\n• Technical assessment relevant to your trade\n• Customer interaction role-play\n\n**6. Competitive Compensation Package**\n• Market rate + performance bonuses\n• Health insurance\n• Paid training & certifications\n• Tool allowance\n• Profit sharing for senior techs\n\n**7. Retention Strategies**\n• Clear career path\n• Ongoing training opportunities\n• Recognition program\n• Work-life balance (fair scheduling)\n• Quality equipment & vehicles\n\n**Apprentice vs. Experienced Trade-off:**\n• Apprentice: Lower cost, moldable, loyal, needs training\n• Experienced: Immediate productivity, higher cost, may have bad habits\n\n**Best Practice:** Hire for attitude, train for skill. Technical skills can be taught, but work ethic and customer service mindset are harder to change.\n\nNeed help writing a job posting?";
    }
    if (lowerMessage.includes('inventory') || lowerMessage.includes('stock management')) {
      return "Here's a practical approach to inventory management for field service:\n\n**1. Categorize Your Inventory**\n• **A Items:** High-value, slow-moving (15% of items, 70% of value)\n• **B Items:** Medium value & turnover (30% of items, 20% of value)\n• **C Items:** Low-value, fast-moving (55% of items, 10% of value)\n\n**2. Set Par Levels**\n• Minimum stock before reorder\n• Maximum stock to avoid over-purchasing\n• Reorder point = (Daily usage × Lead time) + Safety stock\n\n**Example:**\n• PVC pipe fittings: Min 50, Max 200\n• Use 10 per day, 3-day lead time\n• Reorder at: (10 × 3) + 20 safety = 50 units\n\n**3. Truck Stock Management**\n• Each truck carries commonly used parts\n• Weekly replenishment schedule\n• Digital inventory tracking app\n• Technicians report usage daily\n\n**4. First In, First Out (FIFO)**\n• Always use oldest stock first\n• Date all inventory upon receipt\n• Rotate stock during replenishment\n• Critical for items with shelf life\n\n**5. Annual Inventory Audit**\n• Physical count vs. system count\n• Identify slow-moving items\n• Clear out obsolete inventory\n• Update pricing and suppliers\n\n**6. Technology Solutions**\n✓ Barcode/QR code scanning\n✓ Mobile apps for truck inventory\n✓ Automated reorder alerts\n✓ Integration with job costing\n\n**Common Mistakes to Avoid:**\n❌ Over-stocking \"just in case\"\n❌ No system for tracking truck inventory\n❌ Buying poor quality to save money\n❌ Not accounting for inventory shrinkage\n❌ Delayed data entry\n\n**Key Metrics:**\n📊 Inventory turnover ratio (target: 4-6×/year)\n📊 Stock-out rate (target: <5%)\n📊 Carrying cost (should be <25% of inventory value)\n\n**Quick Win:** Start tracking your top 20 most-used items first. Get those dialed in before expanding to full inventory management.\n\nWant help setting up a specific tracking system?";
    }
    if (lowerMessage.includes('price') && lowerMessage.includes('competitively')) {
      return "Here's how to price your services competitively:\n\n**1. Know Your True Costs**\n\n**Direct Costs:**\n• Materials & supplies\n• Direct labor (wages + benefits)\n• Equipment/tool depreciation\n\n**Indirect Costs (Overhead):**\n• Vehicle expenses (fuel, maintenance, insurance)\n• Office expenses\n• Marketing\n• Insurance (liability, workers comp)\n• Software/technology\n• Administrative labor\n• Rent/utilities\n\n**Formula:**\nHourly overhead rate = Annual overhead ÷ Billable hours per year\n\n**2. Calculate Your Break-Even Rate**\nMinimum rate = (Labor cost + Overhead) per hour\n\n**Example:**\n• Technician wage: $25/hr\n• Overhead allocation: $35/hr\n• Break-even rate: $60/hr\n• Add profit margin (25-35%): $75-81/hr\n\n**3. Market-Based Pricing Strategies**\n\n**Premium Pricing (20% above market)**\n• Best for: Specialized services, excellent reputation\n• Requires: Superior service, guarantees, fast response\n• Position: \"We're not the cheapest, but we're the best\"\n\n**Competitive Pricing (market average)**\n• Best for: Standard services, established business\n• Requires: Efficiency, good service\n• Position: \"Fair pricing, quality work\"\n\n**Value Pricing (bundle pricing)**\n• Service plans instead of one-time pricing\n• Annual maintenance contracts\n• Package deals (vs. à la carte)\n\n**4. Research Competitor Pricing**\n• Call for quotes as a mystery shopper\n• Check online reviews for price complaints\n• Join local trade associations\n• Survey customers about price expectations\n\n**5. Pricing Psychology**\n\n✓ **Good-Better-Best Tiers**\nOffering 3 options increases average sale by 30%\n\n✓ **Anchor Pricing**\n\"This repair is $400, but a replacement would be $2,500\"\n\n✓ **Round vs. Precise Numbers**\n• Round ($500): Feels easier, emotional decision\n• Precise ($487): Feels calculated, logical\n\n**6. When to Raise Prices**\n• Annual increase: 3-5% (matches inflation)\n• When booked out 2+ weeks\n• After adding certifications/capabilities\n• Following major cost increases\n\n**7. How to Present Pricing**\n\n❌ Don't say: \"It's $2,400\"\n✓ Say: \"The investment for this is $2,400, which includes [list value items]\"\n\n❌ Don't say: \"Is that okay?\"\n✓ Say: \"When would you like to schedule this?\"\n\n**Common Pricing Mistakes:**\n🚫 Racing to the bottom on price\n🚫 Not accounting for all costs\n🚫 Giving discounts too easily\n🚫 Not raising prices regularly\n🚫 Apologizing for your pricing\n\n**Script for Price Objections:**\n\"I understand that's higher than you expected. Let me break down exactly what you're getting for that investment... [list value]. Compared to [cheaper competitor], we include [differentiators]. This ensures the job is done right the first time, saving you money in the long run.\"\n\n**Remember:** Competing on price alone is a race to bankruptcy. Compete on value, speed, expertise, and service quality instead.\n\nNeed help pricing a specific service?";
    }
    if (lowerMessage.includes('seasonal promotion') || lowerMessage.includes('marketing idea')) {
      return "Here are seasonal promotion ideas for field service businesses:\n\n**Spring Promotions (March-May)**\n🌸 \"Spring Maintenance Special\" - 15% off tune-ups\n🌸 \"April Showers Prep\" - Plumbing inspections\n🌸 \"Spring Cleaning Package\" - Duct cleaning + filter replacement\n🌸 \"Tax Refund Special\" - $500 off major installations\n\n**Summer Promotions (June-August)**\n☀️ \"Beat the Heat\" - AC emergency service discount\n☀️ \"Summer Saver Package\" - Bundled maintenance services\n☀️ \"Refer-a-Friend BBQ\" - Referral rewards program\n☀️ \"School's Out Special\" - Timing for homeowners\n\n**Fall Promotions (September-November)**\n🍂 \"Winterize Your Home\" - Heating system check\n🍂 \"Fall Prevention Package\" - Pre-winter maintenance\n🍂 \"Back-to-School Special\" - Complete system inspection\n🍂 \"Thanksgiving Prep\" - Ensure systems work for holidays\n\n**Winter Promotions (December-February)**\n❄️ \"New Year, New System\" - Installation discounts\n❄️ \"Winter Emergency Service\" - 24/7 priority response\n❄️ \"Tax Deduction Deadline\" - End-of-year upgrades\n❄️ \"Valentine's Special\" - Gift certificates for service\n\n**Year-Round Evergreen Offers**\n• Service Plan Memberships (20% off with annual contract)\n• Military/Senior/Teacher Discounts (10%)\n• First-Time Customer Special\n• Maintenance Club with perks\n• Referral Rewards Program\n\n**Promotion Delivery Methods**\n📧 Email campaigns to existing customers\n📱 Social media posts & ads\n📮 Direct mail postcards\n💬 SMS text campaigns\n🌐 Website banner\n🚗 Vehicle wraps with QR codes\n\n**Promotion Best Practices**\n✓ Create urgency (limited time/spots)\n✓ Clear call-to-action\n✓ Easy to understand offer\n✓ Track results to measure ROI\n✓ Train team on promotion details\n\n**Sample Promotion Ad Copy:**\n\n\"☀️ BEAT THE SUMMER HEAT SPECIAL ☀️\n\nSchedule your AC tune-up this May and save 20%!\n\n✓ Complete system inspection\n✓ Filter replacement included\n✓ Priority scheduling\n✓ 90-day satisfaction guarantee\n\nNormally $179 → Now just $143\n\nCall now or book online: [phone/link]\n\n⏰ Offer expires May 31st - Limited slots available!\"\n\nWant help creating a specific promotion for your business?";
    }

    // ===== KLERVO FEATURE QUESTIONS =====
    if (lowerMessage.includes('what is klervo') || lowerMessage.includes('about klervo')) {
      return "Klervo is a comprehensive field service management platform designed to help businesses manage leads, schedule jobs, track service plans, manage teams, and streamline operations. It provides an all-in-one solution for service-based businesses.";
    }
    if (lowerMessage.includes('lead') && !lowerMessage.includes('status of lead')) {
      return "Klervo's lead management system helps you track potential customers through various stages: New, Contacted, Price Shared, Follow-Up, Won, and Lost. You can manage lead priorities, track communication history, and convert leads into jobs seamlessly.\n\nYou can access Leads from the sidebar → Leads page.";
    }
    if (lowerMessage.includes('schedule') || lowerMessage.includes('calendar')) {
      return "The Schedule Calendar in Klervo allows you to view and manage all your jobs in a calendar format. You can see job details on hover, track job statuses, and organize your team's workload efficiently.\n\nAccess it from: Sidebar → Schedule";
    }
    if (lowerMessage.includes('service plan') || lowerMessage.includes('subscription')) {
      return "Klervo's Service Plans feature is 100% Stripe-compatible and allows you to create and manage recurring service subscriptions. You can set up different tiers, billing cycles, and manage customer subscriptions all in one place.\n\nFind it at: Sidebar → Service Plans";
    }
    if (lowerMessage.includes('team') || lowerMessage.includes('staff')) {
      return "The Team Management feature helps you manage your staff members, track their registration status, assign roles (Admin, Field Staff, Office Staff), and monitor team activities. You can easily invite new members and manage permissions.\n\nLocation: Sidebar → Team";
    }
    if (lowerMessage.includes('help') || lowerMessage.includes('support') || lowerMessage.includes('documentation')) {
      return "For detailed documentation and support, you can visit the Klervo GitBook at https://klervo.gitbook.io/klervo. It contains comprehensive guides, tutorials, and answers to common questions.\n\nYou can also access Help & Support from the bottom of your sidebar.";
    }
    if (lowerMessage.includes('feature') && lowerMessage.includes('klervo')) {
      return "Klervo offers many features including: Lead Management, Job Scheduling, Service Plans & Subscriptions, Team Management, Client Management, Calendar View, Pipeline Visualization, Inventory Management, Reports & Analytics, and more. Each feature is designed to streamline your field service operations.\n\nWhat specific feature would you like to know more about?";
    }

    // ===== DEFAULT HELPFUL RESPONSE =====
    return "I'm Klervo AI, your comprehensive business assistant! I can help you with:\n\n**📊 System Questions**\n• Check job schedules, invoices, leads, revenue\n• View client information and statuses\n• Track payments and reports\n\n**🧭 Navigation & Help**\n• Learn how to use Klervo features\n• Find specific pages and functions\n• Get step-by-step guidance\n\n**💡 Business Advice**\n• Pricing strategies and calculations\n• Customer service tips\n• Marketing and promotion ideas\n• Hiring and team management\n• Industry best practices\n\n**✍️ General Assistance**\n• Write professional emails and quotes\n• Answer business questions\n• Provide explanations and guidance\n• Help with problem-solving\n\nWhat can I help you with today?";
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    // Clear any existing timer
    if (aiResponseTimerRef.current) {
      clearTimeout(aiResponseTimerRef.current);
    }

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      content: inputValue,
      sender: 'user',
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    const messageContent = inputValue; // Store before clearing
    setInputValue('');
    setIsTyping(true);

    // Simulate AI thinking delay
    aiResponseTimerRef.current = setTimeout(() => {
      const aiResponse: Message = {
        id: `ai-${Date.now()}`,
        content: getAIResponse(messageContent),
        sender: 'ai',
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, aiResponse]);
      setIsTyping(false);
      aiResponseTimerRef.current = null;
    }, 1000 + Math.random() * 1000); // Random delay between 1-2 seconds
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const saveCurrentChatToHistory = () => {
    if (messages.length === 0) return;

    const newHistory: ChatHistory = {
      id: currentChatId || `chat-${Date.now()}`,
      title: messages[0].content.slice(0, 50) + (messages[0].content.length > 50 ? '...' : ''),
      messages: [...messages],
      timestamp: new Date().toISOString(),
    };

    setChatHistories((prev) => {
      // Remove existing chat with same ID if updating
      const filtered = prev.filter(h => h.id !== newHistory.id);
      // Add new history at the beginning
      const updated = [newHistory, ...filtered];
      // Keep only last 20
      return updated.slice(0, 20);
    });
  };

  const startNewChat = () => {
    if (messages.length > 0) {
      saveCurrentChatToHistory();
    }
    setMessages([]);
    setCurrentChatId(null);
    setActiveTab('chat');
  };

  const loadChatFromHistory = (history: ChatHistory) => {
    setMessages(history.messages);
    setCurrentChatId(history.id);
    setActiveTab('chat');
  };

  const deleteChatHistory = (id: string) => {
    setChatHistories((prev) => prev.filter(h => h.id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      {/* Header */}
      <div className="mb-6">
        {/* Tabs */}
        <div className="flex gap-6 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('chat')}
            className={`pb-3 px-1 text-sm font-medium transition-colors relative ${
              activeTab === 'chat'
                ? 'text-[#051046]'
                : 'text-gray-500 hover:text-[#051046]'
            }`}
          >
            Chat
            {activeTab === 'chat' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#9473ff]" />
            )}
          </button>
          <button
            onClick={() => {
              if (messages.length > 0 && activeTab === 'chat') {
                saveCurrentChatToHistory();
              }
              setActiveTab('history');
            }}
            className={`pb-3 px-1 text-sm font-medium transition-colors relative ${
              activeTab === 'history'
                ? 'text-[#051046]'
                : 'text-gray-500 hover:text-[#051046]'
            }`}
          >
            History
            {activeTab === 'history' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#9473ff]" />
            )}
          </button>
        </div>
      </div>

      {/* Chat Tab */}
      {activeTab === 'chat' && (
        <div className="max-w-7xl mx-auto">
          {messages.length === 0 ? (
            /* Welcome Screen */
            <div
              className="bg-white rounded-[20px] border border-[#e2e8f0] p-8"
              style={{ boxShadow: 'rgba(226, 232, 240, 0.5) 0px 2px 16px 2px' }}
            >
              <h1 className="text-2xl font-semibold text-[#051046] mb-3">
                Ask any question or get Klervo assistance instantly.
              </h1>
              <p className="text-sm mb-6" style={{ color: '#9473ff' }}>
                Works like an OpenAI-style chat while also answering questions about Klervo and its features.
              </p>

              <div className="relative">
                <textarea
                  ref={inputRef}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="What can I help you with today?"
                  className="w-full px-3 py-2.5 pr-10 sm:px-4 sm:py-3 sm:pr-12 md:px-5 md:py-3.5 md:pr-14 border border-[#e8e8e8] rounded-[15px] focus:outline-none focus:ring-2 focus:ring-[#9473ff] text-[#051046] resize-none text-sm sm:text-base"
                  rows={1}
                  style={{ minHeight: '44px' }}
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim()}
                  className="absolute right-2 sm:right-3 md:right-4 top-1/2 transform -translate-y-1/2 w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 flex items-center justify-center rounded-full transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                  style={{
                    backgroundColor: inputValue.trim() ? '#051046' : '#e8e8e8',
                    color: inputValue.trim() ? '#ffffff' : '#a0a0a0',
                  }}
                  onMouseEnter={(e) => {
                    if (inputValue.trim()) {
                      e.currentTarget.style.backgroundColor = '#1a1a4a';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (inputValue.trim()) {
                      e.currentTarget.style.backgroundColor = '#051046';
                    }
                  }}
                >
                  <Send className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-4.5 md:h-4.5" />
                </button>
              </div>
            </div>
          ) : (
            /* Chat Messages */
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-[#051046]">Chat with Klervo AI</h2>
                <button
                  onClick={startNewChat}
                  className="px-4 py-2 text-sm bg-[#9473ff] text-white rounded-[32px] hover:bg-[#7f5fd9] transition-colors"
                >
                  New Chat
                </button>
              </div>

              <div
                className="bg-white rounded-[20px] border border-[#e2e8f0] p-6 space-y-6 max-h-[600px] overflow-y-auto"
                style={{ boxShadow: 'rgba(226, 232, 240, 0.5) 0px 2px 16px 2px' }}
              >
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex gap-4 ${
                      message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'
                    }`}
                  >
                    {/* Avatar */}
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                        message.sender === 'user'
                          ? 'bg-[#9473ff]'
                          : 'bg-gradient-to-br from-purple-500 to-blue-500'
                      }`}
                    >
                      {message.sender === 'user' ? (
                        <User className="w-4 h-4 text-white" />
                      ) : (
                        <Bot className="w-4 h-4 text-white" />
                      )}
                    </div>

                    {/* Message Content */}
                    <div
                      className={`flex-1 max-w-[80%] ${
                        message.sender === 'user' ? 'text-right' : 'text-left'
                      }`}
                    >
                      <div
                        className={`inline-block px-4 py-3 rounded-[15px] ${
                          message.sender === 'user'
                            ? 'bg-[#9473ff] text-white'
                            : 'bg-gray-100 text-[#051046]'
                        }`}
                      >
                        <p className="text-sm leading-relaxed whitespace-pre-wrap">
                          {message.content}
                        </p>
                      </div>
                      <p className="text-xs text-gray-400 mt-1 px-2">
                        {new Date(message.timestamp).toLocaleTimeString('en-US', {
                          hour: 'numeric',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                  </div>
                ))}

                {/* Typing Indicator */}
                {isTyping && (
                  <div className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center flex-shrink-0">
                      <Bot className="w-4 h-4 text-white" />
                    </div>
                    <div className="bg-gray-100 px-4 py-3 rounded-[15px]">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="relative">
                <textarea
                  ref={inputRef}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Type your message..."
                  className="w-full px-4 py-3 pr-12 border border-[#e8e8e8] rounded-[15px] focus:outline-none focus:ring-2 focus:ring-[#9473ff] text-[#051046] resize-none bg-white"
                  rows={1}
                  style={{ minHeight: '48px' }}
                  disabled={isTyping}
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim() || isTyping}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-full transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                  style={{
                    backgroundColor: inputValue.trim() && !isTyping ? '#051046' : '#e8e8e8',
                    color: inputValue.trim() && !isTyping ? '#ffffff' : '#a0a0a0',
                  }}
                  onMouseEnter={(e) => {
                    if (inputValue.trim() && !isTyping) {
                      e.currentTarget.style.backgroundColor = '#1a1a4a';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (inputValue.trim() && !isTyping) {
                      e.currentTarget.style.backgroundColor = '#051046';
                    }
                  }}
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* History Tab */}
      {activeTab === 'history' && (
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-[#051046]">Chat History</h2>
            <p className="text-sm text-gray-500">
              Last {chatHistories.length} of 20 conversations
            </p>
          </div>

          {chatHistories.length === 0 ? (
            <div
              className="bg-white rounded-[20px] border border-[#e2e8f0] p-12 text-center"
              style={{ boxShadow: 'rgba(226, 232, 240, 0.5) 0px 2px 16px 2px' }}
            >
              <Bot className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-[#051046] mb-2">No chat history yet</h3>
              <p className="text-sm text-gray-500 mb-6">
                Start a conversation with Klervo AI to see your chat history here.
              </p>
              <button
                onClick={() => setActiveTab('chat')}
                className="px-6 py-2.5 bg-[#9473ff] text-white rounded-[32px] hover:bg-[#7f5fd9] transition-colors"
              >
                Start New Chat
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {chatHistories.map((history) => (
                <div
                  key={history.id}
                  className="bg-white rounded-[20px] border border-[#e2e8f0] p-6 hover:shadow-lg transition-shadow cursor-pointer"
                  style={{ boxShadow: 'rgba(226, 232, 240, 0.5) 0px 2px 16px 2px' }}
                  onClick={() => loadChatFromHistory(history)}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="font-semibold text-[#051046] mb-1">{history.title}</h3>
                      <p className="text-sm text-gray-500">
                        {history.messages.length} messages • {new Date(history.timestamp).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                          hour: 'numeric',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteChatHistory(history.id);
                      }}
                      className="px-4 py-1.5 text-sm text-red-600 border border-red-200 rounded-[32px] hover:bg-red-50 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}