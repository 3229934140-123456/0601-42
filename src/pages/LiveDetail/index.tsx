import { useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Users,
  TrendingUp,
  Eye,
  Heart,
  MessageSquare,
  ShoppingCart,
  Clock,
  Star,
  ChevronRight,
  BarChart3,
  Gift,
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
  Area,
  AreaChart,
} from 'recharts';
import { useAppStore } from '@/store/useAppStore';
import StatCard from '@/components/common/StatCard';
import {
  formatNumber,
  formatDuration,
  formatPercent,
  getLiveStatusText,
  getLiveStatusColor,
} from '@/utils/format';
import { cn } from '@/lib/utils';

const LiveDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const channels = useAppStore((state) => state.channels);
  const currentRoomId = useAppStore((state) => state.currentRoomId);

  const roomId = id || currentRoomId;
  const room = useMemo(
    () => channels.find((c) => c.id === roomId),
    [channels, roomId]
  );

  const viewerTrendData = useMemo(() => {
    if (!room) return [];
    const data = [];
    const baseValue = room.viewers || room.peakViewers * 0.7;
    for (let i = 0; i < 24; i++) {
      const hour = 10 + Math.floor(i / 2);
      const minute = (i % 2) * 30;
      const variance = room.peakViewers * 0.3;
      const value = Math.floor(
        baseValue + (Math.random() - 0.3) * variance
      );
      data.push({
        time: `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`,
        在线人数: Math.max(0, value),
        峰值: room.peakViewers,
      });
    }
    return data;
  }, [room]);

  if (!room) {
    return (
      <div className="flex items-center justify-center h-full text-text-secondary">
        未找到直播间
      </div>
    );
  }

  const quickActions = [
    { label: '互动管理', icon: MessageSquare, path: `/interaction/${roomId}`, color: 'purple' },
    { label: '商品管理', icon: ShoppingCart, path: `/products/${roomId}`, color: 'orange' },
    { label: '风险监控', icon: AlertTriangle, path: `/risks/${roomId}`, color: 'red' },
    { label: '数据分析', icon: BarChart3, path: '/analytics', color: 'green' },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-1 text-text-secondary hover:text-text-primary transition-colors"
          >
            <ChevronRight size={16} className="rotate-180" />
            <span className="text-sm">返回频道墙</span>
          </button>
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-bold text-text-primary">
                {room.title}
              </h2>
              <span
                className={cn(
                  'px-2.5 py-1 rounded text-xs font-medium text-white flex items-center gap-1.5',
                  getLiveStatusColor(room.status)
                )}
              >
                {room.status === 'live' && (
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                )}
                {getLiveStatusText(room.status)}
              </span>
              {room.isStarred && (
                <Star
                  size={18}
                  className="text-yellow-500 fill-yellow-500"
                />
              )}
            </div>
            <p className="text-sm text-text-secondary mt-1">
              {room.category} · 开播时长 {formatDuration(room.duration)}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard
          title="在线人数"
          value={formatNumber(room.viewers)}
          icon={Users}
          trend={{ value: 12.5, isUp: true }}
          color="cyan"
          subtitle="较上小时 +6,230"
        />
        <StatCard
          title="峰值人数"
          value={formatNumber(room.peakViewers)}
          icon={Eye}
          color="purple"
          subtitle="出现在 20:32"
        />
        <StatCard
          title="新增关注"
          value="12,580"
          icon={Heart}
          trend={{ value: 8.3, isUp: true }}
          color="red"
          subtitle="今日累计"
        />
        <StatCard
          title="互动率"
          value="38.5%"
          icon={MessageSquare}
          color="green"
          subtitle="高于场均 15%"
        />
        <StatCard
          title="商品点击"
          value="89,560"
          icon={ShoppingCart}
          trend={{ value: 15.2, isUp: true }}
          color="orange"
          subtitle="转化率 3.98%"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-bg-secondary rounded-xl border border-border p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-text-primary">
              人气趋势
            </h3>
            <div className="flex items-center gap-4 text-sm">
              <span className="flex items-center gap-2 text-text-secondary">
                <span className="w-3 h-3 rounded-full bg-cyan-500" />
                在线人数
              </span>
              <span className="flex items-center gap-2 text-text-secondary">
                <span className="w-3 h-0.5 bg-orange-500" />
                峰值参考
              </span>
            </div>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={viewerTrendData}>
                <defs>
                  <linearGradient id="colorViewers" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06B6D4" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#06B6D4" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                <XAxis
                  dataKey="time"
                  stroke="var(--text-tertiary)"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="var(--text-tertiary)"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => formatNumber(value)}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--bg-primary)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '8px',
                    color: 'var(--text-primary)',
                  }}
                  labelStyle={{ color: 'var(--text-primary)' }}
                />
                <Area
                  type="monotone"
                  dataKey="在线人数"
                  stroke="#06B6D4"
                  strokeWidth={2}
                  fill="url(#colorViewers)"
                />
                <Line
                  type="monotone"
                  dataKey="峰值"
                  stroke="#F97316"
                  strokeWidth={1}
                  strokeDasharray="5 5"
                  dot={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-bg-secondary rounded-xl border border-border p-5">
            <h3 className="text-base font-semibold text-text-primary mb-4">
              主播信息
            </h3>
            <div className="flex items-start gap-4">
              <img
                src={room.anchor.avatar}
                alt={room.anchor.name}
                className="w-16 h-16 rounded-full border-2 border-accent"
              />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-text-primary">
                    {room.anchor.name}
                  </span>
                  <span className="px-1.5 py-0.5 rounded text-xs bg-accent/10 text-accent font-medium">
                    Lv.{room.anchor.level}
                  </span>
                </div>
                <p className="text-sm text-text-secondary mt-1">
                  {room.anchor.category}类主播
                </p>
                <div className="mt-3 flex items-center gap-4 text-sm">
                  <div className="text-text-secondary">
                    粉丝{' '}
                    <span className="text-text-primary font-medium">
                      {formatNumber(room.anchor.followers)}
                    </span>
                  </div>
                  <div className="text-text-secondary">
                    场均{' '}
                    <span className="text-text-primary font-medium">
                      {formatNumber(room.anchor.avgViewers)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-bg-secondary rounded-xl border border-border p-5">
            <h3 className="text-base font-semibold text-text-primary mb-4">
              快捷操作
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {quickActions.map((action) => {
                const Icon = action.icon;
                return (
                  <button
                    key={action.label}
                    onClick={() => navigate(action.path)}
                    className="flex flex-col items-center gap-2 p-4 rounded-lg bg-bg-primary border border-border hover:border-accent/50 hover:bg-accent/5 transition-all group"
                  >
                    <Icon
                      size={24}
                      className={cn(
                        'group-hover:scale-110 transition-transform',
                        `text-${action.color}-500`
                      )}
                    />
                    <span className="text-sm text-text-secondary group-hover:text-text-primary transition-colors">
                      {action.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="bg-bg-secondary rounded-xl border border-border p-5">
            <h3 className="text-base font-semibold text-text-primary mb-4">
              实时数据
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-text-secondary flex items-center gap-2">
                  <Gift size={16} className="text-yellow-500" />
                  礼物收入
                </span>
                <span className="text-sm font-medium text-text-primary">
                  ¥28,560
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-text-secondary flex items-center gap-2">
                  <MessageSquare size={16} className="text-cyan-500" />
                  弹幕数量
                </span>
                <span className="text-sm font-medium text-text-primary">
                  12,890 条
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-text-secondary flex items-center gap-2">
                  <Clock size={16} className="text-green-500" />
                  平均观看
                </span>
                <span className="text-sm font-medium text-text-primary">
                  8分32秒
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-text-secondary flex items-center gap-2">
                  <TrendingUp size={16} className="text-purple-500" />
                  新用户占比
                </span>
                <span className="text-sm font-medium text-text-primary">
                  42.5%
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveDetail;
