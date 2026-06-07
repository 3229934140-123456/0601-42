import type { Schedule, Staff } from '@/types';

const staffList: Staff[] = [
  {
    id: 's-001',
    name: '张明',
    avatar: 'https://i.pravatar.cc/150?img=31',
    role: 'supervisor',
    phone: '138****1234',
    isOnline: true,
  },
  {
    id: 's-002',
    name: '李华',
    avatar: 'https://i.pravatar.cc/150?img=32',
    role: 'moderator',
    phone: '139****5678',
    isOnline: true,
  },
  {
    id: 's-003',
    name: '王芳',
    avatar: 'https://i.pravatar.cc/150?img=33',
    role: 'moderator',
    phone: '137****9012',
    isOnline: true,
  },
  {
    id: 's-004',
    name: '刘强',
    avatar: 'https://i.pravatar.cc/150?img=34',
    role: 'moderator',
    phone: '136****3456',
    isOnline: false,
  },
  {
    id: 's-005',
    name: '陈静',
    avatar: 'https://i.pravatar.cc/150?img=35',
    role: 'manager',
    phone: '135****7890',
    isOnline: true,
  },
  {
    id: 's-006',
    name: '赵磊',
    avatar: 'https://i.pravatar.cc/150?img=36',
    role: 'moderator',
    phone: '134****2345',
    isOnline: false,
  },
  {
    id: 's-007',
    name: '孙丽',
    avatar: 'https://i.pravatar.cc/150?img=37',
    role: 'moderator',
    phone: '133****6789',
    isOnline: false,
  },
  {
    id: 's-008',
    name: '周涛',
    avatar: 'https://i.pravatar.cc/150?img=38',
    role: 'supervisor',
    phone: '132****0123',
    isOnline: false,
  },
];

const today = new Date();
const getDateStr = (offset: number) => {
  const d = new Date(today);
  d.setDate(d.getDate() + offset);
  return d.toISOString().split('T')[0];
};

export const schedules: Schedule[] = [
  {
    id: 'sch-001',
    date: getDateStr(0),
    shifts: [
      {
        id: 'shift-001',
        name: '早班',
        startTime: '08:00',
        endTime: '16:00',
        members: [staffList[0], staffList[1], staffList[2]],
        responsibilities: ['监控直播间秩序', '处理违规内容', '记录重要事件'],
      },
      {
        id: 'shift-002',
        name: '中班',
        startTime: '14:00',
        endTime: '22:00',
        members: [staffList[4], staffList[3], staffList[5]],
        responsibilities: ['高峰时段监控', '重点直播间巡检', '晚高峰数据记录'],
      },
      {
        id: 'shift-003',
        name: '晚班',
        startTime: '20:00',
        endTime: '04:00',
        members: [staffList[7], staffList[6]],
        responsibilities: ['夜间直播监控', '紧急事件处理', '夜班日志记录'],
      },
    ],
  },
  {
    id: 'sch-002',
    date: getDateStr(1),
    shifts: [
      {
        id: 'shift-004',
        name: '早班',
        startTime: '08:00',
        endTime: '16:00',
        members: [staffList[7], staffList[6], staffList[5]],
        responsibilities: ['监控直播间秩序', '处理违规内容', '记录重要事件'],
      },
      {
        id: 'shift-005',
        name: '中班',
        startTime: '14:00',
        endTime: '22:00',
        members: [staffList[4], staffList[0], staffList[1]],
        responsibilities: ['高峰时段监控', '重点直播间巡检', '晚高峰数据记录'],
      },
      {
        id: 'shift-006',
        name: '晚班',
        startTime: '20:00',
        endTime: '04:00',
        members: [staffList[2], staffList[3]],
        responsibilities: ['夜间直播监控', '紧急事件处理', '夜班日志记录'],
      },
    ],
  },
  {
    id: 'sch-003',
    date: getDateStr(2),
    shifts: [
      {
        id: 'shift-007',
        name: '早班',
        startTime: '08:00',
        endTime: '16:00',
        members: [staffList[0], staffList[4], staffList[6]],
        responsibilities: ['监控直播间秩序', '处理违规内容', '记录重要事件'],
      },
      {
        id: 'shift-008',
        name: '中班',
        startTime: '14:00',
        endTime: '22:00',
        members: [staffList[7], staffList[1], staffList[5]],
        responsibilities: ['高峰时段监控', '重点直播间巡检', '晚高峰数据记录'],
      },
      {
        id: 'shift-009',
        name: '晚班',
        startTime: '20:00',
        endTime: '04:00',
        members: [staffList[2], staffList[3]],
        responsibilities: ['夜间直播监控', '紧急事件处理', '夜班日志记录'],
      },
    ],
  },
  {
    id: 'sch-004',
    date: getDateStr(3),
    shifts: [
      {
        id: 'shift-010',
        name: '早班',
        startTime: '08:00',
        endTime: '16:00',
        members: [staffList[1], staffList[2], staffList[3]],
        responsibilities: ['监控直播间秩序', '处理违规内容', '记录重要事件'],
      },
      {
        id: 'shift-011',
        name: '中班',
        startTime: '14:00',
        endTime: '22:00',
        members: [staffList[4], staffList[0], staffList[7]],
        responsibilities: ['高峰时段监控', '重点直播间巡检', '晚高峰数据记录'],
      },
      {
        id: 'shift-012',
        name: '晚班',
        startTime: '20:00',
        endTime: '04:00',
        members: [staffList[5], staffList[6]],
        responsibilities: ['夜间直播监控', '紧急事件处理', '夜班日志记录'],
      },
    ],
  },
  {
    id: 'sch-005',
    date: getDateStr(4),
    shifts: [
      {
        id: 'shift-013',
        name: '早班',
        startTime: '08:00',
        endTime: '16:00',
        members: [staffList[4], staffList[5], staffList[6]],
        responsibilities: ['监控直播间秩序', '处理违规内容', '记录重要事件'],
      },
      {
        id: 'shift-014',
        name: '中班',
        startTime: '14:00',
        endTime: '22:00',
        members: [staffList[0], staffList[1], staffList[7]],
        responsibilities: ['高峰时段监控', '重点直播间巡检', '晚高峰数据记录'],
      },
      {
        id: 'shift-015',
        name: '晚班',
        startTime: '20:00',
        endTime: '04:00',
        members: [staffList[2], staffList[3]],
        responsibilities: ['夜间直播监控', '紧急事件处理', '夜班日志记录'],
      },
    ],
  },
  {
    id: 'sch-006',
    date: getDateStr(5),
    shifts: [
      {
        id: 'shift-016',
        name: '早班',
        startTime: '08:00',
        endTime: '16:00',
        members: [staffList[0], staffList[2], staffList[4]],
        responsibilities: ['监控直播间秩序', '处理违规内容', '记录重要事件'],
      },
      {
        id: 'shift-017',
        name: '中班',
        startTime: '14:00',
        endTime: '22:00',
        members: [staffList[7], staffList[5], staffList[6]],
        responsibilities: ['高峰时段监控', '重点直播间巡检', '晚高峰数据记录'],
      },
      {
        id: 'shift-018',
        name: '晚班',
        startTime: '20:00',
        endTime: '04:00',
        members: [staffList[1], staffList[3]],
        responsibilities: ['夜间直播监控', '紧急事件处理', '夜班日志记录'],
      },
    ],
  },
  {
    id: 'sch-007',
    date: getDateStr(6),
    shifts: [
      {
        id: 'shift-019',
        name: '早班',
        startTime: '08:00',
        endTime: '16:00',
        members: [staffList[4], staffList[1], staffList[3]],
        responsibilities: ['监控直播间秩序', '处理违规内容', '记录重要事件'],
      },
      {
        id: 'shift-020',
        name: '中班',
        startTime: '14:00',
        endTime: '22:00',
        members: [staffList[0], staffList[7], staffList[2]],
        responsibilities: ['高峰时段监控', '重点直播间巡检', '晚高峰数据记录'],
      },
      {
        id: 'shift-021',
        name: '晚班',
        startTime: '20:00',
        endTime: '04:00',
        members: [staffList[5], staffList[6]],
        responsibilities: ['夜间直播监控', '紧急事件处理', '夜班日志记录'],
      },
    ],
  },
];

export const currentShift = {
  name: '中班',
  startTime: '14:00',
  endTime: '22:00',
  members: staffList.filter((s) => s.isOnline),
  responsibilities: ['高峰时段监控', '重点直播间巡检', '晚高峰数据记录'],
  nextHandover: '22:00',
  handoverCountdown: '6小时32分',
};

export { staffList };
