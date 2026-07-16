import {
  Input,
} from '../../../../shared/components/Input';
import type {
  ProductInventoryDraft,
} from '../../types/productCreation';
import type {
  ProductInventoryErrors,
} from '../../utils/validateProductInventory';

interface ProductInventoryFieldsProps {
  value: ProductInventoryDraft;
  errors?: ProductInventoryErrors;

  lowStockEnabled: boolean;
  barcodeScanEnabled: boolean;

  disabled?: boolean;

  onChange: (
    patch: Partial<ProductInventoryDraft>,
  ) => void;
}

export function ProductInventoryFields({
  value,
  errors = {},
  lowStockEnabled,
  barcodeScanEnabled,
  disabled = false,
  onChange,
}: ProductInventoryFieldsProps) {
  return (
    <div className="grid gap-6">
      <div
        className={[
          'grid gap-5',
          lowStockEnabled
            ? 'md:grid-cols-2'
            : '',
        ].join(' ')}
      >
        <Input
          id="product-initial-quantity"
          label="Initial quantity"
          type="number"
          value={value.initialQuantity}
          error={errors.initialQuantity}
          hint="The quantity currently available when this product is created."
          disabled={disabled}
          required
          min="0"
          step="any"
          inputMode="decimal"
          placeholder="0"
          onChange={(event) =>
            onChange({
              initialQuantity:
                event.currentTarget.value,
            })
          }
        />

        {lowStockEnabled && (
          <Input
            id="product-reorder-level"
            label="Reorder threshold"
            type="number"
            value={value.reorderLevel}
            error={errors.reorderLevel}
            hint="StockFlow will flag the product when stock reaches this quantity."
            disabled={disabled}
            required
            min="0"
            step="any"
            inputMode="decimal"
            placeholder="5"
            onChange={(event) =>
              onChange({
                reorderLevel:
                  event.currentTarget.value,
              })
            }
          />
        )}
      </div>

      {barcodeScanEnabled && (
        <Input
          id="product-barcode"
          label="Barcode"
          value={value.barcode}
          error={errors.barcode}
          hint="Optional barcode, EAN, UPC, or other scannable identifier."
          disabled={disabled}
          maxLength={128}
          autoComplete="off"
          placeholder="3760123456789"
          onChange={(event) =>
            onChange({
              barcode:
                event.currentTarget.value,
            })
          }
        />
      )}

      {!lowStockEnabled && (
        <div className="rounded-xl border border-border-subtle bg-surface-secondary px-4 py-3">
          <p className="text-sm font-medium text-text-primary">
            Low-stock alerts are disabled
          </p>

          <p className="mt-1 text-sm text-text-secondary">
            No reorder threshold is required
            for this workspace.
          </p>
        </div>
      )}

      {!barcodeScanEnabled && (
        <div className="rounded-xl border border-border-subtle bg-surface-secondary px-4 py-3">
          <p className="text-sm font-medium text-text-primary">
            Barcode scanning is disabled
          </p>

          <p className="mt-1 text-sm text-text-secondary">
            A barcode can be configured later
            if this workspace enables scanning.
          </p>
        </div>
      )}
    </div>
  );
}
