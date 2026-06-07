import { useState, useMemo } from 'react';
import {
  BarChart3,
  TrendingUp,
  Users,
  ShoppingCart,
  DollarSign,
  Heart,
  Filter,
  Download,
  Calendar,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area,
} from 'recharts';
import { analyticsData, platformOverview, conversionTrendData } from '@/data/analytics';
import StatCard from '@/components/common/StatCard';
import {
  formatNumber,
  formatPrice,
  formatPercent,
} from '@/utils/format';
import { cn } from '@/lib/utils';

const AnalyticsPage = () => {
  const [selectedRooms, setSelectedRooms] = useState<string[]>([
    'room-001',
    'room-002',
    'room-005',
  ]);
  const [timeRange, setTimeRange] = useState<'today' | 'week' | 'month'>('today');

  const peakComparisonData = useMemo(() => {
    return analyticsData
      .filter((d) => selectedRooms.includes(d.roomId))
      .map((d) => ({
        name: d.roomTitle.length > 10 ? d.roomTitle.slice(0, 10) + '...' : d.roomTitle,
        峰值人数: d.metrics.peakViewers,
        平均人数: d.metrics.avgViewers,
      }));
  }, [selectedRooms]);

  const colors = ['#06B6D4', '#8B5CF6', '#F97316', '#10B981', '#EF4444'];

  const toggleRoom = (roomId: string) => {
    setSelectedRooms((prev) =>
      prev.includes(roomId)
        ? prev.filter((id) => id !== roomId)
        : prev.length < 5
        ? [...prev, roomId]
        : prev
    );
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-text-primary">数据分析</h2>
          <p className="text-sm text-text-secondary mt-1">
            多场直播数据对比与趋势分析
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-bg-secondary rounded-lg p-0.5 border border-border">
            {[
              { value: 'today', label: '今日' },
              { value: 'week', label: '本周' },
              { value: 'month', label: '本月' },
            ].map((range) => (
              <button
                key={range.value}
                onClick={() => setTimeRange(range.value as 'today' | 'week' | 'month')}
                className={cn(
                  'px-4 py-2 rounded-md text-sm font-medium transition-all',
                  timeRange === range.value
                    ? 'bg-accent/10 text-accent'
                    : 'text-text-secondary hover:text-text-primary'
                )}
              >
                {range.label}
              </button>
            ))}
          </div>
          <button className="h-9 px-4 rounded-lg bg-accent/10 text-accent text-sm font-medium hover:bg-accent/20 transition-colors flex items-center gap-2">
            <Download size={16} />
            导出报表
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <StatCard
          title="开播场次"
          value={platformOverview.liveRooms}
          icon={BarChart3}
          color="cyan"
        />
        <StatCard
          title="总观看人次"
          value={formatNumber(platformOverview.totalViewers)}
          icon={Users}
          color="purple"
          trend={{ value: 12.5, isUp: true }}
        />
        <StatCard
          title="总订单数"
          value={formatNumber(platformOverview.totalOrders)}
          icon={ShoppingCart}
          color="orange"
          trend={{ value: 18.3, isUp: true }}
        />
        <StatCard
          title="总GMV"
          value={formatPrice(platformOverview.totalGmv)}
          icon={DollarSign}
          color="green"
          trend={{ value: 15.7, isUp: true }}
        />
        <StatCard
          title="平均转化率"
          value={formatPercent(platformOverview.avgConversionRate)}
          icon={TrendingUp}
          color="red"
        />
        <StatCard
          title="新增关注"
          value={formatNumber(platformOverview.newFollowers)}
          icon={Heart}
          color="blue"
          trend={{ value: 8.2, isUp: true }}
        />
      </div>

      <div className="bg-bg-secondary rounded-xl border border-border p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-semibold text-text-primary">
            对比直播间
          </h3>
          <span className="text-xs text-text-tertiary">
            最多选择 5 个直播间对比
          </span>
        </div>
        <div className="flex flex-wrap gap-2">
          {analyticsData.map((room, index) => (
            <button
              key={room.roomId}
              onClick={() => toggleRoom(room.roomId)}
              className={cn(
                'h-9 px-4 rounded-lg text-sm font-medium transition-all flex items-center gap-2 border',
                selectedRooms.includes(room.roomId)
                  ? 'border-transparent'
                  : 'border-border text-text-secondary hover:text-text-primary'
              )}
              style={{
                backgroundColor: selectedRooms.includes(room.roomId)
                  ? `${colors[index % colors.length]}20`
                  : undefined,
                color: selectedRooms.includes(room.roomId)
                  ? colors[index % colors.length]
                  : undefined,
                borderColor: selectedRooms.includes(room.roomId)
                  ? `${colors[index % colors.length]}50`
                  : undefined,
              }}
            >
              <span
                className={cn(
                  'w-2 h-2 rounded-full',
                  selectedRooms.includes(room.roomId) ? '' : 'bg-text-tertiary'
                )}
                style={{
                  backgroundColor: selectedRooms.includes(room.roomId)
                    ? colors[index % colors.length]
                    : undefined,
                }}
              />
              {room.roomTitle.length > 12
                ? room.roomTitle.slice(0, 12) + '...'
                : room.roomTitle}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-bg-secondary rounded-xl border border-border p-5">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-base font-semibold text-text-primary flex items-center gap-2">
              <BarChart3 size={18} className="text-cyan-500" />
              观看峰值对比
            </h3>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={peakComparisonData} barGap={8}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                <XAxis
                  dataKey="name"
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
                  formatter={(value: number) => formatNumber(value)}
                />
                <Legend />
                <Bar dataKey="峰值人数" fill="#06B6D4" radius={[4, 4, 0, 0]} />
                <Bar dataKey="平均人数" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-bg-secondary rounded-xl border border-border p-5">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-base font-semibold text-text-primary flex items-center gap-2">
              <TrendingUp size={18} className="text-green-500" />
              转化趋势
            </h3>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={conversionTrendData}>
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
                <Legend />
                <Line
                  type="monotone"
                  dataKey="关注转化"
                  stroke="#06B6D4"
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="商品点击"
                  stroke="#F97316"
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="成交转化"
                  stroke="#10B981"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="bg-bg-secondary rounded-xl border border-border overflow-hidden">
        <div className="p-5 border-b border-border">
          <h3 className="text-base font-semibold text-text-primary">
            详细数据
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-bg-primary/50">
                <th className="text-left text-sm font-medium text-text-secondary px-5 py-3">
                  直播间
                </th>
                <th className="text-right text-sm font-medium text-text-secondary px-5 py-3">
                  峰值人数
                </th>
                <th className="text-right text-sm font-medium text-text-secondary px-5 py-3">
                  平均人数
                </th>
                <th className="text-right text-sm font-medium text-text-secondary px-5 py-3">
                  总观看
                </th>
                <th className="text-right text-sm font-medium text-text-secondary px-5 py-3">
                  新增关注
                </th>
                <th className="text-right text-sm font-medium text-text-secondary px-5 py-3">
                  互动率
                </th>
                <th className="text-right text-sm font-medium text-text-secondary px-5 py-3">
                  商品点击
                </th>
                <th className="text-right text-sm font-medium text-text-secondary px-5 py-3">
                  订单数
                </th>
                <th className="text-right text-sm font-medium text-text-secondary px-5 py-3">
                  GMV
                </th>
                <th className="text-right text-sm font-medium text-text-secondary px-5 py-3">
                  转化率
                </th>
              </tr>
            </thead>
            <tbody>
              {analyticsData.map((data, index) => (
                <tr
                  key={data.roomId}
                  className={cn(
                    'border-b border-border/50 hover:bg-bg-primary/30 transition-colors',
                    index === analyticsData.length - 1 && 'border-b-0'
                  )}
                >
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <span
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: colors[index % colors.length] }}
                      />
                      <span className="text-sm font-medium text-text-primary">
                        {data.roomTitle}
                      </span>
                    </div>
                  </td>
                  <td className="text-right px-5 py-4">
                    <span className="text-sm text-text-primary">
                      {formatNumber(data.metrics.peakViewers)}
                    </span>
                  </td>
                  <td className="text-right px-5 py-4">
                    <span className="text-sm text-text-primary">
                      {formatNumber(data.metrics.avgViewers)}
                    </span>
                  </td>
                  <td className="text-right px-5 py-4">
                    <span className="text-sm text-text-primary">
                      {formatNumber(data.metrics.totalViewers)}
                    </span>
                  </td>
                  <td className="text-right px-5 py-4">
                    <span className="text-sm text-green-500 font-medium">
                      +{formatNumber(data.metrics.newFollowers)}
                    </span>
                  </td>
                  <td className="text-right px-5 py-4">
                    <span className="text-sm text-text-primary">
                      {data.metrics.interactionRate}%
                    </span>
                  </td>
                  <td className="text-right px-5 py-4">
                    <span className="text-sm text-text-primary">
                      {formatNumber(data.metrics.productClicks)}
                    </span>
                  </td>
                  <td className="text-right px-5 py-4">
                    <span className="text-sm text-text-primary">
                      {formatNumber(data.metrics.orders)}
                    </span>
                  </td>
                  <td className="text-right px-5 py-4">
                    <span className="text-sm text-text-primary font-medium">
                      {formatPrice(data.metrics.gmv)}
                    </span>
                  </td>
                  <td className="text-right px-5 py-4">
                    <span
                      className={cn(
                        'text-sm font-medium',
                        data.metrics.conversionRate > 3
                          ? 'text-green-500'
                          : 'text-orange-500'
                      )}
                    >
                      {data.metrics.conversionRate}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
