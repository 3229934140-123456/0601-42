import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  TrendingUp,
  Users,
  DollarSign,
  ShoppingCart,
  BarChart3,
  Calendar,
  Download,
  X,
  Plus,
  AlertTriangle,
  FileText,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Legend,
} from 'recharts';
import { useAppStore } from '@/store/useAppStore';
import { channels } from '@/data/channels';
import {
  formatNumber,
  formatPrice,
  formatDate,
} from '@/utils/format';
import { cn } from '@/lib/utils';

const timeRanges = [
  { value: 'today', label: '今日' },
  { value: 'week', label: '本周' },
  { value: 'month', label: '本月' },
  { value: 'custom', label: '自定义' },
];

const compareDimensions = [
  { key: 'peakViewers', label: '在线峰值', icon: Users, unit: '人' },
  { key: 'interactionRate', label: '互动率', icon: TrendingUp, unit: '%' },
  { key: 'productClicks', label: '商品点击', icon: ShoppingCart, unit: '次' },
  { key: 'conversion', label: '成交转化', icon: DollarSign, unit: '%' },
  { key: 'riskCount', label: '风险数量', icon: AlertTriangle, unit: '条' },
];

const AnalyticsPage = () => {
  const navigate = useNavigate();
  const channelsData = useAppStore((state) => state.channels);
  const selectedCompareRooms = useAppStore(
    (state) => state.selectedCompareRooms
  );
  const toggleCompareRoom = useAppStore(
    (state) => state.toggleCompareRoom
  );
  const getViewerTrend = useAppStore((state) => state.getViewerTrend);
  const getPendingRisksCount = useAppStore(
    (state) => state.getPendingRisksCount
  );
  const getRoomProducts = useAppStore((state) => state.getRoomProducts);

  const [timeRange, setTimeRange] = useState('week');
  const [showRoomSelector, setShowRoomSelector] = useState(false);

  const compareRooms = useMemo(() => {
    return channelsData.filter((c) => selectedCompareRooms.includes(c.id));
  }, [channelsData, selectedCompareRooms]);

  const compareData = useMemo(() => {
    return compareRooms.map((room) => {
      const products = getRoomProducts(room.id);
      const totalGmv = products.reduce(
        (sum, p) => sum + p.salesVolume * p.price,
        0
      );
      const totalClicks = products.reduce((sum, p) => sum + p.clickCount, 0);
      const riskCount = getPendingRisksCount(room.id);

      return {
        name: room.title,
        id: room.id,
        peakViewers: room.peakViewers,
        interactionRate: 12.5 + Math.random() * 5,
        productClicks: totalClicks,
        conversion: (3 + Math.random() * 4).toFixed(1),
        riskCount,
        gmv: totalGmv,
      };
    });
  }, [compareRooms, getRoomProducts, getPendingRisksCount]);

  const trendData = useMemo(() => {
    if (compareRooms.length === 0) return [];

    const firstRoomTrend = getViewerTrend(compareRooms[0]?.id) || [];
    return firstRoomTrend.map((point, index) => {
      const dataPoint: Record<string, any> = { time: point.time };
      compareRooms.forEach((room) => {
        const trend = getViewerTrend(room.id) || [];
        dataPoint[room.title] = trend[index]?.viewers || 0;
      });
      return dataPoint;
    });
  }, [compareRooms, getViewerTrend]);

  const barChartData = useMemo(() => {
    return [
      {
        name: '在线峰值(百)',
        ...Object.fromEntries(
          compareData.map((d) => [d.name, Math.round(d.peakViewers / 100)])
        ),
      },
      {
        name: '互动率(%)',
        ...Object.fromEntries(
          compareData.map((d) => [d.name, d.interactionRate.toFixed(1)])
        ),
      },
      {
        name: '商品点击(百)',
        ...Object.fromEntries(
          compareData.map((d) => [d.name, Math.round(d.productClicks / 100)])
        ),
      },
      {
        name: '转化率(%)',
        ...Object.fromEntries(
          compareData.map((d) => [d.name, d.conversion])
        ),
      },
      {
        name: '风险数量',
        ...Object.fromEntries(
          compareData.map((d) => [d.name, d.riskCount])
        ),
      },
    ];
  }, [compareData]);

  const handleExport = () => {
    const content = `多场对比分析报告
生成时间：${new Date().toLocaleString('zh-CN')}
时间范围：${timeRanges.find((t) => t.value === timeRange)?.label}

对比直播间：${compareRooms.map((r) => r.title).join('、')}

关键指标对比：
${compareData
  .map(
    (d) => `
【${d.name}】
在线峰值：${formatNumber(d.peakViewers)} 人
互动率：${d.interactionRate.toFixed(1)}%
商品点击：${formatNumber(d.productClicks)} 次
成交转化率：${d.conversion}%
风险数量：${d.riskCount} 条
预计GMV：${formatPrice(d.gmv)}
`
  )
  .join('')}
`;

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `多场对比报告_${formatDate(new Date().toISOString())}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const colors = [
    '#0ea5e9',
    '#10b981',
    '#f59e0b',
    '#ef4444',
    '#8b5cf6',
  ];

  const availableRooms = channelsData.filter(
    (c) => !selectedCompareRooms.includes(c.id)
  );

  return (
    <div className="h-full flex flex-col gap-6 overflow-y-auto">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-text-primary">数据分析</h2>
          <p className="text-sm text-text-secondary mt-1">
            多维度直播数据对比分析
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-bg-secondary rounded-lg p-1 border border-border">
            {timeRanges.map((range) => (
              <button
                key={range.value}
                onClick={() => setTimeRange(range.value)}
                className={cn(
                  'px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2',
                  timeRange === range.value
                    ? 'bg-accent/10 text-accent'
                    : 'text-text-secondary hover:text-text-primary'
                )}
              >
                <Calendar size={14} />
                {range.label}
              </button>
            ))}
          </div>
          <button
            onClick={handleExport}
            className="h-9 px-4 rounded-lg bg-accent text-white text-sm font-medium hover:bg-accent/90 transition-colors flex items-center gap-2"
          >
            <Download size={16} />
            导出报告
          </button>
        </div>
      </div>

      <div className="bg-bg-secondary rounded-xl border border-border p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-semibold text-text-primary flex items-center gap-2">
            <BarChart3 size={18} className="text-accent" />
            多场对比看板
            <span className="text-sm font-normal text-text-secondary">
              （{selectedCompareRooms.length}/5 个直播间）
            </span>
          </h3>
          <button
            onClick={() => setShowRoomSelector(!showRoomSelector)}
            className="text-sm text-accent hover:underline flex items-center gap-1"
          >
            {showRoomSelector ? <X size={14} /> : <Plus size={14} />}
            {showRoomSelector ? '收起选择' : '添加直播间'}
          </button>
        </div>

        {showRoomSelector && (
          <div className="mb-4 p-4 rounded-lg bg-bg-primary border border-border">
            <p className="text-sm text-text-secondary mb-3">
              选择要对比的直播间（最多5个）：
            </p>
            <div className="flex flex-wrap gap-2">
              {availableRooms.map((room) => (
                <button
                  key={room.id}
                  onClick={() => {
                    if (selectedCompareRooms.length < 5) {
                      toggleCompareRoom(room.id);
                    }
                  }}
                  disabled={selectedCompareRooms.length >= 5}
                  className={cn(
                    'px-3 py-1.5 rounded-lg text-sm transition-all flex items-center gap-2 border',
                    selectedCompareRooms.length >= 5
                      ? 'bg-bg-tertiary text-text-tertiary border-border cursor-not-allowed'
                      : 'bg-bg-secondary text-text-secondary border-border hover:text-accent hover:border-accent/50'
                  )}
                >
                  <Plus size={12} />
                  {room.title}
                </button>
              ))}
            </div>
          </div>
        )}

        {compareRooms.length === 0 ? (
          <div className="py-16 flex flex-col items-center justify-center text-text-tertiary">
            <BarChart3 size={64} className="mb-4 opacity-50" />
            <p className="text-lg mb-2">暂无对比数据</p>
            <p className="text-sm mb-6">
              从频道墙选择 2-5 个直播间进行对比分析
            </p>
            <button
              onClick={() => navigate('/')}
              className="h-10 px-5 rounded-lg bg-accent text-white text-sm font-medium hover:bg-accent/90 transition-colors flex items-center gap-2"
            >
              去频道墙选择
            </button>
          </div>
        ) : (
          <>
            <div className="flex flex-wrap gap-3 mb-6">
              {compareRooms.map((room, index) => (
                <div
                  key={room.id}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg bg-bg-primary border border-border"
                >
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: colors[index % colors.length] }}
                  />
                  <span className="text-sm text-text-primary">
                    {room.title}
                  </span>
                  <button
                    onClick={() => toggleCompareRoom(room.id)}
                    className="p-0.5 rounded hover:bg-bg-secondary text-text-tertiary hover:text-text-primary"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
              {compareDimensions.map((dim, index) => (
                <div
                  key={dim.key}
                  className="p-4 rounded-xl bg-bg-primary border border-border"
                >
                  <div className="flex items-center gap-2 text-text-secondary mb-3">
                    <dim.icon size={16} />
                    <span className="text-xs">{dim.label}</span>
                  </div>
                  <div className="space-y-2">
                    {compareData.map((d, i) => (
                      <div
                        key={d.id}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center gap-2">
                          <div
                            className="w-2 h-2 rounded-full"
                            style={{
                              backgroundColor: colors[i % colors.length],
                            }}
                          />
                          <span className="text-xs text-text-secondary truncate max-w-[80px]">
                            {d.name}
                          </span>
                        </div>
                        <span className="text-sm font-medium text-text-primary">
                          {dim.key === 'peakViewers'
                            ? formatNumber(d.peakViewers)
                            : dim.key === 'interactionRate'
                            ? `${d.interactionRate.toFixed(1)}%`
                            : dim.key === 'productClicks'
                            ? formatNumber(d.productClicks)
                            : dim.key === 'conversion'
                            ? `${d.conversion}%`
                            : `${d.riskCount}条`}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="p-4 rounded-xl bg-bg-primary border border-border">
                <h4 className="text-sm font-semibold text-text-primary mb-4">
                  在线人数趋势对比
                </h4>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={trendData}>
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
                          fontSize: '12px',
                        }}
                      />
                      <Legend
                        wrapperStyle={{ fontSize: '12px' }}
                      />
                      {compareRooms.map((room, index) => (
                        <Line
                          key={room.id}
                          type="monotone"
                          dataKey={room.title}
                          stroke={colors[index % colors.length]}
                          strokeWidth={2}
                          dot={false}
                        />
                      ))}
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-bg-primary border border-border">
                <h4 className="text-sm font-semibold text-text-primary mb-4">
                  核心指标对比
                </h4>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={barChartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                      <XAxis
                        dataKey="name"
                        stroke="var(--color-text-tertiary)"
                        fontSize={11}
                      />
                      <YAxis
                        stroke="var(--color-text-tertiary)"
                        fontSize={11}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'var(--color-bg-secondary)',
                          border: '1px solid var(--color-border)',
                          borderRadius: '8px',
                          fontSize: '12px',
                        }}
                      />
                      <Legend
                        wrapperStyle={{ fontSize: '12px' }}
                      />
                      {compareRooms.map((room, index) => (
                        <Bar
                          key={room.id}
                          dataKey={room.title}
                          fill={colors[index % colors.length]}
                          radius={[4, 4, 0, 0]}
                        />
                      ))}
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            <div className="mt-6 p-4 rounded-xl bg-bg-primary border border-border">
              <h4 className="text-sm font-semibold text-text-primary mb-4">
                详细数据对比表
              </h4>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-4 text-text-secondary font-medium">
                        指标
                      </th>
                      {compareData.map((d, i) => (
                        <th
                          key={d.id}
                          className="text-left py-3 px-4 font-medium"
                        >
                          <div className="flex items-center gap-2">
                            <div
                              className="w-2 h-2 rounded-full"
                              style={{
                                backgroundColor: colors[i % colors.length],
                              }}
                            />
                            <span className="text-text-primary">{d.name}</span>
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-border">
                      <td className="py-3 px-4 text-text-secondary">在线峰值</td>
                      {compareData.map((d) => (
                        <td key={d.id} className="py-3 px-4 text-text-primary font-medium">
                          {formatNumber(d.peakViewers)}
                        </td>
                      ))}
                    </tr>
                    <tr className="border-b border-border">
                      <td className="py-3 px-4 text-text-secondary">互动率</td>
                      {compareData.map((d) => (
                        <td key={d.id} className="py-3 px-4 text-text-primary">
                          {d.interactionRate.toFixed(1)}%
                        </td>
                      ))}
                    </tr>
                    <tr className="border-b border-border">
                      <td className="py-3 px-4 text-text-secondary">商品点击</td>
                      {compareData.map((d) => (
                        <td key={d.id} className="py-3 px-4 text-text-primary">
                          {formatNumber(d.productClicks)}
                        </td>
                      ))}
                    </tr>
                    <tr className="border-b border-border">
                      <td className="py-3 px-4 text-text-secondary">成交转化</td>
                      {compareData.map((d) => (
                        <td key={d.id} className="py-3 px-4 text-text-primary">
                          {d.conversion}%
                        </td>
                      ))}
                    </tr>
                    <tr className="border-b border-border">
                      <td className="py-3 px-4 text-text-secondary">风险数量</td>
                      {compareData.map((d) => (
                        <td
                          key={d.id}
                          className={cn(
                            'py-3 px-4 font-medium',
                            d.riskCount > 0 ? 'text-red-500' : 'text-green-500'
                          )}
                        >
                          {d.riskCount} 条
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="py-3 px-4 text-text-secondary">预计GMV</td>
                      {compareData.map((d) => (
                        <td key={d.id} className="py-3 px-4 text-accent font-semibold">
                          {formatPrice(d.gmv)}
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-bg-secondary rounded-xl border border-border p-4">
          <h3 className="text-base font-semibold text-text-primary mb-4 flex items-center gap-2">
            <TrendingUp size={18} className="text-green-500" />
            整体观看趋势
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={getViewerTrend(channelsData[0]?.id) || []}>
                <defs>
                  <linearGradient id="colorAll" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
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
                <Line
                  type="monotone"
                  dataKey="viewers"
                  name="全部频道"
                  stroke="#0ea5e9"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-bg-secondary rounded-xl border border-border p-4">
          <h3 className="text-base font-semibold text-text-primary mb-4 flex items-center gap-2">
            <ShoppingCart size={18} className="text-purple-500" />
            分类GMV分布
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={[
                  { name: '美妆个护', value: 1280000 },
                  { name: '服饰鞋包', value: 960000 },
                  { name: '食品生鲜', value: 720000 },
                  { name: '数码家电', value: 540000 },
                  { name: '生活家居', value: 420000 },
                  { name: '母婴用品', value: 280000 },
                ]}
                layout="vertical"
              >
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis
                  type="number"
                  stroke="var(--color-text-tertiary)"
                  fontSize={11}
                  tickFormatter={(val) => `¥${(val / 10000).toFixed(0)}万`}
                />
                <YAxis
                  dataKey="name"
                  type="category"
                  stroke="var(--color-text-tertiary)"
                  fontSize={11}
                  width={80}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--color-bg-secondary)',
                    border: '1px solid var(--color-border)',
                    borderRadius: '8px',
                    color: 'var(--color-text-primary)',
                    fontSize: '12px',
                  }}
                  formatter={(value: number) => [formatPrice(value), 'GMV']}
                />
                <Bar
                  dataKey="value"
                  fill="#8b5cf6"
                  radius={[0, 4, 4, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
