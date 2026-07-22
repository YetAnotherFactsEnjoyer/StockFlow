import {
  useEffect,
  useId,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import {
  FiBox,
  FiCheckCircle,
  FiDollarSign,
  FiInfo,
  FiTruck,
  FiX,
} from 'react-icons/fi';

import type {
  Customer,
} from '../../customers/types/customer';
import type {
  Supplier,
} from '../../suppliers/types/supplier';
import {
  Button,
} from '../../../shared/components/Button';
import type {
  ProductRepository,
} from '../api/productRepository';
import {
  useProductCreation,
} from '../context/useProductCreation';
import type {
  Product,
} from '../types/product';
import type {
  ProductCreationState,
} from '../types/productCreation';
import {
  buildFullProductRequest,
} from '../utils/buildFullProductRequest';
import type {
  ProductCustomersErrors,
} from '../utils/validateProductCustomers';
import {
  hasProductCustomersErrors,
  validateProductCustomers,
} from '../utils/validateProductCustomers';
import type {
  ProductDetailsErrors,
} from '../utils/validateProductDetails';
import {
  hasProductDetailsErrors,
  validateProductDetails,
} from '../utils/validateProductDetails';
import type {
  ProductInventoryErrors,
} from '../utils/validateProductInventory';
import {
  hasProductInventoryErrors,
  validateProductInventory,
} from '../utils/validateProductInventory';
import type {
  ProductSuppliersErrors,
} from '../utils/validateProductSuppliers';
import {
  hasProductSuppliersErrors,
  validateProductSuppliers,
} from '../utils/validateProductSuppliers';
import {
  ProductDialogFrame,
} from './ProductDialogFrame';
import {
  ProductCustomersFields,
} from './creation/ProductCustomersFields';
import {
  ProductDetailsFields,
} from './creation/ProductDetailsFields';
import {
  ProductInventoryFields,
} from './creation/ProductInventoryFields';
import {
  ProductSuppliersFields,
} from './creation/ProductSuppliersFields';

type EditSection =
  | 'details'
  | 'inventory'
  | 'suppliers'
  | 'customers';

interface ProductEditDialogProps {
  product: Product;
  suppliers: Supplier[];
  customers: Customer[];
  repository: ProductRepository;
  onClose: () => void;
  onUpdated: (product: Product) => void;
}

function toInputValue(value: number | null) {
  return value === null ? '' : String(value);
}

function createProductEditState(
  product: Product,
): ProductCreationState {
  return {
    mode: 'full',
    currentStep: 'details',
    completedSteps: [
      'details',
      'inventory',
      'suppliers',
      'customers',
      'review',
    ],
    skippedSteps: [],
    draft: {
      details: {
        name: product.name,
        sku: product.sku ?? '',
        description: product.description ?? '',
        type: product.type,
        stockUnit: product.stockUnit,
        customStockUnit: product.customStockUnit ?? '',
      },
      inventory: {
        initialQuantity: String(product.stockQuantity),
        reorderLevel: toInputValue(product.reorderLevel),
        barcode: product.barcode ?? '',
      },
      suppliers: (product.suppliers ?? []).map((supplier) => ({
        temporaryId: `edit-${supplier.id}`,
        supplierId: supplier.supplierId,
        supplierSku: supplier.supplierSku ?? '',
        purchasePrice: toInputValue(supplier.purchasePrice),
        minimumOrderQuantity: toInputValue(
          supplier.minimumOrderQuantity,
        ),
        leadTimeDays: toInputValue(supplier.leadTimeDays),
        preferred: supplier.preferred,
      })),
      commercial: {
        availability: product.availability,
        defaultSellingPrice: toInputValue(
          product.defaultSellingPrice,
        ),
        customers: (product.customers ?? []).map((customer) => ({
          temporaryId: `edit-${customer.id}`,
          customerId: customer.customerId,
          customerSku: customer.customerSku ?? '',
          sellingPrice: toInputValue(customer.sellingPrice),
          minimumOrderQuantity: toInputValue(
            customer.minimumOrderQuantity,
          ),
        })),
      },
    },
  };
}

const sections: ReadonlyArray<{
  id: EditSection;
  label: string;
  icon: ReactNode;
}> = [
  { id: 'details', label: 'Details', icon: <FiInfo /> },
  { id: 'inventory', label: 'Inventory', icon: <FiBox /> },
  { id: 'suppliers', label: 'Suppliers', icon: <FiTruck /> },
  { id: 'customers', label: 'Commercial', icon: <FiDollarSign /> },
];

export function ProductEditDialog({
  product,
  suppliers,
  customers,
  repository,
  onClose,
  onUpdated,
}: ProductEditDialogProps) {
  const titleId = useId();
  const { state, defaults, dispatch } = useProductCreation();
  const previousStateRef = useRef(state);
  const [section, setSection] = useState<EditSection>('details');
  const [active, setActive] = useState(product.active);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [detailsErrors, setDetailsErrors] =
    useState<ProductDetailsErrors>({});
  const [inventoryErrors, setInventoryErrors] =
    useState<ProductInventoryErrors>({});
  const [suppliersErrors, setSuppliersErrors] =
    useState<ProductSuppliersErrors>({});
  const [customersErrors, setCustomersErrors] =
    useState<ProductCustomersErrors>({});

  useEffect(() => {
    dispatch({
      type: 'HYDRATE',
      payload: createProductEditState(product),
    });
  }, [dispatch, product]);

  function restoreCreationDraft() {
    dispatch({
      type: 'HYDRATE',
      payload: previousStateRef.current,
    });
  }

  function handleClose() {
    if (submitting) {
      return;
    }

    restoreCreationDraft();
    onClose();
  }

  async function handleSubmit() {
    const nextDetailsErrors = validateProductDetails(
      state.draft.details,
      { skuRequired: defaults.skuRequired },
    );
    const nextInventoryErrors = validateProductInventory(
      state.draft.inventory,
      {
        lowStockEnabled: defaults.lowStockEnabled,
        barcodeScanEnabled: defaults.barcodeScanEnabled,
      },
    );
    const nextSuppliersErrors = validateProductSuppliers(
      state.draft.suppliers,
    );
    const nextCustomersErrors = validateProductCustomers(
      state.draft.commercial,
    );

    setDetailsErrors(nextDetailsErrors);
    setInventoryErrors(nextInventoryErrors);
    setSuppliersErrors(nextSuppliersErrors);
    setCustomersErrors(nextCustomersErrors);
    setSubmitError('');

    if (hasProductDetailsErrors(nextDetailsErrors)) {
      setSection('details');
      return;
    }

    if (hasProductInventoryErrors(nextInventoryErrors)) {
      setSection('inventory');
      return;
    }

    if (hasProductSuppliersErrors(nextSuppliersErrors)) {
      setSection('suppliers');
      return;
    }

    if (hasProductCustomersErrors(nextCustomersErrors)) {
      setSection('customers');
      return;
    }

    setSubmitting(true);

    try {
      const updatedProduct = await repository.updateProduct(
        product.id,
        {
          ...buildFullProductRequest(state),
          active,
        },
      );
      restoreCreationDraft();
      onUpdated(updatedProduct);
    } catch (caughtError) {
      setSubmitError(
        caughtError instanceof Error
          ? caughtError.message
          : 'The product could not be updated.',
      );
      setSubmitting(false);
    }
  }

  return (
    <ProductDialogFrame titleId={titleId} layout="wide" onClose={handleClose}>
      <header className="flex items-start justify-between gap-4 border-b border-border-subtle px-6 py-5">
        <div>
          <h2 id={titleId} className="text-xl font-semibold text-text-primary">
            Modify product
          </h2>
          <p className="mt-1 text-sm text-text-secondary">
            Update {product.name} without leaving the product workspace.
          </p>
        </div>
        <button
          type="button"
          aria-label="Close product editor"
          disabled={submitting}
          onClick={handleClose}
          className="grid size-10 shrink-0 place-items-center rounded-xl text-text-secondary transition hover:bg-surface-secondary hover:text-text-primary disabled:opacity-40"
        >
          <FiX aria-hidden="true" className="size-5" />
        </button>
      </header>

      <div className="flex min-h-0 flex-1 flex-col md:flex-row">
        <nav
          aria-label="Product edit sections"
          className="flex shrink-0 gap-1 overflow-x-auto border-b border-border-subtle bg-surface-secondary/50 p-3 md:w-48 md:flex-col md:border-b-0 md:border-r"
        >
          {sections.map((item) => (
            <button
              key={item.id}
              type="button"
              aria-current={section === item.id ? 'page' : undefined}
              onClick={() => setSection(item.id)}
              className={[
                'flex min-h-10 shrink-0 items-center gap-2 rounded-lg px-3 text-left text-sm font-medium transition',
                section === item.id
                  ? 'bg-brand-soft text-brand-default'
                  : 'text-text-secondary hover:bg-surface hover:text-text-primary',
              ].join(' ')}
            >
              <span aria-hidden="true" className="size-4">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>

        <form
          id="product-edit-form"
          className="min-h-0 flex-1 overflow-y-auto px-6 py-6"
          onSubmit={(event) => {
            event.preventDefault();
            void handleSubmit();
          }}
        >
          {section === 'details' && (
            <div className="grid gap-7">
              <div>
                <h3 className="text-lg font-semibold text-text-primary">Product details</h3>
                <p className="mt-1 text-sm text-text-secondary">
                  Core catalogue information and product status.
                </p>
              </div>
              <ProductDetailsFields
                value={state.draft.details}
                errors={detailsErrors}
                skuRequired={defaults.skuRequired}
                disabled={submitting}
                onChange={(patch) =>
                  dispatch({ type: 'UPDATE_DETAILS', payload: patch })
                }
              />
              <label className="flex items-start gap-3 rounded-xl border border-border-subtle bg-surface-secondary/60 px-4 py-4">
                <input
                  type="checkbox"
                  checked={active}
                  disabled={submitting}
                  onChange={(event) => setActive(event.currentTarget.checked)}
                  className="mt-1"
                />
                <span>
                  <span className="block text-sm font-semibold text-text-primary">
                    Active product
                  </span>
                  <span className="mt-1 block text-sm text-text-secondary">
                    Inactive products remain in the catalogue but are clearly marked.
                  </span>
                </span>
              </label>
            </div>
          )}

          {section === 'inventory' && (
            <div className="grid gap-7">
              <div>
                <h3 className="text-lg font-semibold text-text-primary">Inventory setup</h3>
                <p className="mt-1 text-sm text-text-secondary">
                  Quantity editing is temporary until inventory movements become the source of truth.
                </p>
              </div>
              <ProductInventoryFields
                value={state.draft.inventory}
                errors={inventoryErrors}
                lowStockEnabled={defaults.lowStockEnabled}
                barcodeScanEnabled={defaults.barcodeScanEnabled}
                disabled={submitting}
                onChange={(patch) =>
                  dispatch({ type: 'UPDATE_INVENTORY', payload: patch })
                }
              />
            </div>
          )}

          {section === 'suppliers' && (
            <div className="grid gap-7">
              <div>
                <h3 className="text-lg font-semibold text-text-primary">Suppliers</h3>
                <p className="mt-1 text-sm text-text-secondary">
                  Maintain purchasing references and one preferred supplier.
                </p>
              </div>
              <ProductSuppliersFields
                suppliers={suppliers}
                value={state.draft.suppliers}
                errors={suppliersErrors}
                disabled={submitting}
                onChange={(nextSuppliers) =>
                  dispatch({ type: 'SET_SUPPLIERS', payload: nextSuppliers })
                }
              />
            </div>
          )}

          {section === 'customers' && (
            <div className="grid gap-7">
              <div>
                <h3 className="text-lg font-semibold text-text-primary">Commercial settings</h3>
                <p className="mt-1 text-sm text-text-secondary">
                  Control availability, pricing, and customer-specific links.
                </p>
              </div>
              <ProductCustomersFields
                customers={customers}
                value={state.draft.commercial}
                errors={customersErrors}
                disabled={submitting}
                onCommercialChange={(patch) =>
                  dispatch({ type: 'UPDATE_COMMERCIAL', payload: patch })
                }
                onCustomersChange={(nextCustomers) =>
                  dispatch({ type: 'SET_CUSTOMERS', payload: nextCustomers })
                }
              />
            </div>
          )}

          {submitError && (
            <p role="alert" className="mt-6 rounded-xl bg-danger/10 px-4 py-3 text-sm text-danger">
              {submitError}
            </p>
          )}
        </form>
      </div>

      <footer className="flex items-center justify-between gap-3 border-t border-border-subtle px-6 py-4">
        <p className="hidden text-xs text-text-secondary sm:block">
          Changes are saved to this workspace only.
        </p>
        <div className="ml-auto flex gap-3">
          <Button variant="secondary" disabled={submitting} onClick={handleClose}>
            Cancel
          </Button>
          <Button
            type="submit"
            form="product-edit-form"
            isLoading={submitting}
            leftIcon={<FiCheckCircle className="size-4" />}
          >
            Save changes
          </Button>
        </div>
      </footer>
    </ProductDialogFrame>
  );
}
