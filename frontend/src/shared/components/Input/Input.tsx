import type {
  InputHTMLAttributes,
  ReactNode,
} from 'react';

interface InputProps
  extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  hint?: string;
  leadingElement?: ReactNode;
  trailingElement?: ReactNode;
}

export function Input({
  label,
  error,
  hint,
  leadingElement,
  trailingElement,
  id,
  name,
  className = '',
  required,
  ...inputProps
}: InputProps) {
  const generatedId =
    id ??
    name ??
    label.toLowerCase().replaceAll(' ', '-');

  const descriptionId = `${generatedId}-description`;
  const hasDescription = Boolean(error || hint);

  return (
    <div className="grid gap-1.5">
      <label
        htmlFor={generatedId}
        className="text-sm font-medium text-text-primary"
      >
        {label}

        {required && (
          <span
            aria-hidden="true"
            className="ml-1 text-danger-500"
          >
            *
          </span>
        )}
      </label>

      <div className="relative">
        {leadingElement && (
          <div className="pointer-events-none absolute inset-y-0 left-0 grid place-items-center pl-3 text-text-secondary">
            {leadingElement}
          </div>
        )}

        <input
          {...inputProps}
          id={generatedId}
          name={name}
          required={required}
          aria-invalid={Boolean(error)}
          aria-describedby={
            hasDescription ? descriptionId : undefined
          }
          className={[
            'min-h-12 w-full rounded-lg border bg-surface',
            'text-sm text-text-primary placeholder:text-text-secondary',
            'outline-none transition duration-200',
            'disabled:cursor-not-allowed disabled:bg-surface-secondary disabled:text-text-secondary',
            leadingElement ? 'pl-10' : 'pl-3',
            trailingElement ? 'pr-10' : 'pr-3',
            error
              ? 'border-danger focus:border-danger focus:ring-4 focus:ring-danger/10'
              : 'border-border-subtle focus:border-brand-default focus:ring-4 focus:ring-brand-default/10',
            className,
          ]
            .filter(Boolean)
            .join(' ')}
        />

        {trailingElement && (
          <div className="absolute inset-y-0 right-0 grid place-items-center pr-3 text-text-secondary">
            {trailingElement}
          </div>
        )}
      </div>

      {hasDescription && (
        <p
          id={descriptionId}
          className={[
            'text-xs',
            error
              ? 'text-danger'
              : 'text-text-secondary',
          ].join(' ')}
        >
          {error ?? hint}
        </p>
      )}
    </div>
  );
}
