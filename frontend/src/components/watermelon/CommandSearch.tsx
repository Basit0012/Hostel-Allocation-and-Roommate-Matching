import {
  useState,
  useMemo,
  useEffect,
  useRef,
  type KeyboardEvent,
  type FC,
  type ReactNode,
} from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface CommandItem {
  id: string;
  title: string;
  subtitle?: string;
  section: string;
  icon: ReactNode;
  shortcut?: string;
  action: () => void;
}

interface CommandSearchProps {
  items: CommandItem[];
  placeholder?: string;
  className?: string;
}

export const CommandSearch: FC<CommandSearchProps> = ({
  items,
  placeholder = 'Search portal...',
  className,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      const timeout = setTimeout(() => {
        inputRef.current?.focus();
      }, 60);
      return () => clearTimeout(timeout);
    }
    setQuery('');
    setActiveIndex(0);
  }, [isOpen]);

  useEffect(() => {
    const handleGlobalKeyDown = (e: globalThis.KeyboardEvent) => {
      const targetTag = (document.activeElement?.tagName || '').toLowerCase();
      const inEditable =
        targetTag === 'input' ||
        targetTag === 'textarea' ||
        targetTag === 'select' ||
        (document.activeElement as HTMLElement | null)?.isContentEditable;

      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
        return;
      }

      if (e.key === '/' && !isOpen && !inEditable) {
        e.preventDefault();
        setIsOpen(true);
        return;
      }

      if (e.key === 'Escape' && isOpen) {
        e.preventDefault();
        e.stopPropagation();
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown, true);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown, true);
  }, [isOpen]);

  const filteredItems = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        item.section.toLowerCase().includes(q) ||
        (item.subtitle && item.subtitle.toLowerCase().includes(q)),
    );
  }, [query, items]);

  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  const sections = useMemo(() => {
    const groups: Record<string, CommandItem[]> = {};
    filteredItems.forEach((item) => {
      if (!groups[item.section]) groups[item.section] = [];
      groups[item.section].push(item);
    });
    return Object.entries(groups).map(([name, groupItems]) => ({
      name,
      items: groupItems,
    }));
  }, [filteredItems]);

  const handleInputKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (filteredItems.length === 0) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((prev) => (prev + 1) % filteredItems.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((prev) => (prev - 1 + filteredItems.length) % filteredItems.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const selected = filteredItems[activeIndex];
      if (selected) {
        selected.action();
        setIsOpen(false);
      }
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        aria-label="Open quick command search"
        className={cn(
          'group flex h-9 w-full max-w-[260px] items-center justify-between gap-2 rounded-lg border border-border bg-card px-3 text-sm text-muted-foreground transition-colors hover:border-border-strong hover:text-foreground cursor-pointer',
          className,
        )}
      >
        <span className="flex items-center gap-2 truncate">
          <Search size={15} className="shrink-0 text-muted-foreground" />
          <span className="truncate font-normal">{placeholder}</span>
        </span>
        <kbd className="hidden sm:inline-flex shrink-0 items-center rounded border border-border bg-muted px-1.5 py-0.5 font-mono text-[11px] font-medium text-muted-foreground">
          Ctrl+K
        </kbd>
      </button>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-start justify-center px-4 pt-16 sm:pt-24">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.14 }}
              className="fixed inset-0 bg-black/35 backdrop-blur-[2px]"
              onClick={() => setIsOpen(false)}
            />

            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label="Quick command palette"
              initial={{ opacity: 0, scale: 0.98, y: -8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, y: -6 }}
              transition={{ type: 'spring', stiffness: 420, damping: 32 }}
              className="relative z-10 flex w-full max-w-[460px] flex-col overflow-hidden rounded-2xl border border-border bg-background shadow-[0_24px_48px_-12px_rgba(0,0,0,0.22)]"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center border-b border-border px-4 py-3">
                <Search size={17} className="mr-3 shrink-0 text-muted-foreground" />
                <input
                  ref={inputRef}
                  type="text"
                  placeholder={placeholder}
                  className="w-full bg-transparent text-sm font-medium text-foreground placeholder:text-muted-foreground outline-none"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={handleInputKeyDown}
                />
                <kbd className="ml-2 shrink-0 rounded border border-border bg-muted px-1.5 py-0.5 font-mono text-[11px] font-medium text-muted-foreground">
                  Esc
                </kbd>
              </div>

              <div className="max-h-[340px] overflow-y-auto p-1.5">
                {filteredItems.length === 0 ? (
                  <div className="py-10 text-center text-sm text-muted-foreground">
                    No matching routes or actions for "{query}"
                  </div>
                ) : (
                  <div className="space-y-3 py-1">
                    {sections.map((section) => (
                      <div key={section.name} className="space-y-1">
                        <h3 className="px-3 py-1 font-mono text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
                          {section.name}
                        </h3>
                        <div className="space-y-0.5">
                          {section.items.map((item) => {
                            const globalIndex = filteredItems.findIndex(
                              (fi) => fi.id === item.id,
                            );
                            const isActive = globalIndex === activeIndex;

                            return (
                              <button
                                key={item.id}
                                type="button"
                                onMouseEnter={() => setActiveIndex(globalIndex)}
                                onClick={() => {
                                  item.action();
                                  setIsOpen(false);
                                }}
                                className={cn(
                                  'flex w-full cursor-pointer items-center justify-between rounded-lg px-3 py-2 text-left transition-colors',
                                  isActive
                                    ? 'bg-muted text-foreground'
                                    : 'text-muted-foreground hover:text-foreground',
                                )}
                              >
                                <span className="flex items-center gap-3 min-w-0">
                                  <span
                                    className={cn(
                                      'shrink-0',
                                      isActive ? 'text-foreground' : 'text-muted-foreground',
                                    )}
                                  >
                                    {item.icon}
                                  </span>
                                  <span className="min-w-0">
                                    <span className="block truncate text-sm font-medium">
                                      {item.title}
                                    </span>
                                    {item.subtitle && (
                                      <span className="block truncate text-xs text-muted-foreground">
                                        {item.subtitle}
                                      </span>
                                    )}
                                  </span>
                                </span>

                                {item.shortcut && (
                                  <kbd className="ml-2 shrink-0 rounded border border-border bg-card px-1.5 py-0.5 font-mono text-[11px] font-medium text-muted-foreground">
                                    {item.shortcut}
                                  </kbd>
                                )}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

