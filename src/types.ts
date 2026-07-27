export type ItemStatus = 'ok' | 'attention' | 'damaged' | 'na';

export type DamageSeverity = 'leve' | 'media' | 'grave';

export interface ChecklistItem {
  id: string;
  label: string;
  category?: string;
  status: ItemStatus;
  notes?: string;
}

export interface RoomChecklist {
  id: string;
  name: string;
  iconName: string;
  items: ChecklistItem[];
  photos: string[]; // Base64 or image URLs
  completed: boolean;
}

export interface InventoryItem {
  id: string;
  name: string;
  category: 'banheiro' | 'cozinha' | 'boas_vindas' | 'limpeza';
  currentQty: number;
  minimumQty: number;
  unit: string;
  status: 'suficiente' | 'repor' | 'urgente';
  notes?: string;
}

export interface LinenItem {
  id: string;
  name: string; // ex: "Jogo Cama Casal", "Toalha de Banho"
  category: 'cama' | 'banho' | 'mesa_cozinha';
  quantityInstalled: number;
  quantityLaundry: number;
  stainedOrDamagedQty: number;
  condition: 'excelente' | 'bom' | 'requer_substituicao';
  notes?: string;
}

export interface DamageReport {
  id: string;
  itemOrArea: string;
  roomName: string;
  severity: DamageSeverity;
  description: string;
  photos: string[];
  estimatedCost?: number;
  requiresImmediateNotice: boolean;
  notifiedOwnerAt?: string;
}

export interface Property {
  id: string;
  name: string;
  address: string;
  wifiName?: string;
  wifiPass?: string;
}

export interface CleanerInfo {
  name: string;
  phone: string;
}

export interface InspectionReport {
  id: string;
  propertyId: string;
  propertyName: string;
  propertyAddress: string;
  wifiName?: string;
  wifiPass?: string;
  
  inspectionDate: string;
  startTime: string;
  endTime?: string;
  
  cleanerName: string;
  cleanerPhone: string;
  
  rooms: RoomChecklist[];
  inventory: InventoryItem[];
  linen: LinenItem[];
  damageReports: DamageReport[];
  generalPhotos: string[];
  
  generalNotes?: string;
  signatureDataUrl?: string;
  signatureTimestamp?: string;
  
  status: 'em_andamento' | 'concluido' | 'enviado_proprietario';
  createdAt: string;
  updatedAt: string;
}
