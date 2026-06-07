import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import {
  Monitor,
  Tv,
  MessageSquare,
  ShoppingBag,
  AlertTriangle,
  BarChart3,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { cn } from '@/lib/utils';

const menuItems = [
  { path: '/', label: '频道墙', icon: Monitor },
  { path: '/live', label: '直播详情', icon: Tv },
  { path: '/interaction', label: '互动管理', icon: MessageSquare },
  { path: '/products', label: '商品管理', icon: ShoppingBag },
  { path: '/risks', label: '风险监控', icon: AlertTriangle },
  { path: '/analytics', label: '数据分析', icon: BarChart3 },
  { path: '/schedule', label: '排班管理', icon: CalendarDays },
];

const Sidebar = () => {
  const sidebarCollapsed = useAppStore((state) => state.sidebarCollapsed);
  const toggleSidebar = useAppStore((state) => state.toggleSidebar);
  const currentRoomId = useAppStore((state) => state.currentRoomId);
  const location = useLocation();
  const navigate = useNavigate();

  const getNavPath = (path: string) => {
    if (path === '/' || path === '/analytics' || path === '/schedule') {
      return path;
    }
    return `${path}/${currentRoomId}`;
  };

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/' || location.pathname === '/channels';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <aside
      className={cn(
        'h-screen bg-sidebar border-r border-border flex flex-col transition-all duration-300',
        sidebarCollapsed ? 'w-16' : 'w-56'
      )}
    >
      <div className="h-16 flex items-center justify-center border-b border-border px-4">
        {!sidebarCollapsed && (
          <h1 className="text-lg font-bold text-accent truncate">
            直播运营控制台
          </h1>
        )}
        {sidebarCollapsed && (
          <span className="text-2xl font-bold text-accent">直</span>
        )}
      </div>

      <nav className="flex-1 py-4 px-2 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);
          const navPath = getNavPath(item.path);

          return (
            <button
              key={item.path}
              onClick={() => navigate(navPath)}
              className={cn(
                'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group',
                active
                  ? 'bg-accent/10 text-accent'
                  : 'text-text-secondary hover:bg-bg-secondary hover:text-text-primary'
              )}
            >
              <Icon
                size={20}
                className={cn(
                  'shrink-0 transition-transform',
                  active && 'scale-110'
                )}
              />
              {!sidebarCollapsed && (
                <span className="text-sm font-medium truncate">
                  {item.label}
                </span>
              )}
              {active && !sidebarCollapsed && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
              )}
            </button>
          );
        })}
      </nav>

      <div className="p-2 border-t border-border">
        <button
          onClick={toggleSidebar}
          className="w-full flex items-center justify-center py-2 rounded-lg text-text-secondary hover:bg-bg-secondary hover:text-text-primary transition-colors"
        >
          {sidebarCollapsed ? (
            <ChevronRight size={18} />
          ) : (
            <>
              <ChevronLeft size={18} />
              <span className="ml-2 text-sm">收起菜单</span>
            </>
          )}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
