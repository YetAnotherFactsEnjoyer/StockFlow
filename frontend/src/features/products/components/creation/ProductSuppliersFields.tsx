import { useState } from 'react';
import { FiTrash2 } from 'react-icons/fi';

import {
  Input,
} from '../../../../shared/components/Input';
import type {
  Supplier,
} from '../../../suppliers/types/supplier';
import type {
  ProductSupplierDraft,
} from '../../types/productCreation';
import type {
  ProductSuppliersErrors,
} from '../../utils/validateProductSuppliers';

interface ProductSuppliersFieldsProps {
  suppliers: Supplier[];
  value: ProductSupplierDraft[];
  errors?: ProductSuppliersErrors;
  disabled?: boolean;
  onChange: (
    suppliers: ProductSupplierDraft[],
  ) => void;
}

export function ProductSuppliersFields({
  suppliers,
  value,
  errors = {},
  disabled = false,
  onChange,
}: ProductSuppliersFieldsProps) {
  const [
    selectedSupplierId,
    setSelectedSupplierId,
  ] = useState('');

  const availableSuppliers =
    suppliers.filter(
      (supplier) =>
        !value.some(
          (link) =>
            link.supplierId ===
            supplier.id,
        ),
    );

  function addSupplier() {
    if (!selectedSupplierId) {
      return;
    }

    const hasPreferredSupplier =
      value.some(
        (supplier) =>
          supplier.preferred,
      );

    const newSupplier:
      ProductSupplierDraft = {
      temporaryId:
        crypto.randomUUID(),
      supplierId:
        selectedSupplierId,
      supplierSku: '',
      purchasePrice: '',
      minimumOrderQuantity: '',
      leadTimeDays: '',
      preferred:
        !hasPreferredSupplier,
    };

    onChange([
      ...value,
      newSupplier,
    ]);
    setSelectedSupplierId('');
  }

  function updateSupplier(
    temporaryId: string,
    patch:
      Partial<ProductSupplierDraft>,
  ) {
    let nextSuppliers = value.map(
      (supplier) =>
        supplier.temporaryId ===
        temporaryId
          ? {
              ...supplier,
              ...patch,
            }
          : supplier,
    );

    if (patch.preferred === true) {
      nextSuppliers =
        nextSuppliers.map(
          (supplier) => ({
            ...supplier,
            preferred:
              supplier.temporaryId ===
              temporaryId,
          }),
        );
    }

    onChange(nextSuppliers);
  }

  function removeSupplier(
    temporaryId: string,
  ) {
    const removedSupplier =
      value.find(
        (supplier) =>
          supplier.temporaryId ===
          temporaryId,
      );

    let remainingSuppliers =
      value.filter(
        (supplier) =>
          supplier.temporaryId !==
          temporaryId,
      );

    if (
      removedSupplier?.preferred &&
      remainingSuppliers.length > 0
    ) {
      remainingSuppliers =
        remainingSuppliers.map(
          (supplier, index) => ({
            ...supplier,
            preferred: index === 0,
          }),
        );
    }

    onChange(remainingSuppliers);
  }

  return (
    <div className="grid gap-6">
      <div className="rounded-xl border border-border-subtle bg-surface-secondary p-4">
        <label
          htmlFor="product-supplier-select"
          className="text-sm font-medium text-text-primary"
        >
          Add a supplier
        </label>

        <div className="mt-2 flex flex-col gap-3 sm:flex-row">
          <select
            id="product-supplier-select"
            value={selectedSupplierId}
            disabled={
              disabled ||
              availableSuppliers.length === 0
            }
            onChange={(event) =>
              setSelectedSupplierId(
                event.currentTarget.value,
              )
            }
            className="min-h-11 min-w-0 flex-1 border-x-0 border-t-0 border-b-2 border-border-subtle bg-transparent px-1 text-sm text-text-primary outline-none transition focus:border-brand-default disabled:cursor-not-allowed disabled:opacity-60"
          >
            <option value="">
              Select a supplier
            </option>

            {availableSuppliers.map(
              (supplier) => (
                <option
                  key={supplier.id}
                  value={supplier.id}
                >
                  {supplier.name}
                </option>
              ),
            )}
          </select>

          <button
            type="button"
            disabled={
              disabled ||
              !selectedSupplierId
            }
            onClick={addSupplier}
            className="min-h-10 rounded-md border border-brand-default bg-brand-default px-4 text-sm font-semibold text-white transition hover:bg-brand-hover disabled:cursor-not-allowed disabled:opacity-50"
          >
            Add supplier
          </button>
        </div>

        {availableSuppliers.length === 0 &&
          suppliers.length > 0 && (
            <p className="mt-3 text-sm text-text-secondary">
              All available suppliers have
              already been linked.
            </p>
          )}

        {suppliers.length === 0 && (
          <p className="mt-3 text-sm text-text-secondary">
            No active suppliers are available.
            You can skip this step and add
            suppliers later.
          </p>
        )}
      </div>

      {value.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border-subtle px-5 py-8 text-center">
          <p className="font-medium text-text-primary">
            No suppliers linked
          </p>

          <p className="mt-1 text-sm text-text-secondary">
            This product can be created without
            a supplier.
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {value.map((link) => {
            const supplier =
              suppliers.find(
                (item) =>
                  item.id ===
                  link.supplierId,
              );

            const rowErrors =
              errors[link.temporaryId] ??
              {};

            return (
              <article
                key={link.temporaryId}
                className="rounded-xl border border-border-subtle bg-surface"
              >
                <header className="flex items-start justify-between gap-4 border-b border-border-subtle px-5 py-4">
                  <div>
                    <h3 className="font-semibold text-text-primary">
                      {supplier?.name ??
                        'Unknown supplier'}
                    </h3>

                    {supplier?.contactName && (
                      <p className="mt-1 text-sm text-text-secondary">
                        Contact:{' '}
                        {supplier.contactName}
                      </p>
                    )}
                  </div>

                  <button
                    type="button"
                    disabled={disabled}
                    aria-label={`Remove ${supplier?.name ?? 'supplier'}`}
                    onClick={() =>
                      removeSupplier(
                        link.temporaryId,
                      )
                    }
                    className="grid size-9 shrink-0 place-items-center rounded-lg text-text-secondary transition hover:bg-danger/10 hover:text-danger disabled:opacity-40"
                  >
                    <FiTrash2
                      aria-hidden="true"
                      className="size-4"
                    />
                  </button>
                </header>

                <div className="grid gap-5 px-5 py-5">
                  <div className="grid gap-5 md:grid-cols-2">
                    <Input
                      id={`supplier-sku-${link.temporaryId}`}
                      label="Supplier SKU"
                      value={link.supplierSku}
                      error={rowErrors.supplierSku}
                      hint="The reference used by this supplier."
                      disabled={disabled}
                      maxLength={64}
                      placeholder="SUP-SCN-001"
                      onChange={(event) =>
                        updateSupplier(
                          link.temporaryId,
                          {
                            supplierSku:
                              event.currentTarget.value,
                          },
                        )
                      }
                    />

                    <Input
                      id={`purchase-price-${link.temporaryId}`}
                      label="Purchase price"
                      type="number"
                      value={link.purchasePrice}
                      error={rowErrors.purchasePrice}
                      hint="Optional price paid to this supplier."
                      disabled={disabled}
                      min="0"
                      step="any"
                      inputMode="decimal"
                      placeholder="65.00"
                      onChange={(event) =>
                        updateSupplier(
                          link.temporaryId,
                          {
                            purchasePrice:
                              event.currentTarget.value,
                          },
                        )
                      }
                    />
                  </div>

                  <div className="grid gap-5 md:grid-cols-2">
                    <Input
                      id={`minimum-order-${link.temporaryId}`}
                      label="Minimum order quantity"
                      type="number"
                      value={link.minimumOrderQuantity}
                      error={rowErrors.minimumOrderQuantity}
                      disabled={disabled}
                      min="1"
                      step="1"
                      inputMode="numeric"
                      placeholder="5"
                      onChange={(event) =>
                        updateSupplier(
                          link.temporaryId,
                          {
                            minimumOrderQuantity:
                              event.currentTarget.value,
                          },
                        )
                      }
                    />

                    <Input
                      id={`lead-time-${link.temporaryId}`}
                      label="Lead time in days"
                      type="number"
                      value={link.leadTimeDays}
                      error={rowErrors.leadTimeDays}
                      disabled={disabled}
                      min="0"
                      step="1"
                      inputMode="numeric"
                      placeholder="4"
                      onChange={(event) =>
                        updateSupplier(
                          link.temporaryId,
                          {
                            leadTimeDays:
                              event.currentTarget.value,
                          },
                        )
                      }
                    />
                  </div>

                  <label className="flex items-start gap-3 rounded-xl border border-border-subtle bg-surface-secondary px-4 py-3">
                    <input
                      type="radio"
                      name="preferred-supplier"
                      checked={link.preferred}
                      disabled={disabled}
                      onChange={() =>
                        updateSupplier(
                          link.temporaryId,
                          {
                            preferred: true,
                          },
                        )
                      }
                      className="mt-0.5"
                    />

                    <span>
                      <span className="block text-sm font-medium text-text-primary">
                        Preferred supplier
                      </span>

                      <span className="mt-0.5 block text-sm text-text-secondary">
                        Use this supplier as the
                        default option for future
                        purchasing.
                      </span>
                    </span>
                  </label>

                  {rowErrors.preferred && (
                    <p className="text-sm text-danger">
                      {rowErrors.preferred}
                    </p>
                  )}

                  {rowErrors.supplierId && (
                    <p className="text-sm text-danger">
                      {rowErrors.supplierId}
                    </p>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
