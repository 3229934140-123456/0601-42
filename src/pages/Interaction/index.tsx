import { useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import {
  Pin,
  PinOff,
  ThumbsUp,
  MessageSquare,
  TrendingUp,
  Search,
  EyeOff,
  MoreHorizontal,
  Plus,
  FileText,
  AlertCircle,
} from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { channels } from '@/data/channels';
import {
  formatTime,
  formatNumber,
} from '@/utils/format';
import { generateLiveReport, downloadReport } from '@/utils/export';
import { cn } from '@/lib/utils';

const InteractionPage = () => {
  const { id } = useParams<{ id: string }>();
  const currentRoomId = useAppStore((state) => state.currentRoomId);
  const pinComment = useAppStore((state) => state.pinComment);
  const unpinComment = useAppStore((state) => state.unpinComment);
  const getRoomComments = useAppStore((state) => state.getRoomComments);
  const getRoomFrequentComments = useAppStore(
    (state) => state.getRoomFrequentComments
  );
  const operatorConclusions = useAppStore(
    (state) => state.operatorConclusions
  );

  const roomId = id || currentRoomId;
  const room = channels.find((c) => c.id === roomId);
  const comments = getRoomComments(roomId);
  const frequentComments = getRoomFrequentComments(roomId);

  const [searchQuery, setSearchQuery] = useState('');
  const [commentFilter, setCommentFilter] = useState<'all' | 'question' | 'pinned'>('all');
  const [highlightKeywords] = useState(['链接', '价格', '优惠']);

  const hasData = comments.length > 0;

  const pinnedComments = useMemo(
    () => comments.filter((c) => c.isPinned),
    [comments]
  );

  const filteredComments = useMemo(() => {
    let result = [...comments].sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );

    if (commentFilter === 'question') {
      result = result.filter((c) => c.type === 'question');
    } else if (commentFilter === 'pinned') {
      result = result.filter((c) => c.isPinned);
    }

    if (searchQuery) {
      result = result.filter((c) =>
        c.content.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return result;
  }, [comments, commentFilter, searchQuery]);

  const hasHighlight = (content: string) => {
    return highlightKeywords.some((keyword) => content.includes(keyword));
  };

  const highlightText = (content: string) => {
    let result = content;
    highlightKeywords.forEach((keyword) => {
      const regex = new RegExp(`(${keyword})`, 'gi');
      result = result.replace(
        regex,
        '<mark class="bg-yellow-500/30 text-yellow-300 px-0.5 rounded">$1</mark>'
      );
    });
    return result;
  };

  const handleExport = () => {
    if (!room) return;
    
    const products = useAppStore.getState().getRoomProducts(roomId);
    const oralBroadcasts = useAppStore.getState().getRoomOralBroadcasts(roomId);
    const risks = useAppStore.getState().getRoomRisks(roomId);

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

  if (!hasData) {
    return (
      <div className="h-full flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-text-primary">互动管理</h2>
            <p className="text-sm text-text-secondary mt-1">
              {room ? `${room.title} - ` : ''}管理观众评论、置顶问题、整理高频话题
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
          <MessageSquare size={64} className="text-text-tertiary mb-4 opacity-50" />
          <h3 className="text-lg font-medium text-text-primary mb-2">
            暂无互动数据
          </h3>
          <p className="text-sm text-text-secondary mb-6">
            该直播间暂无评论数据，等待开播后会自动同步
          </p>
          <div className="flex gap-3">
            <button className="h-10 px-5 rounded-lg bg-accent text-white text-sm font-medium hover:bg-accent/90 transition-colors flex items-center gap-2">
              <Plus size={16} />
              手动添加评论
            </button>
            <button className="h-10 px-5 rounded-lg border border-border text-text-secondary text-sm font-medium hover:text-text-primary hover:border-border-hover transition-colors">
              去频道墙看看
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-text-primary">互动管理</h2>
          <p className="text-sm text-text-secondary mt-1">
            {room ? `${room.title} - ` : ''}管理观众评论、置顶问题、整理高频话题
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-2 bg-bg-secondary rounded-lg border border-border">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-sm text-text-secondary">
              实时弹幕流 ·{' '}
              <span className="text-text-primary font-medium">328</span> 条/分
            </span>
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

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 flex-1 min-h-0">
        <div className="lg:col-span-1 flex flex-col gap-4">
          <div className="bg-bg-secondary rounded-xl border border-border p-4">
            <h3 className="text-base font-semibold text-text-primary mb-4 flex items-center gap-2">
              <Pin size={18} className="text-accent" />
              已置顶问题
              <span className="ml-auto text-sm text-text-secondary font-normal">
                {pinnedComments.length} 条
              </span>
            </h3>
            <div className="space-y-3 max-h-80 overflow-y-auto">
              {pinnedComments.length === 0 ? (
                <p className="text-sm text-text-tertiary text-center py-4">
                  暂无置顶评论
                </p>
              ) : (
                pinnedComments.map((comment, index) => (
                  <div
                    key={comment.id}
                    className="p-3 rounded-lg bg-accent/5 border border-accent/20"
                  >
                    <div className="flex items-start gap-2">
                      <span className="shrink-0 w-5 h-5 rounded-full bg-accent text-white text-xs flex items-center justify-center font-medium">
                        {index + 1}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-text-primary leading-relaxed">
                          {comment.content}
                        </p>
                        <div className="mt-2 flex items-center justify-between">
                          <span className="text-xs text-text-tertiary">
                            {comment.userName}
                          </span>
                          <button
                            onClick={() => unpinComment(roomId, comment.id)}
                            className="text-xs text-text-secondary hover:text-accent flex items-center gap-1"
                          >
                            <PinOff size={12} />
                            取消置顶
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="bg-bg-secondary rounded-xl border border-border p-4 flex-1 flex flex-col min-h-0">
            <h3 className="text-base font-semibold text-text-primary mb-4 flex items-center gap-2">
              <TrendingUp size={18} className="text-orange-500" />
              高频评论
            </h3>
            <div className="space-y-3 flex-1 overflow-y-auto">
              {frequentComments.map((item, index) => (
                <div
                  key={item.id}
                  className="p-3 rounded-lg bg-bg-primary border border-border hover:border-accent/30 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={cn(
                        'shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold',
                        index === 0
                          ? 'bg-red-500 text-white'
                          : index === 1
                          ? 'bg-orange-500 text-white'
                          : index === 2
                          ? 'bg-yellow-500 text-white'
                          : 'bg-gray-500/50 text-text-secondary'
                      )}
                    >
                      {index + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-text-primary truncate">
                          {item.keyword}
                        </span>
                        <span className="text-xs text-accent ml-2 shrink-0">
                          {item.count} 次提及
                        </span>
                      </div>
                      <p className="text-xs text-text-tertiary mt-1 line-clamp-2">
                        {item.comments[0]}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-3 flex flex-col bg-bg-secondary rounded-xl border border-border overflow-hidden">
          <div className="p-4 border-b border-border">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-semibold text-text-primary flex items-center gap-2">
                <MessageSquare size={18} className="text-green-500" />
                实时评论流
              </h3>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search
                    size={14}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary"
                  />
                  <input
                    type="text"
                    placeholder="搜索评论..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-48 h-8 pl-8 pr-3 rounded-lg bg-bg-primary border border-border text-sm text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-accent/50"
                  />
                </div>
                <div className="flex items-center gap-1 bg-bg-primary rounded-lg p-0.5 border border-border">
                  {[
                    { value: 'all', label: '全部' },
                    { value: 'question', label: '提问' },
                    { value: 'pinned', label: '置顶' },
                  ].map((filter) => (
                    <button
                      key={filter.value}
                      onClick={() =>
                        setCommentFilter(
                          filter.value as 'all' | 'question' | 'pinned'
                        )
                      }
                      className={cn(
                        'px-3 py-1 rounded-md text-xs font-medium transition-all',
                        commentFilter === filter.value
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
            {filteredComments.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-text-tertiary">
                <AlertCircle size={40} className="mb-3 opacity-50" />
                <p>没有匹配的评论</p>
              </div>
            ) : (
              filteredComments.map((comment) => (
                <div
                  key={comment.id}
                  className={cn(
                    'p-3 rounded-lg border transition-all',
                    comment.isPinned
                      ? 'bg-accent/5 border-accent/30'
                      : comment.type === 'gift'
                      ? 'bg-yellow-500/5 border-yellow-500/30'
                      : comment.type === 'system'
                      ? 'bg-gray-500/5 border-gray-500/30'
                      : hasHighlight(comment.content)
                      ? 'bg-yellow-500/5 border-yellow-500/20'
                      : 'bg-bg-primary border-border hover:border-border-hover'
                  )}
                >
                  <div className="flex items-start gap-3">
                    {comment.userAvatar ? (
                      <img
                        src={comment.userAvatar}
                        alt={comment.userName}
                        className="w-9 h-9 rounded-full shrink-0"
                      />
                    ) : (
                      <div className="w-9 h-9 rounded-full bg-accent/20 shrink-0 flex items-center justify-center">
                        <AlertCircle size={16} className="text-accent" />
                      </div>
                    )}

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-medium text-text-primary">
                          {comment.userName}
                        </span>
                        {comment.type === 'gift' && (
                          <span className="px-1.5 py-0.5 rounded text-xs bg-yellow-500/20 text-yellow-500">
                            礼物
                          </span>
                        )}
                        {comment.type === 'question' && (
                          <span className="px-1.5 py-0.5 rounded text-xs bg-blue-500/20 text-blue-400">
                            提问
                          </span>
                        )}
                        {comment.isPinned && (
                          <span className="px-1.5 py-0.5 rounded text-xs bg-accent/20 text-accent flex items-center gap-1">
                            <Pin size={10} />
                            已置顶
                          </span>
                        )}
                        <span className="text-xs text-text-tertiary ml-auto">
                          {formatTime(comment.timestamp)}
                        </span>
                      </div>
                      <p
                        className={cn(
                          'text-sm mt-1 leading-relaxed',
                          comment.type === 'system'
                            ? 'text-text-tertiary'
                            : 'text-text-primary'
                        )}
                        dangerouslySetInnerHTML={{
                          __html: hasHighlight(comment.content)
                            ? highlightText(comment.content)
                            : comment.content,
                        }}
                      />
                      <div className="mt-2 flex items-center gap-4">
                        <button className="flex items-center gap-1 text-xs text-text-tertiary hover:text-accent transition-colors">
                          <ThumbsUp size={12} />
                          {formatNumber(comment.likeCount)}
                        </button>
                        {!comment.isPinned && comment.type === 'question' && (
                          <button
                            onClick={() => pinComment(roomId, comment.id)}
                            className="flex items-center gap-1 text-xs text-text-tertiary hover:text-accent transition-colors"
                          >
                            <Pin size={12} />
                            置顶
                          </button>
                        )}
                        <button className="flex items-center gap-1 text-xs text-text-tertiary hover:text-red-500 transition-colors">
                          <EyeOff size={12} />
                          屏蔽
                        </button>
                        <button className="ml-auto p-1 rounded hover:bg-bg-secondary text-text-tertiary hover:text-text-secondary">
                          <MoreHorizontal size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InteractionPage;
