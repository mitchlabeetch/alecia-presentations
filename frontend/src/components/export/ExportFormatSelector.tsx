import { FileText, FileImage, FileSpreadsheet, Package, Check } from 'lucide-react';
import type { ExportFormat } from '@/types';

interface ExportFormatSelectorProps {
  value: ExportFormat;
  onChange: (format: ExportFormat) => void;
}

const FORMATS: { value: ExportFormat; label: string; icon: typeof FileText; description: string }[] = [
  {
    value: 'pptx',
    label: 'PowerPoint',
    icon: FileText,
    description: 'Format natif pour Microsoft PowerPoint',
  },
  {
    value: 'pdf',
    label: 'PDF',
    icon: FileSpreadsheet,
    description: 'Document pour partage et impression',
  },
  {
    value: 'png',
    label: 'Images PNG',
    icon: FileImage,
    description: 'Images individuelles par diapositive',
  },
  {
    value: 'zip',
    label: 'Archive ZIP',
    icon: Package,
    description: 'Toutes les images compressées',
  },
];

export function ExportFormatSelector({ value, onChange }: ExportFormatSelectorProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-alecia-navy mb-2">
        Format d'export
      </label>
      <div className="grid grid-cols-2 gap-2">
        {FORMATS.map(({ value: formatValue, label, icon: Icon, description }) => (
          <button
            key={formatValue}
            onClick={() => onChange(formatValue)}
            className={`
              p-3 rounded-lg border text-left transition-all
              ${value === formatValue
                ? 'border-alecia-navy bg-alecia-navy/5'
                : 'border-alecia-silver/30 hover:border-alecia-silver'
              }
            `}
          >
            <div className="flex items-center justify-between mb-1">
              <Icon className={`w-5 h-5 ${value === formatValue ? 'text-alecia-navy' : 'text-alecia-silver'}`} />
              {value === formatValue && (
                <Check className="w-4 h-4 text-alecia-navy" />
              )}
            </div>
            <span className="text-sm font-medium text-alecia-navy block">{label}</span>
            <span className="text-xs text-alecia-silver mt-0.5 block">{description}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
