import { useState, useMemo, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  AlertTriangle,
  Shield,
  Clock,
  CheckCircle,
  XCircle,
  MessageSquare,
  Search,
  Filter,
  Eye,
  FileText,
  User,
  AlertCircle,
} from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { channels } from '@/data/channels';
import { staffList } from '@/data/schedule';
import {
  formatTime,
  formatDate,
  getRiskLevelText,
  getRiskTypeText,
} from '@/utils/format';
import { generateLiveReport, downloadReport } from '@/utils/export';
import { cn } from '@/lib/utils';
import type { Risk, RiskLevel, RiskStatus } from '@/types';

const RisksPage = () => {
  const { id } = useParams<{ id: string }>();
  const currentRoomId = useAppStore((state) => state.currentRoomId);
  const setCurrentRoomId = useAppStore((state) => state.setCurrentRoomId);
  const getRoomRisks = useAppStore((state) => state.getRoomRisks);
  const updateRiskStatus = useAppStore((state) => state.updateRiskStatus);
  const addRiskNote = useAppStore((state) => state.addRiskNote);
  const operatorConclusions = useAppStore(
    (state) => state.operatorConclusions
  );

  const roomId = id || currentRoomId;
  const room = channels.find((c) => c.id === roomId);

  useEffect(() => {
    if (id && id !== currentRoomId) {
      setCurrentRoomId(id);
    }
  }, [id, currentRoomId, setCurrentRoomId]);
  const risks = getRoomRisks(roomId);

  const [selectedRisk, setSelectedRisk] = useState<Risk | null>(null);
  const [levelFilter, setLevelFilter] = useState<RiskLevel | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<RiskStatus | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [noteInput, setNoteInput] = useState('');

  const hasData = risks.length > 0;

  const stats = useMemo(() => {
    const pending = risks.filter((r) => r.status === 'pending').length;
    const processing = risks.filter((r) => r.status === 'processing').length;
    const resolved = risks.filter((r) => r.status === 'resolved').length;
    const critical = risks.filter((r) => r.level === 'critical').length;

    return { total: risks.length, pending, processing, resolved, critical };
  }, [risks]);

  const filteredRisks = useMemo(() => {
    let result = [...risks].sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );

    if (levelFilter !== 'all') {
      result = result.filter((r) => r.level === levelFilter);
    }
    if (statusFilter !== 'all') {
      result = result.filter((r) => r.status === statusFilter);
    }
    if (searchQuery) {
      result = result.filter(
        (r) =>
          r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          r.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return result;
  }, [risks, levelFilter, statusFilter, searchQuery]);

  const getLevelColor = (level: RiskLevel) => {
    switch (level) {
      case 'critical':
        return 'bg-red-500';
      case 'high':
        return 'bg-orange-500';
      case 'medium':
        return 'bg-yellow-500';
      case 'low':
        return 'bg-green-500';
    }
  };

  const getLevelBgColor = (level: RiskLevel) => {
    switch (level) {
      case 'critical':
        return 'bg-red-500/10 border-red-500/30 text-red-500';
      case 'high':
        return 'bg-orange-500/10 border-orange-500/30 text-orange-500';
      case 'medium':
        return 'bg-yellow-500/10 border-yellow-500/30 text-yellow-500';
      case 'low':
        return 'bg-green-500/10 border-green-500/30 text-green-500';
    }
  };

  const getStatusIcon = (status: RiskStatus) => {
    switch (status) {
      case 'pending':
        return <Clock size={14} />;
      case 'processing':
        return <AlertTriangle size={14} />;
      case 'resolved':
        return <CheckCircle size={14} />;
      case 'ignored':
        return <XCircle size={14} />;
    }
  };

  const handleExport = () => {
    if (!room) return;

    const comments = useAppStore.getState().getRoomComments(roomId);
    const pinnedComments = comments.filter((c) => c.isPinned);
    const products = useAppStore.getState().getRoomProducts(roomId);
    const oralBroadcasts = useAppStore.getState().getRoomOralBroadcasts(roomId);
    const frequentComments = useAppStore
      .getState()
      .getRoomFrequentComments(roomId);

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

  const handleAddNote = () => {
    if (!noteInput.trim() || !selectedRisk) return;
    addRiskNote(roomId, selectedRisk.id, noteInput.trim(), '运营小张');
    setNoteInput('');
    const updated = getRoomRisks(roomId).find((r) => r.id === selectedRisk.id);
    if (updated) setSelectedRisk(updated);
  };

  const handleStatusChange = (status: RiskStatus) => {
    if (!selectedRisk) return;
    updateRiskStatus(roomId, selectedRisk.id, status);
    const updated = getRoomRisks(roomId).find((r) => r.id === selectedRisk.id);
    if (updated) setSelectedRisk(updated);
  };

  if (!hasData) {
    return (
      <div className="h-full flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-text-primary">风险监控</h2>
            <p className="text-sm text-text-secondary mt-1">
              {room ? `${room.title} - ` : ''}实时监控直播间违规风险，及时处理告警
            </p>
          </div>
          <button
            onClick={handleExport}
            className="h-9 px-4 rounded-lg bg-accent/10 text-accent text-sm font-medium hover:bg-accent/20 transition-colors flex items-center gap-2"
          >
            <FileText size={16} />
            导出复盘
          </button>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center bg-bg-secondary rounded-xl border border-border">
          <Shield size={64} className="text-green-500 mb-4 opacity-50" />
          <h3 className="text-lg font-medium text-text-primary mb-2">
            暂无风险告警
          </h3>
          <p className="text-sm text-text-secondary mb-6">
            该直播间暂无风险记录，直播状态良好
          </p>
          <button className="h-10 px-5 rounded-lg border border-border text-text-secondary text-sm font-medium hover:text-text-primary hover:border-border-hover transition-colors">
            查看风险规则配置
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-text-primary">风险监控</h2>
          <p className="text-sm text-text-secondary mt-1">
            {room ? `${room.title} - ` : ''}实时监控直播间违规风险，及时处理告警
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-2 bg-bg-secondary rounded-lg border border-border">
            {stats.pending > 0 && (
              <>
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                <span className="text-sm text-text-secondary">
                  待处理:{' '}
                  <span className="text-red-500 font-medium">
                    {stats.pending}
                  </span>
                </span>
              </>
            )}
            {stats.pending === 0 && (
              <>
                <span className="w-2 h-2 rounded-full bg-green-500" />
                <span className="text-sm text-text-secondary">
                  全部已处理
                </span>
              </>
            )}
          </div>
          <button
            onClick={handleExport}
            className="h-9 px-4 rounded-lg bg-accent/10 text-accent text-sm font-medium hover:bg-accent/20 transition-colors flex items-center gap-2"
          >
            <FileText size={16} />
            导出复盘
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-bg-secondary rounded-xl border border-border p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center">
              <AlertTriangle size={20} className="text-red-500" />
            </div>
            <div>
              <p className="text-sm text-text-secondary">严重风险</p>
              <p className="text-xl font-bold text-red-500">
                {stats.critical}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-bg-secondary rounded-xl border border-border p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-yellow-500/10 flex items-center justify-center">
              <Clock size={20} className="text-yellow-500" />
            </div>
            <div>
              <p className="text-sm text-text-secondary">待处理</p>
              <p className="text-xl font-bold text-yellow-500">
                {stats.pending}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-bg-secondary rounded-xl border border-border p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
              <Shield size={20} className="text-blue-500" />
            </div>
            <div>
              <p className="text-sm text-text-secondary">处理中</p>
              <p className="text-xl font-bold text-blue-500">
                {stats.processing}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-bg-secondary rounded-xl border border-border p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
              <CheckCircle size={20} className="text-green-500" />
            </div>
            <div>
              <p className="text-sm text-text-secondary">已解决</p>
              <p className="text-xl font-bold text-green-500">
                {stats.resolved}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 flex-1 min-h-0">
        <div className="lg:col-span-3 flex flex-col bg-bg-secondary rounded-xl border border-border overflow-hidden">
          <div className="p-4 border-b border-border">
            <div className="flex items-center justify-between gap-4">
              <h3 className="text-base font-semibold text-text-primary flex items-center gap-2">
                <AlertTriangle size={18} className="text-red-500" />
                风险告警列表
              </h3>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search
                    size={14}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary"
                  />
                  <input
                    type="text"
                    placeholder="搜索风险..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-40 h-8 pl-8 pr-3 rounded-lg bg-bg-primary border border-border text-sm text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-accent/50"
                  />
                </div>
                <div className="flex items-center gap-1 bg-bg-primary rounded-lg p-0.5 border border-border">
                  {[
                    { value: 'all', label: '全部' },
                    { value: 'pending', label: '待处理' },
                    { value: 'resolved', label: '已解决' },
                  ].map((filter) => (
                    <button
                      key={filter.value}
                      onClick={() =>
                        setStatusFilter(filter.value as RiskStatus | 'all')
                      }
                      className={cn(
                        'px-2.5 py-1 rounded-md text-xs font-medium transition-all',
                        statusFilter === filter.value
                          ? 'bg-accent/10 text-accent'
                          : 'text-text-secondary hover:text-text-primary'
                      )}
                    >
                      {filter.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {filteredRisks.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-text-tertiary">
                <AlertCircle size={40} className="mb-3 opacity-50" />
                <p>没有匹配的风险</p>
              </div>
            ) : (
              filteredRisks.map((risk) => (
                <div
                  key={risk.id}
                  onClick={() => setSelectedRisk(risk)}
                  className={cn(
                    'p-4 rounded-xl border cursor-pointer transition-all',
                    selectedRisk?.id === risk.id
                      ? 'border-accent bg-accent/5'
                      : 'border-border bg-bg-primary hover:border-accent/50'
                  )}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={cn(
                        'w-2 h-2 rounded-full mt-1.5 shrink-0',
                        getLevelColor(risk.level)
                      )}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="font-medium text-text-primary text-sm">
                          {risk.title}
                        </h4>
                        <div className="flex items-center gap-2 shrink-0">
                          <span
                            className={cn(
                              'px-2 py-0.5 rounded text-xs font-medium border',
                              getLevelBgColor(risk.level)
                            )}
                          >
                            {getRiskLevelText(risk.level)}
                          </span>
                        </div>
                      </div>
                      <p className="text-xs text-text-secondary mt-1 line-clamp-2">
                        {risk.description}
                      </p>
                      <div className="mt-2 flex items-center gap-4 text-xs text-text-tertiary">
                        <span className="flex items-center gap-1">
                          <Clock size={12} />
                          {formatTime(risk.timestamp)}
                        </span>
                        <span className="flex items-center gap-1">
                          {getStatusIcon(risk.status)}
                          {risk.status === 'pending'
                            ? '待处理'
                            : risk.status === 'processing'
                            ? '处理中'
                            : risk.status === 'resolved'
                            ? '已解决'
                            : '已忽略'}
                        </span>
                        {risk.handler && (
                          <span className="flex items-center gap-1">
                            <User size={12} />
                            {risk.handler}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="lg:col-span-2 flex flex-col bg-bg-secondary rounded-xl border border-border overflow-hidden">
          {selectedRisk ? (
            <>
              <div className="p-4 border-b border-border">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-semibold text-text-primary flex items-center gap-2">
                    <Eye size={18} className="text-accent" />
                    风险详情
                  </h3>
                  <span
                    className={cn(
                      'px-2.5 py-1 rounded text-xs font-medium border',
                      getLevelBgColor(selectedRisk.level)
                    )}
                  >
                    {getRiskLevelText(selectedRisk.level)}
                  </span>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-text-primary">
                    {selectedRisk.title}
                  </h4>
                  <p className="text-sm text-text-secondary mt-2 leading-relaxed">
                    {selectedRisk.description}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-lg bg-bg-primary">
                    <p className="text-xs text-text-tertiary">风险类型</p>
                    <p className="text-sm font-medium text-text-primary mt-1">
                      {getRiskTypeText(selectedRisk.type)}
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-bg-primary">
                    <p className="text-xs text-text-tertiary">发现时间</p>
                    <p className="text-sm font-medium text-text-primary mt-1">
                      {formatDate(selectedRisk.timestamp)}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-lg bg-bg-primary">
                    <p className="text-xs text-text-tertiary">处理人</p>
                    <div className="mt-2">
                      {selectedRisk.handler ? (
                        <div className="flex items-center gap-2">
                          <img
                            src={staffList.find((s) => s.name === selectedRisk.handler)?.avatar || 'https://i.pravatar.cc/150'}
                            alt={selectedRisk.handler}
                            className="w-6 h-6 rounded-full"
                          />
                          <span className="text-sm font-medium text-text-primary">
                            {selectedRisk.handler}
                          </span>
                        </div>
                      ) : (
                        <span className="text-sm text-text-tertiary">未分派</span>
                      )}
                    </div>
                  </div>
                  <div className="p-3 rounded-lg bg-bg-primary">
                    <p className="text-xs text-text-tertiary">分派给</p>
                    <select
                      value={selectedRisk.handler || ''}
                      onChange={(e) => {
                        const handler = e.target.value || undefined;
                        updateRiskStatus(roomId, selectedRisk.id, selectedRisk.status, handler);
                        const updated = getRoomRisks(roomId).find((r) => r.id === selectedRisk.id);
                        if (updated) setSelectedRisk(updated);
                      }}
                      className="mt-1.5 w-full px-2 py-1.5 rounded-lg bg-bg-secondary border border-border text-sm text-text-primary focus:outline-none focus:border-accent/50"
                    >
                      <option value="">未分派</option>
                      {staffList.map((staff) => (
                        <option key={staff.id} value={staff.name}>
                          {staff.name} - {staff.role}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-bg-primary">
                  <p className="text-xs text-text-tertiary">处理状态</p>
                  <div className="mt-2 flex items-center gap-2 flex-wrap">
                    {(['pending', 'processing', 'resolved', 'ignored'] as const).map(
                      (status) => (
                        <button
                          key={status}
                          onClick={() => handleStatusChange(status)}
                          className={cn(
                            'px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5',
                            selectedRisk.status === status
                              ? 'bg-accent text-white'
                              : 'bg-bg-secondary text-text-secondary hover:text-text-primary'
                          )}
                        >
                          {getStatusIcon(status)}
                          {status === 'pending'
                            ? '待处理'
                            : status === 'processing'
                            ? '处理中'
                            : status === 'resolved'
                            ? '已解决'
                            : '已忽略'}
                        </button>
                      )
                    )}
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-bg-primary">
                  <p className="text-xs text-text-tertiary mb-2">处理记录</p>
                  <div className="space-y-3">
                    {selectedRisk.notes.length === 0 ? (
                      <p className="text-sm text-text-tertiary">暂无处理备注</p>
                    ) : (
                      selectedRisk.notes.map((note, index) => (
                        <div
                          key={index}
                          className="flex items-start gap-2 pb-3 border-b border-border last:border-0 last:pb-0"
                        >
                          <div className="w-6 h-6 rounded-full bg-accent/20 shrink-0 flex items-center justify-center">
                            <User size={12} className="text-accent" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-medium text-text-primary">
                                {note.author}
                              </span>
                              <span className="text-xs text-text-tertiary">
                                {formatTime(note.timestamp)}
                              </span>
                            </div>
                            <p className="text-xs text-text-secondary mt-1">
                              {note.content}
                            </p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>

              <div className="p-4 border-t border-border">
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="添加处理备注..."
                    value={noteInput}
                    onChange={(e) => setNoteInput(e.target.value)}
                    onKeyDown={(e) =>
                      e.key === 'Enter' && handleAddNote()
                    }
                    className="flex-1 h-9 px-3 rounded-lg bg-bg-primary border border-border text-sm text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-accent/50"
                  />
                  <button
                    onClick={handleAddNote}
                    disabled={!noteInput.trim()}
                    className="h-9 px-4 rounded-lg bg-accent text-white text-sm font-medium hover:bg-accent/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    发送
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-text-tertiary">
              <MessageSquare size={48} className="mb-3 opacity-50" />
              <p>选择一条风险查看详情</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RisksPage;
