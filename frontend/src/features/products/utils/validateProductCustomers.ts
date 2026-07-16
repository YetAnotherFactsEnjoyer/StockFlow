import type {
  ProductCommercialDraft,
  ProductCustomerDraft,
} from '../types/productCreation';

type ProductCustomerField =
  Exclude<
    keyof ProductCustomerDraft,
    'temporaryId'
  >;

export type ProductCustomerRowErrors =
  Partial<
    Record<
      ProductCustomerField,
      string
    >
  >;

export interface ProductCustomersErrors {
  availability?: string;
  defaultSellingPrice?: string;
  customers?: string;
  rows?: Partial<
    Record<
      string,
      ProductCustomerRowErrors
    >
  >;
}

function isOptionalNonNegativeNumber(
  value: string,
) {
  const normalizedValue = value.trim();

  if (!normalizedValue) {
    return true;
  }

  const parsedValue = Number(
    normalizedValue,
  );

  return (
    Number.isFinite(parsedValue) &&
    parsedValue >= 0
  );
}

function isOptionalPositiveInteger(
  value: string,
) {
  const normalizedValue = value.trim();

  if (!normalizedValue) {
    return true;
  }

  const parsedValue = Number(
    normalizedValue,
  );

  return (
    Number.isInteger(parsedValue) &&
    parsedValue > 0
  );
}

export function validateProductCustomers(
  commercial: ProductCommercialDraft,
): ProductCustomersErrors {
  const errors: ProductCustomersErrors = {};

  if (
    commercial.availability ===
    'unconfigured'
  ) {
    errors.availability =
      'Choose how this product is made available.';
  }

  if (
    commercial.availability !== 'internal' &&
    !isOptionalNonNegativeNumber(
      commercial.defaultSellingPrice,
    )
  ) {
    errors.defaultSellingPrice =
      'Enter a selling price of zero or more.';
  }

  if (
    commercial.availability !==
    'selected_customers'
  ) {
    return errors;
  }

  if (commercial.customers.length === 0) {
    errors.customers =
      'Select at least one customer.';
  }

  const linkedCustomerIds =
    new Set<string>();

  const rowErrors: NonNullable<
    ProductCustomersErrors['rows']
  > = {};

  for (
    const customer
    of commercial.customers
  ) {
    const currentErrors:
      ProductCustomerRowErrors = {};

    if (!customer.customerId) {
      currentErrors.customerId =
        'Select a customer.';
    } else if (
      linkedCustomerIds.has(
        customer.customerId,
      )
    ) {
      currentErrors.customerId =
        'This customer is already linked.';
    } else {
      linkedCustomerIds.add(
        customer.customerId,
      );
    }

    if (customer.customerSku.length > 64) {
      currentErrors.customerSku =
        'Customer SKU must be 64 characters or fewer.';
    }

    if (
      !isOptionalNonNegativeNumber(
        customer.sellingPrice,
      )
    ) {
      currentErrors.sellingPrice =
        'Enter a selling price of zero or more.';
    }

    if (
      !isOptionalPositiveInteger(
        customer.minimumOrderQuantity,
      )
    ) {
      currentErrors.minimumOrderQuantity =
        'Minimum order quantity must be a whole number greater than zero.';
    }

    if (
      Object.keys(currentErrors).length > 0
    ) {
      rowErrors[customer.temporaryId] =
        currentErrors;
    }
  }

  if (Object.keys(rowErrors).length > 0) {
    errors.rows = rowErrors;
  }

  return errors;
}

export function hasProductCustomersErrors(
  errors: ProductCustomersErrors,
) {
  return Object.keys(errors).length > 0;
}
