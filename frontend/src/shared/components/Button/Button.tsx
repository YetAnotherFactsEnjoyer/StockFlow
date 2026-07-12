import type {
  ButtonHTMLAttributes,
  ReactNode,
} from 'react';

type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'ghost'
  | 'danger';

type ButtonSize =
  | 'small'
  | 'medium'
  | 'large';

interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  loading?: boolean;
  isLoading?: boolean;
  leftIcon?: ReactNode;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'border border-transparent bg-brand-default text-white shadow-sm hover:bg-brand-hover focus-visible:ring-brand-default',

  secondary:
    'border border-border-subtle bg-white text-text-primary shadow-sm hover:bg-[#f8f9fa] focus-visible:ring-slate-400',

  ghost:
    'border border-transparent bg-transparent text-text-secondary hover:bg-surface-secondary hover:text-text-primary focus-visible:ring-slate-400',

  danger:
    'border border-transparent bg-danger text-white shadow-sm hover:bg-danger-700 focus-visible:ring-danger-500',
};

const sizeClasses: Record<ButtonSize, string> = {
  small: 'min-h-9 px-3 text-sm',
  medium: 'min-h-11 px-4 text-sm',
  large: 'min-h-12 px-6 text-base',
};

export function Button({
  children,
  variant = 'primary',
  size = 'medium',
  fullWidth = false,
  loading = false,
  isLoading = false,
  leftIcon,
  disabled,
  className = '',
  type = 'button',
  ...buttonProps
}: ButtonProps) {
  const showLoading = loading || isLoading;
  const isDisabled = disabled || showLoading;

  return (
    <button
      {...buttonProps}
      type={type}
      disabled={isDisabled}
      aria-busy={showLoading}
      className={[
        'inline-flex items-center justify-center gap-2',
        'pressable-control rounded-xl font-medium',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
        'disabled:pointer-events-none disabled:opacity-40',
        variantClasses[variant],
        sizeClasses[size],
        fullWidth ? 'w-full' : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {showLoading && (
        <span
          aria-hidden="true"
          className="size-4 animate-spin rounded-full border-2 border-current border-r-transparent"
        />
      )}

      {!showLoading && leftIcon}

      {children}
    </button>
  );
}
