import { useState, useRef } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import { toast } from "sonner";

interface Props {
  projectId: Id<"projects">;
}

export function UploadPanel({ projectId }: Props) {
  const uploads = useQuery(api.uploads.list, { projectId }) ?? [];
  const generateUrl = useMutation(api.uploads.generateUploadUrl);
  const saveUpload = useMutation(api.uploads.save);
  const removeUpload = useMutation(api.uploads.remove);

  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    setUploading(true);
    setProgress(0);
    for (const file of Array.from(files)) {
      try {
        setProgress(20);
        const url = await generateUrl();
        setProgress(40);
        const res = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": file.type },
          body: file,
        });
        setProgress(80);
        const { storageId } = await res.json();
        await saveUpload({ projectId, storageId, fileName: file.name, fileType: file.type, fileSize: file.size });
        setProgress(100);
        toast.success(`${file.name} importé`);
      } catch {
        toast.error(`Erreur lors de l'import de ${file.name}`);
      }
    }
    setUploading(false);
    setProgress(0);
  }

  function formatSize(bytes: number) {
    if (bytes < 1024) return `${bytes} o`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} Ko`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} Mo`;
  }

  function fileIcon(type: string) {
    if (type.includes("image")) return "🖼️";
    if (type.includes("pdf")) return "📄";
    if (type.includes("spreadsheet") || type.includes("excel") || type.includes("csv")) return "📊";
    if (type.includes("presentation") || type.includes("powerpoint")) return "📋";
    return "📎";
  }

  return (
    <div className="flex flex-col h-full">
      <div className="p-3 border-b border-gray-100">
        <p className="text-xs font-semibold text-[#1a3a5c]">📎 Fichiers & Ressources</p>
        <p className="text-xs text-gray-400 mt-0.5">Importez des documents, images, tableaux</p>
      </div>

      <div className="p-3">
        <div
          onDragOver={e => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={e => { e.preventDefault(); setDragOver(false); handleFiles(e.dataTransfer.files); }}
          onClick={() => fileRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition-all ${dragOver ? "border-[#1a3a5c] bg-[#1a3a5c]/5" : "border-gray-200 hover:border-[#1a3a5c]/40"}`}
        >
          <span className="text-2xl block mb-2">⬆️</span>
          <p className="text-xs font-medium text-gray-600">Glissez-déposez ou cliquez</p>
          <p className="text-xs text-gray-400 mt-1">PDF, images, Excel, PowerPoint</p>
          <input
            ref={fileRef}
            type="file"
            multiple
            accept=".pdf,.png,.jpg,.jpeg,.xlsx,.xls,.csv,.pptx,.ppt"
            className="hidden"
            onChange={e => handleFiles(e.target.files)}
          />
        </div>

        {uploading && (
          <div className="mt-3">
            <div className="flex justify-between text-xs text-gray-500 mb-1">
              <span>Import en cours...</span>
              <span>{progress}%</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-1.5">
              <div
                className="h-1.5 rounded-full bg-[#1a3a5c] transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto px-3 space-y-2">
        {uploads.length === 0 && !uploading && (
          <p className="text-xs text-gray-400 text-center py-4">Aucun fichier importé</p>
        )}
        {uploads.map(u => (
          <div key={u._id} className="flex items-center gap-2 p-2.5 rounded-lg border border-gray-100 hover:border-gray-200 group">
            <span className="text-lg flex-shrink-0">{fileIcon(u.fileType)}</span>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-gray-700 truncate">{u.fileName}</p>
              <p className="text-xs text-gray-400">{formatSize(u.fileSize)}</p>
            </div>
            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              {u.url && (
                <a href={u.url} target="_blank" rel="noopener noreferrer" className="p-1 rounded hover:bg-gray-100 text-gray-400 hover:text-[#1a3a5c] text-xs">↗</a>
              )}
              <button
                onClick={() => removeUpload({ uploadId: u._id })}
                className="p-1 rounded hover:bg-red-50 text-gray-400 hover:text-red-500 text-xs"
              >✕</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
