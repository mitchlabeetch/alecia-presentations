interface ExportOptionsProps {
  includeNotes: boolean;
  includeWatermarks: boolean;
  variablePresetId: string | null;
  onIncludeNotesChange: (value: boolean) => void;
  onIncludeWatermarksChange: (value: boolean) => void;
  onVariablePresetChange: (value: string | null) => void;
}

export function ExportOptions({
  includeNotes,
  includeWatermarks,
  variablePresetId,
  onIncludeNotesChange,
  onIncludeWatermarksChange,
  onVariablePresetChange,
}: ExportOptionsProps) {
  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-alecia-navy mb-2">
        Options
      </label>

      <label className="flex items-center gap-2 cursor-pointer">
        <input
          type="checkbox"
          checked={includeNotes}
          onChange={(e) => onIncludeNotesChange(e.target.checked)}
          className="rounded border-alecia-silver/50 text-alecia-navy focus:ring-alecia-navy"
        />
        <span className="text-sm text-alecia-navy">Inclure les notes du présentateur</span>
      </label>

      <label className="flex items-center gap-2 cursor-pointer">
        <input
          type="checkbox"
          checked={includeWatermarks}
          onChange={(e) => onIncludeWatermarksChange(e.target.checked)}
          className="rounded border-alecia-silver/50 text-alecia-navy focus:ring-alecia-navy"
        />
        <span className="text-sm text-alecia-navy">Inclure le filigrane Alecia</span>
      </label>

      <div>
        <label className="block text-sm text-alecia-navy mb-1">
          Appliquer les variables de
        </label>
        <select
          value={variablePresetId || ''}
          onChange={(e) => onVariablePresetChange(e.target.value || null)}
          className="alecia-input"
        >
          <option value="">Aucune variable</option>
          <option value="default">Preset par défaut</option>
        </select>
      </div>
    </div>
  );
}
