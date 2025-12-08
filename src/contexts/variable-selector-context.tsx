"use client";

import { createContext, useContext, useState, ReactNode, useRef, useCallback } from "react";

type VariableSelectorContextType = {
  isOpen: boolean;
  openPanel: (onSelect?: (value: string) => void) => void;
  closePanel: () => void;
  handleSelect: (value: string) => void;
};

const VariableSelectorContext = createContext<VariableSelectorContextType | undefined>(undefined);

export const VariableSelectorProvider = ({ children }: { children: ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const onSelectCallbackRef = useRef<((value: string) => void) | null>(null);

  const openPanel = useCallback((onSelect?: (value: string) => void) => {
    onSelectCallbackRef.current = onSelect || null;
    setIsOpen(true);
  }, []);

  const closePanel = useCallback(() => {
    setIsOpen(false);
    // Clear callback after a small delay to avoid issues
    setTimeout(() => {
      onSelectCallbackRef.current = null;
    }, 100);
  }, []);

  const handleSelect = useCallback((value: string) => {
    if (onSelectCallbackRef.current) {
      onSelectCallbackRef.current(value);
    }
    closePanel();
  }, [closePanel]);

  return (
    <VariableSelectorContext.Provider value={{ isOpen, openPanel, closePanel, handleSelect }}>
      {children}
    </VariableSelectorContext.Provider>
  );
};

export const useVariableSelector = () => {
  const context = useContext(VariableSelectorContext);
  if (!context) {
    throw new Error("useVariableSelector must be used within VariableSelectorProvider");
  }
  return context;
};

