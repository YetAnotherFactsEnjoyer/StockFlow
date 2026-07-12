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
        className="text-sm font-medium text-slate-700"
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
          <div className="pointer-events-none absolute inset-y-0 left-0 grid place-items-center pl-3 text-slate-400">
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
            'min-h-11 w-full rounded-control border bg-white',
            'text-sm text-slate-950 placeholder:text-slate-400',
            'outline-none transition duration-200',
            'disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-500',
            leadingElement ? 'pl-10' : 'pl-3',
            trailingElement ? 'pr-10' : 'pr-3',
            error
              ? 'border-danger-500 focus:border-danger-500 focus:ring-3 focus:ring-danger-500/15'
              : 'border-slate-300 focus:border-brand-500 focus:ring-3 focus:ring-brand-500/15',
            className,
          ]
            .filter(Boolean)
            .join(' ')}
        />

        {trailingElement && (
          <div className="absolute inset-y-0 right-0 grid place-items-center pr-3 text-slate-400">
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
              ? 'text-danger-700'
              : 'text-slate-500',
          ].join(' ')}
        >
          {error ?? hint}
        </p>
      )}
    </div>
  );
}
