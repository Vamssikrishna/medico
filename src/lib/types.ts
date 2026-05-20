export type UserTier = "guest" | "user" | "prime";

export type AuthUser = {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;
  tier: Exclude<UserTier, "guest">;
  provider?: "email-otp" | "google" | "apple";
  biometricUnlock?: boolean;
};

export type FamilyMember = {
  id: string;
  relation: string;
  name: string;
  age?: number;
  notes?: string;
};

export type HealthProfile = {
  diabetes?: boolean;
  bpIssues?: boolean;
  allergies?: string[];
  chronic?: string[];
};

export type EmergencyContact = {
  name: string;
  phone: string;
};

export type UserProfile = {
  phone?: string;
  age?: number;
  gender?: string;
  addresses: Array<{
    id: string;
    label: string;
    line1: string;
    city: string;
    pin: string;
    isDefault?: boolean;
  }>;
  emergencyContacts: EmergencyContact[];
  health?: HealthProfile;
  family: FamilyMember[];
};

export type Category = {
  id: string;
  name: string;
  /** Short label shown in category chips (avoid emoji in clinical UI). */
  abbr: string;
  slug: string;
};

export type Medicine = {
  id: string;
  slug: string;
  brand: string;
  genericSalts: string[];
  strength: string;
  form: string;
  mrp: number;
  discountedPrice?: number;
  manufacturer: string;
  usesSummary: string;
  simplifiedAi: string;
  storageInstructions: string;
  commonSideEffects: string[];
  severeRisks: string[];
  whenToConsult: string[];
  prescriptionsRequired?: boolean;
  restrictedAge?: number;
  temperatureSensitive?: boolean;
  symptoms: string[];
  interactions: Array<{ with: string; message: string; severity: "info" | "warn" | "danger" }>;
  pharmacyName?: string;
  stockQty?: number;
  etaMin?: number;
  uploadedAt?: string;
};

export type Pharmacy = {
  id: string;
  name: string;
  distanceKm: number;
  rating: number;
  etaMin: number;
  open: boolean;
  stockScore: number;
};

export type BannerItem = {
  id: string;
  title: string;
  subtitle: string;
  tone: "season" | "offer" | "alert";
  cta?: string;
  href?: string;
};

export type CartLine = {
  medicineId: string;
  qty: number;
};

export type PrescriptionStatus = "pending" | "ai_review" | "pharmacist" | "approved" | "rejected";

export type Prescription = {
  id: string;
  uploadedAt: string;
  fileName: string;
  status: PrescriptionStatus;
  extracted?: {
    doctor?: string;
    medicines: string[];
    duration?: string;
  };
};

export type OrderStatus =
  | "placed"
  | "packed"
  | "rider_assigned"
  | "out_for_delivery"
  | "delivered"
  | "cancelled";

export type Order = {
  id: string;
  placedAt: string;
  status: OrderStatus;
  etaMin: number;
  deliveryOtp: string;
  items: Array<{ medicineId: string; name: string; qty: number; price: number }>;
  pharmacyName: string;
  riderName?: string;
  batchId?: string;
};
