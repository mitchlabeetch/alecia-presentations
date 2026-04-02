interface SlideRangeSelectorProps {
  value: 'all' | 'current' | 'custom';
  customRange: { from: number; to: number };
  totalSlides: number;
  onChange: (value: 'all' | 'current' | 'custom') => void;
  onCustomRangeChange: (range: { from: number; to: number }) => void;
}

export function SlideRangeSelector({
  value,
  customRange,
  totalSlides,
  onChange,
  onCustomRangeChange,
}: SlideRangeSelectorProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-alecia-navy mb-2">
        Plage de diapositives
      </label>
      <div className="space-y-2">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            name="slideRange"
            checked={value === 'all'}
            onChange={() => onChange('all')}
            className="text-alecia-navy focus:ring-alecia-navy"
          />
          <span className="text-sm text-alecia-navy">
            Toutes les diapositives ({totalSlides})
          </span>
        </label>

        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            name="slideRange"
            checked={value === 'current'}
            onChange={() => onChange('current')}
            className="text-alecia-navy focus:ring-alecia-navy"
          />
          <span className="text-sm text-alecia-navy">Diapositive actuelle</span>
        </label>

        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            name="slideRange"
            checked={value === 'custom'}
            onChange={() => onChange('custom')}
            className="text-alecia-navy focus:ring-alecia-navy"
          />
          <span className="text-sm text-alecia-navy">Personnalisé</span>
        </label>

        {value === 'custom' && (
          <div className="flex items-center gap-2 ml-6 mt-2">
            <input
              type="number"
              min={1}
              max={totalSlides}
              value={customRange.from}
              onChange={(e) =>
                onCustomRangeChange({ ...customRange, from: parseInt(e.target.value) || 1 })
              }
              className="alecia-input w-16 text-center"
            />
            <span className="text-alecia-silver">à</span>
            <input
              type="number"
              min={1}
              max={totalSlides}
              value={customRange.to}
              onChange={(e) =>
                onCustomRangeChange({ ...customRange, to: parseInt(e.target.value) || totalSlides })
              }
              className="alecia-input w-16 text-center"
            />
            <span className="text-sm text-alecia-silver">
              ({customRange.to - customRange.from + 1} diapositives)
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
