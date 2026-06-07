import { useState, useMemo } from 'react';
import {
  CalendarDays,
  Clock,
  Users,
  Phone,
  Shield,
  ChevronLeft,
  ChevronRight,
  UserCheck,
  UserX,
  Bell,
  ListChecks,
} from 'lucide-react';
import { schedules, currentShift, staffList } from '@/data/schedule';
import { formatDate } from '@/utils/format';
import { cn } from '@/lib/utils';

const roleText: Record<string, string> = {
  moderator: '场控',
  supervisor: '主管',
  manager: '经理',
};

const roleColor: Record<string, string> = {
  moderator: 'bg-blue-500/10 text-blue-500',
  supervisor: 'bg-purple-500/10 text-purple-500',
  manager: 'bg-orange-500/10 text-orange-500',
};

const shiftColors: Record<string, string> = {
  早班: 'from-green-500/20 to-green-500/5 border-green-500/30',
  中班: 'from-blue-500/20 to-blue-500/5 border-blue-500/30',
  晚班: 'from-purple-500/20 to-purple-500/5 border-purple-500/30',
};

const SchedulePage = () => {
  const [selectedDate, setSelectedDate] = useState(schedules[0]?.date || '');
  const [viewMode, setViewMode] = useState<'day' | 'week'>('week');
  const [selectedStaff, setSelectedStaff] = useState<string | null>(null);

  const currentWeekDates = useMemo(() => {
    return schedules.slice(0, 7).map((s) => s.date);
  }, []);

  const selectedSchedule = useMemo(() => {
    return schedules.find((s) => s.date === selectedDate);
  }, [selectedDate]);

  const selectedStaffInfo = useMemo(() => {
    return staffList.find((s) => s.id === selectedStaff);
  }, [selectedStaff]);

  const formatDateLabel = (dateStr: string) => {
    const date = new Date(dateStr);
    const days = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
    return {
      day: date.getDate(),
      weekday: days[date.getDay()],
      month: date.getMonth() + 1,
    };
  };

  const today = new Date().toISOString().split('T')[0];
  const isToday = (dateStr: string) => dateStr === today;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-text-primary">排班管理</h2>
          <p className="text-sm text-text-secondary mt-1">
            查看场控排班，了解值班人员信息
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 bg-bg-secondary rounded-lg p-0.5 border border-border">
            <button
              onClick={() => setViewMode('day')}
              className={cn(
                'px-4 py-2 rounded-md text-sm font-medium transition-all',
                viewMode === 'day'
                  ? 'bg-accent/10 text-accent'
                  : 'text-text-secondary hover:text-text-primary'
              )}
            >
              日视图
            </button>
            <button
              onClick={() => setViewMode('week')}
              className={cn(
                'px-4 py-2 rounded-md text-sm font-medium transition-all',
                viewMode === 'week'
                  ? 'bg-accent/10 text-accent'
                  : 'text-text-secondary hover:text-text-primary'
              )}
            >
              周视图
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-bg-secondary rounded-xl border border-border p-5">
            <h3 className="text-base font-semibold text-text-primary mb-4 flex items-center gap-2">
              <Clock size={18} className="text-accent" />
              当前班次
            </h3>
            <div className="p-4 rounded-lg bg-gradient-to-br from-accent/10 to-accent/5 border border-accent/30">
              <div className="flex items-center justify-between mb-3">
                <span className="text-lg font-bold text-accent">
                  {currentShift.name}
                </span>
                <span className="text-sm text-text-secondary">
                  {currentShift.startTime} - {currentShift.endTime}
                </span>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-text-secondary">值班人员</span>
                  <span className="text-text-primary font-medium">
                    {currentShift.members.length} 人
                  </span>
                </div>
                <div className="flex -space-x-2">
                  {currentShift.members.map((staff) => (
                    <img
                      key={staff.id}
                      src={staff.avatar}
                      alt={staff.name}
                      className="w-8 h-8 rounded-full border-2 border-bg-secondary"
                      title={staff.name}
                    />
                  ))}
                </div>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-border">
              <div className="flex items-center justify-between text-sm">
                <span className="text-text-secondary">下次交接</span>
                <span className="text-accent font-medium">
                  {currentShift.nextHandover}
                </span>
              </div>
              <div className="text-xs text-text-tertiary mt-1">
                倒计时 {currentShift.handoverCountdown}
              </div>
            </div>
          </div>

          <div className="bg-bg-secondary rounded-xl border border-border p-5">
            <h3 className="text-base font-semibold text-text-primary mb-4 flex items-center gap-2">
              <Shield size={18} className="text-green-500" />
              在线人员
            </h3>
            <div className="space-y-3">
              {staffList
                .filter((s) => s.isOnline)
                .map((staff) => (
                  <button
                    key={staff.id}
                    onClick={() => setSelectedStaff(staff.id)}
                    className={cn(
                      'w-full flex items-center gap-3 p-2 rounded-lg transition-colors text-left',
                      selectedStaff === staff.id
                        ? 'bg-accent/10'
                        : 'hover:bg-bg-primary'
                    )}
                  >
                    <div className="relative">
                      <img
                        src={staff.avatar}
                        alt={staff.name}
                        className="w-10 h-10 rounded-full"
                      />
                      <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-green-500 border-2 border-bg-secondary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-text-primary truncate">
                        {staff.name}
                      </div>
                      <span
                        className={cn(
                          'text-xs px-2 py-0.5 rounded',
                          roleColor[staff.role]
                        )}
                      >
                        {roleText[staff.role]}
                      </span>
                    </div>
                    <UserCheck size={16} className="text-green-500" />
                  </button>
                ))}
            </div>
            <div className="mt-4 pt-4 border-t border-border">
              <div className="flex items-center justify-between text-sm">
                <span className="text-text-secondary">离线人员</span>
                <span className="text-text-tertiary">
                  {staffList.filter((s) => !s.isOnline).length} 人
                </span>
              </div>
            </div>
          </div>

          {selectedStaffInfo && (
            <div className="bg-bg-secondary rounded-xl border border-border p-5">
              <h3 className="text-base font-semibold text-text-primary mb-4">
                人员详情
              </h3>
              <div className="flex flex-col items-center">
                <img
                  src={selectedStaffInfo.avatar}
                  alt={selectedStaffInfo.name}
                  className="w-20 h-20 rounded-full border-4 border-accent/30"
                />
                <h4 className="mt-3 text-lg font-semibold text-text-primary">
                  {selectedStaffInfo.name}
                </h4>
                <span
                  className={cn(
                    'mt-1 text-xs px-3 py-1 rounded-full',
                    roleColor[selectedStaffInfo.role]
                  )}
                >
                  {roleText[selectedStaffInfo.role]}
                </span>
                <div className="mt-4 w-full space-y-3">
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-bg-primary border border-border">
                    <Phone size={16} className="text-text-secondary" />
                    <span className="text-sm text-text-primary">
                      {selectedStaffInfo.phone}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-bg-primary border border-border">
                    {selectedStaffInfo.isOnline ? (
                      <>
                        <UserCheck size={16} className="text-green-500" />
                        <span className="text-sm text-green-500">在线值班中</span>
                      </>
                    ) : (
                      <>
                        <UserX size={16} className="text-text-tertiary" />
                        <span className="text-sm text-text-tertiary">
                          当前离线
                        </span>
                      </>
                    )}
                  </div>
                </div>
                <button className="mt-4 w-full h-9 rounded-lg bg-accent/10 text-accent text-sm font-medium hover:bg-accent/20 transition-colors flex items-center justify-center gap-2">
                  <Bell size={16} />
                  发送通知
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="lg:col-span-3">
          {viewMode === 'week' ? (
            <div className="bg-bg-secondary rounded-xl border border-border p-5">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-base font-semibold text-text-primary flex items-center gap-2">
                  <CalendarDays size={18} className="text-accent" />
                  本周排班
                </h3>
                <div className="flex items-center gap-2">
                  <button className="p-2 rounded-lg hover:bg-bg-primary text-text-secondary hover:text-text-primary transition-colors">
                    <ChevronLeft size={18} />
                  </button>
                  <span className="text-sm text-text-secondary">
                    6月第2周
                  </span>
                  <button className="p-2 rounded-lg hover:bg-bg-primary text-text-secondary hover:text-text-primary transition-colors">
                    <ChevronRight size={18} />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-7 gap-3">
                {schedules.slice(0, 7).map((schedule) => {
                  const dateLabel = formatDateLabel(schedule.date);
                  const active = schedule.date === selectedDate;
                  const todayFlag = isToday(schedule.date);

                  return (
                    <button
                      key={schedule.id}
                      onClick={() => setSelectedDate(schedule.date)}
                      className={cn(
                        'p-3 rounded-xl border transition-all text-left',
                        active
                          ? 'border-accent bg-accent/5 ring-1 ring-accent/30'
                          : 'border-border hover:border-border-hover bg-bg-primary'
                      )}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <div
                            className={cn(
                              'text-2xl font-bold',
                              active
                                ? 'text-accent'
                                : todayFlag
                                ? 'text-orange-500'
                                : 'text-text-primary'
                            )}
                          >
                            {dateLabel.day}
                          </div>
                          <div
                            className={cn(
                              'text-xs',
                              active
                                ? 'text-accent/70'
                                : 'text-text-tertiary'
                            )}
                          >
                            {dateLabel.weekday}
                          </div>
                        </div>
                        {todayFlag && (
                          <span className="px-1.5 py-0.5 rounded text-xs bg-orange-500/10 text-orange-500 font-medium">
                            今天
                          </span>
                        )}
                      </div>
                      <div className="space-y-2">
                        {schedule.shifts.map((shift) => (
                          <div
                            key={shift.id}
                            className={cn(
                              'p-2 rounded-lg border bg-gradient-to-br',
                              shiftColors[shift.name]
                            )}
                          >
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-xs font-medium text-text-primary">
                                {shift.name}
                              </span>
                              <span className="text-xs text-text-tertiary">
                                {shift.members.length}人
                              </span>
                            </div>
                            <div className="text-xs text-text-tertiary">
                              {shift.startTime}-{shift.endTime}
                            </div>
                          </div>
                        ))}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="bg-bg-secondary rounded-xl border border-border p-5">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-base font-semibold text-text-primary flex items-center gap-2">
                  <CalendarDays size={18} className="text-accent" />
                  {selectedDate &&
                    `${formatDateLabel(selectedDate).month}月${formatDateLabel(selectedDate).day}日 ${formatDateLabel(selectedDate).weekday}`}
                </h3>
              </div>

              {selectedSchedule && (
                <div className="space-y-4">
                  {selectedSchedule.shifts.map((shift) => (
                    <div
                      key={shift.id}
                      className={cn(
                        'p-5 rounded-xl border bg-gradient-to-br',
                        shiftColors[shift.name]
                      )}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h4 className="text-lg font-semibold text-text-primary">
                            {shift.name}
                          </h4>
                          <p className="text-sm text-text-secondary mt-1">
                            {shift.startTime} - {shift.endTime}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users size={18} className="text-text-secondary" />
                          <span className="text-sm text-text-primary font-medium">
                            {shift.members.length} 人
                          </span>
                        </div>
                      </div>

                      <div className="mb-4">
                        <div className="text-sm text-text-secondary mb-2 flex items-center gap-2">
                          <ListChecks size={14} />
                          职责分工
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {shift.responsibilities.map((resp, idx) => (
                            <span
                              key={idx}
                              className="px-3 py-1 rounded-full bg-bg-primary/50 text-xs text-text-secondary border border-border/50"
                            >
                              {resp}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div>
                        <div className="text-sm text-text-secondary mb-3">
                          值班人员
                        </div>
                        <div className="grid grid-cols-3 gap-3">
                          {shift.members.map((staff) => (
                            <div
                              key={staff.id}
                              className="flex items-center gap-3 p-3 rounded-lg bg-bg-primary/50 border border-border/50"
                            >
                              <div className="relative">
                                <img
                                  src={staff.avatar}
                                  alt={staff.name}
                                  className="w-10 h-10 rounded-full"
                                />
                                {staff.isOnline && (
                                  <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-green-500 border-2 border-bg-secondary" />
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="text-sm font-medium text-text-primary truncate">
                                  {staff.name}
                                </div>
                                <span
                                  className={cn(
                                    'text-xs px-1.5 py-0.5 rounded',
                                    roleColor[staff.role]
                                  )}
                                >
                                  {roleText[staff.role]}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          <div className="mt-6 bg-bg-secondary rounded-xl border border-border p-5">
            <h3 className="text-base font-semibold text-text-primary mb-4">
              排班图例
            </h3>
            <div className="flex flex-wrap gap-6">
              <div className="flex items-center gap-3">
                <span className="w-4 h-4 rounded-full bg-green-500" />
                <span className="text-sm text-text-secondary">早班</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="w-4 h-4 rounded-full bg-blue-500" />
                <span className="text-sm text-text-secondary">中班</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="w-4 h-4 rounded-full bg-purple-500" />
                <span className="text-sm text-text-secondary">晚班</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="w-4 h-4 rounded-full bg-green-500 border-2 border-bg-secondary" />
                <span className="text-sm text-text-secondary">在线</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="w-4 h-4 rounded-full bg-gray-500" />
                <span className="text-sm text-text-secondary">离线</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SchedulePage;
