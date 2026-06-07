export interface Anchor {
  id: string;
  name: string;
  avatar: string;
  level: number;
  followers: number;
  avgViewers: number;
  category: string;
}

export type LiveStatus = 'live' | 'waiting' | 'ended';
export type Quality = 'hd' | 'sd' | 'fhd';

export interface LiveRoom {
  id: string;
  title: string;
  anchor: Anchor;
  category: string;
  status: LiveStatus;
  viewers: number;
  peakViewers: number;
  duration: number;
  isStarred: boolean;
  starColor?: string;
  coverUrl: string;
  quality: Quality;
  danmakuSpeed: number;
  startTime: string;
}

export type CommentType = 'normal' | 'question' | 'gift' | 'system';

export interface Comment {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  content: string;
  timestamp: string;
  isPinned: boolean;
  isHighlighted: boolean;
  type: CommentType;
  likeCount: number;
}

export type ProductStatus = 'pending' | 'explaining' | 'done';

export interface Product {
  id: string;
  name: string;
  image: string;
  price: number;
  originalPrice: number;
  stock: number;
  soldCount: number;
  clickCount: number;
  status: ProductStatus;
  explainDuration: number;
  explainStartTime?: string;
  order: number;
}

export type RiskType = 'violence' | 'porn' | 'politics' | 'fraud' | 'copyright' | 'other';
export type RiskLevel = 'low' | 'medium' | 'high' | 'critical';
export type RiskStatus = 'pending' | 'processing' | 'resolved' | 'false_alarm';

export interface RiskNote {
  id: string;
  content: string;
  author: string;
  timestamp: string;
}

export interface RiskAlert {
  id: string;
  roomId: string;
  roomTitle: string;
  type: RiskType;
  level: RiskLevel;
  description: string;
  screenshotUrl?: string;
  timestamp: string;
  status: RiskStatus;
  handler?: string;
  handleTime?: string;
  notes: RiskNote[];
}

export type OralType = 'discount' | 'coupon' | 'reminder' | 'other';

export interface OralBroadcast {
  id: string;
  roomId: string;
  productId?: string;
  productName?: string;
  content: string;
  timestamp: string;
  type: OralType;
  effect?: {
    clickIncrease: number;
    orderIncrease: number;
  };
}

export type StaffRole = 'moderator' | 'supervisor' | 'manager';

export interface Staff {
  id: string;
  name: string;
  avatar: string;
  role: StaffRole;
  phone: string;
  isOnline: boolean;
}

export interface Shift {
  id: string;
  name: string;
  startTime: string;
  endTime: string;
  members: Staff[];
  responsibilities: string[];
}

export interface Schedule {
  id: string;
  date: string;
  shifts: Shift[];
}

export interface TimePoint {
  time: string;
  value: number;
}

export interface AnalyticsMetrics {
  peakViewers: number;
  avgViewers: number;
  totalViewers: number;
  newFollowers: number;
  interactionRate: number;
  productClicks: number;
  orders: number;
  gmv: number;
  conversionRate: number;
}

export interface AnalyticsData {
  roomId: string;
  roomTitle: string;
  date: string;
  metrics: AnalyticsMetrics;
  viewerTrend: TimePoint[];
  conversionTrend: TimePoint[];
}

export interface FrequentComment {
  id: string;
  keyword: string;
  count: number;
  comments: string[];
}
