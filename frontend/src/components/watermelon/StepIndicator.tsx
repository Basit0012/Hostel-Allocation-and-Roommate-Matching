import { useRef, useState, type FC } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface IndicatorStep {
  id: string;
  label: string;
  statusText?: string;
  state: 'done' | 'active' | 'danger' | 'upcoming' | 'untracked';
  icon: LucideIcon;
}

interface StepIndicatorProps {
  steps: IndicatorStep[];
  onStepSelect?: (step: IndicatorStep, index: number) => void;
  className?: string;
}

export const StepIndicator: FC<StepIndicatorProps> = ({
  steps,
  onStepSelect,
  className,
}) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [coords, setCoords] = useState({ clipPath: '', translateX: 0 });
  const [isEntering, setIsEntering] = useState(true);
  const measureRefs = useRef<(HTMLDivElement | null)[]>([]);
  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const calculatePosition = (index: number) => {
    const activeLabel = measureRefs.current[index];
    const activeButton = buttonRefs.current[index];
    if (!activeLabel || !activeButton) return null;

    const labelLeft = activeLabel.offsetLeft;
    const labelWidth = activeLabel.offsetWidth;
    const labelCenter = labelLeft + labelWidth / 2;

    const buttonLeft = activeButton.offsetLeft;
    const buttonWidth = activeButton.offsetWidth;
    const buttonCenter = buttonLeft + buttonWidth / 2;

    const totalWidth = measureRefs.current.reduce(
      (acc, el) => acc + (el?.offsetWidth || 0),
      0,
    );
    if (totalWidth <= 0) return null;

    const cLeft = (labelLeft / totalWidth) * 100;
    const cRight = 100 - ((labelLeft + labelWidth) / totalWidth) * 100;

    return {
      clipPath: `inset(0 ${cRight}% 0 ${cLeft}% round 9999px)`,
      translateX: buttonCenter - labelCenter,
    };
  };

  const handleShow = (index: number) => {
    const next = calculatePosition(index);
    if (!next) return;
    setIsEntering(activeIndex === null);
    setCoords(next);
    setActiveIndex(index);
  };

  const handleHide = () => {
    setActiveIndex(null);
    setCoords({ clipPath: '', translateX: 0 });
    setIsEntering(true);
  };

  return (
    <div className={cn('relative w-full pt-8 pb-2', className)}>
      <div
        className="relative flex h-3 w-full items-center gap-2"
        onMouseLeave={handleHide}
      >
        <AnimatePresence>
          {activeIndex !== null && coords.clipPath !== '' && (
            <motion.div
              className="pointer-events-none absolute bottom-5 left-0 z-20 hidden sm:block"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.16 }}
            >
              <motion.div
                className="flex rounded-full bg-foreground text-background shadow-md"
                animate={{
                  clipPath: coords.clipPath,
                  x: coords.translateX,
                }}
                transition={{
                  type: 'spring',
                  bounce: 0,
                  duration: isEntering ? 0 : 0.35,
                }}
              >
                <div className="inline-flex items-center">
                  {steps.map((step, index) => {
                    const Icon = step.icon;
                    return (
                      <div
                        key={`tip-${step.id}`}
                        className="flex items-center gap-1.5 px-3 py-1.5 whitespace-nowrap text-xs font-semibold"
                        style={{ opacity: activeIndex === index ? 1 : 0 }}
                      >
                        <Icon size={13} />
                        <span>{step.label}</span>
                        {step.statusText && (
                          <span className="font-mono text-[11px] opacity-80">
                            ({step.statusText})
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {steps.map((step, index) => {
          const barClass =
            step.state === 'done'
              ? 'bg-emerald-600 dark:bg-emerald-400'
              : step.state === 'active'
                ? 'bg-accent-brand'
                : step.state === 'danger'
                  ? 'bg-destructive'
                  : step.state === 'untracked'
                    ? 'bg-muted border border-dashed border-border-strong'
                    : 'bg-border';

          return (
            <button
              key={step.id}
              type="button"
              ref={(el) => {
                buttonRefs.current[index] = el;
              }}
              aria-label={`${step.label}: ${step.statusText || step.state}`}
              onMouseEnter={() => handleShow(index)}
              onFocus={() => handleShow(index)}
              onBlur={handleHide}
              onClick={() => onStepSelect?.(step, index)}
              className="group relative h-2.5 flex-1 cursor-pointer rounded-full outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <div
                className={cn(
                  'absolute inset-0 rounded-full transition-opacity duration-200',
                  barClass,
                  activeIndex !== null && activeIndex !== index && 'opacity-70',
                )}
              />
            </button>
          );
        })}
      </div>

      {/* Offscreen measurement strip for clip-path tooltip positioning */}
      <div
        className="pointer-events-none absolute top-0 left-0 flex h-0 overflow-hidden whitespace-nowrap opacity-0"
        aria-hidden="true"
      >
        {steps.map((step, index) => {
          const Icon = step.icon;
          return (
            <div
              key={`measure-${step.id}`}
              ref={(el) => {
                measureRefs.current[index] = el;
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold"
            >
              <Icon size={13} />
              <span>{step.label}</span>
              {step.statusText && (
                <span className="font-mono text-[11px]">({step.statusText})</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

