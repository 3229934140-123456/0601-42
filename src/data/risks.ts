import type { RiskAlert } from '@/types';

const now = new Date();

interface RiskTemplate {
  type: RiskAlert['type'];
  level: RiskAlert['level'];
  description: string;
}

const riskTemplates: RiskTemplate[] = [
  {
    type: 'fraud',
    level: 'high',
    description: '检测到疑似虚假宣传：主播声称产品具有"医疗级"功效，但未提供相关资质证明',
  },
  {
    type: 'violence',
    level: 'medium',
    description: '检测到疑似暴力内容：画面中出现不当暴力镜头',
  },
  {
    type: 'copyright',
    level: 'low',
    description: '检测到背景音乐可能涉及版权问题',
  },
  {
    type: 'politics',
    level: 'critical',
    description: '主播直播间出现敏感政治言论，需立即处理',
  },
  {
    type: 'other',
    level: 'low',
    description: '直播画面偶尔卡顿，建议检查网络状态',
  },
  {
    type: 'fraud',
    level: 'medium',
    description: '检测到疑似夸大宣传：主播声称的效果缺乏科学依据',
  },
  {
    type: 'porn',
    level: 'high',
    description: '检测到疑似色情内容：主播着装不当',
  },
];

const generateRisksForRoom = (
  roomId: string,
  roomTitle: string,
  count: number
): RiskAlert[] => {
  const risks: RiskAlert[] = [];
  for (let i = 0; i < count; i++) {
    const template = riskTemplates[i % riskTemplates.length];
    const isOld = i > 1;
    const status = isOld
      ? i % 3 === 0
        ? 'resolved'
        : i % 3 === 1
        ? 'false_alarm'
        : 'resolved'
      : i === 0
      ? 'pending'
      : 'processing';
    const handler =
      status !== 'pending'
        ? ['运营小王', '场控小李', '运营小王', '技术小张'][i % 4]
        : undefined;

    const titleMap: Record<string, string> = {
      fraud: '虚假宣传风险',
      violence: '暴力内容风险',
      copyright: '版权问题',
      politics: '敏感政治言论',
      porn: '色情内容风险',
      other: '其他风险',
    };

    risks.push({
      id: `${roomId}-risk-${i + 1}`,
      roomId,
      roomTitle,
      title: titleMap[template.type] || '违规风险',
      type: template.type,
      level: template.level,
      description: template.description,
      timestamp: new Date(now.getTime() - (i + 1) * (i === 0 ? 60000 : 300000)).toISOString(),
      status,
      handler,
      handleTime:
        status !== 'pending'
          ? new Date(now.getTime() - (i + 1) * 120000).toISOString()
          : undefined,
      notes:
        status !== 'pending'
          ? [
              {
                id: `${roomId}-note-${i + 1}`,
                content:
                  status === 'false_alarm'
                    ? '核实为误报，已标记'
                    : status === 'resolved'
                    ? '已通知主播整改，问题已解决'
                    : '正在处理中',
                author: handler || '系统',
                timestamp: new Date(
                  now.getTime() - (i + 1) * 120000
                ).toISOString(),
              },
            ]
          : [],
    });
  }
  return risks;
};

export const roomRisksData: Record<string, RiskAlert[]> = {
  'room-001': generateRisksForRoom('room-001', '618年中大促 美妆专场', 2),
  'room-002': generateRisksForRoom('room-002', '数码新品首发 限时优惠', 3),
  'room-003': generateRisksForRoom('room-003', '美食探店 家乡味道', 1),
  'room-004': generateRisksForRoom('room-004', '健身减脂 30天蜕变计划', 2),
  'room-005': generateRisksForRoom('room-005', '服装穿搭 夏季新款', 4),
  'room-006': generateRisksForRoom('room-006', '游戏直播 王者荣耀', 2),
};

export const staffResponsibleRooms: Record<string, string[]> = {
  's-001': ['room-001', 'room-002', 'room-003'],
  's-002': ['room-004', 'room-005'],
  's-003': ['room-006', 'room-001'],
  's-004': ['room-002', 'room-003'],
  's-005': ['room-001', 'room-002', 'room-003', 'room-004', 'room-005', 'room-006'],
  's-006': ['room-004', 'room-006'],
  's-007': ['room-001', 'room-005'],
  's-008': ['room-002', 'room-004', 'room-006'],
};

export const getRoomRisks = (roomId: string): RiskAlert[] => {
  return roomRisksData[roomId] || [];
};

export const getAllRisks = (): RiskAlert[] => {
  return Object.values(roomRisksData).flat();
};

export const getPendingRisksCount = (roomId: string): number => {
  return getRoomRisks(roomId).filter((r) => r.status === 'pending').length;
};

export const getHighestRiskLevel = (roomId: string): RiskAlert['level'] | null => {
  const risks = getRoomRisks(roomId).filter((r) => r.status !== 'resolved' && r.status !== 'false_alarm');
  if (risks.length === 0) return null;
  
  const levelOrder: RiskAlert['level'][] = ['critical', 'high', 'medium', 'low'];
  for (const level of levelOrder) {
    if (risks.some((r) => r.level === level)) {
      return level;
    }
  }
  return null;
};

export const getStaffResponsibleRooms = (staffId: string): string[] => {
  return staffResponsibleRooms[staffId] || [];
};

export const getStaffPendingRisks = (staffId: string): RiskAlert[] => {
  const roomIds = getStaffResponsibleRooms(staffId);
  return roomIds
    .flatMap((roomId) => getRoomRisks(roomId))
    .filter((r) => r.status === 'pending' || r.status === 'processing');
};

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
