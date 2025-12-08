"use client";

import { createContext, useContext, useState, ReactNode, useRef, useCallback } from "react";

type FilterTypeSelectorContextType = {
  isOpen: boolean;
  openPanel: (onSelect?: (value: string) => void) => void;
  closePanel: () => void;
  handleSelect: (value: string) => void;
};

const FilterTypeSelectorContext = createContext<FilterTypeSelectorContextType | undefined>(undefined);

export const FilterTypeSelectorProvider = ({ children }: { children: ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const onSelectCallbackRef = useRef<((value: string) => void) | null>(null);

  const openPanel = useCallback((onSelect?: (value: string) => void) => {
    onSelectCallbackRef.current = onSelect || null;
    setIsOpen(true);
  }, []);

  const closePanel = useCallback(() => {
    setIsOpen(false);
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
    <FilterTypeSelectorContext.Provider value={{ isOpen, openPanel, closePanel, handleSelect }}>
      {children}
    </FilterTypeSelectorContext.Provider>
  );
};

export const useFilterTypeSelector = () => {
  const context = useContext(FilterTypeSelectorContext);
  if (!context) {
    throw new Error("useFilterTypeSelector must be used within FilterTypeSelectorProvider");
  }
  return context;
};

