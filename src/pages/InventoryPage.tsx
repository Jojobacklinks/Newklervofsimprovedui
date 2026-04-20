import { useState, useEffect, useCallback } from 'react';
import { 
  Search, 
  Plus, 
  Package, 
  Users, 
  AlertTriangle, 
  DollarSign, 
  ArrowRightLeft,
  ArrowBigUpDash,
  Filter,
  Wrench,
  Box,
  ChevronDown,
  ChevronUp,
  X,
  TrendingUp,
  Pencil,
  Trash2,
  History,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { ActivityTimelineView } from '../components/ActivityTimelineView';

// Types
type ItemType = 'part' | 'service';
type StockStatus = 'in-stock' | 'low-stock' | 'out-of-stock';

interface InventoryItem {
  id: string;
  name: string;
  type: ItemType;
  category: string;
  sku: string;
  unitPrice: number;
  cost: number;
  minStockLevel: number;
  description: string;
  itemPhoto?: string;
}

interface StockLocation {
  itemId: string;
  location: string; // 'warehouse' or technician name
  quantity: number;
}

interface TransferLog {
  id: string;
  itemId: string;
  itemName: string;
  itemPhoto?: string;
  from: string;
  to: string;
  quantity: number;
  date: string;
  time: string;
  transferredBy: string;
}

interface UsageLog {
  id: string;
  itemId: string;
  itemName: string;
  itemSku: string;
  itemCost: number;
  itemCategory: string;
  itemBrand: string;
  itemPhoto?: string;
  usedCount: number;
  usedBy: string;
  jobNumber: string;
  date: string;
  time: string;
}

interface StockRestoredLog {
  id: string;
  itemId: string;
  itemName: string;
  itemPhoto?: string;
  quantity: number;
  jobNumber: string;
  reason: 'cancelled' | 'refunded';
  restoredBy: string;
  date: string;
  time: string;
}

interface StockAdjustedLog {
  id: string;
  itemId: string;
  itemName: string;
  itemPhoto?: string;
  oldQuantity: number;
  newQuantity: number;
  reason: string;
  adjustedBy: string;
  date: string;
  time: string;
}

// Mock Data
const initialInventoryItems: InventoryItem[] = [
  { id: '1', name: 'HVAC Filter 16x20', type: 'part', category: 'HVAC Parts', sku: 'HVF-1620', unitPrice: 12.50, cost: 5.00, minStockLevel: 20, description: '16x20 HVAC filter, MERV 11', itemPhoto: 'https://images.unsplash.com/photo-1771371600724-11d064eed375?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxIVkFDJTIwYWlyJTIwZmlsdGVyfGVufDF8fHx8MTc3MTYxMTQ5Nnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral' },
  { id: '2', name: 'Copper Pipe 3/4"', type: 'part', category: 'Plumbing', sku: 'CP-075', unitPrice: 8.75, cost: 3.00, minStockLevel: 50, description: '3/4 inch copper pipe per foot', itemPhoto: 'https://images.unsplash.com/photo-1676039708998-dd17ae27c90c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3BwZXIlMjBwaXBlJTIwcGx1bWJpbmd8ZW58MXx8fHwxNzcxNTM3MzYxfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral' },
  { id: '3', name: 'Refrigerant R-410A', type: 'part', category: 'HVAC Parts', sku: 'REF-410A', unitPrice: 45.00, cost: 20.00, minStockLevel: 10, description: 'R-410A refrigerant, 25lb cylinder', itemPhoto: 'https://images.unsplash.com/photo-1736625188671-4326b910165e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZWZyaWdlcmFudCUyMHRhbmslMjBIVkFDfGVufDF8fHx8MTc3MTYxMTQ5N3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral' },
  { id: '4', name: 'Diagnostic Service', type: 'service', category: 'HVAC Services', sku: 'SRV-DIAG', unitPrice: 89.00, cost: 50.00, minStockLevel: 0, description: 'Standard HVAC diagnostic service' },
  { id: '5', name: 'Drain Snake Tool', type: 'part', category: 'Plumbing', sku: 'DST-50', unitPrice: 125.00, cost: 50.00, minStockLevel: 5, description: '50ft drain snake tool', itemPhoto: 'https://images.unsplash.com/photo-1612115482041-d78c0ca829c2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400' },
  { id: '6', name: 'AC Coil Cleaning', type: 'service', category: 'HVAC Services', sku: 'SRV-COIL', unitPrice: 120.00, cost: 60.00, minStockLevel: 0, description: 'AC evaporator coil cleaning service' },
  { id: '7', name: 'Thermostat - Smart', type: 'part', category: 'HVAC Parts', sku: 'THERM-SM', unitPrice: 180.00, cost: 80.00, minStockLevel: 8, description: 'Smart WiFi thermostat', itemPhoto: 'https://images.unsplash.com/photo-1545259741-2ea3ebf61fa3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzbWFydCUyMHRoZXJtb3N0YXR8ZW58MXx8fHwxNzcxNjExNDk3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral' },
  { id: '8', name: 'PVC Pipe 2"', type: 'part', category: 'Plumbing', sku: 'PVC-2', unitPrice: 3.50, cost: 1.50, minStockLevel: 100, description: '2 inch PVC pipe per foot', itemPhoto: 'https://images.unsplash.com/photo-1729169927271-7826d8aae360?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400' },
  { id: '9', name: 'Annual Maintenance', type: 'service', category: 'HVAC Services', sku: 'SRV-MAINT', unitPrice: 150.00, cost: 75.00, minStockLevel: 0, description: 'Annual HVAC system maintenance' },
  { id: '10', name: 'Capacitor 45/5', type: 'part', category: 'HVAC Parts', sku: 'CAP-455', unitPrice: 22.00, cost: 10.00, minStockLevel: 15, description: '45/5 MFD dual run capacitor', itemPhoto: 'https://images.unsplash.com/photo-1727119313713-e5d844a1f0b3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400' },
  { id: '11', name: 'Duct Cleaning', type: 'service', category: 'HVAC Services', sku: 'SRV-DUCT', unitPrice: 200.00, cost: 100.00, minStockLevel: 0, description: 'Complete duct system cleaning' },
  { id: '12', name: 'Emergency Repair', type: 'service', category: 'HVAC Services', sku: 'SRV-EMER', unitPrice: 250.00, cost: 125.00, minStockLevel: 0, description: '24/7 emergency repair service' },
  { id: '13', name: 'System Installation', type: 'service', category: 'HVAC Services', sku: 'SRV-INST', unitPrice: 500.00, cost: 250.00, minStockLevel: 0, description: 'Complete HVAC system installation' },
  { id: '14', name: 'Plumbing Inspection', type: 'service', category: 'Plumbing Services', sku: 'SRV-PINSP', unitPrice: 75.00, cost: 40.00, minStockLevel: 0, description: 'Comprehensive plumbing inspection' },
  { id: '15', name: 'Drain Cleaning', type: 'service', category: 'Plumbing Services', sku: 'SRV-DRAIN', unitPrice: 120.00, cost: 60.00, minStockLevel: 0, description: 'Professional drain cleaning service' },
];

const technicians = [
  { id: 't1', name: 'John Smith', avatar: 'JS' },
  { id: 't2', name: 'Sarah Johnson', avatar: 'SJ' },
  { id: 't3', name: 'Mike Davis', avatar: 'MD' },
  { id: 't4', name: 'Emily Brown', avatar: 'EB' },
];

export function InventoryPage() {
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>(initialInventoryItems);
  const [selectedView, setSelectedView] = useState<'parts' | 'services' | 'usage'>('parts');
  const [selectedType, setSelectedType] = useState<'parts' | 'services'>('parts');
  const [selectedLocation, setSelectedLocation] = useState<string>('warehouse');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [sortBy, setSortBy] = useState<'name' | 'quantity' | 'value'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [showBulkTransferModal, setShowBulkTransferModal] = useState(false);
  const [showAddItemModal, setShowAddItemModal] = useState(false);
  const [showEditItemModal, setShowEditItemModal] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [customCategories, setCustomCategories] = useState<string[]>([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<InventoryItem | null>(null);
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [adjustmentNote, setAdjustmentNote] = useState('');
  const [pendingAdjustment, setPendingAdjustment] = useState<{
    itemId: string;
    itemName: string;
    oldQuantity: number;
    newQuantity: number;
  } | null>(null);

  // Stock locations (simulated database)
  const [stockLocations, setStockLocations] = useState<StockLocation[]>([
    // Main Warehouse Stock
    { itemId: '1', location: 'warehouse', quantity: 45 },
    { itemId: '2', location: 'warehouse', quantity: 120 },
    { itemId: '3', location: 'warehouse', quantity: 8 },
    { itemId: '5', location: 'warehouse', quantity: 12 },
    { itemId: '7', location: 'warehouse', quantity: 15 },
    { itemId: '8', location: 'warehouse', quantity: 200 },
    { itemId: '10', location: 'warehouse', quantity: 25 },
    
    // John Smith's inventory
    { itemId: '1', location: 'John Smith', quantity: 5 },
    { itemId: '2', location: 'John Smith', quantity: 10 },
    { itemId: '3', location: 'John Smith', quantity: 2 },
    { itemId: '10', location: 'John Smith', quantity: 4 },
    
    // Sarah Johnson's inventory
    { itemId: '1', location: 'Sarah Johnson', quantity: 8 },
    { itemId: '5', location: 'Sarah Johnson', quantity: 1 },
    { itemId: '7', location: 'Sarah Johnson', quantity: 2 },
    
    // Mike Davis's inventory
    { itemId: '2', location: 'Mike Davis', quantity: 15 },
    { itemId: '8', location: 'Mike Davis', quantity: 25 },
    { itemId: '10', location: 'Mike Davis', quantity: 3 },
    
    // Emily Brown's inventory
    { itemId: '1', location: 'Emily Brown', quantity: 6 },
    { itemId: '3', location: 'Emily Brown', quantity: 1 },
    { itemId: '7', location: 'Emily Brown', quantity: 1 },
  ]);

  const [transferLogs, setTransferLogs] = useState<TransferLog[]>([
    { id: 'tr1', itemId: '1', itemName: 'HVAC Filter 16x20', itemPhoto: 'https://images.unsplash.com/photo-1771371600724-11d064eed375?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400', from: 'Main Warehouse', to: 'John Smith', quantity: 5, date: '2026-02-15', time: '10:30 AM', transferredBy: 'Office Admin' },
    { id: 'tr2', itemId: '7', itemName: 'Thermostat - Smart', itemPhoto: 'https://images.unsplash.com/photo-1545259741-2ea3ebf61fa3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400', from: 'Main Warehouse', to: 'Sarah Johnson', quantity: 2, date: '2026-02-14', time: '02:15 PM', transferredBy: 'Office Admin' },
    { id: 'tr3', itemId: '3', itemName: 'Refrigerant R-410A', itemPhoto: 'https://images.unsplash.com/photo-1736625188671-4326b910165e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400', from: 'Main Warehouse', to: 'Mike Davis', quantity: 3, date: '2026-02-12', time: '09:00 AM', transferredBy: 'Office Admin' },
    { id: 'tr4', itemId: '10', itemName: 'Capacitor 45/5', itemPhoto: 'https://images.unsplash.com/photo-1727119313713-e5d844a1f0b3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400', from: 'Mike Davis', to: 'Main Warehouse', quantity: 2, date: '2026-02-10', time: '04:45 PM', transferredBy: 'Mike Davis' },
    { id: 'tr5', itemId: '2', itemName: 'Copper Pipe 3/4"', itemPhoto: 'https://images.unsplash.com/photo-1676039708998-dd17ae27c90c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400', from: 'Main Warehouse', to: 'Emily Brown', quantity: 15, date: '2026-02-08', time: '11:20 AM', transferredBy: 'Office Admin' },
    { id: 'tr6', itemId: '8', itemName: 'PVC Pipe 2"', itemPhoto: 'https://images.unsplash.com/photo-1729169927271-7826d8aae360?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400', from: 'Main Warehouse', to: 'Mike Davis', quantity: 25, date: '2025-10-28', time: '01:30 PM', transferredBy: 'Office Admin' },
    { id: 'tr7', itemId: '1', itemName: 'HVAC Filter 16x20', itemPhoto: 'https://images.unsplash.com/photo-1771371600724-11d064eed375?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400', from: 'Sarah Johnson', to: 'Main Warehouse', quantity: 3, date: '2025-10-27', time: '03:00 PM', transferredBy: 'Sarah Johnson' },
    { id: 'tr8', itemId: '5', itemName: 'Drain Snake Tool', itemPhoto: 'https://images.unsplash.com/photo-1612115482041-d78c0ca829c2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400', from: 'Main Warehouse', to: 'Sarah Johnson', quantity: 1, date: '2025-10-24', time: '10:00 AM', transferredBy: 'Office Admin' },
    { id: 'tr9', itemId: '7', itemName: 'Thermostat - Smart', itemPhoto: 'https://images.unsplash.com/photo-1545259741-2ea3ebf61fa3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400', from: 'John Smith', to: 'Main Warehouse', quantity: 1, date: '2025-10-23', time: '05:15 PM', transferredBy: 'John Smith' },
    { id: 'tr10', itemId: '3', itemName: 'Refrigerant R-410A', itemPhoto: 'https://images.unsplash.com/photo-1736625188671-4326b910165e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400', from: 'Main Warehouse', to: 'Emily Brown', quantity: 2, date: '2025-10-20', time: '08:45 AM', transferredBy: 'Office Admin' },
  ]);

  const [usageLogs, setUsageLogs] = useState<UsageLog[]>([
    { id: 'u1', itemId: '1', itemName: 'Connector', itemSku: '321connector', itemCost: 9.99, itemCategory: 'Parts', itemBrand: 'Connector Plus', itemPhoto: 'https://images.unsplash.com/photo-1678119895596-411628b1f6be?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400', usedCount: 1, usedBy: 'John Smith', jobNumber: '317', date: '2026-02-07', time: '09:30 AM' },
    { id: 'u2', itemId: '1', itemName: 'Connector', itemSku: '321connector', itemCost: 9.99, itemCategory: 'Parts', itemBrand: 'Connector Plus', itemPhoto: 'https://images.unsplash.com/photo-1678119895596-411628b1f6be?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400', usedCount: 1, usedBy: 'John Smith', jobNumber: '316', date: '2026-02-07', time: '02:15 PM' },
    { id: 'u3', itemId: '2', itemName: 'AC Unit', itemSku: '123AC Unit', itemCost: 2599.00, itemCategory: 'Parts', itemBrand: 'Conor', itemPhoto: 'https://images.unsplash.com/photo-1757219525975-03b5984bc6e8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400', usedCount: 1, usedBy: 'Sarah Johnson', jobNumber: '315', date: '2026-02-07', time: '11:00 AM' },
    { id: 'u4', itemId: '1', itemName: 'Connector', itemSku: '321connector', itemCost: 9.99, itemCategory: 'Parts', itemBrand: 'Connector Plus', itemPhoto: 'https://images.unsplash.com/photo-1678119895596-411628b1f6be?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400', usedCount: 1, usedBy: 'Mike Davis', jobNumber: '307', date: '2025-10-26', time: '03:45 PM' },
    { id: 'u5', itemId: '1', itemName: 'Connector', itemSku: '321connector', itemCost: 9.99, itemCategory: 'Parts', itemBrand: 'Connector Plus', itemPhoto: 'https://images.unsplash.com/photo-1678119895596-411628b1f6be?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400', usedCount: 1, usedBy: 'Emily Brown', jobNumber: '289', date: '2025-10-25', time: '10:20 AM' },
    { id: 'u6', itemId: '1', itemName: 'Connector', itemSku: '321connector', itemCost: 9.99, itemCategory: 'Parts', itemBrand: 'Connector Plus', itemPhoto: 'https://images.unsplash.com/photo-1678119895596-411628b1f6be?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400', usedCount: 1, usedBy: 'John Smith', jobNumber: '308', date: '2025-10-25', time: '01:30 PM' },
    { id: 'u7', itemId: '2', itemName: 'AC Unit', itemSku: '123AC Unit', itemCost: 2599.00, itemCategory: 'Parts', itemBrand: 'Conor', itemPhoto: 'https://images.unsplash.com/photo-1757219525975-03b5984bc6e8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400', usedCount: 3, usedBy: 'Sarah Johnson', jobNumber: '305', date: '2025-10-23', time: '09:00 AM' },
    { id: 'u8', itemId: '2', itemName: 'AC Unit', itemSku: '123AC Unit', itemCost: 2599.00, itemCategory: 'Parts', itemBrand: 'Conor', itemPhoto: 'https://images.unsplash.com/photo-1757219525975-03b5984bc6e8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400', usedCount: 2, usedBy: 'Mike Davis', jobNumber: '302', date: '2025-10-22', time: '02:30 PM' },
    { id: 'u9', itemId: '2', itemName: 'AC Unit', itemSku: '123AC Unit', itemCost: 2599.00, itemCategory: 'Parts', itemBrand: 'Conor', itemPhoto: 'https://images.unsplash.com/photo-1757219525975-03b5984bc6e8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400', usedCount: 1, usedBy: 'Emily Brown', jobNumber: '302', date: '2025-10-22', time: '04:15 PM' },
    { id: 'u10', itemId: '2', itemName: 'AC Unit', itemSku: '123AC Unit', itemCost: 2599.00, itemCategory: 'Parts', itemBrand: 'Conor', itemPhoto: 'https://images.unsplash.com/photo-1757219525975-03b5984bc6e8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400', usedCount: 2, usedBy: 'John Smith', jobNumber: '302', date: '2025-10-22', time: '05:00 PM' },
  ]);

  // New activity logs - Stock added entries now use the adjustment flow with notes
  const [stockRestoredLogs, setStockRestoredLogs] = useState<StockRestoredLog[]>([
    { id: 'sr1', itemId: '1', itemName: 'Connector', itemPhoto: 'https://images.unsplash.com/photo-1678119895596-411628b1f6be?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400', quantity: 2, jobNumber: '314', reason: 'refunded', restoredBy: 'Office Admin', date: '2026-02-17', time: '03:20 PM' },
    { id: 'sr2', itemId: '7', itemName: 'Thermostat - Smart', itemPhoto: 'https://images.unsplash.com/photo-1545259741-2ea3ebf61fa3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400', quantity: 1, jobNumber: '310', reason: 'cancelled', restoredBy: 'Office Admin', date: '2026-02-11', time: '01:45 PM' },
    { id: 'sr3', itemId: '2', itemName: 'AC Unit', itemPhoto: 'https://images.unsplash.com/photo-1757219525975-03b5984bc6e8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400', quantity: 1, jobNumber: '304', reason: 'refunded', restoredBy: 'Office Admin', date: '2025-10-29', time: '04:10 PM' },
  ]);

  const [stockAdjustedLogs, setStockAdjustedLogs] = useState<StockAdjustedLog[]>([
    { id: 'sadj1', itemId: '1', itemName: 'HVAC Filter 16x20', itemPhoto: 'https://images.unsplash.com/photo-1771371600724-11d064eed375?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400', oldQuantity: 47, newQuantity: 45, reason: 'Physical count adjustment', adjustedBy: 'Office Admin', date: '2026-02-19', time: '08:15 AM' },
    { id: 'sadj2', itemId: '8', itemName: 'PVC Pipe 2"', itemPhoto: 'https://images.unsplash.com/photo-1729169927271-7826d8aae360?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400', oldQuantity: 205, newQuantity: 200, reason: 'Found damaged units', adjustedBy: 'Mike Davis', date: '2026-02-06', time: '05:30 PM' },
    { id: 'sadj3', itemId: '10', itemName: 'Capacitor 45/5', itemPhoto: 'https://images.unsplash.com/photo-1727119313713-e5d844a1f0b3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400', oldQuantity: 22, newQuantity: 25, reason: 'Recount after inventory audit', adjustedBy: 'Office Admin', date: '2025-10-21', time: '12:00 PM' },
  ]);

  const [usageSearchQuery, setUsageSearchQuery] = useState('');
  const [usageSortBy, setUsageSortBy] = useState<'date' | 'name' | 'quantity'>('date');
  const [usageSortOrder, setUsageSortOrder] = useState<'asc' | 'desc'>('desc');
  const [usageCurrentPage, setUsageCurrentPage] = useState(1);
  const usageItemsPerPage = 10;

  // Pagination for Parts and Services
  const [inventoryCurrentPage, setInventoryCurrentPage] = useState(1);
  const inventoryItemsPerPage = 5;

  // Reset pagination when filters or type changes
  useEffect(() => {
    setInventoryCurrentPage(1);
  }, [selectedType, searchQuery, filterCategory, sortBy, sortOrder, selectedLocation]);

  // Helper functions
  const getStockQuantity = (itemId: string, location: string): number => {
    const stock = stockLocations.find(s => s.itemId === itemId && s.location === location);
    return stock?.quantity || 0;
  };

  const getTotalStockForItem = (itemId: string): number => {
    return stockLocations
      .filter(s => s.itemId === itemId)
      .reduce((sum, s) => sum + s.quantity, 0);
  };

  const getStockStatus = (item: InventoryItem, quantity: number): StockStatus => {
    if (item.type === 'service') return 'in-stock';
    if (quantity === 0) return 'out-of-stock';
    if (quantity <= item.minStockLevel) return 'low-stock';
    return 'in-stock';
  };

  const getTotalInventoryValue = (): number => {
    return inventoryItems.reduce((total, item) => {
      const totalQty = getTotalStockForItem(item.id);
      return total + (totalQty * item.unitPrice);
    }, 0);
  };

  const getLowStockCount = (): number => {
    return inventoryItems.filter(item => {
      if (item.type === 'service') return false;
      const warehouseQty = getStockQuantity(item.id, 'warehouse');
      return warehouseQty <= item.minStockLevel;
    }).length;
  };

  const getTotalItemsInStock = (): number => {
    return inventoryItems.reduce((total, item) => {
      return total + getTotalStockForItem(item.id);
    }, 0);
  };

  const getAverageMargin = (): number => {
    if (inventoryItems.length === 0) return 0;
    
    const totalMargin = inventoryItems.reduce((sum, item) => {
      const margin = ((item.unitPrice - item.cost) / item.cost) * 100;
      return sum + margin;
    }, 0);
    
    return totalMargin / inventoryItems.length;
  };

  // Get unique categories
  const categories = ['all', ...new Set(inventoryItems.map(item => item.category))];

  // Filter and sort items
  const filteredItems = inventoryItems
    .filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           item.sku.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = selectedType === 'parts' ? item.type === 'part' : item.type === 'service';
      const matchesCategory = filterCategory === 'all' || item.category === filterCategory;
      return matchesSearch && matchesType && matchesCategory;
    })
    .sort((a, b) => {
      let compareValue = 0;
      
      if (sortBy === 'name') {
        compareValue = a.name.localeCompare(b.name);
      } else if (sortBy === 'quantity') {
        const location = selectedLocation;
        const qtyA = getStockQuantity(a.id, location);
        const qtyB = getStockQuantity(b.id, location);
        compareValue = qtyA - qtyB;
      } else if (sortBy === 'value') {
        const location = selectedLocation;
        const valueA = getStockQuantity(a.id, location) * a.unitPrice;
        const valueB = getStockQuantity(b.id, location) * b.unitPrice;
        compareValue = valueA - valueB;
      }
      
      return sortOrder === 'asc' ? compareValue : -compareValue;
    });

  // Pagination calculations
  const totalPages = Math.ceil(filteredItems.length / inventoryItemsPerPage);
  const startIndex = (inventoryCurrentPage - 1) * inventoryItemsPerPage;
  const endIndex = startIndex + inventoryItemsPerPage;
  const paginatedItems = filteredItems.slice(startIndex, endIndex);

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (inventoryCurrentPage <= 3) {
        for (let i = 1; i <= 4; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      } else if (inventoryCurrentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = inventoryCurrentPage - 1; i <= inventoryCurrentPage + 1; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  const handleTransfer = (from: string, to: string, quantity: number) => {
    if (!selectedItem) return;

    // Update stock locations
    setStockLocations(prev => {
      const updated = [...prev];
      
      // Reduce from source
      const fromIndex = updated.findIndex(s => s.itemId === selectedItem.id && s.location === from);
      if (fromIndex >= 0) {
        updated[fromIndex] = { ...updated[fromIndex], quantity: updated[fromIndex].quantity - quantity };
      }
      
      // Add to destination
      const toIndex = updated.findIndex(s => s.itemId === selectedItem.id && s.location === to);
      if (toIndex >= 0) {
        updated[toIndex] = { ...updated[toIndex], quantity: updated[toIndex].quantity + quantity };
      } else {
        updated.push({ itemId: selectedItem.id, location: to, quantity });
      }
      
      return updated;
    });

    // Add transfer log
    const newLog: TransferLog = {
      id: `tr${Date.now()}`,
      itemId: selectedItem.id,
      itemName: selectedItem.name,
      from,
      to,
      quantity,
      date: new Date().toISOString().split('T')[0],
      transferredBy: 'Admin'
    };
    setTransferLogs(prev => [newLog, ...prev]);

    setShowTransferModal(false);
    setSelectedItem(null);
  };

  const handleAddCategory = () => {
    if (newCategoryName.trim()) {
      setCustomCategories(prev => [...prev, newCategoryName.trim()]);
      setNewCategoryName('');
      setIsAddingCategory(false);
    }
  };

  const handleUpdateItem = (itemId: string, updatedData: Partial<InventoryItem>, newStockQuantity?: number) => {
    // Find the original item before updating
    const originalItem = inventoryItems.find(item => item.id === itemId);
    const currentQuantity = getStockQuantity(itemId, selectedLocation);
    
    // Update the item data first
    setInventoryItems(prev => prev.map(item => 
      item.id === itemId ? { ...item, ...updatedData } : item
    ));

    // If stock quantity changed, show note modal
    if (newStockQuantity !== undefined && originalItem) {
      setPendingAdjustment({
        itemId,
        itemName: updatedData.name || originalItem.name,
        oldQuantity: currentQuantity,
        newQuantity: newStockQuantity
      });
      setShowNoteModal(true);
    }
  };

  const handleSaveAdjustmentNote = () => {
    if (!pendingAdjustment) return;

    // Update stock locations
    setStockLocations(prev => {
      const updated = [...prev];
      const index = updated.findIndex(s => s.itemId === pendingAdjustment.itemId && s.location === selectedLocation);
      if (index >= 0) {
        updated[index] = { ...updated[index], quantity: pendingAdjustment.newQuantity };
      } else {
        updated.push({ itemId: pendingAdjustment.itemId, location: selectedLocation, quantity: pendingAdjustment.newQuantity });
      }
      return updated;
    });

    // Add adjustment log
    const newLog: StockAdjustedLog = {
      id: `sadj${Date.now()}`,
      itemId: pendingAdjustment.itemId,
      itemName: pendingAdjustment.itemName,
      oldQuantity: pendingAdjustment.oldQuantity,
      newQuantity: pendingAdjustment.newQuantity,
      reason: adjustmentNote || 'Quantity adjusted',
      adjustedBy: 'Office Admin',
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    };
    setStockAdjustedLogs(prev => [newLog, ...prev]);

    // Reset states
    setShowNoteModal(false);
    setAdjustmentNote('');
    setPendingAdjustment(null);
    
    // Close edit modal if it's open
    if (showEditItemModal) {
      setShowEditItemModal(false);
      setEditingItem(null);
    }
  };

  const handleDeleteItem = () => {
    if (!itemToDelete) return;

    // Remove item from inventory
    setInventoryItems(prev => prev.filter(item => item.id !== itemToDelete.id));

    // Remove all stock locations for this item
    setStockLocations(prev => prev.filter(loc => loc.itemId !== itemToDelete.id));

    // Close modal and reset state
    setShowDeleteModal(false);
    setItemToDelete(null);
  };

  const getAllCategories = () => {
    const baseCategories = itemType === 'part' 
      ? ['HVAC Parts', 'Plumbing', 'Electrical', 'Tools']
      : ['HVAC Services', 'Plumbing Services', 'Electrical Services', 'Maintenance'];
    return [...baseCategories, ...customCategories];
  };

  // Reset to page 1 when filters change
  useEffect(() => {
    setInventoryCurrentPage(1);
  }, [searchQuery, filterCategory, selectedType, selectedLocation, sortBy, sortOrder]);

  return (
    <div className="p-4 md:p-8">
      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="relative flex min-h-[152px] flex-col justify-between bg-white rounded-[20px] border border-[#e2e8f0] p-6" style={{ boxShadow: 'rgba(226, 232, 240, 0.5) 0px 2px 16px 2px' }}>
          <div className="absolute top-6 right-6 inline-flex h-10 w-10 items-center justify-center rounded-full bg-purple-100">
            <DollarSign className="w-5 h-5 text-[#9473ff]" />
          </div>
          <p className="text-sm text-gray-600">Total Value</p>
          <p className="text-3xl font-bold text-[#051046]">${getTotalInventoryValue().toLocaleString()}</p>
          <p className="text-xs text-gray-600">Combined inventory value</p>
        </div>

        <div className="relative flex min-h-[152px] flex-col justify-between bg-white rounded-[20px] border border-[#e2e8f0] p-6" style={{ boxShadow: 'rgba(226, 232, 240, 0.5) 0px 2px 16px 2px' }}>
          <div className="absolute top-6 right-6 inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#A6E4FA]">
            <Package className="w-5 h-5 text-[#399deb]" />
          </div>
          <p className="text-sm text-gray-600">Items in Stock</p>
          <p className="text-3xl font-bold text-[#051046]">{getTotalItemsInStock()}</p>
          <p className="text-xs text-gray-600">Units available across inventory</p>
        </div>

        <div className="relative flex min-h-[152px] flex-col justify-between bg-white rounded-[20px] border border-[#e2e8f0] p-6" style={{ boxShadow: 'rgba(226, 232, 240, 0.5) 0px 2px 16px 2px' }}>
          <div className="absolute top-6 right-6 inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#FFDBE6]">
            <AlertTriangle className="w-5 h-5 text-[#f16a6a]" />
          </div>
          <p className="text-sm text-gray-600">Low Stock Alerts</p>
          <p className="text-3xl font-bold text-[#051046]">{getLowStockCount()}</p>
          <p className="text-xs text-gray-600">Items at or below minimum stock</p>
        </div>

        <div className="relative flex min-h-[152px] flex-col justify-between bg-white rounded-[20px] border border-[#e2e8f0] p-6" style={{ boxShadow: 'rgba(226, 232, 240, 0.5) 0px 2px 16px 2px' }}>
          <div className="absolute top-6 right-6 inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#E2F685]">
            <ArrowBigUpDash className="w-5 h-5 text-[#b9df10]" />
          </div>
          <p className="text-sm text-gray-600">Average Margin</p>
          <p className="text-3xl font-bold text-[#051046]">{getAverageMargin().toFixed(1)}%</p>
          <p className="text-xs text-gray-600">Average markup across items</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-[20px] border border-[#e2e8f0] p-4 md:p-6" style={{ boxShadow: 'rgba(226, 232, 240, 0.5) 0px 2px 16px 2px' }}>
        {/* View Toggle */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div className="flex gap-2">
            <button
              onClick={() => { setSelectedView('parts'); setSelectedType('parts'); }}
              className={`px-4 py-2 rounded-[10px] font-medium transition-colors ${
                selectedView === 'parts'
                  ? 'bg-white border-2 border-[#9473ff] text-[#9473ff]'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border-2 border-transparent'
              }`}
            >
              Parts
            </button>
            <button
              onClick={() => { setSelectedView('services'); setSelectedType('services'); }}
              className={`px-4 py-2 rounded-[10px] font-medium transition-colors ${
                selectedView === 'services'
                  ? 'bg-white border-2 border-[#9473ff] text-[#9473ff]'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border-2 border-transparent'
              }`}
            >
              Services
            </button>
            <button
              onClick={() => setSelectedView('usage')}
              className={`px-4 py-2 rounded-[10px] font-medium transition-colors flex items-center gap-2 ${
                selectedView === 'usage'
                  ? 'bg-white border-2 border-[#9473ff] text-[#9473ff]'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border-2 border-transparent'
              }`}
            >
              <History className="w-4 h-4" />
              Activity
            </button>
          </div>

          <div className="flex gap-2">
            <button 
              onClick={() => setShowBulkTransferModal(true)}
              className="px-4 py-2 bg-white border border-[#9473ff] text-[#9473ff] hover:bg-purple-50 rounded-[32px] font-medium transition-colors flex items-center gap-2"
            >
              <ArrowRightLeft className="w-4 h-4" />
              Transfer Stock
            </button>
            <button
              onClick={() => setShowAddItemModal(true)}
              className="w-[160px] bg-[#9473ff] hover:bg-[#7f5fd9] text-white rounded-[32px] flex items-center justify-center gap-2 text-[16px] px-[24px] py-[10px] transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Item
            </button>
          </div>
        </div>

        {/* Location Selection */}
        <div className="mb-6">
          {/* Location selector removed */}
        </div>

        {/* Parts/Services View */}
        {selectedView !== 'usage' ? (
          <>
            {/* Search and Filters */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search items by name or SKU..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-[#e8e8e8] rounded-[32px] focus:outline-none focus:border-[#9473ff]"
            />
          </div>

          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-4 py-2 border border-[#e8e8e8] rounded-[32px] focus:outline-none focus:border-[#9473ff]"
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>
                {cat === 'all' ? 'All Categories' : cat}
              </option>
            ))}
          </select>

          <select
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
            className="px-4 py-2 border border-[#e8e8e8] rounded-[32px] focus:outline-none focus:border-[#9473ff]"
          >
            <option value="warehouse">Main Warehouse</option>
            {technicians.map(tech => (
              <option key={tech.id} value={tech.name}>{tech.name}</option>
            ))}
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-4 py-2 border border-[#e8e8e8] rounded-[32px] focus:outline-none focus:border-[#9473ff]"
          >
            <option value="name">Sort by Name</option>
            <option value="quantity">Sort by Quantity</option>
            <option value="value">Sort by Value</option>
          </select>

          <button
            onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
            className="px-4 py-2 border border-[#e8e8e8] rounded-[32px] hover:bg-gray-50 transition-colors"
          >
            {sortOrder === 'asc' ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </button>
        </div>

        {/* Inventory Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#e2e8f0]">
                <th className="text-left py-3 px-4 text-sm font-semibold text-[#6a7282] uppercase tracking-wider">Item</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-[#6a7282] uppercase tracking-wider">Type</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-[#6a7282] uppercase tracking-wider">Category</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-[#6a7282] uppercase tracking-wider">SKU</th>
                {selectedType === 'parts' && (
                  <th className="text-center py-3 px-4 text-sm font-semibold text-[#6a7282] uppercase tracking-wider">Quantity</th>
                )}
                <th className="text-left py-3 px-4 text-sm font-semibold text-[#6a7282] uppercase tracking-wider">Price</th>
                {selectedType === 'parts' && (
                  <th className="text-left py-3 px-4 text-sm font-semibold text-[#6a7282] uppercase tracking-wider">Total Value</th>
                )}
                {selectedType === 'parts' && (
                  <th className="text-left py-3 px-4 text-sm font-semibold text-[#6a7282] uppercase tracking-wider">Status</th>
                )}
                <th className="text-center py-3 px-4 text-sm font-semibold text-[#6a7282] uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedItems.map((item) => {
                const location = selectedLocation;
                const quantity = getStockQuantity(item.id, location);
                const totalValue = quantity * item.cost;
                const status = getStockStatus(item, quantity);

                return (
                  <tr key={item.id} className="border-b border-[#e2e8f0] hover:bg-gray-50">
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        {item.type === 'part' && item.itemPhoto ? (
                          <img 
                            src={item.itemPhoto} 
                            alt={item.name}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                        ) : (
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            item.type === 'part' ? 'bg-[#E2F685]' : 'bg-[#E2F685]'
                          }`}>
                            {item.type === 'part' ? (
                              <Box className="w-5 h-5 text-blue-600" />
                            ) : (
                              <Wrench className="w-5 h-5 text-green-600" />
                            )}
                          </div>
                        )}
                        <div>
                          <p className="font-medium text-[#051046]">{item.name}</p>
                          <p className="text-xs text-gray-500">{item.description}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span 
                        className={`px-3 py-1 text-xs font-medium ${
                          item.type === 'part' 
                            ? 'bg-[#A6E4FA] text-[#399deb]' 
                            : 'bg-[#E2F685] text-green-700'
                        }`}
                        style={{ borderRadius: '0.25rem' }}
                      >
                        {item.type === 'part' ? 'Part' : 'Service'}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-600">{item.category}</td>
                    <td className="py-4 px-4 text-sm font-mono text-gray-600">{item.sku}</td>
                    {selectedType === 'parts' && (
                      <td className="py-4 px-4 text-center">
                        <span className="font-semibold text-[#051046]">{quantity}</span>
                      </td>
                    )}
                    <td className="py-4 px-4 text-sm text-gray-600">${item.cost.toFixed(2)}</td>
                    {selectedType === 'parts' && (
                      <td className="py-4 px-4 text-sm font-semibold text-[#051046]">${totalValue.toFixed(2)}</td>
                    )}
                    {selectedType === 'parts' && (
                      <td className="py-4 px-4">
                        <span 
                          className={`px-3 py-1 text-xs font-medium text-white ${
                            status === 'in-stock' 
                              ? 'bg-[#399deb]'
                              : status === 'low-stock'
                              ? 'bg-[#f0a041]'
                              : 'bg-[#f16a6a]'
                          }`}
                          style={{ borderRadius: '0.25rem' }}
                        >
                          {status === 'in-stock' ? 'Good' : status === 'low-stock' ? 'Low' : 'Out'}
                        </span>
                      </td>
                    )}
                    <td className="py-4 px-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => {
                            setEditingItem(item);
                            setShowEditItemModal(true);
                          }}
                          className="p-2 hover:bg-blue-50 rounded-[10px] transition-colors"
                          title="Edit Item"
                        >
                          <Pencil className="w-4 h-4 text-blue-600" />
                        </button>
                        {item.type === 'part' && (
                          <button
                            onClick={() => {
                              setSelectedItem(item);
                              setShowTransferModal(true);
                            }}
                            className="p-2 hover:bg-purple-50 rounded-[10px] transition-colors"
                            title="Transfer Item"
                          >
                            <ArrowRightLeft className="w-4 h-4 text-[#9473ff]" />
                          </button>
                        )}
                        <button
                          onClick={() => {
                            setItemToDelete(item);
                            setShowDeleteModal(true);
                          }}
                          className="p-2 hover:bg-red-50 rounded-[10px] transition-colors"
                          title="Delete Item"
                        >
                          <Trash2 className="w-4 h-4 text-[#f16a6a]" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {paginatedItems.length === 0 && (
            <div className="text-center py-12">
              <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No items found</p>
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && filteredItems.length > 0 && (
          <div className="mt-6">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600">
                Showing {startIndex + 1} to {Math.min(endIndex, filteredItems.length)} of {filteredItems.length} entries
              </p>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setInventoryCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={inventoryCurrentPage === 1}
                  className="p-2 rounded-[10px] border border-[#e2e8f0] text-[#051046] hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                
                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (inventoryCurrentPage <= 3) {
                      pageNum = i + 1;
                    } else if (inventoryCurrentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = inventoryCurrentPage - 2 + i;
                    }
                    
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setInventoryCurrentPage(pageNum)}
                        className={`w-8 h-8 rounded-[10px] text-sm font-medium transition-colors ${
                          inventoryCurrentPage === pageNum
                            ? 'bg-[#9473ff] text-white'
                            : 'border border-[#e2e8f0] text-[#051046] hover:bg-gray-50'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={() => setInventoryCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={inventoryCurrentPage === totalPages}
                  className="p-2 rounded-[10px] border border-[#e2e8f0] text-[#051046] hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}
          </>
        ) : (
          <ActivityTimelineView 
            usageLogs={usageLogs}
            transferLogs={transferLogs}
            stockRestoredLogs={stockRestoredLogs}
            stockAdjustedLogs={stockAdjustedLogs}
            searchQuery={usageSearchQuery}
            setSearchQuery={setUsageSearchQuery}
            sortBy={usageSortBy}
            setSortBy={setUsageSortBy}
            sortOrder={usageSortOrder}
            setSortOrder={setUsageSortOrder}
            currentPage={usageCurrentPage}
            setCurrentPage={setUsageCurrentPage}
            itemsPerPage={usageItemsPerPage}
          />
        )}
      </div>

      {/* Transfer Modal */}
      {showTransferModal && selectedItem && (
        <TransferModal
          item={selectedItem}
          currentLocation={selectedLocation}
          currentQuantity={getStockQuantity(selectedItem.id, selectedLocation)}
          technicians={technicians}
          onTransfer={handleTransfer}
          onClose={() => {
            setShowTransferModal(false);
            setSelectedItem(null);
          }}
        />
      )}

      {/* Bulk Transfer Modal */}
      {showBulkTransferModal && (
        <BulkTransferModal
          items={inventoryItems}
          stockLocations={stockLocations}
          technicians={technicians}
          onTransfer={handleTransfer}
          onClose={() => setShowBulkTransferModal(false)}
        />
      )}

      {/* Add Item Modal */}
      {showAddItemModal && (
        <AddItemModal
          onClose={() => setShowAddItemModal(false)}
          customCategories={customCategories}
          onAddCategory={() => setIsAddingCategory(true)}
        />
      )}

      {/* Edit Item Modal */}
      {showEditItemModal && editingItem && (
        <EditItemModal
          item={editingItem}
          currentLocation={selectedLocation}
          currentStockQuantity={getStockQuantity(editingItem.id, selectedLocation)}
          onClose={() => {
            setShowEditItemModal(false);
            setEditingItem(null);
          }}
          onSave={handleUpdateItem}
          customCategories={customCategories}
          onAddCategory={() => setIsAddingCategory(true)}
        />
      )}

      {/* Add Category Modal */}
      {isAddingCategory && (
        <AddCategoryModal
          onAdd={handleAddCategory}
          onClose={() => setIsAddingCategory(false)}
          value={newCategoryName}
          onChange={setNewCategoryName}
        />
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && itemToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-[20px] border border-[#e2e8f0] p-6 max-w-md w-full" style={{ boxShadow: 'rgba(226, 232, 240, 0.5) 0px 2px 16px 2px' }}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-[#051046]">Delete Item</h2>
              <button onClick={() => setShowDeleteModal(false)} className="p-1 hover:bg-gray-100 rounded-[10px]">
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            <div className="mb-6">
              <div className="flex items-center justify-center mb-4">
                <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center">
                  <Trash2 className="w-8 h-8 text-[#f16a6a]" />
                </div>
              </div>
              <p className="text-center text-gray-700 mb-2">
                Are you sure you want to delete this item?
              </p>
              <div className="p-4 bg-gray-50 rounded-[15px] mt-4">
                <p className="font-semibold text-[#051046]">{itemToDelete.name}</p>
                <p className="text-xs text-gray-500 mt-1">SKU: {itemToDelete.sku}</p>
              </div>
              <p className="text-sm text-[#f16a6a] text-center mt-4">
                This action cannot be undone. All stock data will be permanently removed.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 px-4 py-2 border border-[#e8e8e8] rounded-[32px] font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteItem}
                className="flex-1 px-4 py-2 bg-[#f16a6a] hover:bg-[#e05555] text-white rounded-[32px] font-medium transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Adjustment Note Modal */}
      {showNoteModal && pendingAdjustment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[100] p-4">
          <div className="bg-white rounded-[20px] border border-[#e2e8f0] p-6 max-w-md w-full" style={{ boxShadow: 'rgba(226, 232, 240, 0.5) 0px 2px 16px 2px' }}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-[#051046]">Add Note</h2>
              <button onClick={() => {
                setShowNoteModal(false);
                setAdjustmentNote('');
                setPendingAdjustment(null);
              }} className="p-1 hover:bg-gray-100 rounded-[10px]">
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            <div className="mb-6">
              <div className="p-4 bg-blue-50 rounded-[15px] mb-4">
                <p className="font-medium text-[#051046] mb-2">{pendingAdjustment.itemName}</p>
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <span className="font-semibold">{pendingAdjustment.oldQuantity}</span>
                  <span className="text-gray-400">→</span>
                  <span className="font-semibold">{pendingAdjustment.newQuantity}</span>
                </div>
              </div>

              <label className="block text-sm font-medium text-[#051046] mb-2">
                Reason for adjustment (optional, max 50 characters)
              </label>
              <input
                type="text"
                placeholder="e.g., Physical count adjustment, Found damaged units..."
                value={adjustmentNote}
                onChange={(e) => {
                  if (e.target.value.length <= 50) {
                    setAdjustmentNote(e.target.value);
                  }
                }}
                className="w-full px-4 py-2 border border-[#e8e8e8] rounded-[15px] focus:outline-none focus:border-[#9473ff] placeholder:text-gray-400"
              />
              <p className="text-xs text-gray-500 mt-1 text-right">
                {adjustmentNote.length}/50
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowNoteModal(false);
                  setAdjustmentNote('');
                  setPendingAdjustment(null);
                }}
                className="flex-1 px-4 py-2 border border-[#e8e8e8] rounded-[32px] font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveAdjustmentNote}
                className="flex-1 px-4 py-2 bg-[#9473ff] hover:bg-[#7f5fd9] text-white rounded-[32px] font-medium transition-colors"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Transfer Modal Component
interface TransferModalProps {
  item: InventoryItem;
  currentLocation: string;
  currentQuantity: number;
  technicians: { id: string; name: string; avatar: string }[];
  onTransfer: (from: string, to: string, quantity: number) => void;
  onClose: () => void;
}

function TransferModal({ item, currentLocation, currentQuantity, technicians, onTransfer, onClose }: TransferModalProps) {
  const [selectedDestination, setSelectedDestination] = useState('');
  const [quantity, setQuantity] = useState(1);

  // Get available destinations based on current location
  const getDestinations = () => {
    if (currentLocation === 'warehouse') {
      // From warehouse: can transfer to any technician
      return technicians.map(tech => ({ value: tech.name, label: tech.name }));
    } else {
      // From technician: can transfer to warehouse or other technicians
      const destinations = [{ value: 'warehouse', label: 'Main Warehouse' }];
      technicians
        .filter(tech => tech.name !== currentLocation)
        .forEach(tech => destinations.push({ value: tech.name, label: tech.name }));
      return destinations;
    }
  };

  const destinations = getDestinations();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedDestination && quantity > 0 && quantity <= currentQuantity) {
      onTransfer(currentLocation, selectedDestination, quantity);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-[20px] border border-[#e2e8f0] p-6 max-w-md w-full" style={{ boxShadow: 'rgba(226, 232, 240, 0.5) 0px 2px 16px 2px' }}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-[#051046]">Transfer Item</h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-[10px]">
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Item Info */}
          <div className="mb-6 p-4 bg-gray-50 rounded-[32px]">
            <p className="text-sm text-gray-600 mb-1">Item</p>
            <p className="font-semibold text-[#051046]">{item.name}</p>
            <p className="text-xs text-gray-500 mt-1">SKU: {item.sku}</p>
            <p className="text-sm text-gray-600 mt-2">
              Current location: <span className="font-semibold text-[#051046]">{currentLocation === 'warehouse' ? 'Main Warehouse' : currentLocation}</span>
            </p>
            <p className="text-sm text-gray-600 mt-1">
              Available quantity: <span className="font-semibold text-[#051046]">{currentQuantity}</span>
            </p>
          </div>

          {/* Select Destination */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-[#051046] mb-2">
              Transfer to
            </label>
            <select
              value={selectedDestination}
              onChange={(e) => setSelectedDestination(e.target.value)}
              required
              className="w-full px-4 py-2 border border-[#e8e8e8] rounded-[32px] focus:outline-none focus:border-[#9473ff]"
            >
              <option value="">Select destination...</option>
              {destinations.map(dest => (
                <option key={dest.value} value={dest.value}>{dest.label}</option>
              ))}
            </select>
          </div>

          {/* Quantity */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-[#051046] mb-2">
              Quantity
            </label>
            <input
              type="number"
              min="1"
              max={currentQuantity}
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
              required
              className="w-full px-4 py-2 border border-[#e8e8e8] rounded-[32px] focus:outline-none focus:border-[#9473ff]"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-[#e8e8e8] rounded-[32px] font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!selectedDestination || quantity <= 0 || quantity > currentQuantity}
              className="flex-1 px-4 py-2 bg-[#9473ff] hover:bg-[#7f5fd9] text-white rounded-[32px] font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Transfer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Bulk Transfer Modal Component
interface BulkTransferModalProps {
  items: InventoryItem[];
  stockLocations: StockLocation[];
  technicians: { id: string; name: string; avatar: string }[];
  onTransfer: (from: string, to: string, quantity: number) => void;
  onClose: () => void;
}

function BulkTransferModal({ items, stockLocations, technicians, onTransfer, onClose }: BulkTransferModalProps) {
  const [selectedTech, setSelectedTech] = useState('');
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [quantity, setQuantity] = useState(1);

  const getStockQuantity = (itemId: string, location: string): number => {
    const stock = stockLocations.find(s => s.itemId === itemId && s.location === location);
    return stock?.quantity || 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedTech && selectedItem && quantity > 0 && quantity <= getStockQuantity(selectedItem.id, 'warehouse')) {
      onTransfer('warehouse', selectedTech, quantity);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-[20px] border border-[#e2e8f0] p-6 max-w-md w-full" style={{ boxShadow: 'rgba(226, 232, 240, 0.5) 0px 2px 16px 2px' }}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-[#051046]">Bulk Transfer Item</h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-[10px]">
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Item Info */}
          <div className="mb-6 p-4 bg-gray-50 rounded-[15px]">
            <p className="text-sm text-gray-600 mb-1">Item</p>
            <select
              value={selectedItem?.id || ''}
              onChange={(e) => setSelectedItem(items.find(item => item.id === e.target.value) || null)}
              required
              className="w-full px-4 py-2 border border-[#e8e8e8] rounded-[15px] focus:outline-none focus:border-[#9473ff]"
            >
              <option value="">Select item...</option>
              {items.map(item => (
                <option key={item.id} value={item.id}>{item.name} (SKU: {item.sku})</option>
              ))}
            </select>
            {selectedItem && (
              <p className="text-sm text-gray-600 mt-2">
                Available in warehouse: <span className="font-semibold text-[#051046]">{getStockQuantity(selectedItem.id, 'warehouse')}</span>
              </p>
            )}
          </div>

          {/* Select Technician */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-[#051046] mb-2">
              Transfer to Technician
            </label>
            <select
              value={selectedTech}
              onChange={(e) => setSelectedTech(e.target.value)}
              required
              className="w-full px-4 py-2 border border-[#e8e8e8] rounded-[15px] focus:outline-none focus:border-[#9473ff]"
            >
              <option value="">Select technician...</option>
              {technicians.map(tech => (
                <option key={tech.id} value={tech.name}>{tech.name}</option>
              ))}
            </select>
          </div>

          {/* Quantity */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-[#051046] mb-2">
              Quantity
            </label>
            <input
              type="number"
              min="1"
              max={selectedItem ? getStockQuantity(selectedItem.id, 'warehouse') : 0}
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
              required
              className="w-full px-4 py-2 border border-[#e8e8e8] rounded-[15px] focus:outline-none focus:border-[#9473ff]"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-[#e8e8e8] rounded-[15px] font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!selectedTech || !selectedItem || quantity <= 0 || quantity > getStockQuantity(selectedItem.id, 'warehouse')}
              className="flex-1 px-4 py-2 bg-[#9473ff] hover:bg-[#7f5fd9] text-white rounded-[15px] font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Transfer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Add Item Modal Component
interface AddItemModalProps {
  onClose: () => void;
  customCategories: string[];
  onAddCategory: () => void;
}

function AddItemModal({ onClose, customCategories, onAddCategory }: AddItemModalProps) {
  const [itemType, setItemType] = useState<ItemType>('part');
  const [name, setName] = useState('');
  const [minStockLevel, setMinStockLevel] = useState(0);
  const [stockQuantity, setStockQuantity] = useState(0);
  const [sku, setSku] = useState('');
  const [cost, setCost] = useState('');
  const [markupType, setMarkupType] = useState<'percentage' | 'dollar'>('percentage');
  const [markupValue, setMarkupValue] = useState('');
  const [price, setPrice] = useState('');
  const [taxable, setTaxable] = useState('');
  const [category, setCategory] = useState('');
  const [brand, setBrand] = useState('');
  const [description, setDescription] = useState('');
  const [lastModified, setLastModified] = useState<'markup' | 'price' | null>(null);

  // Calculate price when cost or markup changes
  useEffect(() => {
    if (lastModified === 'markup') {
      const costNum = parseFloat(cost) || 0;
      const markupNum = parseFloat(markupValue) || 0;

      if (costNum > 0 && markupNum > 0) {
        let calculatedPrice = 0;
        if (markupType === 'percentage') {
          calculatedPrice = costNum + (costNum * (markupNum / 100));
        } else {
          calculatedPrice = costNum + markupNum;
        }
        setPrice(calculatedPrice.toFixed(2));
      }
    }
  }, [cost, markupType, markupValue, lastModified]);

  // Calculate markup percentage when price changes
  useEffect(() => {
    if (lastModified === 'price') {
      const costNum = parseFloat(cost) || 0;
      const priceNum = parseFloat(price) || 0;

      if (costNum > 0 && priceNum > 0) {
        const markupPercentage = ((priceNum - costNum) / costNum * 100);
        setMarkupType('percentage');
        setMarkupValue(markupPercentage.toFixed(2));
      }
    }
  }, [cost, price, lastModified]);

  const getAllCategories = () => {
    const baseCategories = itemType === 'part' 
      ? ['HVAC Parts', 'Plumbing', 'Electrical', 'Tools']
      : ['HVAC Services', 'Plumbing Services', 'Electrical Services', 'Maintenance'];
    return [...baseCategories, ...customCategories];
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-[20px] border border-[#e2e8f0] p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto" style={{ boxShadow: 'rgba(226, 232, 240, 0.5) 0px 2px 16px 2px' }}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-[#051046]">Add Part or Service</h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-[10px]">
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Type Toggle */}
        <div className="mb-6 p-4 bg-purple-50 border border-purple-200 rounded-[15px]">
          <p className="text-sm text-[#051046] mb-3 font-medium text-center">What are you adding?</p>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setItemType('part')}
              className={`flex-1 px-4 py-3 rounded-[32px] font-medium transition-colors flex items-center justify-center gap-2 ${
                itemType === 'part'
                  ? 'bg-[#9473ff] text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-[#e8e8e8]'
              }`}
            >
              <Box className="w-4 h-4" />
              Parts/Products
            </button>
            <button
              type="button"
              onClick={() => setItemType('service')}
              className={`flex-1 px-4 py-3 rounded-[32px] font-medium transition-colors flex items-center justify-center gap-2 ${
                itemType === 'service'
                  ? 'bg-[#9473ff] text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-[#e8e8e8]'
              }`}
            >
              <Wrench className="w-4 h-4" />
              Service/Plans
            </button>
          </div>
          <p className="text-xs text-gray-600 mt-2 text-center">
            {itemType === 'part' 
              ? 'Parts are physical items tracked in inventory (HVAC filters, pipes, etc.)'
              : 'Services and plans are the work or recurring offerings you provide (diagnostics, repairs, maintenance, memberships)'}
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Name */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-[#051046] mb-2">
              Name
            </label>
            <input
              type="text"
              placeholder={itemType === 'part' ? 'Product name' : 'Service name'}
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-4 py-2 border border-[#e8e8e8] rounded-[15px] focus:outline-none focus:border-[#9473ff] placeholder:text-gray-400"
            />
          </div>

          {/* Quantity - Only for parts */}
          {itemType === 'part' && (
            <>
              <div className="mb-4">
                <label className="block text-sm font-medium text-[#051046] mb-2">
                  Minimum Stock Level
                </label>
                <input
                  type="number"
                  placeholder="Min quantity"
                  value={minStockLevel}
                  onChange={(e) => setMinStockLevel(parseInt(e.target.value) || 0)}
                  required
                  className="w-full px-4 py-2 border border-[#e8e8e8] rounded-[15px] focus:outline-none focus:border-[#9473ff] placeholder:text-gray-400"
                />
                <p className="text-xs text-gray-500 mt-1">Status: Good (above), Low (at/below), Out (zero)</p>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-[#051046] mb-2">
                  Current Stock Quantity (Warehouse)
                </label>
                <input
                  type="number"
                  placeholder="Current quantity"
                  value={stockQuantity}
                  onChange={(e) => setStockQuantity(parseInt(e.target.value) || 0)}
                  required
                  className="w-full px-4 py-2 border border-[#e8e8e8] rounded-[15px] focus:outline-none focus:border-[#9473ff] placeholder:text-gray-400"
                />
                <p className="text-xs text-gray-500 mt-1">Set the quantity currently on hand</p>
              </div>
            </>
          )}

          {/* SKU */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-[#051046] mb-2">
              SKU
            </label>
            <input
              type="text"
              placeholder="SKU"
              value={sku}
              onChange={(e) => setSku(e.target.value)}
              required
              className="w-full px-4 py-2 border border-[#e8e8e8] rounded-[15px] focus:outline-none focus:border-[#9473ff] placeholder:text-gray-400"
            />
          </div>

          {/* Cost */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-[#051046] mb-2">
              {itemType === 'part' ? 'Unit Cost' : 'Service Cost'}
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
              <input
                type="text"
                placeholder="0.00"
                value={cost}
                onChange={(e) => setCost(e.target.value)}
                required
                className="w-full pl-8 pr-4 py-2 border border-[#e8e8e8] rounded-[15px] focus:outline-none focus:border-[#9473ff] placeholder:text-gray-400"
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {itemType === 'part' ? 'What you pay for this part' : 'Your cost to provide this service (labor, overhead, etc.)'}
            </p>
          </div>

          {/* Markup */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-[#051046] mb-2">
              Markup
            </label>
            <div className="flex gap-2">
              <select
                value={markupType}
                onChange={(e) => {
                  setMarkupType(e.target.value as 'percentage' | 'dollar');
                  setLastModified('markup');
                }}
                className="px-4 py-2 border border-[#e8e8e8] rounded-[15px] focus:outline-none focus:border-[#9473ff] text-gray-700"
              >
                <option value="percentage">%</option>
                <option value="dollar">$</option>
              </select>
              <input
                type="text"
                placeholder="0.00"
                value={markupValue}
                onChange={(e) => {
                  setMarkupValue(e.target.value);
                  setLastModified('markup');
                }}
                className="w-full px-4 py-2 border border-[#e8e8e8] rounded-[15px] focus:outline-none focus:border-[#9473ff] placeholder:text-gray-400"
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Add your profit margin
            </p>
          </div>

          {/* Price */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-[#051046] mb-2">
              {itemType === 'part' ? 'Customer Price' : 'Customer Price'}
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
              <input
                type="text"
                placeholder="0.00"
                value={price}
                onChange={(e) => {
                  setPrice(e.target.value);
                  setLastModified('price');
                }}
                required
                className="w-full pl-8 pr-4 py-2 border border-[#e8e8e8] rounded-[15px] focus:outline-none focus:border-[#9473ff] placeholder:text-gray-400 bg-purple-50"
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              This price will appear on invoices and estimates for customers
            </p>
          </div>

          {/* Taxable */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-[#051046] mb-2">
              Taxable
            </label>
            <select
              value={taxable}
              onChange={(e) => setTaxable(e.target.value)}
              className="w-full px-4 py-2 border border-[#e8e8e8] rounded-[15px] focus:outline-none focus:border-[#9473ff] text-gray-700"
            >
              <option value="">Select tax status...</option>
              <option value="taxable">Taxable</option>
              <option value="non-taxable">Non-Taxable</option>
              <option value="tax-exempt">Tax Exempt</option>
            </select>
          </div>

          {/* Category */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-[#051046] mb-2">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-2 border border-[#e8e8e8] rounded-[15px] focus:outline-none focus:border-[#9473ff] text-gray-700"
            >
              <option value="">Select category...</option>
              {getAllCategories().map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            <button 
              type="button" 
              className="mt-2 text-sm text-[#9473ff] hover:text-[#7f5fd9] font-medium" 
              onClick={onAddCategory}
            >
              + Add new category
            </button>
          </div>

          {/* Brand - Only for parts */}
          {itemType === 'part' && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-[#051046] mb-2">
                Brand
              </label>
              <input
                type="text"
                placeholder="Brand"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                className="w-full px-4 py-2 border border-[#e8e8e8] rounded-[15px] focus:outline-none focus:border-[#9473ff] placeholder:text-gray-400"
              />
            </div>
          )}

          {/* Description */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-[#051046] mb-2">
              Description
            </label>
            <textarea
              placeholder="Enter description..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="w-full px-4 py-2 border border-[#e8e8e8] rounded-[15px] focus:outline-none focus:border-[#9473ff] placeholder:text-gray-400 resize-none"
            />
            <p className="text-xs text-gray-500 mt-1">
              Short, simple descriptions are recommended since these will be displayed in estimates and invoices for your clients.
            </p>
          </div>

          {/* Image - Only for parts */}
          {itemType === 'part' && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-[#051046] mb-2">
                Image
              </label>
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center bg-gray-50 hover:bg-gray-100 cursor-pointer transition-colors">
                  <Plus className="w-6 h-6 text-gray-400" />
                </div>
                <p className="text-xs text-gray-500">
                  Upload an image of the part<br />
                  (Optional)
                </p>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-[#e8e8e8] rounded-[15px] font-medium text-[#051046] hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-3 bg-[#9473ff] hover:bg-[#7f5fd9] text-white rounded-[32px] font-medium transition-colors"
            >
              Save {itemType === 'part' ? 'Part' : 'Service'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Edit Item Modal Component
interface EditItemModalProps {
  item: InventoryItem;
  currentLocation: string;
  currentStockQuantity: number;
  onClose: () => void;
  onSave: (itemId: string, updatedData: Partial<InventoryItem>, newStockQuantity?: number) => void;
  customCategories: string[];
  onAddCategory: () => void;
}

function EditItemModal({ item, currentLocation, currentStockQuantity, onClose, onSave, customCategories, onAddCategory }: EditItemModalProps) {
  const [itemType, setItemType] = useState<ItemType>(item.type);
  const [name, setName] = useState(item.name);
  const [quantity, setQuantity] = useState(item.type === 'part' ? item.minStockLevel : 0);
  const [stockQuantity, setStockQuantity] = useState(currentStockQuantity);
  const [sku, setSku] = useState(item.sku);
  const [cost, setCost] = useState(item.unitPrice.toString());
  const [markupType, setMarkupType] = useState<'percentage' | 'dollar'>('percentage');
  const [markupValue, setMarkupValue] = useState('');
  const [price, setPrice] = useState(item.cost.toString());
  const [taxable, setTaxable] = useState('');
  const [category, setCategory] = useState(item.category);
  const [brand, setBrand] = useState('');
  const [description, setDescription] = useState(item.description);
  const [lastModified, setLastModified] = useState<'markup' | 'price' | null>(null);

  // Calculate price when cost or markup changes
  useEffect(() => {
    if (lastModified === 'markup') {
      const costNum = parseFloat(cost) || 0;
      const markupNum = parseFloat(markupValue) || 0;

      if (costNum > 0 && markupNum > 0) {
        let calculatedPrice = 0;
        if (markupType === 'percentage') {
          calculatedPrice = costNum + (costNum * (markupNum / 100));
        } else {
          calculatedPrice = costNum + markupNum;
        }
        setPrice(calculatedPrice.toFixed(2));
      }
    }
  }, [cost, markupType, markupValue, lastModified]);

  // Calculate markup percentage when price changes
  useEffect(() => {
    if (lastModified === 'price') {
      const costNum = parseFloat(cost) || 0;
      const priceNum = parseFloat(price) || 0;

      if (costNum > 0 && priceNum > 0) {
        const markupPercentage = ((priceNum - costNum) / costNum * 100);
        setMarkupType('percentage');
        setMarkupValue(markupPercentage.toFixed(2));
      }
    }
  }, [cost, price, lastModified]);

  const getAllCategories = () => {
    const baseCategories = itemType === 'part' 
      ? ['HVAC Parts', 'Plumbing', 'Electrical', 'Tools']
      : ['HVAC Services', 'Plumbing Services', 'Electrical Services', 'Maintenance'];
    return [...baseCategories, ...customCategories];
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Create updated item data
    const updatedData: Partial<InventoryItem> = {
      name,
      type: itemType,
      category,
      sku,
      unitPrice: parseFloat(cost) || 0,
      cost: parseFloat(price) || 0,
      minStockLevel: quantity,
      description,
    };
    
    // Check if stock quantity actually changed (compare as numbers)
    const hasStockChanged = itemType === 'part' && stockQuantity !== currentStockQuantity;
    
    // Pass the new stock quantity if it changed
    onSave(item.id, updatedData, hasStockChanged ? stockQuantity : undefined);
    
    // Only close if stock quantity didn't change (note modal will handle closing if it did)
    if (!hasStockChanged) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-[20px] border border-[#e2e8f0] p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto" style={{ boxShadow: 'rgba(226, 232, 240, 0.5) 0px 2px 16px 2px' }}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-[#051046]">Edit {itemType === 'part' ? 'Part' : 'Service'}</h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-[10px]">
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Name */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-[#051046] mb-2">
              Name
            </label>
            <input
              type="text"
              placeholder={itemType === 'part' ? 'Product name' : 'Service name'}
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-4 py-2 border border-[#e8e8e8] rounded-[15px] focus:outline-none focus:border-[#9473ff] placeholder:text-gray-400"
            />
          </div>

          {/* Quantity - Only for parts */}
          {itemType === 'part' && (
            <>
              <div className="mb-4">
                <label className="block text-sm font-medium text-[#051046] mb-2">
                  Minimum Stock Level
                </label>
                <input
                  type="number"
                  placeholder="Min quantity"
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value) || 0)}
                  required
                  className="w-full px-4 py-2 border border-[#e8e8e8] rounded-[15px] focus:outline-none focus:border-[#9473ff] placeholder:text-gray-400"
                />
                <p className="text-xs text-gray-500 mt-1">Status: Good (above), Low (at/below), Out (zero)</p>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-[#051046] mb-2">
                  Current Stock Quantity ({currentLocation === 'warehouse' ? 'Warehouse' : currentLocation})
                </label>
                <input
                  type="number"
                  placeholder="Current quantity"
                  value={stockQuantity}
                  onChange={(e) => setStockQuantity(parseInt(e.target.value) || 0)}
                  required
                  className="w-full px-4 py-2 border border-[#e8e8e8] rounded-[15px] focus:outline-none focus:border-[#9473ff] placeholder:text-gray-400"
                />
                <p className="text-xs text-gray-500 mt-1">Adjust the actual quantity in stock</p>
              </div>
            </>
          )}

          {/* SKU */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-[#051046] mb-2">
              SKU
            </label>
            <input
              type="text"
              placeholder="SKU"
              value={sku}
              onChange={(e) => setSku(e.target.value)}
              required
              className="w-full px-4 py-2 border border-[#e8e8e8] rounded-[15px] focus:outline-none focus:border-[#9473ff] placeholder:text-gray-400"
            />
          </div>

          {/* Cost */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-[#051046] mb-2">
              {itemType === 'part' ? 'Unit Cost' : 'Service Cost'}
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
              <input
                type="text"
                placeholder="0.00"
                value={cost}
                onChange={(e) => {
                  setCost(e.target.value);
                }}
                required
                className="w-full pl-8 pr-4 py-2 border border-[#e8e8e8] rounded-[15px] focus:outline-none focus:border-[#9473ff] placeholder:text-gray-400"
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {itemType === 'part' ? 'What you pay for this part' : 'Your cost to provide this service (labor, overhead, etc.)'}
            </p>
          </div>

          {/* Markup */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-[#051046] mb-2">
              Markup
            </label>
            <div className="flex gap-2">
              <select
                value={markupType}
                onChange={(e) => {
                  setMarkupType(e.target.value as 'percentage' | 'dollar');
                  setLastModified('markup');
                }}
                className="px-4 py-2 border border-[#e8e8e8] rounded-[15px] focus:outline-none focus:border-[#9473ff] text-gray-700"
              >
                <option value="percentage">%</option>
                <option value="dollar">$</option>
              </select>
              <input
                type="text"
                placeholder="0.00"
                value={markupValue}
                onChange={(e) => {
                  setMarkupValue(e.target.value);
                  setLastModified('markup');
                }}
                className="w-full px-4 py-2 border border-[#e8e8e8] rounded-[15px] focus:outline-none focus:border-[#9473ff] placeholder:text-gray-400"
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Add your profit margin
            </p>
          </div>

          {/* Price */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-[#051046] mb-2">
              {itemType === 'part' ? 'Customer Price' : 'Customer Price'}
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
              <input
                type="text"
                placeholder="0.00"
                value={price}
                onChange={(e) => {
                  setPrice(e.target.value);
                  setLastModified('price');
                }}
                required
                className="w-full pl-8 pr-4 py-2 border border-[#e8e8e8] rounded-[15px] focus:outline-none focus:border-[#9473ff] placeholder:text-gray-400 bg-purple-50"
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              This price will appear on invoices and estimates for customers
            </p>
          </div>

          {/* Taxable */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-[#051046] mb-2">
              Taxable
            </label>
            <select
              value={taxable}
              onChange={(e) => setTaxable(e.target.value)}
              className="w-full px-4 py-2 border border-[#e8e8e8] rounded-[15px] focus:outline-none focus:border-[#9473ff] text-gray-700"
            >
              <option value="">Select tax status...</option>
              <option value="taxable">Taxable</option>
              <option value="non-taxable">Non-Taxable</option>
              <option value="tax-exempt">Tax Exempt</option>
            </select>
          </div>

          {/* Category */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-[#051046] mb-2">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-2 border border-[#e8e8e8] rounded-[15px] focus:outline-none focus:border-[#9473ff] text-gray-700"
            >
              <option value="">Select category...</option>
              {getAllCategories().map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            <button 
              type="button" 
              className="mt-2 text-sm text-[#9473ff] hover:text-[#7f5fd9] font-medium" 
              onClick={onAddCategory}
            >
              + Add new category
            </button>
          </div>

          {/* Brand - Only for parts */}
          {itemType === 'part' && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-[#051046] mb-2">
                Brand
              </label>
              <input
                type="text"
                placeholder="Brand"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                className="w-full px-4 py-2 border border-[#e8e8e8] rounded-[15px] focus:outline-none focus:border-[#9473ff] placeholder:text-gray-400"
              />
            </div>
          )}

          {/* Description */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-[#051046] mb-2">
              Description
            </label>
            <textarea
              placeholder="Enter description..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="w-full px-4 py-2 border border-[#e8e8e8] rounded-[15px] focus:outline-none focus:border-[#9473ff] placeholder:text-gray-400 resize-none"
            />
            <p className="text-xs text-gray-500 mt-1">
              Short, simple descriptions are recommended since these will be displayed in estimates and invoices for your clients.
            </p>
          </div>

          {/* Image - Only for parts */}
          {itemType === 'part' && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-[#051046] mb-2">
                Image
              </label>
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center bg-gray-50 hover:bg-gray-100 cursor-pointer transition-colors">
                  <Plus className="w-6 h-6 text-gray-400" />
                </div>
                <p className="text-xs text-gray-500">
                  Upload an image of the part<br />
                  (Optional)
                </p>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-[#e8e8e8] rounded-[15px] font-medium text-[#051046] hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-3 bg-[#9473ff] hover:bg-[#7f5fd9] text-white rounded-[32px] font-medium transition-colors"
            >
              Save {itemType === 'part' ? 'Part' : 'Service'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Add Category Modal Component
interface AddCategoryModalProps {
  onAdd: () => void;
  onClose: () => void;
  value: string;
  onChange: (value: string) => void;
}

function AddCategoryModal({ onAdd, onClose, value, onChange }: AddCategoryModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-[20px] border border-[#e2e8f0] p-6 max-w-md w-full" style={{ boxShadow: 'rgba(226, 232, 240, 0.5) 0px 2px 16px 2px' }}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-[#051046]">Add New Category</h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-[10px]">
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        <form onSubmit={onAdd}>
          {/* Category Name */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-[#051046] mb-2">
              Category Name
            </label>
            <input
              type="text"
              placeholder="Enter category name..."
              value={value}
              onChange={(e) => onChange(e.target.value)}
              required
              className="w-full px-4 py-2 border border-[#e8e8e8] rounded-[15px] focus:outline-none focus:border-[#9473ff] placeholder:text-gray-400"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-[#e8e8e8] rounded-[15px] font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!value.trim()}
              className="flex-1 px-4 py-2 bg-[#9473ff] hover:bg-[#7f5fd9] text-white rounded-[15px] font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Add Category
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
