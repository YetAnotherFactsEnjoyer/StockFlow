import {
  Input as MaterialInput,
  Select as MaterialSelect,
  Textarea as MaterialTextarea,
} from '@material-tailwind/react';
import type { ReactNode } from 'react';
import {
  FiCheck,
  FiChevronDown,
} from 'react-icons/fi';

import type {
  ProductDetailsDraft,
  ProductType,
  StockUnit,
} from '../../types/productCreation';
import type {
  ProductDetailsErrors,
} from '../../utils/validateProductDetails';

interface ProductDetailsFieldsProps {
  value: ProductDetailsDraft;
  errors?: ProductDetailsErrors;
  skuRequired: boolean;
  disabled?: boolean;
  autoFocusName?: boolean;
  onChange: (
    patch: Partial<ProductDetailsDraft>,
  ) => void;
}

const productTypeOptions: ReadonlyArray<{
  value: ProductType;
  label: string;
}> = [
  {
    value: 'finished_good',
    label: 'Finished good',
  },
  {
    value: 'raw_material',
    label: 'Raw material',
  },
  {
    value: 'component',
    label: 'Component',
  },
  {
    value: 'consumable',
    label: 'Consumable',
  },
  {
    value: 'packaging',
    label: 'Packaging',
  },
  {
    value: 'other',
    label: 'Other',
  },
];

const stockUnitOptions: ReadonlyArray<{
  value: StockUnit;
  label: string;
}> = [
  {
    value: 'unit',
    label: 'Unit',
  },
  {
    value: 'kilogram',
    label: 'Kilogram',
  },
  {
    value: 'gram',
    label: 'Gram',
  },
  {
    value: 'liter',
    label: 'Liter',
  },
  {
    value: 'meter',
    label: 'Meter',
  },
  {
    value: 'box',
    label: 'Box',
  },
  {
    value: 'pallet',
    label: 'Pallet',
  },
  {
    value: 'custom',
    label: 'Custom unit',
  },
];

const materialControlClasses = [
  'min-h-10 w-full rounded-md border border-border-subtle bg-transparent px-2.5 py-2',
  'text-sm text-text-primary outline-none transition duration-200',
  'select-text shadow-sm ring-0 placeholder:text-text-secondary/70',
  'hover:border-text-primary/60 hover:ring-3 hover:ring-text-primary/5',
  'focus:border-text-primary focus:ring-3 focus:ring-text-primary/10',
  'data-[error=true]:border-danger data-[error=true]:hover:border-danger',
  'data-[error=true]:focus:border-danger data-[error=true]:focus:ring-danger/10',
  'disabled:cursor-not-allowed disabled:bg-surface-secondary disabled:text-text-secondary',
].join(' ');

export function ProductDetailsFields({
  value,
  errors = {},
  skuRequired,
  disabled = false,
  autoFocusName = false,
  onChange,
}: ProductDetailsFieldsProps) {
  return (
    <div className="grid gap-5">
      <MaterialTextField
        id="product-name"
        label="Product name"
        value={value.name}
        error={errors.name}
        disabled={disabled}
        required
        maxLength={120}
        autoComplete="off"
        initialFocus={autoFocusName}
        placeholder="Wireless barcode scanner"
        onChange={(nextValue) =>
          onChange({
            name: nextValue,
          })
        }
      />

      <MaterialTextField
        id="product-sku"
        label="Internal SKU"
        value={value.sku}
        error={errors.sku}
        disabled={disabled}
        required={skuRequired}
        optional={!skuRequired}
        maxLength={64}
        autoComplete="off"
        placeholder="SCN-001"
        onChange={(nextValue) =>
          onChange({
            sku: nextValue,
          })
        }
      />

      <SelectField
        id="product-type"
        label="Product type"
        value={value.type}
        error={errors.type}
        disabled={disabled}
        required
        options={productTypeOptions}
        onChange={(nextValue) =>
          onChange({
            type:
              nextValue as ProductType | '',
          })
        }
      />

      <SelectField
        id="product-stock-unit"
        label="Stock unit"
        value={value.stockUnit}
        error={errors.stockUnit}
        disabled={disabled}
        required
        options={stockUnitOptions}
        onChange={(nextValue) =>
          onChange({
            stockUnit:
              nextValue as StockUnit | '',
          })
        }
      />

      {value.stockUnit === 'custom' && (
        <MaterialTextField
          id="product-custom-stock-unit"
          label="Custom stock unit"
          value={value.customStockUnit}
          error={errors.customStockUnit}
          hint="Use the singular form: roll, sheet, or crate."
          disabled={disabled}
          required
          maxLength={40}
          autoComplete="off"
          placeholder="Roll"
          onChange={(nextValue) =>
            onChange({
              customStockUnit: nextValue,
            })
          }
        />
      )}

      <TextareaField
        id="product-description"
        label="Description"
        value={value.description}
        error={errors.description}
        hint={`${value.description.length}/500 characters`}
        disabled={disabled}
        maxLength={500}
        placeholder="Add purchasing, storage, or internal notes."
        onChange={(nextValue) =>
          onChange({
            description: nextValue,
          })
        }
      />
    </div>
  );
}

interface FieldShellProps {
  id: string;
  label: string;
  error?: string;
  hint?: string;
  required?: boolean;
  optional?: boolean;
  children: (
    descriptionId: string | undefined,
  ) => ReactNode;
}

function FieldShell({
  id,
  label,
  error,
  hint,
  required = false,
  optional = false,
  children,
}: FieldShellProps) {
  const descriptionId =
    `${id}-description`;

  const hasDescription =
    Boolean(error || hint);

  return (
    <div className="grid gap-1.5">
      <div className="flex items-center justify-between gap-4">
        <label
          htmlFor={id}
          className="text-sm font-medium text-text-primary"
        >
          {label}

          {required && (
            <span
              aria-hidden="true"
              className="ml-1 text-danger"
            >
              *
            </span>
          )}
        </label>

        {optional && (
          <span className="text-xs text-text-secondary">
            Optional
          </span>
        )}
      </div>

      {children(
        hasDescription
          ? descriptionId
          : undefined,
      )}

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

interface MaterialTextFieldProps {
  id: string;
  label: string;
  value: string;
  error?: string;
  hint?: string;
  disabled?: boolean;
  required?: boolean;
  optional?: boolean;
  maxLength?: number;
  autoComplete?: string;
  placeholder?: string;
  initialFocus?: boolean;
  onChange: (value: string) => void;
}

function MaterialTextField({
  id,
  label,
  value,
  error,
  hint,
  disabled = false,
  required = false,
  optional = false,
  maxLength,
  autoComplete,
  placeholder,
  initialFocus = false,
  onChange,
}: MaterialTextFieldProps) {
  return (
    <FieldShell
      id={id}
      label={label}
      error={error}
      hint={hint}
      required={required}
      optional={optional}
    >
      {(descriptionId) => (
        <MaterialInput
          id={id}
          type="text"
          value={value}
          disabled={disabled}
          required={required}
          maxLength={maxLength}
          autoComplete={autoComplete}
          placeholder={placeholder}
          isError={Boolean(error)}
          aria-invalid={Boolean(error)}
          aria-describedby={descriptionId}
          data-initial-focus={
            initialFocus
              ? 'true'
              : undefined
          }
          className={materialControlClasses}
          onChange={(event) =>
            onChange(
              event.currentTarget.value,
            )
          }
        />
      )}
    </FieldShell>
  );
}

interface SelectFieldProps {
  id: string;
  label: string;
  value: string;
  error?: string;
  hint?: string;
  disabled?: boolean;
  required?: boolean;
  options: ReadonlyArray<{
    value: string;
    label: string;
  }>;
  onChange: (value: string) => void;
}

function SelectField({
  id,
  label,
  value,
  error,
  hint,
  disabled = false,
  required = false,
  options,
  onChange,
}: SelectFieldProps) {
  return (
    <FieldShell
      id={id}
      label={label}
      error={error}
      hint={hint}
      required={required}
    >
      {(descriptionId) => (
        <MaterialSelect
          name={id}
          value={value}
          disabled={disabled}
          isError={Boolean(error)}
          onValueChange={onChange}
        >
          <MaterialSelect.Trigger
            id={id}
            placeholder={`Select ${label.toLowerCase()}`}
            aria-required={required}
            aria-invalid={Boolean(error)}
            aria-describedby={descriptionId}
            indicator={
              <FiChevronDown
                aria-hidden="true"
                className="size-4 shrink-0 text-text-secondary transition-transform duration-200 group-data-[open=true]:rotate-180"
              />
            }
            className={[
              'group flex min-h-10 w-full items-center justify-between gap-4 rounded-md',
              'border border-border-subtle bg-transparent px-2.5 text-left text-sm text-text-primary',
              'select-none shadow-sm ring-0 outline-none transition duration-200',
              'hover:border-text-primary/60 hover:ring-3 hover:ring-text-primary/5',
              'focus:border-text-primary focus:ring-3 focus:ring-text-primary/10',
              'data-[open=true]:border-text-primary data-[open=true]:ring-3 data-[open=true]:ring-text-primary/10',
              'data-[error=true]:border-danger data-[error=true]:focus:border-danger data-[error=true]:focus:ring-danger/10',
              'disabled:cursor-not-allowed disabled:bg-surface-secondary disabled:text-text-secondary',
            ].join(' ')}
          >
            {({ element }) =>
              element ?? (
                <span className="text-text-secondary">
                  Select {label.toLowerCase()}
                </span>
              )
            }
          </MaterialSelect.Trigger>

          <MaterialSelect.List className="flex max-h-72 flex-col gap-0.5 overflow-y-auto rounded-md border border-border-subtle bg-surface p-1 text-text-primary shadow-lg outline-none">
            {options.map((option) => (
              <MaterialSelect.Option
                key={option.value}
                value={option.value}
                ripple={false}
                indicator={
                  <FiCheck className="size-4" />
                }
                className="flex w-full select-none items-center justify-between gap-4 rounded px-2.5 py-2 text-left text-sm text-text-primary outline-none transition hover:bg-surface-secondary focus:bg-surface-secondary data-[selected=true]:bg-surface-secondary"
              >
                {option.label}
              </MaterialSelect.Option>
            ))}
          </MaterialSelect.List>
        </MaterialSelect>
      )}
    </FieldShell>
  );
}

interface TextareaFieldProps {
  id: string;
  label: string;
  value: string;
  error?: string;
  hint?: string;
  disabled?: boolean;
  maxLength?: number;
  placeholder?: string;
  onChange: (value: string) => void;
}

function TextareaField({
  id,
  label,
  value,
  error,
  hint,
  disabled = false,
  maxLength,
  placeholder,
  onChange,
}: TextareaFieldProps) {
  return (
    <FieldShell
      id={id}
      label={label}
      error={error}
      hint={hint}
      optional
    >
      {(descriptionId) => (
        <MaterialTextarea
          id={id}
          value={value}
          disabled={disabled}
          maxLength={maxLength}
          placeholder={placeholder}
          rows={4}
          resize
          isError={Boolean(error)}
          aria-invalid={Boolean(error)}
          aria-describedby={descriptionId}
          className={`${materialControlClasses} min-h-24 resize-y leading-6`}
          onChange={(event) =>
            onChange(
              event.currentTarget.value,
            )
          }
        />
      )}
    </FieldShell>
  );
}
