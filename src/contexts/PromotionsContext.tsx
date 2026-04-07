import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface Promotion {
  id: number;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  discountType: '$' | '%';
  discountValue: string;
  targetAudience: 'All Clients' | 'New Clients Only' | 'Existing Clients Only';
  promoCode?: string;
  isActive: boolean;
}

interface PromotionsContextType {
  promotions: Promotion[];
  setPromotions: React.Dispatch<React.SetStateAction<Promotion[]>>;
}

const PromotionsContext = createContext<PromotionsContextType | undefined>(undefined);

export function PromotionsProvider({ children }: { children: ReactNode }) {
  const [promotions, setPromotions] = useState<Promotion[]>([]);

  return (
    <PromotionsContext.Provider value={{ promotions, setPromotions }}>
      {children}
    </PromotionsContext.Provider>
  );
}

export function usePromotions() {
  const context = useContext(PromotionsContext);
  if (context === undefined) {
    throw new Error('usePromotions must be used within a PromotionsProvider');
  }
  return context;
}