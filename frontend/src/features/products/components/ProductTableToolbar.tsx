import {
  FiChevronDown,
  FiSearch,
  FiX,
} from 'react-icons/fi';
import type {
  ReactNode,
} from 'react';

import type {
  ConfiguredCustomerAvailability,
} from '../types/product';
import type {
  ProductType,
} from '../types/productCreation';
import {
  availabilityLabels,
  productTypeLabels,
} from '../utils/productPresentation';

export type ProductTypeFilter = 'all' | ProductType;
export type ProductStatusFilter =
  | 'all'
  | 'active'
  | 'inactive'
  | 'low_stock'
  | 'out_of_stock';
export type ProductAvailabilityFilter =
  | 'all'
  | ConfiguredCustomerAvailability;
export type ProductSort =
  | 'newest'
  | 'oldest'
  | 'name_asc'
  | 'name_desc'
  | 'stock_asc'
  | 'stock_desc';

interface ProductTableToolbarProps {
  searchQuery: string;
  typeFilter: ProductTypeFilter;
  statusFilter: ProductStatusFilter;
  availabilityFilter: ProductAvailabilityFilter;
  sort: ProductSort;
  resultCount: number;
  totalCount: number;
  hasActiveFilters: boolean;
  onSearchQueryChange: (value: string) => void;
  onTypeFilterChange: (value: ProductTypeFilter) => void;
  onStatusFilterChange: (value: ProductStatusFilter) => void;
  onAvailabilityFilterChange: (
    value: ProductAvailabilityFilter,
  ) => void;
  onSortChange: (value: ProductSort) => void;
  onClear: () => void;
}

const selectClassName =
  'min-h-10 appearance-none rounded-lg border border-border-subtle bg-surface py-2 pl-3 pr-9 text-sm text-text-primary outline-none transition hover:border-text-secondary focus:border-brand-default focus:ring-2 focus:ring-brand-default/15';

function FilterSelect({
  label,
  value,
  onChange,
  children,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  children: ReactNode;
}) {
  return (
    <label className="relative min-w-0">
      <span className="sr-only">{label}</span>
      <select
        value={value}
        aria-label={label}
        onChange={(event) =>
          onChange(event.currentTarget.value)
        }
        className={selectClassName}
      >
        {children}
      </select>
      <FiChevronDown
        aria-hidden="true"
        className="pointer-events-none absolute right-3 top-3 size-4 text-text-secondary"
      />
    </label>
  );
}

export function ProductTableToolbar({
  searchQuery,
  typeFilter,
  statusFilter,
  availabilityFilter,
  sort,
  resultCount,
  totalCount,
  hasActiveFilters,
  onSearchQueryChange,
  onTypeFilterChange,
  onStatusFilterChange,
  onAvailabilityFilterChange,
  onSortChange,
  onClear,
}: ProductTableToolbarProps) {
  return (
    <div className="border-b border-border-subtle bg-surface px-4 py-4 sm:px-5">
      <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
        <div className="relative min-w-0 flex-1 xl:max-w-sm">
          <FiSearch
            aria-hidden="true"
            className="pointer-events-none absolute left-3 top-3 size-4 text-text-secondary"
          />
          <input
            type="search"
            value={searchQuery}
            placeholder="Search name, SKU, or barcode"
            aria-label="Search products"
            onChange={(event) =>
              onSearchQueryChange(event.currentTarget.value)
            }
            className="min-h-10 w-full rounded-lg border border-border-subtle bg-surface py-2 pl-9 pr-3 text-sm text-text-primary outline-none transition placeholder:text-text-secondary hover:border-text-secondary focus:border-brand-default focus:ring-2 focus:ring-brand-default/15"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <FilterSelect
            label="Filter by product type"
            value={typeFilter}
            onChange={(value) =>
              onTypeFilterChange(value as ProductTypeFilter)
            }
          >
            <option value="all">All types</option>
            {Object.entries(productTypeLabels).map(
              ([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ),
            )}
          </FilterSelect>

          <FilterSelect
            label="Filter by stock or active status"
            value={statusFilter}
            onChange={(value) =>
              onStatusFilterChange(value as ProductStatusFilter)
            }
          >
            <option value="all">All statuses</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="low_stock">Low stock</option>
            <option value="out_of_stock">Out of stock</option>
          </FilterSelect>

          <FilterSelect
            label="Filter by availability"
            value={availabilityFilter}
            onChange={(value) =>
              onAvailabilityFilterChange(
                value as ProductAvailabilityFilter,
              )
            }
          >
            <option value="all">All availability</option>
            {Object.entries(availabilityLabels).map(
              ([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ),
            )}
          </FilterSelect>

          <FilterSelect
            label="Sort products"
            value={sort}
            onChange={(value) =>
              onSortChange(value as ProductSort)
            }
          >
            <option value="newest">Newest updated</option>
            <option value="oldest">Oldest updated</option>
            <option value="name_asc">Name A–Z</option>
            <option value="name_desc">Name Z–A</option>
            <option value="stock_asc">Stock: low to high</option>
            <option value="stock_desc">Stock: high to low</option>
          </FilterSelect>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={onClear}
              className="inline-flex min-h-10 items-center gap-1.5 rounded-lg px-3 text-sm font-medium text-text-secondary transition hover:bg-surface-secondary hover:text-text-primary"
            >
              <FiX aria-hidden="true" className="size-4" />
              Clear
            </button>
          )}
        </div>
      </div>

      <p className="mt-3 text-xs text-text-secondary" aria-live="polite">
        Showing {resultCount.toLocaleString()} of{' '}
        {totalCount.toLocaleString()}{' '}
        {totalCount === 1 ? 'product' : 'products'}
      </p>
    </div>
  );
}
