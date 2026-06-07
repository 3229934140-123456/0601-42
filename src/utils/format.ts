export const formatNumber = (num: number): string => {
  if (num >= 100000000) {
    return (num / 100000000).toFixed(1) + '亿';
  }
  if (num >= 10000) {
    return (num / 10000).toFixed(1) + '万';
  }
  return num.toLocaleString();
};

export const formatDuration = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

export const formatTime = (dateStr: string): string => {
  const date = new Date(dateStr);
  return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
};

export const formatDate = (dateStr: string): string => {
  const date = new Date(dateStr);
  return `${date.getMonth() + 1}/${date.getDate()} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
};

export const formatPrice = (price: number): string => {
  return `¥${price.toFixed(2)}`;
};

export const formatPercent = (value: number): string => {
  return `${value.toFixed(2)}%`;
};

export const getRiskLevelColor = (level: string): string => {
  const colors: Record<string, string> = {
    low: 'text-green-500',
    medium: 'text-yellow-500',
    high: 'text-orange-500',
    critical: 'text-red-500',
  };
  return colors[level] || 'text-gray-500';
};

export const getRiskLevelBg = (level: string): string => {
  const colors: Record<string, string> = {
    low: 'bg-green-500/10',
    medium: 'bg-yellow-500/10',
    high: 'bg-orange-500/10',
    critical: 'bg-red-500/10',
  };
  return colors[level] || 'bg-gray-500/10';
};

export const getRiskLevelText = (level: string): string => {
  const texts: Record<string, string> = {
    low: '轻微',
    medium: '一般',
    high: '严重',
    critical: '紧急',
  };
  return texts[level] || '未知';
};

export const getRiskTypeText = (type: string): string => {
  const texts: Record<string, string> = {
    violence: '暴力内容',
    porn: '色情内容',
    politics: '政治敏感',
    fraud: '违规宣传',
    copyright: '版权问题',
    other: '其他违规',
  };
  return texts[type] || '其他';
};

export const getStatusText = (status: string): string => {
  const texts: Record<string, string> = {
    pending: '待处理',
    processing: '处理中',
    resolved: '已解决',
    false_alarm: '误报',
  };
  return texts[status] || '未知';
};

export const getStatusColor = (status: string): string => {
  const colors: Record<string, string> = {
    pending: 'text-red-500',
    processing: 'text-yellow-500',
    resolved: 'text-green-500',
    false_alarm: 'text-gray-500',
  };
  return colors[status] || 'text-gray-500';
};

export const getOralTypeText = (type: string): string => {
  const texts: Record<string, string> = {
    discount: '折扣优惠',
    coupon: '优惠券',
    reminder: '温馨提示',
    other: '其他',
  };
  return texts[type] || '其他';
};

export const getOralTypeColor = (type: string): string => {
  const colors: Record<string, string> = {
    discount: 'text-red-500',
    coupon: 'text-orange-500',
    reminder: 'text-blue-500',
    other: 'text-gray-500',
  };
  return colors[type] || 'text-gray-500';
};

export const getProductStatusText = (status: string): string => {
  const texts: Record<string, string> = {
    pending: '待讲解',
    explaining: '讲解中',
    done: '已讲解',
  };
  return texts[status] || '未知';
};

export const getLiveStatusText = (status: string): string => {
  const texts: Record<string, string> = {
    live: '直播中',
    waiting: '待开播',
    ended: '已结束',
  };
  return texts[status] || '未知';
};

export const getLiveStatusColor = (status: string): string => {
  const colors: Record<string, string> = {
    live: 'bg-green-500',
    waiting: 'bg-yellow-500',
    ended: 'bg-gray-500',
  };
  return colors[status] || 'bg-gray-500';
};

export const getQualityText = (quality: string): string => {
  const texts: Record<string, string> = {
    fhd: '1080P',
    hd: '720P',
    sd: '标清',
  };
  return texts[quality] || '未知';
};
