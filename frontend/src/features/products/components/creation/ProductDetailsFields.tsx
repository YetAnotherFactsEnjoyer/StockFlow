import {
  FiChevronDown,
} from 'react-icons/fi';

import {
  Input,
} from '../../../../shared/components/Input';
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
  { value: 'finished_good', label: 'Finished good' },
  { value: 'raw_material', label: 'Raw material' },
  { value: 'component', label: 'Component' },
  { value: 'consumable', label: 'Consumable' },
  { value: 'packaging', label: 'Packaging' },
  { value: 'other', label: 'Other' },
];

const stockUnitOptions: ReadonlyArray<{
  value: StockUnit;
  label: string;
}> = [
  { value: 'unit', label: 'Unit' },
  { value: 'kilogram', label: 'Kilogram' },
  { value: 'gram', label: 'Gram' },
  { value: 'liter', label: 'Liter' },
  { value: 'meter', label: 'Meter' },
  { value: 'box', label: 'Box' },
  { value: 'pallet', label: 'Pallet' },
  { value: 'custom', label: 'Custom unit' },
];

export function ProductDetailsFields({
  value,
  errors = {},
  skuRequired,
  disabled = false,
  autoFocusName = false,
  onChange,
}: ProductDetailsFieldsProps) {
  return (
    <div className="grid grid-cols-1 gap-x-6 gap-y-6 md:grid-cols-2">
      <Input
        id="product-name"
        label="Product name"
        value={value.name}
        error={errors.name}
        disabled={disabled}
        required
        maxLength={120}
        autoComplete="off"
        autoFocus={autoFocusName}
        onChange={(event) =>
          onChange({ name: event.currentTarget.value })
        }
      />

      <Input
        id="product-sku"
        label={skuRequired ? 'Internal SKU' : 'Internal SKU (optional)'}
        value={value.sku}
        error={errors.sku}
        disabled={disabled}
        required={skuRequired}
        maxLength={64}
        autoComplete="off"
        onChange={(event) =>
          onChange({ sku: event.currentTarget.value })
        }
      />

      <FloatingSelect
        id="product-type"
        label="Product type"
        value={value.type}
        error={errors.type}
        disabled={disabled}
        required
        options={productTypeOptions}
        onChange={(nextValue) =>
          onChange({ type: nextValue as ProductType | '' })
        }
      />

      <FloatingSelect
        id="product-stock-unit"
        label="Stock unit"
        value={value.stockUnit}
        error={errors.stockUnit}
        disabled={disabled}
        required
        options={stockUnitOptions}
        onChange={(nextValue) =>
          onChange({ stockUnit: nextValue as StockUnit | '' })
        }
      />

      {value.stockUnit === 'custom' && (
        <Input
          id="product-custom-stock-unit"
          label="Custom stock unit"
          value={value.customStockUnit}
          error={errors.customStockUnit}
          hint="Use the singular form: roll, sheet, or crate."
          disabled={disabled}
          required
          maxLength={40}
          autoComplete="off"
          onChange={(event) =>
            onChange({
              customStockUnit: event.currentTarget.value,
            })
          }
        />
      )}

      <FloatingTextarea
        id="product-description"
        label="Description (optional)"
        value={value.description}
        error={errors.description}
        hint={`${value.description.length}/500 characters`}
        disabled={disabled}
        onChange={(nextValue) =>
          onChange({ description: nextValue })
        }
      />
    </div>
  );
}

interface FloatingSelectProps {
  id: string;
  label: string;
  value: string;
  error?: string;
  disabled: boolean;
  required?: boolean;
  options: ReadonlyArray<{ value: string; label: string }>;
  onChange: (value: string) => void;
}

function FloatingSelect({
  id,
  label,
  value,
  error,
  disabled,
  required = false,
  options,
  onChange,
}: FloatingSelectProps) {
  const descriptionId = error ? `${id}-description` : undefined;

  return (
    <div className="grid gap-1.5 pt-3">
      <div className="relative">
        <select
          id={id}
          value={value}
          required={required}
          disabled={disabled}
          aria-invalid={Boolean(error)}
          aria-describedby={descriptionId}
          onChange={(event) => onChange(event.currentTarget.value)}
          className={[
            'min-h-11 w-full appearance-none border-x-0 border-t-0 border-b-2 bg-transparent px-1 pb-2 pt-3 text-sm text-text-primary outline-none transition-all duration-200',
            error
              ? 'border-danger focus:border-danger'
              : 'border-border-subtle hover:border-text-secondary focus:border-brand-default',
          ].join(' ')}
        >
          <option value="">Select {label.toLowerCase()}</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <label
          htmlFor={id}
          className={[
            'pointer-events-none absolute left-1 top-0 -translate-y-2 text-xs',
            error ? 'text-danger' : 'text-text-secondary',
          ].join(' ')}
        >
          {label}{required && <span className="ml-1 text-danger">*</span>}
        </label>
        <FiChevronDown
          aria-hidden="true"
          className="pointer-events-none absolute right-1 top-4 size-4 text-text-secondary"
        />
      </div>
      {error && (
        <p id={descriptionId} className="text-xs text-danger">{error}</p>
      )}
    </div>
  );
}

function FloatingTextarea({
  id,
  label,
  value,
  error,
  hint,
  disabled,
  onChange,
}: {
  id: string;
  label: string;
  value: string;
  error?: string;
  hint: string;
  disabled: boolean;
  onChange: (value: string) => void;
}) {
  const descriptionId = `${id}-description`;

  return (
    <div className="grid gap-1.5 pt-3 md:col-span-2">
      <div className="relative">
        <textarea
          id={id}
          value={value}
          disabled={disabled}
          maxLength={500}
          rows={3}
          placeholder=" "
          aria-invalid={Boolean(error)}
          aria-describedby={descriptionId}
          onChange={(event) => onChange(event.currentTarget.value)}
          className={[
            'peer min-h-24 w-full resize-y border-x-0 border-t-0 border-b-2 bg-transparent px-1 pb-2 pt-3 text-sm leading-6 text-text-primary outline-none transition-all duration-200 placeholder:text-transparent',
            error
              ? 'border-danger focus:border-danger'
              : 'border-border-subtle hover:border-text-secondary focus:border-brand-default',
          ].join(' ')}
        />
        <label
          htmlFor={id}
          className={[
            'pointer-events-none absolute left-1 top-3 text-sm text-text-secondary transition-all duration-200',
            'peer-focus:-translate-y-5 peer-focus:text-xs peer-focus:text-brand-default',
            'peer-[:not(:placeholder-shown)]:-translate-y-5 peer-[:not(:placeholder-shown)]:text-xs',
            error ? 'text-danger peer-focus:text-danger' : '',
          ].join(' ')}
        >
          {label}
        </label>
      </div>
      <p
        id={descriptionId}
        className={error ? 'text-xs text-danger' : 'text-xs text-text-secondary'}
      >
        {error ?? hint}
      </p>
    </div>
  );
}
