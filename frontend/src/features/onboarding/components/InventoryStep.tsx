import type { ReactNode } from 'react';

import { useOnboarding } from '../context/useOnboarding';
import type { InventoryDraft } from '../types/onboarding';

const valuationMethods: Array<{
  id: InventoryDraft['valuationMethod'];
  shortName: string;
  title: string;
  description: string;
}> = [
  {
    id: 'FIFO',
    shortName: 'FIFO',
    title: 'First-In, First-Out',
    description:
      'The oldest stock is considered sold or consumed first.',
  },
  {
    id: 'LIFO',
    shortName: 'LIFO',
    title: 'Last-In, First-Out',
    description:
      'The newest stock is considered sold or consumed first.',
  },
  {
    id: 'AVG',
    shortName: 'WAC',
    title: 'Weighted Average Cost',
    description:
      'Stock value is calculated using the average cost of all available units.',
  },
];

export default function InventoryStep() {
  const { state, dispatch } = useOnboarding();
  const { inventory } = state;

  function updateInventory(
    payload: Partial<InventoryDraft>,
  ) {
    dispatch({
      type: 'UPDATE_INVENTORY',
      payload,
    });
  }

  return (
    <div className="mx-auto w-full max-w-5xl">
      <header className="max-w-2xl">
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">
          Inventory preferences
        </h1>

        <p className="mt-3 text-base leading-7 text-text-secondary">
          Choose how StockFlow calculates inventory value
          and which tracking features should be enabled.
        </p>
      </header>

      <div className="mt-8 overflow-hidden rounded-2xl border border-border-subtle bg-surface">
        <FormSection
          title="Inventory valuation"
          description="Choose how the cost of products is calculated when stock enters and leaves your inventory."
        >
          <fieldset>
            <legend className="sr-only">
              Inventory valuation method
            </legend>

            <div className="divide-y divide-border-subtle overflow-hidden rounded-xl border border-border-subtle">
              {valuationMethods.map((method) => (
                <ValuationOption
                  key={method.id}
                  method={method}
                  selected={
                    inventory.valuationMethod ===
                    method.id
                  }
                  onSelect={() =>
                    updateInventory({
                      valuationMethod: method.id,
                    })
                  }
                />
              ))}
            </div>
          </fieldset>
        </FormSection>

        <FormSection
          title="Stock tracking"
          description="Enable the inventory tools your organization needs for daily operations."
          separated
        >
          <div className="divide-y divide-border-subtle overflow-hidden rounded-xl border border-border-subtle">
            <SettingRow
              title="Low-stock alerts"
              description="Display a warning when a product reaches its reorder threshold."
              checked={inventory.lowStockEnabled}
              onChange={(checked) =>
                updateInventory({
                  lowStockEnabled: checked,
                })
              }
            />

            <SettingRow
              title="Barcode scanning"
              description="Allow products and stock movements to be identified using barcodes."
              checked={
                inventory.barcodeScanEnabled
              }
              onChange={(checked) =>
                updateInventory({
                  barcodeScanEnabled: checked,
                })
              }
            />

            <SettingRow
              title="Track purchase prices"
              description="Store the acquisition cost associated with products and stock movements."
              checked={
                inventory.trackPurchasePrice
              }
              onChange={(checked) =>
                updateInventory({
                  trackPurchasePrice: checked,
                })
              }
            />
          </div>
        </FormSection>
      </div>
    </div>
  );
}

interface FormSectionProps {
  title: string;
  description: string;
  separated?: boolean;
  children: ReactNode;
}

function FormSection({
  title,
  description,
  separated = false,
  children,
}: FormSectionProps) {
  return (
    <section
      className={[
        'px-6 py-7 sm:px-8 sm:py-8',
        separated
          ? 'border-t border-border-subtle'
          : '',
      ].join(' ')}
    >
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-text-primary">
          {title}
        </h2>

        <p className="mt-1 max-w-2xl text-sm leading-6 text-text-secondary">
          {description}
        </p>
      </div>

      {children}
    </section>
  );
}

interface ValuationOptionProps {
  method: {
    id: InventoryDraft['valuationMethod'];
    shortName: string;
    title: string;
    description: string;
  };
  selected: boolean;
  onSelect: () => void;
}

function ValuationOption({
  method,
  selected,
  onSelect,
}: ValuationOptionProps) {
  return (
    <label
      className={[
        'flex cursor-pointer items-start gap-4 px-4 py-4 transition-colors sm:px-5',
        selected
          ? 'bg-brand-soft'
          : 'bg-surface hover:bg-surface-secondary',
      ].join(' ')}
    >
      <input
        type="radio"
        name="valuationMethod"
        value={method.id}
        checked={selected}
        onChange={onSelect}
        className="sr-only"
      />

      <span
        aria-hidden="true"
        className={[
          'mt-0.5 grid size-5 shrink-0 place-items-center rounded-full border-2',
          selected
            ? 'border-brand-default'
            : 'border-border-strong',
        ].join(' ')}
      >
        {selected && (
          <span className="size-2.5 rounded-full bg-brand-default" />
        )}
      </span>

      <span className="grid min-w-0 flex-1 gap-1 sm:grid-cols-[90px_minmax(0,1fr)] sm:gap-4">
        <span
          className={[
            'text-sm font-bold',
            selected
              ? 'text-brand-default'
              : 'text-text-primary',
          ].join(' ')}
        >
          {method.shortName}
        </span>

        <span>
          <span className="block text-sm font-semibold text-text-primary">
            {method.title}
          </span>

          <span className="mt-1 block text-sm leading-6 text-text-secondary">
            {method.description}
          </span>
        </span>
      </span>
    </label>
  );
}

interface SettingRowProps {
  title: string;
  description: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

function SettingRow({
  title,
  description,
  checked,
  onChange,
}: SettingRowProps) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-6 bg-surface px-4 py-4 transition-colors hover:bg-surface-secondary sm:px-5">
      <span className="min-w-0">
        <span className="block text-sm font-semibold text-text-primary">
          {title}
        </span>

        <span className="mt-1 block max-w-2xl text-sm leading-6 text-text-secondary">
          {description}
        </span>
      </span>

      <span className="relative shrink-0">
        <input
          type="checkbox"
          checked={checked}
          onChange={(event) =>
            onChange(event.target.checked)
          }
          className="peer sr-only"
        />

        <span
          className={[
            'block h-7 w-12 rounded-full border transition-colors',
            checked
              ? 'border-brand-default bg-brand-default'
              : 'border-border-strong bg-surface-secondary',
          ].join(' ')}
        />

        <span
          className={[
            'absolute left-1 top-1 size-5 rounded-full bg-white shadow-sm transition-transform',
            checked
              ? 'translate-x-5'
              : 'translate-x-0',
          ].join(' ')}
        />
      </span>
    </label>
  );
}
