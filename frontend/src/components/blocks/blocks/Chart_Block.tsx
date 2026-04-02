import type { BlockContent, TimelineItem } from '@/types';
import { Pencil } from 'lucide-react';

interface Process_TimelineProps {
  content: BlockContent;
  data?: { timeline?: TimelineItem[] } | null;
  isEditing?: boolean;
  onChange?: (content: BlockContent) => void;
}

export function Process_Timeline({ content, data, isEditing = false, onChange }: Process_T