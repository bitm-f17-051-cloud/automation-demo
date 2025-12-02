import { ChevronUpIcon } from "lucide-react";
import React from "react";

/* eslint-disable @typescript-eslint/no-explicit-any */

function Collapsable({
  children,
  expanded,
  setExpanded,
  className = "",
}: {
  children: React.ReactNode;
  expandedIndex?: number;
  expanded: number;
  setExpanded: React.Dispatch<React.SetStateAction<number>>;
  className?: string;
}) {
  return (
    <div className={`${className} flex-1 min-h-0 bg-white`}>
      {React.Children.toArray(children)
        .filter(Boolean)
        .map((child: any, index) =>
          React.cloneElement(child, {
            index: index + 1,
            expanded: expanded || 0,
            setExpanded: setExpanded,
          })
        )}
    </div>
  );
}

function Item({
  index,
  expanded,
  setExpanded,
  children,
  className = "",
}: {
  index: number;
  expanded: number;
  setExpanded: React.Dispatch<React.SetStateAction<number>>;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`${className} border-b border-gray-300`}>
      {React.Children.map(children, (child: any) =>
        React.cloneElement(child, {
          index: index,
          expanded: expanded,
          setExpanded: setExpanded,
        })
      )}
    </div>
  );
}

function Button({
  className = "",
  index,
  expanded,
  setExpanded,
  children,
  onClick,
}: {
  className?: string;
  index: number;
  expanded: number;
  setExpanded: React.Dispatch<React.SetStateAction<number>>;
  children: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        setExpanded((prev) => (prev === index ? 0 : index));
        if (onClick) {
          onClick();
        }
      }}
      className={`${className} w-full text-left flex items-center justify-between`}
    >
      {children}
      <ChevronUpIcon
        className={`${
          expanded !== index && "rotate-180"
        } w-4 h-4 text-gray-900 stroke-[3] transition-all`}
      />
    </button>
  );
}

function Content({
  index,
  expanded,
  children,
}: {
  index: number;
  expanded: number;
  children: React.ReactNode;
}) {
  return (
    <div
      className={`${
        expanded !== index ? "h-0 overflow-y-hidden" : "mt-3"
      } space-y-4 transition-all`}
    >
      {children}
    </div>
  );
}

Collapsable.Item = Item;
Collapsable.Button = Button;
Collapsable.Content = Content;

export default Collapsable;
