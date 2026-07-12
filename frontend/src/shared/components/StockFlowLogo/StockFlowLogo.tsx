import stockFlowLogoUrl from './stockflow-logo.png';

interface StockFlowLogoProps {
  className?: string;
  markClassName?: string;
  wordmarkClassName?: string;
  subtitle?: string;
  subtitleClassName?: string;
  showWordmark?: boolean;
}

export function StockFlowLogo({
  className = '',
  markClassName = 'size-10',
  wordmarkClassName = 'text-sm',
  subtitle,
  subtitleClassName = 'text-text-secondary',
  showWordmark = true,
}: StockFlowLogoProps) {
  return (
    <div
      className={[
        'flex min-w-0 items-center gap-3',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <StockFlowMark className={markClassName} />

      {showWordmark && (
        <div className="min-w-0">
          <StockFlowWordmark
            className={wordmarkClassName}
          />

          {subtitle && (
            <p
              className={[
                'truncate text-xs font-medium uppercase tracking-[0.18em]',
                subtitleClassName,
              ]
                .filter(Boolean)
                .join(' ')}
            >
              {subtitle}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

export function StockFlowWordmark({
  className = '',
}: {
  className?: string;
}) {
  return (
    <span
      className={[
        'block truncate font-bold tracking-tight',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <span className="text-[#0b4aa2]">Stock</span>
      <span className="text-[#11b8b2]">Flow</span>
    </span>
  );
}

export function StockFlowMark({
  className = '',
}: {
  className?: string;
}) {
  return (
    <span
      aria-hidden="true"
      className={[
        'relative inline-block shrink-0 overflow-hidden',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <img
        src={stockFlowLogoUrl}
        alt=""
        className="pointer-events-none absolute left-1/2 top-1/2 size-full max-w-none -translate-x-1/2 -translate-y-1/2 scale-[1.55] object-contain"
      />
    </span>
  );
}
