import type { AnalyticsData } from '@/types';

const generateTrendData = (baseValue: number, variance: number, count: number) => {
  const data = [];
  const now = new Date();
  for (let i = count - 1; i >= 0; i--) {
    const time = new Date(now.getTime() - i * 300000); // 每5分钟一个点
    const value = Math.floor(baseValue + (Math.random() - 0.5) * variance * 2);
    data.push({
      time: `${time.getHours().toString().padStart(2, '0')}:${time.getMinutes().toString().padStart(2, '0')}`,
      value: Math.max(0, value),
    });
  }
  return data;
};

export const analyticsData: AnalyticsData[] = [
  {
    roomId: 'room-001',
    roomTitle: '618年中大促 美妆专场',
    date: new Date().toISOString().split('T')[0],
    metrics: {
      peakViewers: 68520,
      avgViewers: 45680,
      totalViewers: 356780,
      newFollowers: 12580,
      interactionRate: 38.5,
      productClicks: 89560,
      orders: 3560,
      gmv: 289600,
      conversionRate: 3.98,
    },
    viewerTrend: generateTrendData(50000, 15000, 24),
    conversionTrend: generateTrendData(120, 50, 24),
  },
  {
    roomId: 'room-002',
    roomTitle: '数码新品首发 限时优惠',
    date: new Date().toISOString().split('T')[0],
    metrics: {
      peakViewers: 125600,
      avgViewers: 89200,
      totalViewers: 689200,
      newFollowers: 28900,
      interactionRate: 45.2,
      productClicks: 156800,
      orders: 8950,
      gmv: 1256800,
      conversionRate: 5.71,
    },
    viewerTrend: generateTrendData(90000, 25000, 24),
    conversionTrend: generateTrendData(200, 80, 24),
  },
  {
    roomId: 'room-003',
    roomTitle: '美食探店 家乡味道',
    date: new Date().toISOString().split('T')[0],
    metrics: {
      peakViewers: 42300,
      avgViewers: 28760,
      totalViewers: 198560,
      newFollowers: 6780,
      interactionRate: 32.1,
      productClicks: 45680,
      orders: 1890,
      gmv: 89600,
      conversionRate: 4.14,
    },
    viewerTrend: generateTrendData(30000, 10000, 24),
    conversionTrend: generateTrendData(80, 30, 24),
  },
  {
    roomId: 'room-005',
    roomTitle: '服装穿搭 夏季新款',
    date: new Date().toISOString().split('T')[0],
    metrics: {
      peakViewers: 89600,
      avgViewers: 72450,
      totalViewers: 523400,
      newFollowers: 18900,
      interactionRate: 41.8,
      productClicks: 128900,
      orders: 5680,
      gmv: 689500,
      conversionRate: 4.41,
    },
    viewerTrend: generateTrendData(70000, 18000, 24),
    conversionTrend: generateTrendData(160, 60, 24),
  },
  {
    roomId: 'room-006',
    roomTitle: '游戏直播 王者荣耀',
    date: new Date().toISOString().split('T')[0],
    metrics: {
      peakViewers: 234500,
      avgViewers: 156780,
      totalViewers: 1256800,
      newFollowers: 45600,
      interactionRate: 62.3,
      productClicks: 32500,
      orders: 560,
      gmv: 28900,
      conversionRate: 0.17,
    },
    viewerTrend: generateTrendData(160000, 50000, 24),
    conversionTrend: generateTrendData(20, 10, 24),
  },
];

export const platformOverview = {
  liveRooms: 32,
  totalViewers: 658900,
  totalOrders: 25680,
  totalGmv: 3256800,
  avgConversionRate: 3.85,
  newFollowers: 125600,
  peakTime: '20:00-22:00',
  topCategory: '美妆',
};

export const conversionTrendData = [
  { time: '10:00', 关注转化: 120, 商品点击: 850, 成交转化: 32 },
  { time: '11:00', 关注转化: 180, 商品点击: 1200, 成交转化: 45 },
  { time: '12:00', 关注转化: 250, 商品点击: 1800, 成交转化: 68 },
  { time: '13:00', 关注转化: 220, 商品点击: 1500, 成交转化: 55 },
  { time: '14:00', 关注转化: 280, 商品点击: 2100, 成交转化: 78 },
  { time: '15:00', 关注转化: 320, 商品点击: 2500, 成交转化: 92 },
  { time: '16:00', 关注转化: 290, 商品点击: 2200, 成交转化: 85 },
  { time: '17:00', 关注转化: 350, 商品点击: 2800, 成交转化: 105 },
  { time: '18:00', 关注转化: 420, 商品点击: 3500, 成交转化: 128 },
  { time: '19:00', 关注转化: 480, 商品点击: 4200, 成交转化: 156 },
  { time: '20:00', 关注转化: 560, 商品点击: 5200, 成交转化: 198 },
  { time: '21:00', 关注转化: 620, 商品点击: 5800, 成交转化: 225 },
  { time: '22:00', 关注转化: 450, 商品点击: 4000, 成交转化: 168 },
];
