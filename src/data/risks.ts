import type { RiskAlert } from '@/types';

const now = new Date();

export const riskAlerts: RiskAlert[] = [
  {
    id: 'risk-001',
    roomId: 'room-002',
    roomTitle: '数码新品首发 限时优惠',
    type: 'fraud',
    level: 'high',
    description: '检测到疑似虚假宣传：主播声称产品具有"医疗级"功效，但未提供相关资质证明',
    timestamp: new Date(now.getTime() - 300000).toISOString(),
    status: 'processing',
    handler: '运营小王',
    handleTime: new Date(now.getTime() - 120000).toISOString(),
    notes: [
      {
        id: 'note-001',
        content: '已通知主播修改话术，正在核实产品资质',
        author: '运营小王',
        timestamp: new Date(now.getTime() - 120000).toISOString(),
      },
    ],
  },
  {
    id: 'risk-002',
    roomId: 'room-006',
    roomTitle: '游戏直播 王者荣耀',
    type: 'violence',
    level: 'medium',
    description: '检测到疑似暴力内容：游戏画面中出现血腥特效',
    timestamp: new Date(now.getTime() - 600000).toISOString(),
    status: 'resolved',
    handler: '场控小李',
    handleTime: new Date(now.getTime() - 480000).toISOString(),
    notes: [
      {
        id: 'note-002',
        content: '核实为游戏正常内容，已标记为误报',
        author: '场控小李',
        timestamp: new Date(now.getTime() - 480000).toISOString(),
      },
    ],
  },
  {
    id: 'risk-003',
    roomId: 'room-001',
    roomTitle: '618年中大促 美妆专场',
    type: 'copyright',
    level: 'low',
    description: '检测到背景音乐可能涉及版权问题',
    timestamp: new Date(now.getTime() - 900000).toISOString(),
    status: 'resolved',
    handler: '运营小王',
    handleTime: new Date(now.getTime() - 780000).toISOString(),
    notes: [
      {
        id: 'note-003',
        content: '已提醒主播更换平台授权音乐',
        author: '运营小王',
        timestamp: new Date(now.getTime() - 780000).toISOString(),
      },
    ],
  },
  {
    id: 'risk-004',
    roomId: 'room-005',
    roomTitle: '服装穿搭 夏季新款',
    type: 'other',
    level: 'critical',
    description: '主播直播间出现敏感政治言论，需立即处理',
    timestamp: new Date(now.getTime() - 60000).toISOString(),
    status: 'pending',
    notes: [],
  },
  {
    id: 'risk-005',
    roomId: 'room-003',
    roomTitle: '美食探店 家乡味道',
    type: 'other',
    level: 'low',
    description: '直播画面偶尔卡顿，建议检查网络状态',
    timestamp: new Date(now.getTime() - 1200000).toISOString(),
    status: 'resolved',
    handler: '技术小张',
    handleTime: new Date(now.getTime() - 1080000).toISOString(),
    notes: [
      {
        id: 'note-005',
        content: '主播已切换网络环境，恢复正常',
        author: '技术小张',
        timestamp: new Date(now.getTime() - 1080000).toISOString(),
      },
    ],
  },
  {
    id: 'risk-006',
    roomId: 'room-004',
    roomTitle: '健身减脂 30天蜕变计划',
    type: 'fraud',
    level: 'medium',
    description: '检测到疑似夸大宣传：主播声称"7天瘦10斤"缺乏科学依据',
    timestamp: new Date(now.getTime() - 180000).toISOString(),
    status: 'pending',
    notes: [],
  },
];

export const riskStats = {
  todayTotal: 28,
  pending: 3,
  processing: 5,
  resolved: 18,
  falseAlarm: 2,
  avgHandleTime: '8分32秒',
  typeDistribution: [
    { type: '违规宣传', count: 12, color: '#F59E0B' },
    { type: '版权问题', count: 6, color: '#8B5CF6' },
    { type: '暴力内容', count: 4, color: '#EF4444' },
    { type: '其他违规', count: 6, color: '#64748B' },
  ],
  levelDistribution: [
    { level: '轻微', count: 10, color: '#10B981' },
    { level: '一般', count: 9, color: '#F59E0B' },
    { level: '严重', count: 6, color: '#F97316' },
    { level: '紧急', count: 3, color: '#EF4444' },
  ],
};
