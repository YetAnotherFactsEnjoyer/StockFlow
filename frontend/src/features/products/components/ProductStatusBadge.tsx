interface ProductStatusBadgeProps {
  active: boolean;
}

export function ProductStatusBadge({
  active,
}: ProductStatusBadgeProps) {
  return (
    <span
      className={[
        'inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold',
        active
          ? 'border-success/25 bg-success/10 text-success'
          : 'border-border-subtle bg-surface-secondary text-text-secondary',
      ].join(' ')}
    >
      {active ? 'Active' : 'Inactive'}
    </span>
  );
}
