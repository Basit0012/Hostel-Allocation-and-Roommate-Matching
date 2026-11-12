import { useState, useId, type FC } from 'react';
import { motion } from 'motion/react';
import { cn } from '@/lib/utils';

export interface ContinuousTabItem {
  id: string;
  label: string;
}

interface ContinuousTabsProps {
  tabs: ContinuousTabItem[];
  value?: string;
  defaultActiveId?: string;
  onChange?: (id: string) => void;
  className?: string;
}

export const ContinuousTabs: FC<ContinuousTabsProps> = ({
  tabs,
  value,
  defaultActiveId,
  onChange,
  className,
}) => {
  const [internalActive, setInternalActive] = useState<string>(
    defaultActiveId ?? tabs[0]?.id ?? '',
  );
  const groupId = useId();
  const active = value !== undefined ? value : internalActive;

  const handleSelect = (id: string) => {
    if (value === undefined) {
      setInternalActive(id);
    }
    onChange?.(id);
  };

  return (
    <div
      role="tablist"
      className={cn(
        'inline-flex flex-wrap items-center gap-1 rounded-xl border border-border bg-muted p-1',
        className,
      )}
    >
      {tabs.map((tab) => {
        const isActive = active === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => handleSelect(tab.id)}
            className="relative cursor-pointer rounded-lg px-3.5 py-2 text-sm font-medium outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {isActive && (
              <motion.div
                layoutId={`wm-tab-pill-${groupId}`}
                transition={{
                  type: 'spring',
                  stiffness: 380,
                  damping: 30,
                  mass: 0.9,
                }}
                className="absolute inset-0 rounded-lg border border-border bg-background shadow-[0_1px_2px_rgba(0,0,0,0.06)]"
              />
            )}
            <span
              className={cn(
                'relative z-10 transition-colors duration-150',
                isActive
                  ? 'text-foreground font-semibold'
                  : 'text-muted-foreground hover:text-foreground',
              )}
            >
              {tab.label}
            </span>
          </button>
        );
      })}
    </div>
  );
};

