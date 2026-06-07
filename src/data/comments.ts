import type { Comment, FrequentComment } from '@/types';

const now = new Date();

const generateComments = (roomId: string, count: number, topic: string): Comment[] => {
  const templates = [
    { content: `这个${topic}好好看！求链接～`, type: 'question' as const, likes: 256 },
    { content: '主播皮肤真好，用的什么护肤品呀', type: 'question' as const, likes: 189 },
    { content: '黄皮可以用吗？', type: 'question' as const, likes: 134 },
    { content: '价格太划算了吧！！', type: 'normal' as const, likes: 89 },
    { content: '已下单！期待收货～', type: 'normal' as const, likes: 67 },
    { content: '主播今天状态好好呀', type: 'normal' as const, likes: 45 },
    { content: '求上个同款！', type: 'normal' as const, likes: 234 },
    { content: '这个持久吗？', type: 'question' as const, likes: 178 },
    { content: '送出了火箭 x1', type: 'gift' as const, likes: 567 },
    { content: '欢迎来到直播间，遵守社区规范，文明互动～', type: 'system' as const, likes: 0 },
    { content: '有没有优惠券可以领呀？', type: 'question' as const, likes: 98 },
    { content: '刚进直播间，主播在讲什么呀', type: 'question' as const, likes: 56 },
    { content: '买买买！', type: 'normal' as const, likes: 123 },
    { content: '质量怎么样？', type: 'question' as const, likes: 87 },
    { content: '主播好漂亮～', type: 'normal' as const, likes: 156 },
  ];

  return Array.from({ length: count }, (_, i) => {
    const template = templates[i % templates.length];
    return {
      id: `${roomId}-comment-${i + 1}`,
      userId: `user-${(i % 20) + 1}`,
      userName: `用户${(i % 20) + 1}`,
      userAvatar: `https://i.pravatar.cc/150?img=${(i % 50) + 10}`,
      content: template.content,
      timestamp: new Date(now.getTime() - (i + 1) * 30000).toISOString(),
      isPinned: i < 2 && template.type === 'question',
      isHighlighted: i % 5 === 0,
      type: template.type,
      likeCount: Math.floor(template.likes * (0.5 + Math.random() * 1)),
    };
  });
};

const generateFrequentComments = (topic: string): FrequentComment[] => {
  return [
    {
      id: `fc-${topic}-1`,
      keyword: '求链接',
      count: Math.floor(200 + Math.random() * 200),
      comments: [
        `这个${topic}好好看！求链接～`,
        `求链接求链接！`,
        `${topic}链接在哪里`,
        '购物车几号链接',
      ],
    },
    {
      id: `fc-${topic}-2`,
      keyword: '价格/优惠',
      count: Math.floor(150 + Math.random() * 150),
      comments: [
        '价格太划算了吧！！',
        '有没有优惠券可以领呀？',
        '还能再便宜点吗',
        '有满减活动吗',
      ],
    },
    {
      id: `fc-${topic}-3`,
      keyword: '质量/效果',
      count: Math.floor(100 + Math.random() * 100),
      comments: [
        '质量怎么样？',
        '效果好吗',
        '持久吗',
        '会不会过敏',
      ],
    },
    {
      id: `fc-${topic}-4`,
      keyword: '主播/好看',
      count: Math.floor(80 + Math.random() * 80),
      comments: [
        '主播今天状态好好呀',
        '主播好漂亮～',
        '主播声音好好听',
        '主播好专业',
      ],
    },
    {
      id: `fc-${topic}-5`,
      keyword: '已下单/购买',
      count: Math.floor(60 + Math.random() * 60),
      comments: [
        '已下单！期待收货～',
        '刚拍了两套',
        '买买买！',
        '果断入手了',
      ],
    },
  ];
};

export const roomCommentsData: Record<string, Comment[]> = {
  'room-001': generateComments('room-001', 15, '口红'),
  'room-002': generateComments('room-002', 12, '手机'),
  'room-003': generateComments('room-003', 10, '美食'),
  'room-004': generateComments('room-004', 8, '健身'),
  'room-005': generateComments('room-005', 14, '衣服'),
  'room-006': generateComments('room-006', 20, '游戏'),
};

export const roomFrequentComments: Record<string, FrequentComment[]> = {
  'room-001': generateFrequentComments('美妆'),
  'room-002': generateFrequentComments('数码'),
  'room-003': generateFrequentComments('美食'),
  'room-004': generateFrequentComments('健身'),
  'room-005': generateFrequentComments('时尚'),
  'room-006': generateFrequentComments('游戏'),
};

export const getRoomComments = (roomId: string): Comment[] => {
  return roomCommentsData[roomId] || [];
};

export const getRoomFrequentComments = (roomId: string): FrequentComment[] => {
  return roomFrequentComments[roomId] || [];
};

export const getPinnedComments = (roomId: string): Comment[] => {
  return getRoomComments(roomId).filter((c) => c.isPinned);
};

export const getCommentsWithFilter = (
  roomId: string,
  filter: 'all' | 'question' | 'pinned',
  searchQuery: string
): Comment[] => {
  let result = getRoomComments(roomId).sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  if (filter === 'question') {
    result = result.filter((c) => c.type === 'question');
  } else if (filter === 'pinned') {
    result = result.filter((c) => c.isPinned);
  }

  if (searchQuery) {
    result = result.filter((c) =>
      c.content.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }

  return result;
};
