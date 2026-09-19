import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';

interface JoinModalContextValue {
  isOpen: boolean;
  open: () => void;
  close: () => void;
}

const JoinModalContext = createContext<JoinModalContextValue | null>(null);

export function JoinModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  const value = useMemo(() => ({ isOpen, open, close }), [isOpen, open, close]);

  return <JoinModalContext.Provider value={value}>{children}</JoinModalContext.Provider>;
}

export function useJoinModal(): JoinModalContextValue {
  const ctx = useContext(JoinModalContext);
  if (!ctx) {
    throw new Error('useJoinModal must be used within a <JoinModalProvider>');
  }
  return ctx;
}
