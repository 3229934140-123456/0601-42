import { cn } from '@/lib/utils';
import type { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon?: LucideIcon;
  trend?: {
    value: number;
    isUp: boolean;
  };
  color?: 'cyan' | 'green' | 'orange' | 'purple' | 'red' | 'blue';
  subtitle?: string;
  className?: string;
}

const colorClasses = {
  cyan: 'from-cyan-500/20 to-cyan-500/5 text-cyan-400 border-cyan-500/30',
  green: 'from-green-500/20 to-green-500/5 text-green-400 border-green-500/30',
  orange: 'from-orange-500/20 to-orange-500/5 text-orange-400 border-orange-500/30',
  purple: 'from-purple-500/20 to-purple-500/5 text-purple-400 border-purple-500/30',
  red: 'from-red-500/20 to-red-500/5 text-red-400 border-red-500/30',
  blue: 'from-blue-500/20 to-blue-500/5 text-blue-400 border-blue-500/30',
};

const StatCard = ({
  title,
  value,
  icon: Icon,
  trend,
  color = 'cyan',
  subtitle,
  className,
}: StatCardProps) => {
  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-xl border bg-bg-secondary/50 p-5 transition-all duration-300 hover:border-accent/50 hover:shadow-lg hover:shadow-accent/5',
        className
      )}
    >
      <div
        className={cn(
          'absolute inset-0 bg-gradient-to-br opacity-50',
          colorClasses[color]
        )}
      />
      <div className="relative z-10">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-text-secondary mb-1">{title}</p>
            <p
              className={cn(
                'text-2xl font-bold',
                `text-${color === 'cyan' ? 'cyan' : color}-400`
              )}
            >
              {value}
            </p>
          </div>
          {Icon && (
            <div
              className={cn(
                'w-10 h-10 rounded-lg bg-bg-primary/80 flex items-center justify-center',
                `text-${color === 'cyan' ? 'cyan' : color}-400`
              )}
            >
              <Icon size={20} />
            </div>
          )}
        </div>
        {(trend || subtitle) && (
          <div className="mt-3 flex items-center gap-2">
            {trend && (
              <span
                className={cn(
                  'text-xs font-medium flex items-center gap-1',
                  trend.isUp ? 'text-green-400' : 'text-red-400'
                )}
              >
                {trend.isUp ? '↑' : '↓'} {trend.value}%
              </span>
            )}
            {subtitle && (
              <span className="text-xs text-text-tertiary">{subtitle}</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default StatCard;
