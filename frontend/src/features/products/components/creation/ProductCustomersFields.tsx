import { useState } from 'react';
import { FiTrash2 } from 'react-icons/fi';

import {
  Input,
} from '../../../../shared/components/Input';
import type {
  Customer,
} from '../../../customers/types/customer';
import type {
  CustomerAvailability,
  ProductCommercialDraft,
  ProductCustomerDraft,
} from '../../types/productCreation';
import type {
  ProductCustomersErrors,
} from '../../utils/validateProductCustomers';

type ConfiguredAvailability = Exclude<
  CustomerAvailability,
  'unconfigured'
>;

interface ProductCustomersFieldsProps {
  customers: Customer[];
  value: ProductCommercialDraft;
  errors?: ProductCustomersErrors;
  disabled?: boolean;
  onCommercialChange: (
    patch: Partial<
      Pick<
        ProductCommercialDraft,
        | 'availability'
        | 'defaultSellingPrice'
      >
    >,
  ) => void;
  onCustomersChange: (
    customers: ProductCustomerDraft[],
  ) => void;
}

const availabilityOptions: Array<{
  value: ConfiguredAvailability;
  label: string;
  description: string;
}> = [
  {
    value: 'internal',
    label: 'Internal use only',
    description:
      'Track this item in inventory without offering it to customers.',
  },
  {
    value: 'all_customers',
    label: 'Available to all customers',
    description:
      'Make this product part of the general customer catalogue.',
  },
  {
    value: 'selected_customers',
    label: 'Selected customers only',
    description:
      'Restrict this product to specific linked customers.',
  },
];

export function ProductCustomersFields({
  customers,
  value,
  errors = {},
  disabled = false,
  onCommercialChange,
  onCustomersChange,
}: ProductCustomersFieldsProps) {
  const [
    selectedCustomerId,
    setSelectedCustomerId,
  ] = useState('');

  const availableCustomers =
    customers.filter(
      (customer) =>
        !value.customers.some(
          (link) =>
            link.customerId ===
            customer.id,
        ),
    );

  function addCustomer() {
    if (!selectedCustomerId) {
      return;
    }

    onCustomersChange([
      ...value.customers,
      {
        temporaryId: crypto.randomUUID(),
        customerId: selectedCustomerId,
        customerSku: '',
        sellingPrice: '',
        minimumOrderQuantity: '',
      },
    ]);
    setSelectedCustomerId('');
  }

  function updateCustomer(
    temporaryId: string,
    patch: Partial<ProductCustomerDraft>,
  ) {
    onCustomersChange(
      value.customers.map(
        (customer) =>
          customer.temporaryId === temporaryId
            ? { ...customer, ...patch }
            : customer,
      ),
    );
  }

  function removeCustomer(
    temporaryId: string,
  ) {
    onCustomersChange(
      value.customers.filter(
        (customer) =>
          customer.temporaryId !== temporaryId,
      ),
    );
  }

  const showSellingPrice =
    value.availability === 'all_customers' ||
    value.availability === 'selected_customers';
  const showCustomerSelection =
    value.availability === 'selected_customers';

  return (
    <div className="grid gap-7">
      <fieldset>
        <legend className="text-sm font-medium text-text-primary">
          Product availability
        </legend>

        <div className="mt-3 grid gap-3">
          {availabilityOptions.map((option) => (
            <label
              key={option.value}
              className={[
                'flex cursor-pointer items-start gap-3 rounded-xl border px-4 py-4 transition',
                value.availability === option.value
                  ? 'border-brand-default bg-brand-soft'
                  : 'border-border-subtle bg-surface hover:border-brand-default/50',
                disabled
                  ? 'cursor-not-allowed opacity-60'
                  : '',
              ].join(' ')}
            >
              <input
                type="radio"
                name="product-availability"
                value={option.value}
                checked={value.availability === option.value}
                disabled={disabled}
                onChange={() =>
                  onCommercialChange({
                    availability: option.value,
                  })
                }
                className="mt-1"
              />

              <span>
                <span className="block text-sm font-semibold text-text-primary">
                  {option.label}
                </span>
                <span className="mt-1 block text-sm leading-5 text-text-secondary">
                  {option.description}
                </span>
              </span>
            </label>
          ))}
        </div>

        {errors.availability && (
          <p className="mt-2 text-sm text-danger">
            {errors.availability}
          </p>
        )}
      </fieldset>

      {showSellingPrice && (
        <Input
          id="product-default-selling-price"
          label="Default selling price"
          type="number"
          value={value.defaultSellingPrice}
          error={errors.defaultSellingPrice}
          hint="Optional general selling price. Specific customers may use a different price."
          disabled={disabled}
          min="0"
          step="any"
          inputMode="decimal"
          placeholder="99.00"
          onChange={(event) =>
            onCommercialChange({
              defaultSellingPrice:
                event.currentTarget.value,
            })
          }
        />
      )}

      {showCustomerSelection && (
        <section className="grid gap-5">
          <div className="rounded-xl border border-border-subtle bg-surface-secondary p-4">
            <label
              htmlFor="product-customer-select"
              className="text-sm font-medium text-text-primary"
            >
              Add a customer
            </label>

            <div className="mt-2 flex flex-col gap-3 sm:flex-row">
              <select
                id="product-customer-select"
                value={selectedCustomerId}
                disabled={
                  disabled ||
                  availableCustomers.length === 0
                }
                onChange={(event) =>
                  setSelectedCustomerId(
                    event.currentTarget.value,
                  )
                }
                className="min-h-11 min-w-0 flex-1 border-x-0 border-t-0 border-b-2 border-border-subtle bg-transparent px-1 text-sm text-text-primary outline-none transition focus:border-brand-default disabled:cursor-not-allowed disabled:opacity-60"
              >
                <option value="">Select a customer</option>
                {availableCustomers.map((customer) => (
                  <option key={customer.id} value={customer.id}>
                    {customer.name}
                  </option>
                ))}
              </select>

              <button
                type="button"
                disabled={disabled || !selectedCustomerId}
                onClick={addCustomer}
                className="min-h-10 rounded-md border border-brand-default bg-brand-default px-4 text-sm font-semibold text-white transition hover:bg-brand-hover disabled:cursor-not-allowed disabled:opacity-50"
              >
                Add customer
              </button>
            </div>

            {availableCustomers.length === 0 &&
              customers.length > 0 && (
                <p className="mt-3 text-sm text-text-secondary">
                  All available customers have already been linked.
                </p>
              )}
            {customers.length === 0 && (
              <p className="mt-3 text-sm text-text-secondary">
                No active customers are available. You can skip this step and create customers later.
              </p>
            )}
          </div>

          {errors.customers && (
            <p className="text-sm text-danger">
              {errors.customers}
            </p>
          )}

          {value.customers.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border-subtle px-5 py-8 text-center">
              <p className="font-medium text-text-primary">
                No customers linked
              </p>
              <p className="mt-1 text-sm text-text-secondary">
                Select at least one customer for restricted availability.
              </p>
            </div>
          ) : (
            <div className="grid gap-4">
              {value.customers.map((link) => {
                const customer = customers.find(
                  (item) => item.id === link.customerId,
                );
                const rowErrors =
                  errors.rows?.[link.temporaryId] ?? {};

                return (
                  <article
                    key={link.temporaryId}
                    className="rounded-xl border border-border-subtle bg-surface"
                  >
                    <header className="flex items-start justify-between gap-4 border-b border-border-subtle px-5 py-4">
                      <div>
                        <h3 className="font-semibold text-text-primary">
                          {customer?.name ?? 'Unknown customer'}
                        </h3>
                        <p className="mt-1 text-sm capitalize text-text-secondary">
                          {customer?.type ?? 'Customer'}
                        </p>
                      </div>
                      <button
                        type="button"
                        disabled={disabled}
                        aria-label={`Remove ${customer?.name ?? 'customer'}`}
                        onClick={() => removeCustomer(link.temporaryId)}
                        className="grid size-9 shrink-0 place-items-center rounded-lg text-text-secondary transition hover:bg-danger/10 hover:text-danger disabled:opacity-40"
                      >
                        <FiTrash2 aria-hidden="true" className="size-4" />
                      </button>
                    </header>

                    <div className="grid gap-5 px-5 py-5 md:grid-cols-3">
                      <Input
                        id={`customer-sku-${link.temporaryId}`}
                        label="Customer SKU"
                        value={link.customerSku}
                        error={rowErrors.customerSku}
                        hint="Optional reference used by this customer."
                        disabled={disabled}
                        maxLength={64}
                        placeholder="CUS-SCN-001"
                        onChange={(event) =>
                          updateCustomer(link.temporaryId, {
                            customerSku: event.currentTarget.value,
                          })
                        }
                      />
                      <Input
                        id={`customer-price-${link.temporaryId}`}
                        label="Selling price"
                        type="number"
                        value={link.sellingPrice}
                        error={rowErrors.sellingPrice}
                        hint="Optional customer-specific price."
                        disabled={disabled}
                        min="0"
                        step="any"
                        inputMode="decimal"
                        placeholder="92.00"
                        onChange={(event) =>
                          updateCustomer(link.temporaryId, {
                            sellingPrice: event.currentTarget.value,
                          })
                        }
                      />
                      <Input
                        id={`customer-minimum-order-${link.temporaryId}`}
                        label="Minimum order"
                        type="number"
                        value={link.minimumOrderQuantity}
                        error={rowErrors.minimumOrderQuantity}
                        disabled={disabled}
                        min="1"
                        step="1"
                        inputMode="numeric"
                        placeholder="1"
                        onChange={(event) =>
                          updateCustomer(link.temporaryId, {
                            minimumOrderQuantity:
                              event.currentTarget.value,
                          })
                        }
                      />
                    </div>

                    {rowErrors.customerId && (
                      <p className="px-5 pb-5 text-sm text-danger">
                        {rowErrors.customerId}
                      </p>
                    )}
                  </article>
                );
              })}
            </div>
          )}
        </section>
      )}

      {value.availability === 'internal' && (
        <div className="rounded-xl border border-border-subtle bg-surface-secondary px-4 py-4">
          <p className="text-sm font-medium text-text-primary">
            Internal inventory item
          </p>
          <p className="mt-1 text-sm leading-5 text-text-secondary">
            Customer pricing and customer links are not required for this product.
          </p>
        </div>
      )}
    </div>
  );
}
