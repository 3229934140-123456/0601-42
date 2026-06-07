import { Sun, Moon, Bell, Search, Download, User } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';
import { useAppStore } from '@/store/useAppStore';
import { channels } from '@/data/channels';
import { formatNumber } from '@/utils/format';
import { cn } from '@/lib/utils';

const Header = () => {
  const { toggleTheme, isDark } = useTheme();
  const currentRoomId = useAppStore((state) => state.currentRoomId);
  const channelsData = useAppStore((state) => state.channels);

  const currentRoom = channelsData.find((c) => c.id === currentRoomId);
  const liveCount = channels.filter((c) => c.status === 'live').length;
  const totalViewers = channels.reduce(
    (sum, c) => sum + (c.status === 'live' ? c.viewers : 0),
    0
  );

  const handleExport = () => {
    const room = currentRoom || channels[0];
    const reportData = {
      直播间: room.title,
      主播: room.anchor.name,
      分类: room.category,
      开播时间: room.startTime,
      峰值人数: formatNumber(room.peakViewers),
      当前在线: formatNumber(room.viewers),
      弹幕速度: `${room.danmakuSpeed}条/分钟`,
      画质: room.quality.toUpperCase(),
      导出时间: new Date().toLocaleString(),
    };

    const content = `直播复盘摘要
====================
${Object.entries(reportData)
  .map(([key, value]) => `${key}: ${value}`)
  .join('\n')}

互动数据
--------------------
- 置顶问题数: 3 条
- 高频评论: 6 类
- 互动率: 38.5%

商品数据
--------------------
- 商品总数: 8 个
- 已讲解: 3 个
- 预计GMV: ¥289,600

风险记录
--------------------
- 风险告警: 2 条
- 已处理: 2 条
- 处理时效: 平均 8 分 32 秒

运营备注
--------------------
本场直播整体表现良好，互动率高于场均水平。
建议后续加强商品讲解节奏，提升转化效果。
`;

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${room.title}_复盘摘要_${new Date().toLocaleDateString()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <header className="h-16 bg-bg-primary border-b border-border flex items-center justify-between px-6 shrink-0">
      <div className="flex items-center gap-6">
        <div className="relative">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary"
          />
          <input
            type="text"
            placeholder="搜索直播间、主播..."
            className="w-72 h-9 pl-10 pr-4 rounded-lg bg-bg-secondary border border-border text-sm text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-accent/50 transition-colors"
          />
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-sm text-text-secondary">
              开播中 <span className="text-text-primary font-medium">{liveCount}</span> 场
            </span>
          </div>
          <div className="h-4 w-px bg-border" />
          <div className="text-sm text-text-secondary">
            总在线 <span className="text-text-primary font-medium">{formatNumber(totalViewers)}</span> 人
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={handleExport}
          className={cn(
            'h-9 px-4 rounded-lg text-sm font-medium flex items-center gap-2 transition-all duration-200',
            'bg-accent/10 text-accent hover:bg-accent/20 hover:shadow-lg hover:shadow-accent/20'
          )}
        >
          <Download size={16} />
          导出复盘
        </button>

        <button className="relative w-9 h-9 rounded-lg bg-bg-secondary border border-border flex items-center justify-center text-text-secondary hover:text-text-primary hover:border-border-hover transition-colors">
          <Bell size={18} />
          <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
            3
          </span>
        </button>

        <button
          onClick={toggleTheme}
          className="w-9 h-9 rounded-lg bg-bg-secondary border border-border flex items-center justify-center text-text-secondary hover:text-text-primary hover:border-border-hover transition-colors"
        >
          {isDark ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        <div className="flex items-center gap-3 pl-3 ml-1 border-l border-border">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent to-purple-500 flex items-center justify-center">
            <User size={16} className="text-white" />
          </div>
          <div className="text-sm">
            <div className="text-text-primary font-medium">运营小王</div>
            <div className="text-text-tertiary text-xs">场控主管</div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
