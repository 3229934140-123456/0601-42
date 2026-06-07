import { useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import {
  AlertTriangle,
  Clock,
  CheckCircle,
  XCircle,
  MessageSquare,
  Plus,
  Filter,
  Search,
  AlertCircle,
  Shield,
  Zap,
  Activity,
} from 'lucide-react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from 'recharts';
import { useAppStore } from '@/store/useAppStore';
import { riskStats } from '@/data/risks';
import StatCard from '@/components/common/StatCard';
import {
  formatNumber,
  formatDate,
  getRiskLevelText,
  getRiskLevelColor,
  getRiskLevelBg,
  getRiskTypeText,
  getStatusText,
  getStatusColor,
} from '@/utils/format';
import { cn } from '@/lib/utils';
import type { RiskLevel, RiskStatus } from '@/types';

const RisksPage = () => {
  const { id } = useParams<{ id: string }>();
  const currentRoomId = useAppStore((state) => state.currentRoomId);
  const riskAlerts = useAppStore((state) => state.riskAlerts);
  const addRiskNote = useAppStore((state) => state.addRiskNote);
  const updateRiskStatus = useAppStore((state) => state.updateRiskStatus);

  const roomId = id || currentRoomId;

  const [selectedRiskId, setSelectedRiskId] = useState<string | null>(null);
  const [levelFilter, setLevelFilter] = useState<RiskLevel | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<RiskStatus | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [newNote, setNewNote] = useState('');

  const roomRisks = useMemo(() => {
    let result = riskAlerts;
    
    if (id) {
      result = result.filter((r) => r.roomId === roomId);
    }

    if (levelFilter !== 'all') {
      result = result.filter((r) => r.level === levelFilter);
    }

    if (statusFilter !== 'all') {
      result = result.filter((r) => r.status === statusFilter);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (r) =>
          r.description.toLowerCase().includes(query) ||
          r.roomTitle.toLowerCase().includes(query)
      );
    }

    return result.sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  }, [riskAlerts, roomId, levelFilter, statusFilter, searchQuery, id]);

  const selectedRisk = useMemo(
    () => riskAlerts.find((r) => r.id === selectedRiskId),
    [riskAlerts, selectedRiskId]
  );

  const pendingCount = riskAlerts.filter((r) => r.status === 'pending').length;

  const handleAddNote = () => {
    if (!selectedRiskId || !newNote.trim()) return;
    addRiskNote(selectedRiskId, newNote, '运营小王');
    setNewNote('');
  };

  const handleUpdateStatus = (status: RiskStatus) => {
    if (!selectedRiskId) return;
    updateRiskStatus(selectedRiskId, status, '运营小王');
  };

  const levelOptions: { value: RiskLevel | 'all'; label: string }[] = [
    { value: 'all', label: '全部等级' },
    { value: 'critical', label: '紧急' },
    { value: 'high', label: '严重' },
    { value: 'medium', label: '一般' },
    { value: 'low', label: '轻微' },
  ];

  const statusOptions: { value: RiskStatus | 'all'; label: string }[] = [
    { value: 'all', label: '全部状态' },
    { value: 'pending', label: '待处理' },
    { value: 'processing', label: '处理中' },
    { value: 'resolved', label: '已解决' },
    { value: 'false_alarm', label: '误报' },
  ];

  return (
    <div className="flex flex-col gap-6 h-full">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-text-primary">风险监控</h2>
          <p className="text-sm text-text-secondary mt-1">
            实时监控违规风险，记录处理备注
          </p>
        </div>
        {pendingCount > 0 && (
          <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500/10 border border-red-500/30">
            <AlertTriangle size={18} className="text-red-500 animate-pulse" />
            <span className="text-sm text-red-500 font-medium">
              {pendingCount} 条待处理告警
            </span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          title="今日告警"
          value={riskStats.todayTotal}
          icon={AlertCircle}
          color="red"
          subtitle="较昨日 +15%"
        />
        <StatCard
          title="待处理"
          value={riskStats.pending}
          icon={Clock}
          color="orange"
          subtitle="需及时处理"
        />
        <StatCard
          title="已解决"
          value={riskStats.resolved}
          icon={CheckCircle}
          color="green"
          subtitle={`处理率 ${Math.round((riskStats.resolved / riskStats.todayTotal) * 100)}%`}
        />
        <StatCard
          title="平均处理时效"
          value={riskStats.avgHandleTime}
          icon={Zap}
          color="cyan"
          subtitle="持续优化中"
        />
      </div>

      <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-bg-secondary rounded-xl border border-border overflow-hidden flex flex-col">
          <div className="p-4 border-b border-border">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-semibold text-text-primary flex items-center gap-2">
                <Shield size={18} className="text-red-500" />
                风险告警列表
              </h3>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search
                    size={14}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary"
                  />
                  <input
                    type="text"
                    placeholder="搜索告警..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-44 h-8 pl-8 pr-3 rounded-lg bg-bg-primary border border-border text-sm text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-accent/50"
                  />
                </div>
                <select
                  value={levelFilter}
                  onChange={(e) =>
                    setLevelFilter(e.target.value as RiskLevel | 'all')
                  }
                  className="h-8 px-3 rounded-lg bg-bg-primary border border-border text-sm text-text-primary focus:outline-none focus:border-accent/50"
                >
                  {levelOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                <select
                  value={statusFilter}
                  onChange={(e) =>
                    setStatusFilter(e.target.value as RiskStatus | 'all')
                  }
                  className="h-8 px-3 rounded-lg bg-bg-primary border border-border text-sm text-text-primary focus:outline-none focus:border-accent/50"
                >
                  {statusOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {roomRisks.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-text-tertiary">
                <Shield size={48} className="mb-4 opacity-50" />
                <p>暂无风险告警</p>
              </div>
            ) : (
              <div className="divide-y divide-border">
                {roomRisks.map((risk) => (
                  <div
                    key={risk.id}
                    onClick={() => setSelectedRiskId(risk.id)}
                    className={cn(
                      'p-4 cursor-pointer transition-all',
                      selectedRiskId === risk.id
                        ? 'bg-accent/5 border-l-2 border-accent'
                        : 'hover:bg-bg-primary/50 border-l-2 border-transparent'
                    )}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={cn(
                          'shrink-0 w-10 h-10 rounded-lg flex items-center justify-center',
                          getRiskLevelBg(risk.level)
                        )}
                      >
                        <AlertTriangle
                          size={20}
                          className={getRiskLevelColor(risk.level)}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span
                            className={cn(
                              'px-2 py-0.5 rounded text-xs font-medium',
                              getRiskLevelBg(risk.level),
                              getRiskLevelColor(risk.level)
                            )}
                          >
                            {getRiskLevelText(risk.level)}
                          </span>
                          <span className="text-xs text-text-tertiary">
                            {getRiskTypeText(risk.type)}
                          </span>
                          <span
                            className={cn(
                              'text-xs ml-auto font-medium',
                              getStatusColor(risk.status)
                            )}
                          >
                            {getStatusText(risk.status)}
                          </span>
                        </div>
                        <p className="text-sm text-text-primary mt-2 line-clamp-2">
                          {risk.description}
                        </p>
                        <div className="mt-2 flex items-center justify-between text-xs text-text-tertiary">
                          <span>{risk.roomTitle}</span>
                          <span>{formatDate(risk.timestamp)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="bg-bg-secondary rounded-xl border border-border overflow-hidden flex flex-col">
          <div className="p-4 border-b border-border">
            <h3 className="text-base font-semibold text-text-primary">
              风险详情
            </h3>
          </div>

          {selectedRisk ? (
            <div className="flex-1 overflow-y-auto p-4">
              <div className="space-y-4">
                <div
                  className={cn(
                    'p-4 rounded-lg border',
                    getRiskLevelBg(selectedRisk.level),
                    `border-${
                      selectedRisk.level === 'critical'
                        ? 'red'
                        : selectedRisk.level === 'high'
                        ? 'orange'
                        : selectedRisk.level === 'medium'
                        ? 'yellow'
                        : 'green'
                    }-500/30`
                  )}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle
                      size={20}
                      className={getRiskLevelColor(selectedRisk.level)}
                    />
                    <span
                      className={cn(
                        'font-semibold',
                        getRiskLevelColor(selectedRisk.level)
                      )}
                    >
                      {getRiskLevelText(selectedRisk.level)}风险
                    </span>
                  </div>
                  <p className="text-sm text-text-primary">
                    {selectedRisk.description}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-lg bg-bg-primary border border-border">
                    <div className="text-xs text-text-tertiary mb-1">
                      直播间
                    </div>
                    <div className="text-sm text-text-primary font-medium truncate">
                      {selectedRisk.roomTitle}
                    </div>
                  </div>
                  <div className="p-3 rounded-lg bg-bg-primary border border-border">
                    <div className="text-xs text-text-tertiary mb-1">
                      风险类型
                    </div>
                    <div className="text-sm text-text-primary font-medium">
                      {getRiskTypeText(selectedRisk.type)}
                    </div>
                  </div>
                  <div className="p-3 rounded-lg bg-bg-primary border border-border">
                    <div className="text-xs text-text-tertiary mb-1">
                      发现时间
                    </div>
                    <div className="text-sm text-text-primary font-medium">
                      {formatDate(selectedRisk.timestamp)}
                    </div>
                  </div>
                  <div className="p-3 rounded-lg bg-bg-primary border border-border">
                    <div className="text-xs text-text-tertiary mb-1">
                      当前状态
                    </div>
                    <div
                      className={cn(
                        'text-sm font-medium',
                        getStatusColor(selectedRisk.status)
                      )}
                    >
                      {getStatusText(selectedRisk.status)}
                    </div>
                  </div>
                </div>

                {selectedRisk.handler && (
                  <div className="p-3 rounded-lg bg-bg-primary border border-border">
                    <div className="text-xs text-text-tertiary mb-1">
                      处理人
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-text-primary font-medium">
                        {selectedRisk.handler}
                      </span>
                      <span className="text-xs text-text-tertiary">
                        {selectedRisk.handleTime &&
                          formatDate(selectedRisk.handleTime)}
                      </span>
                    </div>
                  </div>
                )}

                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-sm font-medium text-text-primary flex items-center gap-2">
                      <MessageSquare size={16} className="text-accent" />
                      处理备注
                    </h4>
                  </div>
                  <div className="space-y-2 mb-4">
                    {selectedRisk.notes.length === 0 ? (
                      <p className="text-xs text-text-tertiary text-center py-3">
                        暂无处理备注
                      </p>
                    ) : (
                      selectedRisk.notes.map((note) => (
                        <div
                          key={note.id}
                          className="p-3 rounded-lg bg-bg-primary border border-border"
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-medium text-accent">
                              {note.author}
                            </span>
                            <span className="text-xs text-text-tertiary">
                              {formatDate(note.timestamp)}
                            </span>
                          </div>
                          <p className="text-sm text-text-primary">
                            {note.content}
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newNote}
                      onChange={(e) => setNewNote(e.target.value)}
                      placeholder="添加处理备注..."
                      onKeyDown={(e) =>
                        e.key === 'Enter' && handleAddNote()
                      }
                      className="flex-1 h-9 px-3 rounded-lg bg-bg-primary border border-border text-sm text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-accent/50"
                    />
                    <button
                      onClick={handleAddNote}
                      className="h-9 px-4 rounded-lg bg-accent text-white text-sm font-medium hover:bg-accent/90 transition-colors flex items-center gap-1"
                    >
                      <Plus size={16} />
                      添加
                    </button>
                  </div>
                </div>

                <div className="pt-2 border-t border-border">
                  <h4 className="text-sm font-medium text-text-primary mb-3">
                    操作
                  </h4>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => handleUpdateStatus('processing')}
                      className="h-9 rounded-lg border border-yellow-500/30 text-yellow-500 text-sm font-medium hover:bg-yellow-500/10 transition-colors"
                    >
                      开始处理
                    </button>
                    <button
                      onClick={() => handleUpdateStatus('resolved')}
                      className="h-9 rounded-lg border border-green-500/30 text-green-500 text-sm font-medium hover:bg-green-500/10 transition-colors"
                    >
                      标记已解决
                    </button>
                    <button
                      onClick={() => handleUpdateStatus('false_alarm')}
                      className="h-9 rounded-lg border border-gray-500/30 text-text-secondary text-sm font-medium hover:bg-gray-500/10 transition-colors"
                    >
                      标记误报
                    </button>
                    <button className="h-9 rounded-lg bg-red-500/10 border border-red-500/30 text-red-500 text-sm font-medium hover:bg-red-500/20 transition-colors">
                      紧急处理
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-text-tertiary">
              <Activity size={48} className="mb-4 opacity-50" />
              <p>选择一条告警查看详情</p>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-bg-secondary rounded-xl border border-border p-5">
          <h3 className="text-base font-semibold text-text-primary mb-4">
            风险类型分布
          </h3>
          <div className="h-48 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={riskStats.typeDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={70}
                  paddingAngle={2}
                  dataKey="count"
                >
                  {riskStats.typeDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="ml-6 space-y-2">
              {riskStats.typeDistribution.map((item) => (
                <div key={item.type} className="flex items-center gap-2">
                  <span
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm text-text-secondary">
                    {item.type}
                  </span>
                  <span className="text-sm text-text-primary font-medium ml-auto">
                    {item.count}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-bg-secondary rounded-xl border border-border p-5">
          <h3 className="text-base font-semibold text-text-primary mb-4">
            风险等级分布
          </h3>
          <div className="space-y-4">
            {riskStats.levelDistribution.map((item) => (
              <div key={item.level}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-text-secondary">
                    {item.level}
                  </span>
                  <span className="text-sm font-medium text-text-primary">
                    {item.count} 条
                  </span>
                </div>
                <div className="h-2 bg-bg-primary rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${(item.count / riskStats.todayTotal) * 100}%`,
                      backgroundColor: item.color,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RisksPage;
