import React, { useState } from 'react';
import { motion, AnimatePresence, LayoutGroup } from 'motion/react';
import { Pencil, X, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface InlineTableColumn<T> {
  key: keyof T & string;
  label: string;
  icon?: React.ReactNode;
  editable?: boolean;
  align?: 'left' | 'right';
  render?: (item: T) => React.ReactNode;
}

interface InlineTableControlProps<T extends { id: string | number }> {
  data: T[];
  columns: InlineTableColumn<T>[];
  onUpdate?: (item: T) => void | Promise<void>;
  allowEdit?: boolean;
  emptyMessage?: string;
  className?: string;
}

const layoutTransition = {
  type: 'spring' as const,
  bounce: 0,
  duration: 0.45,
};

export function InlineTableControl<T extends { id: string | number }>({
  data,
  columns,
  onUpdate,
  allowEdit = true,
  emptyMessage = 'No records available.',
  className,
}: InlineTableControlProps<T>) {
  const [editingId, setEditingId] = useState<string | number | null>(null);
  const [editValues, setEditValues] = useState<T | null>(null);

  const handleDone = async () => {
    if (!editValues) return;
    await onUpdate?.(editValues);
    setEditingId(null);
    setEditValues(null);
  };

  if (data.length === 0) {
    return (
      <div className="rounded-xl border border-border bg-card px-4 py-8 text-center text-sm text-muted-foreground">
        {emptyMessage}
      </div>
    );
  }

  const colTemplate = `${columns.map(() => 'minmax(0, 1fr)').join(' ')}${allowEdit ? ' 44px' : ''}`;

  return (
    <div className={cn('w-full overflow-hidden rounded-xl border border-border bg-card', className)}>
      <div
        className={cn(
          'hidden border-b border-border bg-muted/60 px-4 py-3 font-mono text-xs font-semibold tracking-wide text-muted-foreground uppercase transition-opacity sm:grid sm:gap-3',
          editingId !== null && 'opacity-40',
        )}
        style={{ gridTemplateColumns: colTemplate }}
      >
        {columns.map((col) => (
          <div
            key={col.key}
            className={cn(
              'flex items-center gap-1.5',
              col.align === 'right' && 'justify-end',
            )}
          >
            {col.icon}
            <span>{col.label}</span>
          </div>
        ))}
        {allowEdit && <span className="sr-only">Actions</span>}
      </div>

      <LayoutGroup>
        <div className="divide-y divide-border">
          {data.map((item) => {
            const isEditing = editingId === item.id;
            return (
              <div key={item.id} className="relative">
                <AnimatePresence mode="popLayout">
                  {isEditing && editValues ? (
                    <motion.div
                      key={`edit-${item.id}`}
                      layout
                      transition={layoutTransition}
                      className="flex flex-col gap-3 bg-background p-4"
                    >
                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                        {columns.map((col) => (
                          <div key={col.key} className="flex flex-col gap-1">
                            <label className="font-mono text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">
                              {col.label}
                            </label>
                            {col.editable !== false ? (
                              <input
                                type="text"
                                value={String(editValues[col.key] ?? '')}
                                onChange={(e) =>
                                  setEditValues({
                                    ...editValues,
                                    [col.key]: e.target.value,
                                  })
                                }
                                className="h-9 w-full rounded-lg border border-border bg-card px-3 text-sm font-medium text-foreground outline-none focus:border-foreground"
                              />
                            ) : (
                              <div className="flex h-9 items-center rounded-lg border border-border bg-muted/50 px-3 text-sm text-muted-foreground">
                                {col.render ? col.render(item) : String(item[col.key] ?? '')}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setEditingId(null);
                            setEditValues(null);
                          }}
                          className="inline-flex h-8 cursor-pointer items-center gap-1.5 rounded-lg border border-border bg-card px-3 text-xs font-semibold text-foreground hover:bg-muted"
                        >
                          <X size={14} /> Cancel
                        </button>
                        <button
                          type="button"
                          onClick={handleDone}
                          className="inline-flex h-8 cursor-pointer items-center gap-1.5 rounded-lg bg-primary px-3 text-xs font-semibold text-primary-foreground hover:opacity-90"
                        >
                          <Check size={14} /> Save
                        </button>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key={`row-${item.id}`}
                      layout="position"
                      transition={layoutTransition}
                      className={cn(
                        'grid grid-cols-1 gap-2 px-4 py-3.5 text-sm transition-colors hover:bg-muted/40 sm:items-center sm:gap-3',
                        editingId !== null && 'opacity-40',
                      )}
                      style={{
                        gridTemplateColumns: undefined,
                      }}
                    >
                      <div
                        className="hidden sm:grid sm:items-center sm:gap-3"
                        style={{ gridTemplateColumns: colTemplate }}
                      >
                        {columns.map((col) => (
                          <div
                            key={col.key}
                            className={cn(
                              'min-w-0 truncate text-foreground',
                              col.align === 'right' && 'text-right',
                            )}
                          >
                            {col.render ? col.render(item) : String(item[col.key] ?? '')}
                          </div>
                        ))}
                        {allowEdit && (
                          <div className="flex justify-end">
                            <button
                              type="button"
                              aria-label="Edit row"
                              onClick={() => {
                                setEditValues({ ...item });
                                setEditingId(item.id);
                              }}
                              className="inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground"
                            >
                              <Pencil size={15} />
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Mobile clean stack (360px safe) */}
                      <div className="flex flex-col gap-1.5 sm:hidden">
                        {columns.map((col) => (
                          <div
                            key={`m-${col.key}`}
                            className="flex items-center justify-between gap-3"
                          >
                            <span className="font-mono text-[11px] font-medium text-muted-foreground uppercase">
                              {col.label}
                            </span>
                            <span className="text-right text-sm text-foreground">
                              {col.render ? col.render(item) : String(item[col.key] ?? '')}
                            </span>
                          </div>
                        ))}
                        {allowEdit && (
                          <div className="mt-1 flex justify-end">
                            <button
                              type="button"
                              onClick={() => {
                                setEditValues({ ...item });
                                setEditingId(item.id);
                              }}
                              className="inline-flex items-center gap-1 rounded-md border border-border bg-background px-2.5 py-1 text-xs font-medium text-foreground"
                            >
                              <Pencil size={12} /> Edit
                            </button>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </LayoutGroup>
    </div>
  );
}

