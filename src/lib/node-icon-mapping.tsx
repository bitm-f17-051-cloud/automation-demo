// Icon mapping utility for workflow nodes
import React from 'react';
import { TriggerIcon } from '@/components/assets/icons/trigger';
import { Play, Zap, GitBranch, RefreshCw, Square } from 'lucide-react';

export const iconMap = {
  trigger: TriggerIcon,
  play: Play,
  zap: Zap,
  branch: GitBranch,
  refresh: RefreshCw,
  square: Square,
} as const;

export type IconType = keyof typeof iconMap;

interface NodeIconRendererProps {
  iconType: IconType | string;
  className?: string;
}

export const NodeIconRenderer: React.FC<NodeIconRendererProps> = ({ iconType, className = "w-4 h-4" }) => {
  const IconComponent = iconMap[iconType as IconType];
  
  if (!IconComponent) {
    // Fallback to a default icon if not found
    const DefaultIcon = iconMap.play;
    return <DefaultIcon className={className} />;
  }
  
  return <IconComponent className={className} />;
};
