import { useState, useMemo } from 'react';
import {
  Calendar,
  Clock,
  User,
  Users,
  ChevronLeft,
  ChevronRight,
  Radio,
  AlertTriangle,
  Shield,
  CheckCircle,
  Star,
} from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import {
  staffList,
  shifts,
  todayStaff,
  formatShiftTime,
  getStaffResponsibleRooms,
  getStaffPendingRisks,
} from '@/data/schedule';
import { channels } from '@/data/channels';
import { cn } from '@/lib/utils';
import type { Staff } from '@/types';

const SchedulePage = () => {
  const channelsData = useAppStore((state) => state.channels);
  const getPendingRisksCount = useAppStore(
    (state) => state.getPendingRisksCount
  );
  const getHighestRiskLevel = useAppStore(
    (state) => state.getHighestRiskLevel
  );

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null);
  const [viewMode, setViewMode] = useState<'day' | 'week'>('day');

  const weekDays = useMemo(() => {
    const days = [];
    const startOfWeek = new Date(selectedDate);
    const day = startOfWeek.getDay();
    const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1);
    startOfWeek.setDate(diff);

    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      days.push(date);
    }
    return days;
  }, [selectedDate]);

  const isToday = (date: Date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  const formatDate = (date: Date) => {
    return `${date.getMonth() + 1}月${date.getDate()}日`;
  };

  const getDayName = (date: Date) => {
    const days = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
    return days[date.getDay()];
  };

  const previousWeek = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() - 7);
    setSelectedDate(newDate);
  };

  const nextWeek = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + 7);
    setSelectedDate(newDate);
  };

  const handleSelectStaff = (staff: Staff) => {
    setSelectedStaff(staff);
  };

  const staffResponsibleRooms = selectedStaff
    ? getStaffResponsibleRooms(selectedStaff.id)
    : [];
  const staffResponsibleChannels = channelsData.filter((c) =>
    staffResponsibleRooms.includes(c.id)
  );
  const staffPendingRisks = selectedStaff
    ? getStaffPendingRisks(selectedStaff.id)
    : [];

  const riskLevelColors: Record<string, string> = {
    critical: 'bg-red-500',
    high: 'bg-orange-500',
    medium: 'bg-yellow-500',
    low: 'bg-green-500',
  };

  const getRiskLevelText = (level: string) => {
    switch (level) {
      case 'critical':
        return '严重';
      case 'high':
        return '高';
      case 'medium':
        return '中';
      case 'low':
        return '低';
      default:
        return level;
    }
  };

  return (
    <div className="h-full flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-text-primary">排班管理</h2>
          <p className="text-sm text-text-secondary mt-1">
            场控排班安排，班次交接与值班人员管理
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 bg-bg-secondary rounded-lg p-1 border border-border">
            {[
              { value: 'day', label: '日视图' },
              { value: 'week', label: '周视图' },
            ].map((mode) => (
              <button
                key={mode.value}
                onClick={() => setViewMode(mode.value as 'day' | 'week')}
                className={cn(
                  'px-4 py-2 rounded-md text-sm font-medium transition-all',
                  viewMode === mode.value
                    ? 'bg-accent/10 text-accent'
                    : 'text-text-secondary hover:text-text-primary'
                )}
              >
                {mode.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-0">
        <div className="lg:col-span-2 flex flex-col gap-4">
          <div className="bg-bg-secondary rounded-xl border border-border p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-semibold text-text-primary flex items-center gap-2">
                <Calendar size={18} className="text-accent" />
                {viewMode === 'day'
                  ? formatDate(selectedDate) + ' ' + getDayName(selectedDate)
                  : `${formatDate(weekDays[0])} - ${formatDate(weekDays[6])}`}
              </h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={previousWeek}
                  className="p-2 rounded-lg hover:bg-bg-primary text-text-secondary hover:text-text-primary transition-colors"
                >
                  <ChevronLeft size={18} />
                </button>
                <button
                  onClick={() => setSelectedDate(new Date())}
                  className="px-3 py-1 rounded-lg text-sm text-text-secondary hover:text-text-primary hover:bg-bg-primary transition-colors"
                >
                  今天
                </button>
                <button
                  onClick={nextWeek}
                  className="p-2 rounded-lg hover:bg-bg-primary text-text-secondary hover:text-text-primary transition-colors"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>

            {viewMode === 'week' ? (
              <div className="grid grid-cols-7 gap-3">
                {weekDays.map((day) => (
                  <div
                    key={day.toISOString()}
                    onClick={() => setSelectedDate(day)}
                    className={cn(
                      'p-3 rounded-xl cursor-pointer transition-all',
                      isToday(day)
                        ? 'bg-accent/10 border border-accent/30'
                        : 'bg-bg-primary border border-border hover:border-accent/50'
                    )}
                  >
                    <div className="text-center mb-2">
                      <p
                        className={cn(
                          'text-xs',
                          isToday(day)
                            ? 'text-accent font-medium'
                            : 'text-text-tertiary'
                        )}
                      >
                        {getDayName(day)}
                      </p>
                      <p
                        className={cn(
                          'text-lg font-bold mt-1',
                          isToday(day)
                            ? 'text-accent'
                            : 'text-text-primary'
                        )}
                      >
                        {day.getDate()}
                      </p>
                    </div>
                    <div className="space-y-1.5">
                      {shifts
                        .filter(
                          (s) =>
                            s.date.getDate() === day.getDate() &&
                            s.date.getMonth() === day.getMonth()
                        )
                        .slice(0, 3)
                        .map((shift) => {
                          const staff = staffList.find(
                            (s) => s.id === shift.staffId
                          );
                          return (
                            <div
                              key={shift.id}
                              className="flex items-center gap-2 p-1.5 rounded bg-bg-tertiary/50"
                            >
                              <img
                                src={staff?.avatar}
                                alt={staff?.name}
                                className="w-5 h-5 rounded-full"
                              />
                              <span className="text-xs text-text-secondary truncate">
                                {staff?.name}
                              </span>
                            </div>
                          );
                        })}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-4">
                {['早班', '中班', '晚班'].map((shiftName, idx) => {
                  const shiftStaff = todayStaff.filter((s) => {
                    const hour = parseInt(s.shift.split(':')[0]);
                    if (idx === 0) return hour >= 6 && hour < 14;
                    if (idx === 1) return hour >= 14 && hour < 22;
                    return hour >= 22 || hour < 6;
                  });

                  const shiftTimes = [
                    '06:00 - 14:00',
                    '14:00 - 22:00',
                    '22:00 - 06:00',
                  ];

                  return (
                    <div
                      key={shiftName}
                      className="p-4 rounded-xl bg-bg-primary border border-border"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-medium text-text-primary">
                          {shiftName}
                        </h4>
                        <span className="text-xs text-text-secondary flex items-center gap-1">
                          <Clock size={12} />
                          {shiftTimes[idx]}
                        </span>
                      </div>
                      <div className="space-y-3">
                        {shiftStaff.map((staff) => (
                          <div
                            key={staff.id}
                            onClick={() => handleSelectStaff(staff)}
                            className={cn(
                              'flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all',
                              selectedStaff?.id === staff.id
                                ? 'bg-accent/10 border border-accent/30'
                                : 'bg-bg-secondary hover:bg-bg-tertiary/50'
                            )}
                          >
                            <img
                              src={staff.avatar}
                              alt={staff.name}
                              className="w-10 h-10 rounded-full"
                            />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-text-primary">
                                {staff.name}
                              </p>
                              <p className="text-xs text-text-secondary">
                                {staff.role}
                              </p>
                            </div>
                            {staff.status === 'online' ? (
                              <span className="w-2 h-2 rounded-full bg-green-500" />
                            ) : (
                              <span className="w-2 h-2 rounded-full bg-gray-400" />
                            )}
                          </div>
                        ))}
                        {shiftStaff.length === 0 && (
                          <p className="text-center text-xs text-text-tertiary py-4">
                            暂无排班
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="bg-bg-secondary rounded-xl border border-border p-4 flex-1 flex flex-col min-h-0">
            <h3 className="text-base font-semibold text-text-primary mb-4 flex items-center gap-2">
              <Users size={18} className="text-blue-500" />
              所有场控人员
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 flex-1 overflow-y-auto">
              {staffList.map((staff) => {
                const pendingRisks = getStaffPendingRisks(staff.id).length;
                const highestRisk = getStaffPendingRisks(staff.id)[0]?.level;

                return (
                  <div
                    key={staff.id}
                    onClick={() => handleSelectStaff(staff)}
                    className={cn(
                      'p-4 rounded-xl cursor-pointer transition-all border',
                      selectedStaff?.id === staff.id
                        ? 'bg-accent/5 border-accent/30'
                        : 'bg-bg-primary border-border hover:border-accent/50'
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <img
                          src={staff.avatar}
                          alt={staff.name}
                          className="w-12 h-12 rounded-full"
                        />
                        <span
                          className={cn(
                            'absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-bg-secondary',
                            staff.status === 'online'
                              ? 'bg-green-500'
                              : 'bg-gray-400'
                          )}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-text-primary truncate">
                          {staff.name}
                        </p>
                        <p className="text-xs text-text-secondary">
                          {staff.role}
                        </p>
                      </div>
                    </div>
                    <div className="mt-3 flex items-center justify-between text-xs">
                      <span className="text-text-secondary">
                        负责 {getStaffResponsibleRooms(staff.id).length} 个直播间
                      </span>
                      {pendingRisks > 0 && (
                        <span
                          className={cn(
                            'px-2 py-0.5 rounded-full text-white font-medium',
                            riskLevelColors[highestRisk || 'low']
                          )}
                        >
                          {pendingRisks} 待处理
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          {selectedStaff ? (
            <>
              <div className="bg-bg-secondary rounded-xl border border-border p-4">
                <div className="flex items-center gap-4 pb-4 border-b border-border">
                  <img
                    src={selectedStaff.avatar}
                    alt={selectedStaff.name}
                    className="w-16 h-16 rounded-full"
                  />
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-text-primary">
                      {selectedStaff.name}
                    </h3>
                    <p className="text-sm text-text-secondary">
                      {selectedStaff.role}
                    </p>
                    <div className="mt-2 flex items-center gap-2">
                      <span
                        className={cn(
                          'px-2 py-0.5 rounded text-xs',
                          selectedStaff.status === 'online'
                            ? 'bg-green-500/10 text-green-500'
                            : 'bg-gray-500/10 text-gray-400'
                        )}
                      >
                        {selectedStaff.status === 'online'
                          ? '在线'
                          : '离线'}
                      </span>
                      {selectedStaff.isLeader && (
                        <span className="px-2 py-0.5 rounded text-xs bg-accent/10 text-accent">
                          组长
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="pt-4 space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-text-secondary">工号</span>
                    <span className="text-text-primary font-mono">
                      {selectedStaff.id}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-text-secondary">联系电话</span>
                    <span className="text-text-primary">
                      {selectedStaff.phone}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-text-secondary">工作经验</span>
                    <span className="text-text-primary">
                      {selectedStaff.experience}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-text-secondary">负责直播间</span>
                    <span className="text-text-primary">
                      {staffResponsibleRooms.length} 个
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-bg-secondary rounded-xl border border-border p-4 flex-1 flex flex-col min-h-0">
                <h3 className="text-base font-semibold text-text-primary mb-4 flex items-center gap-2">
                  <Radio size={18} className="text-green-500" />
                  负责的直播间
                </h3>
                <div className="space-y-3 flex-1 overflow-y-auto">
                  {staffResponsibleChannels.length === 0 ? (
                    <div className="text-center py-8 text-text-tertiary">
                      <User size={32} className="mx-auto mb-2 opacity-50" />
                      <p className="text-sm">暂无负责直播间</p>
                    </div>
                  ) : (
                    staffResponsibleChannels.map((room) => {
                      const pendingRisks = getPendingRisksCount(room.id);
                      const highestRisk = getHighestRiskLevel(room.id);

                      return (
                        <div
                          key={room.id}
                          className="p-3 rounded-lg bg-bg-primary border border-border hover:border-accent/50 transition-colors cursor-pointer"
                        >
                          <div className="flex items-center gap-3">
                            <img
                              src={room.coverUrl}
                              alt={room.title}
                              className="w-14 h-14 rounded-lg object-cover"
                            />
                            <div className="flex-1 min-w-0">
                              <h4 className="text-sm font-medium text-text-primary truncate">
                                {room.title}
                              </h4>
                              <p className="text-xs text-text-secondary mt-0.5">
                                {room.anchor.name}
                              </p>
                              <div className="mt-1.5 flex items-center gap-2">
                                <span
                                  className={cn(
                                    'w-1.5 h-1.5 rounded-full',
                                    room.status === 'live'
                                      ? 'bg-green-500 animate-pulse'
                                      : 'bg-gray-400'
                                  )}
                                />
                                <span className="text-xs text-text-tertiary">
                                  {room.status === 'live'
                                    ? '直播中'
                                    : room.status === 'waiting'
                                    ? '待开播'
                                    : '已结束'}
                                </span>
                              </div>
                            </div>
                            {pendingRisks > 0 && (
                              <div
                                className={cn(
                                  'flex items-center gap-1 px-2 py-1 rounded-full text-white text-xs font-medium',
                                  riskLevelColors[highestRisk || 'low']
                                )}
                              >
                                <AlertTriangle size={12} />
                                {pendingRisks}
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              <div className="bg-bg-secondary rounded-xl border border-border p-4">
                <h3 className="text-base font-semibold text-text-primary mb-4 flex items-center gap-2">
                  <AlertTriangle size={18} className="text-red-500" />
                  待处理告警
                  <span className="ml-auto text-sm font-normal text-red-500">
                    {staffPendingRisks.length} 条
                  </span>
                </h3>
                {staffPendingRisks.length === 0 ? (
                  <div className="text-center py-6 text-text-tertiary">
                    <Shield size={32} className="mx-auto mb-2 opacity-50 text-green-500" />
                    <p className="text-sm">暂无待处理告警</p>
                  </div>
                ) : (
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {staffPendingRisks.slice(0, 5).map((risk) => {
                      const room = channels.find(
                        (c) => c.id === risk.roomId
                      );
                      return (
                        <div
                          key={risk.id}
                          className="p-3 rounded-lg bg-bg-primary border-l-2 border-red-500"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <p className="text-sm text-text-primary font-medium">
                              {risk.title}
                            </p>
                            <span
                              className={cn(
                                'shrink-0 px-1.5 py-0.5 rounded text-xs text-white',
                                riskLevelColors[risk.level]
                              )}
                            >
                              {getRiskLevelText(risk.level)}
                            </span>
                          </div>
                          <p className="text-xs text-text-tertiary mt-1">
                            {room?.title}
                          </p>
                        </div>
                      );
                    })}
                    {staffPendingRisks.length > 5 && (
                      <p className="text-xs text-text-tertiary text-center pt-2">
                        还有 {staffPendingRisks.length - 5} 条告警...
                      </p>
                    )}
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="bg-bg-secondary rounded-xl border border-border p-6 flex flex-col items-center justify-center text-text-tertiary h-full">
              <User size={48} className="mb-3 opacity-50" />
              <p className="text-base">选择人员查看详情</p>
              <p className="text-sm mt-1">点击左侧人员卡片查看详细信息</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SchedulePage;
