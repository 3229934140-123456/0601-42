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
