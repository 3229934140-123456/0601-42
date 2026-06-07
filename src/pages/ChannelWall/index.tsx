import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Star,
  Users,
  Clock,
  Zap,
  Filter,
  Search,
  Radio,
  BarChart3,
  AlertTriangle,
  CheckSquare,
  Square,
} from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { categories } from '@/data/channels';
import { getHighestRiskLevel, getPendingRisksCount } from '@/data/risks';
import {
  formatNumber,
  formatDuration,
  getLiveStatusText,
  getLiveStatusColor,
  getQualityText,
  getRiskLevelText,
} from '@/utils/format';
import { cn } from '@/lib/utils';
import type { LiveStatus } from '@/types';

const statusFilters: { value: LiveStatus | 'all'; label: string }[] = [
  { value: 'all', label: '全部' },
  { value: 'live', label: '直播中' },
  { value: 'waiting', label: '待开播' },
  { value: 'ended', label: '已结束' },
];

const riskLevelColors: Record<string, string> = {
  critical: 'bg-red-500',
  high: 'bg-orange-500',
  medium: 'bg-yellow-500',
  low: 'bg-green-500',
};

const ChannelWall = () => {
  const navigate = useNavigate();
  const channels = useAppStore((state) => state.channels);
  const toggleStar = useAppStore((state) => state.toggleStar);
  const setCurrentRoomId = useAppStore((state) => state.setCurrentRoomId);
  const selectedCompareRooms = useAppStore(
    (state) => state.selectedCompareRooms
  );
  const toggleCompareRoom = useAppStore(
    (state) => state.toggleCompareRoom
  );

  const [statusFilter, setStatusFilter] = useState<LiveStatus | 'all'>('all');
  const [categoryFilter, setCategoryFilter] = useState('全部');
  const [searchQuery, setSearchQuery] = useState('');
  const [starredFirst, setStarredFirst] = useState(true);
  const [compareMode, setCompareMode] = useState(false);

  const filteredChannels = useMemo(() => {
    let result = [...channels];

    if (statusFilter !== 'all') {
      result = result.filter((c) => c.status === statusFilter);
    }

    if (categoryFilter !== '全部') {
      result = result.filter((c) => c.category === categoryFilter);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (c) =>
          c.title.toLowerCase().includes(query) ||
          c.anchor.name.toLowerCase().includes(query)
      );
    }

    if (starredFirst) {
      result.sort((a, b) => {
        if (a.isStarred && !b.isStarred) return -1;
        if (!a.isStarred && b.isStarred) return 1;
        return b.viewers - a.viewers;
      });
    }

    return result;
  }, [channels, statusFilter, categoryFilter, searchQuery, starredFirst]);

  const handleChannelClick = (roomId: string) => {
    if (compareMode) {
      toggleCompareRoom(roomId);
    } else {
      setCurrentRoomId(roomId);
      navigate(`/live/${roomId}`);
    }
  };

  const handleGoToCompare = () => {
    navigate('/analytics');
  };

  return (
    <div className="h-full flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-text-primary">频道墙</h2>
          <p className="text-sm text-text-secondary mt-1">
            实时监控所有直播间状态
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setCompareMode(!compareMode)}
            className={cn(
              'h-9 px-4 rounded-lg text-sm font-medium flex items-center gap-2 transition-all border',
              compareMode
                ? 'bg-accent/10 text-accent border-accent/30'
                : 'bg-bg-secondary text-text-secondary border-border hover:text-text-primary'
            )}
          >
            {compareMode ? (
              <CheckSquare size={16} />
            ) : (
              <Square size={16} />
            )}
            对比模式
            {compareMode && (
              <span className="ml-1 px-1.5 py-0.5 rounded text-xs bg-accent text-white">
                {selectedCompareRooms.length}/5
              </span>
            )}
          </button>

          {compareMode && (
            <button
              onClick={handleGoToCompare}
              disabled={selectedCompareRooms.length < 2}
              className={cn(
                'h-9 px-4 rounded-lg text-sm font-medium flex items-center gap-2 transition-all',
                selectedCompareRooms.length >= 2
                  ? 'bg-accent text-white hover:bg-accent/90'
                  : 'bg-bg-tertiary text-text-tertiary cursor-not-allowed'
              )}
            >
              <BarChart3 size={16} />
              去对比
            </button>
          )}

          <button
            onClick={() => setStarredFirst(!starredFirst)}
            className={cn(
              'h-9 px-4 rounded-lg text-sm font-medium flex items-center gap-2 transition-all',
              starredFirst
                ? 'bg-accent/10 text-accent border border-accent/30'
                : 'bg-bg-secondary text-text-secondary border border-border hover:text-text-primary'
            )}
          >
            <Star size={16} className={starredFirst ? 'fill-accent' : ''} />
            星标置顶
          </button>
        </div>
      </div>

      {compareMode && (
        <div className="p-4 rounded-lg bg-accent/5 border border-accent/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <BarChart3 size={20} className="text-accent" />
              <span className="text-sm text-text-primary font-medium">
                已选择 {selectedCompareRooms.length} 个直播间进行对比
              </span>
              <span className="text-xs text-text-tertiary">
                （最少选择 2 个，最多选择 5 个）
              </span>
            </div>
            <span className="text-xs text-text-secondary">
              点击直播间卡片进行选择
            </span>
          </div>
        </div>
      )}

      <div className="flex items-center gap-4 flex-wrap">
        <div className="flex items-center gap-2 bg-bg-secondary rounded-lg p-1 border border-border">
          {statusFilters.map((filter) => (
            <button
              key={filter.value}
              onClick={() => setStatusFilter(filter.value)}
              className={cn(
                'px-4 py-2 rounded-md text-sm font-medium transition-all',
                statusFilter === filter.value
                  ? 'bg-accent/10 text-accent'
                  : 'text-text-secondary hover:text-text-primary'
              )}
            >
              {filter.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 bg-bg-secondary rounded-lg px-3 py-2 border border-border">
          <Filter size={16} className="text-text-secondary" />
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-transparent text-sm text-text-primary focus:outline-none cursor-pointer"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div className="relative flex-1 max-w-xs">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary"
          />
          <input
            type="text"
            placeholder="搜索直播间..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-9 pl-9 pr-4 rounded-lg bg-bg-secondary border border-border text-sm text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-accent/50 transition-colors"
          />
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredChannels.map((channel) => {
            const pendingRisks = getPendingRisksCount(channel.id);
            const highestRisk = getHighestRiskLevel(channel.id);
            const isSelected = selectedCompareRooms.includes(channel.id);

            return (
              <div
                key={channel.id}
                onClick={() => handleChannelClick(channel.id)}
                className={cn(
                  'group relative rounded-xl overflow-hidden bg-bg-secondary border cursor-pointer transition-all duration-300',
                  compareMode
                    ? isSelected
                      ? 'border-accent ring-2 ring-accent/50'
                      : 'border-border hover:border-accent/50'
                    : 'border-border hover:border-accent/50 hover:shadow-xl hover:shadow-accent/10 hover:-translate-y-1',
                  channel.isStarred && !compareMode && 'ring-2 ring-accent/50'
                )}
              >
                {compareMode && isSelected && (
                  <div className="absolute top-3 left-3 z-10 w-6 h-6 rounded-full bg-accent flex items-center justify-center">
                    <CheckSquare size={14} className="text-white" />
                  </div>
                )}

                {highestRisk && pendingRisks > 0 && (
                  <div
                    className={cn(
                      'absolute top-3 right-3 z-10 flex items-center gap-1.5 px-2 py-1 rounded-full text-white text-xs font-medium animate-pulse',
                      riskLevelColors[highestRisk]
                    )}
                  >
                    <AlertTriangle size={12} />
                    <span>{getRiskLevelText(highestRisk)}</span>
                    <span className="bg-white/20 px-1.5 rounded-full">
                      {pendingRisks}
                    </span>
                  </div>
                )}

                <div className="relative aspect-video bg-bg-primary overflow-hidden">
                  <img
                    src={channel.coverUrl}
                    alt={channel.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

                  <div className="absolute top-3 left-3 flex items-center gap-2">
                    <span
                      className={cn(
                        'px-2 py-1 rounded text-xs font-medium text-white flex items-center gap-1.5',
                        getLiveStatusColor(channel.status)
                      )}
                    >
                      {channel.status === 'live' && (
                        <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                      )}
                      {getLiveStatusText(channel.status)}
                    </span>
                    <span className="px-2 py-1 rounded text-xs font-medium bg-black/50 text-white backdrop-blur-sm">
                      {getQualityText(channel.quality)}
                    </span>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleStar(channel.id);
                    }}
                    className={cn(
                      'absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-all',
                      pendingRisks > 0 ? 'right-28' : 'right-3',
                      channel.isStarred
                        ? 'bg-yellow-500 text-white'
                        : 'bg-black/30 text-white/70 hover:bg-black/50 hover:text-white'
                    )}
                  >
                    <Star
                      size={16}
                      className={channel.isStarred ? 'fill-white' : ''}
                    />
                  </button>

                  {channel.status === 'live' && (
                    <div className="absolute bottom-3 left-3 right-3">
                      <div className="flex items-center justify-between text-white text-sm">
                        <div className="flex items-center gap-3">
                          <span className="flex items-center gap-1">
                            <Users size={14} />
                            {formatNumber(channel.viewers)}
                          </span>
                          <span className="flex items-center gap-1">
                            <Zap size={14} />
                            {channel.danmakuSpeed}/分
                          </span>
                        </div>
                        <span className="flex items-center gap-1">
                          <Clock size={14} />
                          {formatDuration(channel.duration)}
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="p-4">
                  <h3 className="font-medium text-text-primary truncate group-hover:text-accent transition-colors">
                    {channel.title}
                  </h3>
                  <div className="mt-2 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <img
                        src={channel.anchor.avatar}
                        alt={channel.anchor.name}
                        className="w-6 h-6 rounded-full"
                      />
                      <span className="text-sm text-text-secondary">
                        {channel.anchor.name}
                      </span>
                      <span className="px-1.5 py-0.5 rounded text-xs bg-accent/10 text-accent">
                        Lv.{channel.anchor.level}
                      </span>
                    </div>
                    <span className="text-xs text-text-tertiary">
                      {channel.category}
                    </span>
                  </div>
                  {channel.status !== 'ended' && (
                    <div className="mt-3 flex items-center justify-between text-xs text-text-tertiary">
                      <span>峰值: {formatNumber(channel.peakViewers)}</span>
                      <span>
                        粉丝: {formatNumber(channel.anchor.followers)}
                      </span>
                    </div>
                  )}
                </div>

                {channel.isStarred && channel.starColor && (
                  <div
                    className="absolute top-0 left-0 w-1 h-full"
                    style={{ backgroundColor: channel.starColor }}
                  />
                )}
              </div>
            );
          })}
        </div>

        {filteredChannels.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-text-tertiary">
            <Radio size={48} className="mb-4 opacity-50" />
            <p>没有找到匹配的直播间</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChannelWall;
