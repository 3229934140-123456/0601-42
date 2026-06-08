import type { LiveRoom, Comment, Product, RiskAlert, OralBroadcast } from '@/types';
import {
  formatNumber,
  formatDuration,
  formatPrice,
  formatDate,
  getProductStatusText,
  getRiskLevelText,
  getRiskTypeText,
  getStatusText,
  formatTime,
} from './format';
import { generateTimeline, getTimelineTypeIcon } from './timeline';

interface ExportReportOptions {
  room: LiveRoom;
  pinnedComments: Comment[];
  frequentComments: { keyword: string; count: number }[];
  products: Product[];
  oralBroadcasts: OralBroadcast[];
  risks: RiskAlert[];
  operatorConclusion?: string;
  operatorConclusionTimestamp?: string;
}

export const generateLiveReport = (options: ExportReportOptions): string => {
  const {
    room,
    pinnedComments,
    frequentComments,
    products,
    oralBroadcasts,
    risks,
    operatorConclusion,
    operatorConclusionTimestamp,
  } = options;

  const doneProducts = products.filter((p) => p.status === 'explained').length;
  const totalProducts = products.length;
  const productProgress =
    totalProducts > 0 ? Math.round((doneProducts / totalProducts) * 100) : 0;

  const totalGmv = products.reduce((sum, p) => sum + p.salesVolume * p.price, 0);
  const totalClicks = products.reduce((sum, p) => sum + p.clickCount, 0);
  const totalOrders = products.reduce((sum, p) => sum + p.salesVolume, 0);
  const conversionRate =
    totalClicks > 0 ? ((totalOrders / totalClicks) * 100).toFixed(2) : '0';

  const pendingRisks = risks.filter(
    (r) => r.status === 'pending' || r.status === 'processing'
  ).length;
  const resolvedRisks = risks.filter(
    (r) => r.status === 'resolved' || r.status === 'false_alarm'
  ).length;

  const timeline = generateTimeline({
    pinnedComments,
    products,
    oralBroadcasts,
    risks,
    operatorConclusion,
    operatorConclusionTimestamp,
  });

  const now = new Date().toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });

  const report = `
═══════════════════════════════════════════════════════════
                   单场直播运营复盘报告
═══════════════════════════════════════════════════════════

【基本信息】
  直播间名称：${room.title}
  主播名称：${room.anchor.name}
  主播等级：Lv.${room.anchor.level}
  分类：${room.category}
  开播时间：${formatDate(room.startTime)}
  开播时长：${formatDuration(room.duration)}
  画质：${room.quality.toUpperCase()}
  导出时间：${now}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

【直播数据概览】
  ▸ 当前在线人数：${formatNumber(room.viewers)} 人
  ▸ 峰值在线人数：${formatNumber(room.peakViewers)} 人
  ▸ 弹幕速度：${room.danmakuSpeed} 条/分钟
  ▸ 主播粉丝数：${formatNumber(room.anchor.followers)}
  ▸ 主播场均观看：${formatNumber(room.anchor.avgViewers)}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

【互动管理】

  ★ 置顶问题（${pinnedComments.length} 条）
  ─────────────────────────────────────────────────────
${pinnedComments
  .map(
    (c, i) =>
      `  ${i + 1}. [${formatDate(c.timestamp)}] ${c.userName}: ${c.content}
     点赞数：${c.likeCount}`
  )
  .join('\n\n')}

  🔥 高频评论 Top ${frequentComments.length}
  ─────────────────────────────────────────────────────
${frequentComments
  .map(
    (fc, i) =>
      `  ${i + 1}. "${fc.keyword}" - 提及 ${fc.count} 次`
  )
  .join('\n')}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

【商品带货】

  📦 讲解进度：${doneProducts}/${totalProducts} (${productProgress}%)
  💰 预计GMV：${formatPrice(totalGmv)}
  🖱️ 商品点击：${formatNumber(totalClicks)} 次
  📦 订单数量：${formatNumber(totalOrders)} 单
  📊 转化率：${conversionRate}%

  商品清单：
  ─────────────────────────────────────────────────────
${products
  .map(
    (p, i) =>
      `  ${i + 1}. ${p.name}
     状态：${getProductStatusText(p.status)} | 价格：${formatPrice(p.price)} | 库存：${formatNumber(p.stock)}
     点击：${formatNumber(p.clickCount)} | 销量：${formatNumber(p.salesVolume)} | 销售额：${formatPrice(p.salesVolume * p.price)}`
  )
  .join('\n\n')}

  🎤 口播记录（${oralBroadcasts.length} 条）
  ─────────────────────────────────────────────────────
${oralBroadcasts
  .map(
    (o, i) =>
      `  ${i + 1}. [${formatDate(o.timestamp)}] ${o.type === 'discount' ? '【折扣】' : o.type === 'coupon' ? '【优惠券】' : o.type === 'reminder' ? '【提示】' : '【其他】'} ${o.content}
     ${o.productName ? `关联商品：${o.productName}` : ''}${o.effect ? ` | 点击提升：+${formatNumber(o.effect.clickIncrease)} | 订单提升：+${formatNumber(o.effect.orderIncrease)}` : ''}`
  )
  .join('\n\n')}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

【风险监控】

  风险总数：${risks.length} 条
  待处理：${pendingRisks} 条 | 已处理：${resolvedRisks} 条

  风险详情：
  ─────────────────────────────────────────────────────
${
  risks.length === 0
    ? '  暂无风险记录'
    : risks
        .map(
          (r, i) =>
            `  ${i + 1}. 【${getRiskLevelText(r.level)}】${getRiskTypeText(r.type)} - ${getStatusText(r.status)}
     描述：${r.description}
     发现时间：${formatDate(r.timestamp)}
     ${r.handler ? `处理人：${r.handler}` : ''}${r.handleTime ? ` | 处理时间：${formatDate(r.handleTime)}` : ''}
     处理备注：${r.notes.length > 0 ? r.notes[0].content : '暂无'}`
        )
        .join('\n\n')
}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

【运营时间线】
  共 ${timeline.length} 个关键事件
  ─────────────────────────────────────────────────────
${
  timeline.length === 0
    ? '  暂无时间线事件'
    : timeline
        .map(
          (item, i) =>
            `  ${i + 1}. ${getTimelineTypeIcon(item.type)} ${item.title}
     时间：${formatDate(item.timestamp)}
     内容：${item.description}`
        )
        .join('\n\n')
}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

【运营总结】

${operatorConclusion || '  暂无运营总结，可在导出时添加手写结论。'}

  ▸ 整体表现：${room.viewers > room.anchor.avgViewers ? '高于场均水平，表现优秀' : '接近场均水平，有提升空间'}
  ▸ 互动情况：${pinnedComments.length >= 3 ? '观众提问积极，互动氛围好' : '互动一般，可引导更多提问'}
  ▸ 带货表现：${Number(conversionRate) > 3 ? '转化率高于行业均值，带货效果好' : '转化率一般，可优化讲解话术'}
  ▸ 风险管控：${pendingRisks === 0 ? '风险处理及时，无积压' : `有 ${pendingRisks} 条待处理风险，需跟进`}

═══════════════════════════════════════════════════════════
  报告生成完毕 - 直播运营控制台
═══════════════════════════════════════════════════════════
`;

  return report;
};

export const downloadReport = (
  roomTitle: string,
  reportContent: string
): void => {
  const dateStr = new Date().toISOString().split('T')[0];
  const fileName = `${roomTitle}_运营复盘报告_${dateStr}.txt`;

  const blob = new Blob([reportContent], {
    type: 'text/plain;charset=utf-8',
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

interface DailyReportRoomData {
  id: string;
  name: string;
  peakViewers: number;
  avgViewers: number;
  interactionRate: number;
  productClicks: number;
  conversion: number;
  riskCount: number;
  gmv: number;
  trend: 'up' | 'down' | 'flat';
  trendChange: number;
}

interface DailyReportOptions {
  timeRange: string;
  timeRangeLabel: string;
  rooms: DailyReportRoomData[];
}

export const generateDailyReport = (options: DailyReportOptions): string => {
  const { timeRangeLabel, rooms } = options;

  const now = new Date().toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });

  const avg = (key: keyof DailyReportRoomData) => {
    if (rooms.length === 0) return 0;
    const sum = rooms.reduce((s, r) => s + (r[key] as number), 0);
    return sum / rooms.length;
  };

  const rankBy = (key: keyof DailyReportRoomData, desc = true) => {
    return [...rooms].sort((a, b) => {
      const va = a[key] as number;
      const vb = b[key] as number;
      return desc ? vb - va : va - vb;
    });
  };

  const anomalies: {
    room: DailyReportRoomData;
    metric: string;
    metricLabel: string;
    type: 'high' | 'low';
    deviation: number;
  }[] = [];

  const metrics: { key: keyof DailyReportRoomData; label: string; desc: boolean }[] = [
    { key: 'peakViewers', label: '在线峰值', desc: true },
    { key: 'interactionRate', label: '互动率', desc: true },
    { key: 'productClicks', label: '商品点击', desc: true },
    { key: 'conversion', label: '转化率', desc: true },
    { key: 'riskCount', label: '风险数量', desc: false },
    { key: 'gmv', label: '预计GMV', desc: true },
  ];

  metrics.forEach(({ key, label, desc }) => {
    const mean = avg(key);
    if (mean === 0) return;
    rooms.forEach((room) => {
      const value = room[key] as number;
      const deviation = ((value - mean) / mean) * 100;
      if (Math.abs(deviation) >= 30) {
        anomalies.push({
          room,
          metric: key as string,
          metricLabel: label,
          type: deviation > 0 ? 'high' : 'low',
          deviation: Math.round(deviation),
        });
      }
    });
  });

  const upCount = rooms.filter((r) => r.trend === 'up').length;
  const downCount = rooms.filter((r) => r.trend === 'down').length;
  const flatCount = rooms.filter((r) => r.trend === 'flat').length;

  const totalGmv = rooms.reduce((s, r) => s + r.gmv, 0);
  const totalViewers = rooms.reduce((s, r) => s + r.peakViewers, 0);
  const totalRisks = rooms.reduce((s, r) => s + r.riskCount, 0);

  const report = `
═══════════════════════════════════════════════════════════
                  直播运营日报（${timeRangeLabel}）
═══════════════════════════════════════════════════════════

【概览】
  统计周期：${timeRangeLabel}
  生成时间：${now}
  监控直播间：${rooms.length} 个

【整体趋势摘要】
  ▸ 在线峰值总计：${formatNumber(totalViewers)} 人
  ▸ 预计GMV总计：${formatPrice(totalGmv)}
  ▸ 风险总计：${totalRisks} 条
  ▸ 上升直播间：${upCount} 个
  ▸ 下降直播间：${downCount} 个
  ▸ 持平直播间：${flatCount} 个

  趋势总结：${
    upCount > downCount
      ? '整体呈上升趋势，多数直播间表现良好'
      : downCount > upCount
      ? '整体呈下降趋势，需关注下滑直播间'
      : '整体平稳，各直播间表现稳定'
  }

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

【异常波动说明】
${
  anomalies.length === 0
    ? '  未检测到明显异常波动，各直播间表现平稳。'
    : anomalies
        .map(
          (a, i) =>
            `  ${i + 1}. 【${a.room.name}】${a.metricLabel} ${a.type === 'high' ? '偏高' : '偏低'}
     偏离均值：${a.deviation > 0 ? '+' : ''}${a.deviation}%
     建议：${
       a.type === 'high'
         ? a.metric === 'riskCount'
           ? '风险数量偏高，需加强监控'
           : '表现优秀，可总结经验推广'
         : a.metric === 'riskCount'
         ? '风险控制良好'
         : '表现偏低，需分析原因并优化'
     }`
        )
        .join('\n\n')
}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

【关键指标排名】
${metrics
  .map(({ key, label, desc }) => {
    const ranked = rankBy(key, desc);
    return `
  ★ ${label} Top ${Math.min(5, ranked.length)}
  ─────────────────────────────────────────────────────
${ranked
  .slice(0, 5)
  .map(
    (r, i) =>
      `  ${i + 1}. ${r.name} - ${
        key === 'gmv'
          ? formatPrice(r.gmv)
          : key === 'peakViewers' || key === 'productClicks'
          ? formatNumber(r[key] as number) + (key === 'peakViewers' ? ' 人' : ' 次')
          : key === 'interactionRate' || key === 'conversion'
          ? (r[key] as number).toFixed(2) + '%'
          : key === 'riskCount'
          ? (r[key] as number) + ' 条'
          : r[key]
      } ${r.trend === 'up' ? '↑' : r.trend === 'down' ? '↓' : '→'}`
  )
  .join('\n')}`;
  })
  .join('\n')}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

【各直播间详情】
${rooms
  .map(
    (r, i) =>
      `  ${i + 1}. ${r.name}
     在线峰值：${formatNumber(r.peakViewers)} 人
     互动率：${r.interactionRate.toFixed(2)}%
     商品点击：${formatNumber(r.productClicks)} 次
     转化率：${r.conversion.toFixed(2)}%
     风险数量：${r.riskCount} 条
     预计GMV：${formatPrice(r.gmv)}
     趋势：${r.trend === 'up' ? '上升' : r.trend === 'down' ? '下降' : '持平'} (${r.trendChange > 0 ? '+' : ''}${r.trendChange}%)`
  )
  .join('\n\n')}

═══════════════════════════════════════════════════════════
  报告生成完毕 - 直播运营控制台
═══════════════════════════════════════════════════════════
`;

  return report;
};
