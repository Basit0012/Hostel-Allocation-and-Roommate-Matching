import React, { useState, type FC } from 'react';
import { motion, MotionConfig, type Transition } from 'motion/react';
import { ChevronDown } from 'lucide-react';
import useMeasure from 'react-use-measure';
import { cn } from '@/lib/utils';

export interface AccordionItemData {
  id: string | number;
  title: string;
  badge?: string;
  icon?: React.ReactNode;
  content: React.ReactNode;
}

interface CardSplitAccordionProps {
  items: AccordionItemData[];
  defaultOpenId?: string | number | null;
  className?: string;
}

const springTransition: Transition = {
  type: 'spring',
  stiffness: 520,
  damping: 42,
  mass: 0.9,
};

const AccordionRow: FC<{
  item: AccordionItemData;
  isOpen: boolean;
  onToggle: () => void;
  index: number;
  total: number;
  openIndex: number;
}> = ({ item, isOpen, onToggle, index, total, openIndex }) => {
  const [ref, bounds] = useMeasure();

  const isFirst = index === 0;
  const isLast = index === total - 1;
  const isBeforeOpen = openIndex !== -1 && index === openIndex - 1;
  const isAfterOpen = openIndex !== -1 && index === openIndex + 1;
  const isAlone = (isAfterOpen && isLast) || (isBeforeOpen && isFirst);

  const radius = '12px';
  let borderTopLeftRadius: string | number = 0;
  let borderTopRightRadius: string | number = 0;
  let borderBottomLeftRadius: string | number = 0;
  let borderBottomRightRadius: string | number = 0;

  if (isOpen || isAlone) {
    borderTopLeftRadius = radius;
    borderTopRightRadius = radius;
    borderBottomLeftRadius = radius;
    borderBottomRightRadius = radius;
  } else if (isBeforeOpen) {
    borderBottomLeftRadius = radius;
    borderBottomRightRadius = radius;
  } else if (isAfterOpen) {
    borderTopLeftRadius = radius;
    borderTopRightRadius = radius;
  } else if (isFirst) {
    borderTopLeftRadius = radius;
    borderTopRightRadius = radius;
  } else if (isLast) {
    borderBottomLeftRadius = radius;
    borderBottomRightRadius = radius;
  }

  return (
    <motion.li layout className="list-none">
      <motion.div
        animate={{
          borderTopLeftRadius,
          borderTopRightRadius,
          borderBottomLeftRadius,
          borderBottomRightRadius,
        }}
        className={cn(
          'overflow-hidden border-border bg-card transition-colors',
          isOpen && 'bg-background',
        )}
        style={{
          borderTopWidth: isFirst || isAfterOpen || isOpen ? '1px' : '0px',
          borderBottomWidth: isLast || isBeforeOpen || isOpen ? '1px' : '1px',
          borderLeftWidth: '1px',
          borderRightWidth: '1px',
          borderStyle: 'solid',
          marginBlock: isOpen ? '8px' : '0px',
        }}
      >
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={isOpen}
          className="flex w-full cursor-pointer items-center justify-between gap-3 px-4 py-3 text-left outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <span className="flex flex-1 flex-wrap items-center gap-x-2.5 gap-y-1 min-w-0">
            {item.icon && (
              <span className="shrink-0 text-muted-foreground">{item.icon}</span>
            )}
            <span className="text-sm font-semibold text-foreground">
              {item.title}
            </span>
            {item.badge && (
              <span className="shrink-0 rounded-full border border-border bg-muted px-2 py-0.5 font-mono text-[11px] font-medium text-muted-foreground">
                {item.badge}
              </span>
            )}
          </span>
          <motion.span
            animate={{ rotate: isOpen ? 180 : 0 }}
            className="shrink-0 text-muted-foreground"
          >
            <ChevronDown size={16} />
          </motion.span>
        </button>

        <motion.div
          initial={false}
          animate={{
            height: isOpen ? bounds.height : 0,
            opacity: isOpen ? 1 : 0,
          }}
          className="overflow-hidden"
        >
          <div ref={ref}>
            <div className="border-t border-border px-4 py-3 text-sm leading-relaxed text-muted-foreground">
              {item.content}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </motion.li>
  );
};

export const CardSplitAccordion: FC<CardSplitAccordionProps> = ({
  items,
  defaultOpenId = null,
  className,
}) => {
  const [openId, setOpenId] = useState<string | number | null>(defaultOpenId);
  const openIndex = items.findIndex((item) => item.id === openId);

  return (
    <MotionConfig transition={springTransition}>
      <ul className={cn('m-0 flex w-full flex-col p-0', className)}>
        {items.map((item, index) => (
          <AccordionRow
            key={item.id}
            item={item}
            isOpen={openIndex === index}
            onToggle={() => setOpenId(openIndex === index ? null : item.id)}
            index={index}
            total={items.length}
            openIndex={openIndex}
          />
        ))}
      </ul>
    </MotionConfig>
  );
};
