import { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Users,
  Eye,
  Heart,
  Share2,
  Clock,
  Star,
  TrendingUp,
  DollarSign,
  Gift,
  User,
  FileText,
  MessageSquare,
  Edit3,
  Save,
  AlertTriangle,
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from 'recharts';
import { useAppStore } from '@/store/useAppStore';
import { channels } from '@/data/channels';
import { generateLiveReport, downloadReport } from '@/utils/export';
import {
  formatNumber,
  formatDuration,
  getLiveStatusText,
  getLiveStatusColor,
  formatDate,
  formatTime,
  getStatusText,
} from '@/utils/format';
import { cn } from '@/lib/utils';
import type { ViewerTrendPoint } from '@/types';

const LiveDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const currentRoomId = useAppStore((state) => state.currentRoomId);
  const setCurrentRoomId = useAppStore((state) => state.setCurrentRoomId);
  const toggleStar = useAppStore((state) => state.toggleStar);
  const channelsData = useAppStore((state) => state.channels);
  const operatorConclusions = useAppStore(
    (state) => state.operatorConclusions
  );
  const setOperatorConclusion = useAppStore(
    (state) => state.setOperatorConclusion
  );
  const getRoomComments = useAppStore((state) => state.getRoomComments);
  const getRoomFrequentComments = useAppStore(
    (state) => state.getRoomFrequentComments
  );
  const getRoomProducts = useAppStore((state) => state.getRoomProducts);
  const getRoomOralBroadcasts = useAppStore(
    (state) => state.getRoomOralBroadcasts
  );
  const getRoomRisks = useAppStore((state) => state.getRoomRisks);
  const getViewerTrend = useAppStore((state) => state.getViewerTrend);
  const getPendingRisksCount = useAppStore(
    (state) => state.getPendingRisksCount
  );

  const roomId = id || currentRoomId;
  const room = channelsData.find((c) => c.id === roomId);

  const [timeRange, setTimeRange] = useState<'1h' | '3h' | '6h' | 'all'>('1h');
  const [isEditingConclusion, setIsEditingConclusion] = useState(false);
  const [conclusionInput, setConclusionInput] = useState(
    operatorConclusions[roomId] || ''
  );

  const viewerTrend = getViewerTrend(roomId) || [];
  const comments = getRoomComments(roomId);
  const pinnedComments = comments.filter((c) => c.isPinned);
  const frequentComments = getRoomFrequentComments(roomId);
  const products = getRoomProducts(roomId);
  const oralBroadcasts = getRoomOralBroadcasts(roomId);
  const risks = getRoomRisks(roomId);
  const pendingRisks = getPendingRisksCount(roomId);

  const stats = useMemo(() => {
    if (!room) return null;

    const explainedProducts = products.filter((p) => p.status === 'explained');
    const productProgress =
      products.length > 0
        ? Math.round((explainedProducts.length / products.length) * 100)
        : 0;
    const totalGmv = products.reduce(
      (sum, p) => sum + p.salesVolume * p.price,
      0
    );

    return {
      totalViewers: room.viewers,
      peakViewers: room.peakViewers,
      newFollowers: Math.floor(room.viewers * 0.08),
      totalGmv,
      interactionRate: '12.5%',
      productProgress,
      danmakuCount: Math.floor(room.danmakuSpeed * room.duration),
      giftCount: 328,
    };
  }, [room, products]);

  const handleBack = () => {
    navigate('/');
  };

  const handleExport = () => {
    if (!room) return;

    const report = generateLiveReport({
      room,
      pinnedComments,
      frequentComments: frequentComments.map((fc) => ({
        keyword: fc.keyword,
        count: fc.count,
      })),
      products,
      oralBroadcasts,
      risks,
      operatorConclusion: operatorConclusions[roomId],
    });

    downloadReport(room.title, report);
  };

  const handleSaveConclusion = () => {
    setOperatorConclusion(roomId, conclusionInput);
    setIsEditingConclusion(false);
  };

  if (!room) {
    return (
      <div className="h-full flex items-center justify-center text-text-secondary">
        <p>直播间不存在</p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col gap-6 overflow-y-auto">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={handleBack}
            className="w-10 h-10 rounded-lg bg-bg-secondary border border-border flex items-center justify-center text-text-secondary hover:text-text-primary hover:border-border-hover transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h2 className="text-2xl font-bold text-text-primary">
              {room.title}
            </h2>
            <p className="text-sm text-text-secondary mt-1">
              {room.anchor.name} · {room.category}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span
            className={cn(
              'px-3 py-1.5 rounded-lg text-sm font-medium text-white flex items-center gap-2',
              getLiveStatusColor(room.status)
            )}
          >
            {room.status === 'live' && (
              <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
            )}
            {getLiveStatusText(room.status)}
          </span>
          {pendingRisks > 0 && (
            <span className="px-3 py-1.5 rounded-lg text-sm font-medium bg-red-500/10 text-red-500 flex items-center gap-2">
              <AlertTriangle size={14} />
              {pendingRisks} 条待处理
            </span>
          )}
          <button
            onClick={() => toggleStar(room.id)}
            className={cn(
              'w-10 h-10 rounded-lg border flex items-center justify-center transition-colors',
              room.isStarred
                ? 'bg-yellow-500/10 border-yellow-500/30 text-yellow-500'
                : 'bg-bg-secondary border-border text-text-secondary hover:text-text-primary hover:border-border-hover'
            )}
          >
            <Star size={20} className={room.isStarred ? 'fill-yellow-500' : ''} />
          </button>
          <button
            onClick={handleExport}
            className="h-10 px-4 rounded-lg bg-accent text-white text-sm font-medium hover:bg-accent/90 transition-colors flex items-center gap-2"
          >
            <FileText size={18} />
            导出复盘报告
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="relative rounded-xl overflow-hidden bg-bg-secondary border border-border">
            <img
              src={room.coverUrl}
              alt={room.title}
              className="w-full aspect-video object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

            <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-black/50 backdrop-blur-sm text-white text-sm">
                  <Eye size={16} />
                  {formatNumber(room.viewers)} 在线
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-black/50 backdrop-blur-sm text-white text-sm">
                  <Heart size={16} />
                  {formatNumber(Math.floor(room.viewers * 0.35))}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-2 rounded-lg bg-black/50 backdrop-blur-sm text-white hover:bg-black/70 transition-colors">
                  <Share2 size={18} />
                </button>
              </div>
            </div>

            <div className="absolute bottom-4 left-4 right-4">
              <div className="flex items-center gap-3">
                <img
                  src={room.anchor.avatar}
                  alt={room.anchor.name}
                  className="w-12 h-12 rounded-full border-2 border-white"
                />
                <div className="flex-1">
                  <p className="text-white font-medium">{room.anchor.name}</p>
                  <p className="text-white/70 text-sm">
                    {formatNumber(room.anchor.followers)} 粉丝
                  </p>
                </div>
                <button className="px-4 py-2 rounded-lg bg-accent text-white text-sm font-medium hover:bg-accent/90 transition-colors">
                  关注
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-bg-secondary border border-border">
              <div className="flex items-center gap-2 text-text-secondary mb-2">
                <Users size={16} />
                <span className="text-xs">峰值在线</span>
              </div>
              <p className="text-2xl font-bold text-text-primary">
                {formatNumber(room.peakViewers)}
              </p>
            </div>
            <div className="p-4 rounded-xl bg-bg-secondary border border-border">
              <div className="flex items-center gap-2 text-text-secondary mb-2">
                <Clock size={16} />
                <span className="text-xs">直播时长</span>
              </div>
              <p className="text-2xl font-bold text-text-primary">
                {formatDuration(room.duration)}
              </p>
            </div>
            <div className="p-4 rounded-xl bg-bg-secondary border border-border">
              <div className="flex items-center gap-2 text-text-secondary mb-2">
                <Gift size={16} />
                <span className="text-xs">新增粉丝</span>
              </div>
              <p className="text-2xl font-bold text-green-500">
                +{formatNumber(Math.floor(room.viewers * 0.08))}
              </p>
            </div>
            <div className="p-4 rounded-xl bg-bg-secondary border border-border">
              <div className="flex items-center gap-2 text-text-secondary mb-2">
                <TrendingUp size={16} />
                <span className="text-xs">互动率</span>
              </div>
              <p className="text-2xl font-bold text-accent">12.5%</p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-bg-secondary border border-border flex-1">
            <h3 className="text-sm font-semibold text-text-primary mb-3">
              主播信息
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-text-secondary">主播等级</span>
                <span className="text-sm font-medium text-accent">
                  Lv.{room.anchor.level}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-text-secondary">直播场次</span>
                <span className="text-sm font-medium text-text-primary">
                  156 场
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-text-secondary">所属机构</span>
                <span className="text-sm font-medium text-text-primary">
                  星耀传媒
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-text-secondary">签约状态</span>
                <span className="text-sm font-medium text-green-500">
                  已签约
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-bg-secondary rounded-xl border border-border p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-semibold text-text-primary flex items-center gap-2">
              <TrendingUp size={18} className="text-accent" />
              在线人数趋势
            </h3>
            <div className="flex items-center gap-1 bg-bg-primary rounded-lg p-0.5">
              {(['1h', '3h', '6h', 'all'] as const).map((range) => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range)}
                  className={cn(
                    'px-3 py-1 rounded-md text-xs font-medium transition-all',
                    timeRange === range
                      ? 'bg-accent/10 text-accent'
                      : 'text-text-secondary hover:text-text-primary'
                  )}
                >
                  {range === '1h'
                    ? '近1小时'
                    : range === '3h'
                    ? '近3小时'
                    : range === '6h'
                    ? '近6小时'
                    : '全部'}
                </button>
              ))}
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={viewerTrend}>
                <defs>
                  <linearGradient id="colorViewers" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-accent)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="var(--color-accent)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis
                  dataKey="time"
                  stroke="var(--color-text-tertiary)"
                  fontSize={11}
                />
                <YAxis
                  stroke="var(--color-text-tertiary)"
                  fontSize={11}
                  tickFormatter={(val) => formatNumber(val)}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--color-bg-secondary)',
                    border: '1px solid var(--color-border)',
                    borderRadius: '8px',
                    color: 'var(--color-text-primary)',
                    fontSize: '12px',
                  }}
                  formatter={(value: number) => [formatNumber(value), '在线人数']}
                />
                <Area
                  type="monotone"
                  dataKey="viewers"
                  stroke="var(--color-accent)"
                  strokeWidth={2}
                  fill="url(#colorViewers)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-bg-secondary rounded-xl border border-border p-4">
            <h3 className="text-base font-semibold text-text-primary mb-4 flex items-center gap-2">
              <DollarSign size={18} className="text-green-500" />
              带货数据
            </h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-3 rounded-lg bg-bg-primary">
                <p className="text-xs text-text-secondary mb-1">商品数量</p>
                <p className="text-xl font-bold text-text-primary">
                  {products.length}
                </p>
              </div>
              <div className="text-center p-3 rounded-lg bg-bg-primary">
                <p className="text-xs text-text-secondary mb-1">预计GMV</p>
                <p className="text-xl font-bold text-green-500">
                  {stats ? `¥${(stats.totalGmv / 10000).toFixed(1)}万` : '-'}
                </p>
              </div>
              <div className="text-center p-3 rounded-lg bg-bg-primary">
                <p className="text-xs text-text-secondary mb-1">讲解进度</p>
                <p className="text-xl font-bold text-accent">
                  {stats?.productProgress || 0}%
                </p>
              </div>
            </div>
            <div className="mt-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-text-secondary">讲解完成度</span>
                <span className="text-xs font-medium text-text-primary">
                  {stats?.productProgress || 0}%
                </span>
              </div>
              <div className="h-2 bg-bg-primary rounded-full overflow-hidden">
                <div
                  className="h-full bg-accent rounded-full transition-all duration-500"
                  style={{ width: `${stats?.productProgress || 0}%` }}
                />
              </div>
            </div>
          </div>

          <div className="bg-bg-secondary rounded-xl border border-border p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-semibold text-text-primary flex items-center gap-2">
                <Edit3 size={18} className="text-purple-500" />
                运营总结
              </h3>
              {!isEditingConclusion ? (
                <button
                  onClick={() => {
                    setConclusionInput(operatorConclusions[roomId] || '');
                    setIsEditingConclusion(true);
                  }}
                  className="text-xs text-accent hover:underline flex items-center gap-1"
                >
                  <Edit3 size={12} />
                  编辑
                </button>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={() => setIsEditingConclusion(false)}
                    className="text-xs text-text-secondary hover:text-text-primary"
                  >
                    取消
                  </button>
                  <button
                    onClick={handleSaveConclusion}
                    className="text-xs text-accent hover:underline flex items-center gap-1"
                  >
                    <Save size={12} />
                    保存
                  </button>
                </div>
              )}
            </div>
            {isEditingConclusion ? (
              <textarea
                value={conclusionInput}
                onChange={(e) => setConclusionInput(e.target.value)}
                placeholder="输入本场直播运营总结..."
                className="w-full h-32 p-3 rounded-lg bg-bg-primary border border-border text-sm text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-accent/50 resize-none"
              />
            ) : (
              <div className="p-3 rounded-lg bg-bg-primary min-h-[120px]">
                {operatorConclusions[roomId] ? (
                  <p className="text-sm text-text-secondary leading-relaxed whitespace-pre-wrap">
                    {operatorConclusions[roomId]}
                  </p>
                ) : (
                  <p className="text-sm text-text-tertiary italic">
                    暂无运营总结，点击右上角编辑添加
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-bg-secondary rounded-xl border border-border p-4">
          <h3 className="text-base font-semibold text-text-primary mb-4 flex items-center gap-2">
            <MessageSquare size={18} className="text-blue-500" />
            置顶问题
          </h3>
          <div className="space-y-3">
            {pinnedComments.length === 0 ? (
              <p className="text-sm text-text-tertiary text-center py-4">
                暂无置顶问题
              </p>
            ) : (
              pinnedComments.slice(0, 3).map((comment, index) => (
                <div
                  key={comment.id}
                  className="p-3 rounded-lg bg-bg-primary"
                >
                  <div className="flex items-start gap-2">
                    <span className="shrink-0 w-5 h-5 rounded-full bg-accent text-white text-xs flex items-center justify-center font-medium">
                      {index + 1}
                    </span>
                    <p className="text-sm text-text-primary line-clamp-2">
                      {comment.content}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="bg-bg-secondary rounded-xl border border-border p-4">
          <h3 className="text-base font-semibold text-text-primary mb-4 flex items-center gap-2">
            <TrendingUp size={18} className="text-orange-500" />
            热门话题
          </h3>
          <div className="space-y-2">
            {frequentComments.slice(0, 5).map((item, index) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-2 rounded-lg hover:bg-bg-primary transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span
                    className={cn(
                      'w-5 h-5 rounded flex items-center justify-center text-xs font-bold',
                      index === 0
                        ? 'bg-red-500 text-white'
                        : index === 1
                        ? 'bg-orange-500 text-white'
                        : index === 2
                        ? 'bg-yellow-500 text-white'
                        : 'bg-gray-500/30 text-text-secondary'
                    )}
                  >
                    {index + 1}
                  </span>
                  <span className="text-sm text-text-primary">
                    {item.keyword}
                  </span>
                </div>
                <span className="text-xs text-text-secondary">
                  {item.count} 次
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-bg-secondary rounded-xl border border-border p-4">
          <h3 className="text-base font-semibold text-text-primary mb-4 flex items-center gap-2">
            <AlertTriangle size={18} className="text-red-500" />
            风险告警
          </h3>
          <div className="space-y-3">
            {risks.length === 0 ? (
              <div className="text-center py-4">
                <p className="text-sm text-text-tertiary">暂无风险告警</p>
                <p className="text-xs text-text-tertiary mt-1">直播状态良好</p>
              </div>
            ) : (
              risks.slice(0, 3).map((risk) => (
                <div
                  key={risk.id}
                  className="p-3 rounded-lg bg-bg-primary border-l-2 border-red-500"
                >
                  <p className="text-sm font-medium text-text-primary">
                    {risk.title}
                  </p>
                  <p className="text-xs text-text-tertiary mt-1">
                    {formatTime(risk.timestamp)} · {getStatusText(risk.status)}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveDetail;
