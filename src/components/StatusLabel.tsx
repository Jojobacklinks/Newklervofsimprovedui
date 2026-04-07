import React from 'react';

export type StatusLabelVariant = 
  | 'blue'
  | 'yellow' 
  | 'green'
  | 'red'
  | 'purple'
  | 'orange'
  | 'pink'
  | 'cyan'
  | 'gray'
  | 'lime';

export interface StatusLabelProps {
  /**
   * The text to display in the status label
   */
  children: React.ReactNode;
  
  /**
   * The color variant of the status label
   */
  variant: StatusLabelVariant;
  
  /**
   * Whether to show a dot indicator
   * @default false
   */
  showDot?: boolean;
  
  /**
   * Additional CSS classes
   */
  className?: string;
  
  /**
   * Size variant
   * @default 'default'
   */
  size?: 'sm' | 'default' | 'lg';
}

const variantStyles: Record<StatusLabelVariant, string> = {
  blue: 'bg-blue-100 text-blue-700',
  yellow: 'bg-yellow-100 text-yellow-700',
  green: 'bg-green-100 text-green-700',
  red: 'bg-red-100 text-red-700',
  purple: 'bg-purple-100 text-purple-700',
  orange: 'bg-orange-100 text-orange-700',
  pink: 'bg-pink-100 text-pink-700',
  cyan: 'bg-cyan-100 text-cyan-700',
  gray: 'bg-gray-100 text-gray-700',
  lime: 'bg-lime-100 text-lime-700',
};

const sizeStyles = {
  sm: 'px-2 py-0.5 text-[10px]',
  default: 'px-3 py-1 text-xs',
  lg: 'px-4 py-1.5 text-sm',
};

/**
 * StatusLabel Component
 * 
 * A reusable status label component used throughout the Klervo application
 * for displaying statuses with consistent styling.
 * 
 * @example
 * ```tsx
 * <StatusLabel variant="green" showDot>Approved</StatusLabel>
 * <StatusLabel variant="yellow">Pending</StatusLabel>
 * <StatusLabel variant="blue" size="sm">New</StatusLabel>
 * ```
 */
export function StatusLabel({ 
  children, 
  variant, 
  showDot = false,
  className = '',
  size = 'default'
}: StatusLabelProps) {
  return (
    <span 
      className={`inline-flex items-center gap-1.5 rounded-full font-medium ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
    >
      {showDot && <span className="w-1.5 h-1.5 rounded-full bg-current" />}
      {children}
    </span>
  );
}

/**
 * Helper function to get the appropriate variant for common statuses
 */
export const getStatusVariant = {
  // Estimate statuses
  estimateUnsent: 'blue' as StatusLabelVariant,
  estimatePending: 'yellow' as StatusLabelVariant,
  estimateApproved: 'green' as StatusLabelVariant,
  estimateDeclined: 'red' as StatusLabelVariant,
  
  // Job statuses
  jobScheduled: 'blue' as StatusLabelVariant,
  jobDepositCollected: 'cyan' as StatusLabelVariant,
  jobInProgress: 'orange' as StatusLabelVariant,
  jobCompleted: 'green' as StatusLabelVariant,
  jobCancelled: 'red' as StatusLabelVariant,
  
  // Invoice statuses
  invoiceUnpaid: 'yellow' as StatusLabelVariant,
  invoicePaid: 'green' as StatusLabelVariant,
  invoicePartiallyPaid: 'orange' as StatusLabelVariant,
  invoiceOverdue: 'red' as StatusLabelVariant,
  
  // Lead statuses
  leadNew: 'blue' as StatusLabelVariant,
  leadContacted: 'cyan' as StatusLabelVariant,
  leadPriceShared: 'lime' as StatusLabelVariant,
  leadFollowUp: 'orange' as StatusLabelVariant,
  leadWon: 'purple' as StatusLabelVariant,
  leadLost: 'red' as StatusLabelVariant,
  
  // Priority levels
  priorityHigh: 'red' as StatusLabelVariant,
  priorityMedium: 'yellow' as StatusLabelVariant,
  priorityLow: 'green' as StatusLabelVariant,
  
  // General statuses
  active: 'green' as StatusLabelVariant,
  inactive: 'gray' as StatusLabelVariant,
  pending: 'yellow' as StatusLabelVariant,
  success: 'green' as StatusLabelVariant,
  error: 'red' as StatusLabelVariant,
  warning: 'orange' as StatusLabelVariant,
  info: 'blue' as StatusLabelVariant,
};
