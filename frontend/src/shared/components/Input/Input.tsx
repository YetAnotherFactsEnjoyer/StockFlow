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
    <div className="grid gap-1.5 pt-3">
      <div className="group relative">
        {leadingElement && (
          <div className="pointer-events-none absolute inset-y-0 left-0 grid place-items-center pl-2 text-text-secondary">
            {leadingElement}
          </div>
        )}

        <input
          {...inputProps}
          id={generatedId}
          name={name}
          required={required}
          placeholder=" "
          aria-invalid={Boolean(error)}
          aria-describedby={
            hasDescription ? descriptionId : undefined
          }
          className={[
            'peer min-h-11 w-full border-x-0 border-t-0 border-b-2 bg-transparent pb-2 pt-3',
            'text-sm text-text-primary outline-none transition-all duration-200 placeholder:text-transparent',
            'disabled:cursor-not-allowed disabled:text-text-secondary disabled:opacity-60',
            leadingElement ? 'pl-9' : 'pl-1',
            trailingElement ? 'pr-9' : 'pr-1',
            error
              ? 'border-danger focus:border-danger'
              : 'border-border-subtle hover:border-text-secondary focus:border-brand-default',
            className,
          ]
            .filter(Boolean)
            .join(' ')}
        />

        <label
          htmlFor={generatedId}
          className={[
            'pointer-events-none absolute top-3 text-sm text-text-secondary transition-all duration-200',
            leadingElement ? 'left-9' : 'left-1',
            'peer-focus:-translate-y-5 peer-focus:text-xs peer-focus:text-brand-default',
            'peer-[:not(:placeholder-shown)]:-translate-y-5 peer-[:not(:placeholder-shown)]:text-xs',
            error ? 'text-danger peer-focus:text-danger' : '',
          ].join(' ')}
        >
          {label}
          {required && (
            <span aria-hidden="true" className="ml-1 text-danger">
              *
            </span>
          )}
        </label>

        {trailingElement && (
          <div className="absolute inset-y-0 right-0 grid place-items-center pr-2 text-text-secondary">
            {trailingElement}
          </div>
        )}
      </div>

      {hasDescription && (
        <p
          id={descriptionId}
          className={[
            'text-xs',
            error ? 'text-danger' : 'text-text-secondary',
          ].join(' ')}
        >
          {error ?? hint}
        </p>
      )}
    </div>
  );
}
