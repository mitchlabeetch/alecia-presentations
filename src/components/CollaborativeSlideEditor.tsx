import { useEffect, useRef } from 'react';
import { useBlockNoteSync } from '@convex-dev/prosemirror-sync/blocknote';
import { BlockNoteView } from '@blocknote/mantine';
import { BlockNoteEditor } from '@blocknote/core';
import '@blocknote/core/fonts/inter.css';
import '@blocknote/mantine/style.css';
import { api } from '../../convex/_generated/api';
import { Id } from '../../convex/_generated/dataModel';
import { useConvexAuth } from 'convex/react';

interface Props {
  slideId: Id<'slides'>;
  field: 'title' | 'content' | 'notes';
  onContentChange?: (text: string) => void;
  minHeight?: string;
  placeholder?: string;
}

const EMPTY_DOC = { type: 'doc', content: [] };

function EditorInner({
  slideId,
  field,
  onContentChange,
  minHeight,
  placeholder: _placeholder,
}: Props) {
  const docId = `slide-${slideId}-${field}`;
  const sync = useBlockNoteSync<BlockNoteEditor>(api.prosemirrorSync, docId);
  const initialized = useRef(false);

  useEffect(() => {
    if (sync.editor && onContentChange) {
      const editor = sync.editor as BlockNoteEditor;
      const handler = () => {
        const text = editor.document
          .map((b: any) => {
            const content = b.content;
            if (Array.isArray(content)) {
              return content.map((c: any) => c.text ?? '').join('');
            }
            return '';
          })
          .filter(Boolean)
          .join('\n');
        onContentChange(text);
      };
      editor.onChange(handler);
    }
  }, [sync.editor]);

  // Auto-initialize new documents
  useEffect(() => {
    if (!sync.isLoading && !sync.editor && !initialized.current) {
      initialized.current = true;
      sync.create(EMPTY_DOC);
    }
  }, [sync.isLoading, sync.editor]);

  if (sync.isLoading) {
    return (
      <div className="flex items-center justify-center py-6">
        <div className="flex items-center gap-2 text-gray-400">
          <div className="w-3.5 h-3.5 border-2 border-[#1a3a5c]/30 border-t-[#1a3a5c] rounded-full animate-spin" />
          <span className="text-xs">Chargement de l'éditeur collaboratif...</span>
        </div>
      </div>
    );
  }

  if (!sync.editor) {
    return (
      <div className="flex items-center justify-center py-6">
        <div className="flex items-center gap-2 text-gray-400">
          <div className="w-3.5 h-3.5 border-2 border-[#1a3a5c]/30 border-t-[#1a3a5c] rounded-full animate-spin" />
          <span className="text-xs">Initialisation...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bn-container" data-color-scheme="light">
      <BlockNoteView
        editor={sync.editor as BlockNoteEditor}
        theme="light"
        style={{ minHeight: minHeight ?? (field === 'content' ? '180px' : '52px') }}
      />
    </div>
  );
}

export function CollaborativeSlideEditor({
  slideId,
  field,
  onContentChange,
  minHeight,
  placeholder,
}: Props) {
  const { isAuthenticated } = useConvexAuth();
  if (!isAuthenticated) return null;
  return (
    <EditorInner
      key={`${slideId}-${field}`}
      slideId={slideId}
      field={field}
      onContentChange={onContentChange}
      minHeight={minHeight}
      placeholder={placeholder}
    />
  );
}
