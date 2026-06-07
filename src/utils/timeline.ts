import type {
  TimelineItem,
  Comment,
  Product,
  OralBroadcast,
  RiskAlert,
} from '@/types';

interface GenerateTimelineOptions {
  pinnedComments: Comment[];
  products: Product[];
  oralBroadcasts: OralBroadcast[];
  risks: RiskAlert[];
  operatorConclusion?: string;
  operatorConclusionTimestamp?: string;
}

export const generateTimeline = (
  options: GenerateTimelineOptions
): TimelineItem[] => {
  const { pinnedComments, products, oralBroadcasts, risks, operatorConclusion, operatorConclusionTimestamp } =
    options;
  const items: TimelineItem[] = [];

  pinnedComments.forEach((comment) => {
    items.push({
      id: `pin-${comment.id}`,
      type: 'pinned_comment',
      title: '置顶问题',
      description: comment.content,
      timestamp: comment.timestamp,
      targetPage: 'interaction',
      targetId: comment.id,
    });
  });

  products.forEach((product) => {
    if (product.explainStartTime) {
      items.push({
        id: `product-start-${product.id}`,
        type: 'product_start',
        title: '开始讲解商品',
        description: product.name,
        timestamp: product.explainStartTime,
        targetPage: 'products',
        targetId: product.id,
      });
    }
  });

  oralBroadcasts.forEach((oral) => {
    items.push({
      id: `oral-${oral.id}`,
      type: 'oral_broadcast',
      title: '口播提醒',
      description: oral.content,
      timestamp: oral.timestamp,
      targetPage: 'products',
      targetId: oral.id,
    });
  });

  risks.forEach((risk) => {
    items.push({
      id: `risk-${risk.id}`,
      type: 'risk_alert',
      title: risk.title,
      description: risk.description,
      timestamp: risk.timestamp,
      targetPage: 'risks',
      targetId: risk.id,
      level: risk.level,
    });

    risk.notes.forEach((note, noteIndex) => {
      items.push({
        id: `risk-note-${risk.id}-${noteIndex}`,
        type: 'risk_note',
        title: '风险处理备注',
        description: `${note.author}：${note.content}`,
        timestamp: note.timestamp,
        targetPage: 'risks',
        targetId: risk.id,
      });
    });
  });

  if (operatorConclusion) {
    const conclusionTime = operatorConclusionTimestamp || new Date().toISOString();
    items.push({
      id: 'conclusion',
      type: 'operator_conclusion',
      title: '运营总结',
      description: operatorConclusion,
      timestamp: conclusionTime,
      targetPage: 'live',
    });
  }

  items.sort(
    (a, b) =>
      new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );

  return items;
};

export const getTimelineTypeIcon = (type: string): string => {
  const icons: Record<string, string> = {
    pinned_comment: '📌',
    product_start: '🛍️',
    oral_broadcast: '🎤',
    risk_alert: '⚠️',
    risk_note: '📝',
    operator_conclusion: '✅',
  };
  return icons[type] || '📍';
};

export const getTimelineTypeColor = (type: string, level?: string): string => {
  if (type === 'risk_alert' && level) {
    const levelColors: Record<string, string> = {
      critical: 'text-red-500',
      high: 'text-orange-500',
      medium: 'text-yellow-500',
      low: 'text-green-500',
    };
    return levelColors[level] || 'text-text-secondary';
  }

  const colors: Record<string, string> = {
    pinned_comment: 'text-blue-500',
    product_start: 'text-green-500',
    oral_broadcast: 'text-purple-500',
    risk_alert: 'text-red-500',
    risk_note: 'text-yellow-500',
    operator_conclusion: 'text-accent',
  };
  return colors[type] || 'text-text-secondary';
};

export const getTimelineTypeBgColor = (type: string, level?: string): string => {
  if (type === 'risk_alert' && level) {
    const levelColors: Record<string, string> = {
      critical: 'bg-red-500/10',
      high: 'bg-orange-500/10',
      medium: 'bg-yellow-500/10',
      low: 'bg-green-500/10',
    };
    return levelColors[level] || 'bg-bg-secondary';
  }

  const colors: Record<string, string> = {
    pinned_comment: 'bg-blue-500/10',
    product_start: 'bg-green-500/10',
    oral_broadcast: 'bg-purple-500/10',
    risk_alert: 'bg-red-500/10',
    risk_note: 'bg-yellow-500/10',
    operator_conclusion: 'bg-accent/10',
  };
  return colors[type] || 'bg-bg-secondary';
};
