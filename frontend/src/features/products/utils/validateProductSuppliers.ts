import type {
  ProductSupplierDraft,
} from '../types/productCreation';

export type ProductSupplierField =
  Exclude<
    keyof ProductSupplierDraft,
    'temporaryId'
  >;

export type ProductSupplierRowErrors =
  Partial<
    Record<
      ProductSupplierField,
      string
    >
  >;

export type ProductSuppliersErrors =
  Partial<
    Record<
      string,
      ProductSupplierRowErrors
    >
  >;

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

function isOptionalNonNegativeInteger(
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
    parsedValue >= 0
  );
}

export function validateProductSuppliers(
  suppliers: ProductSupplierDraft[],
): ProductSuppliersErrors {
  const errors: ProductSuppliersErrors =
    {};

  const linkedSupplierIds =
    new Set<string>();

  for (const supplier of suppliers) {
    const rowErrors:
      ProductSupplierRowErrors = {};

    if (!supplier.supplierId) {
      rowErrors.supplierId =
        'Select a supplier.';
    } else if (
      linkedSupplierIds.has(
        supplier.supplierId,
      )
    ) {
      rowErrors.supplierId =
        'This supplier is already linked.';
    } else {
      linkedSupplierIds.add(
        supplier.supplierId,
      );
    }

    if (
      supplier.supplierSku.length > 64
    ) {
      rowErrors.supplierSku =
        'Supplier SKU must be 64 characters or fewer.';
    }

    if (
      !isOptionalNonNegativeNumber(
        supplier.purchasePrice,
      )
    ) {
      rowErrors.purchasePrice =
        'Enter a purchase price of zero or more.';
    }

    if (
      !isOptionalPositiveInteger(
        supplier.minimumOrderQuantity,
      )
    ) {
      rowErrors.minimumOrderQuantity =
        'Minimum order quantity must be a whole number greater than zero.';
    }

    if (
      !isOptionalNonNegativeInteger(
        supplier.leadTimeDays,
      )
    ) {
      rowErrors.leadTimeDays =
        'Lead time must be a whole number of zero days or more.';
    }

    if (
      Object.keys(rowErrors).length > 0
    ) {
      errors[supplier.temporaryId] =
        rowErrors;
    }
  }

  const preferredSuppliers =
    suppliers.filter(
      (supplier) =>
        supplier.preferred,
    );

  const [firstSupplier] = suppliers;

  if (
    firstSupplier &&
    preferredSuppliers.length === 0
  ) {
    errors[firstSupplier.temporaryId] = {
      ...errors[firstSupplier.temporaryId],

      preferred:
        'Choose one preferred supplier.',
    };
  }

  if (preferredSuppliers.length > 1) {
    for (
      const supplier
      of preferredSuppliers
    ) {
      errors[supplier.temporaryId] = {
        ...errors[supplier.temporaryId],

        preferred:
          'Only one supplier can be preferred.',
      };
    }
  }

  return errors;
}

export function hasProductSuppliersErrors(
  errors: ProductSuppliersErrors,
) {
  return Object.keys(errors).length > 0;
}
