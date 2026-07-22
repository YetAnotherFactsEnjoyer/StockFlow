import { useId, useState } from 'react';
import {
  FiAlertTriangle,
  FiTrash2,
  FiX,
} from 'react-icons/fi';

import {
  Button,
} from '../../../shared/components/Button';
import type {
  ProductRepository,
} from '../api/productRepository';
import type {
  Product,
} from '../types/product';
import {
  ProductDialogFrame,
} from './ProductDialogFrame';

interface DeleteProductDialogProps {
  product: Product;
  repository: ProductRepository;
  onClose: () => void;
  onDeleted: (product: Product) => void;
}

export function DeleteProductDialog({
  product,
  repository,
  onClose,
  onDeleted,
}: DeleteProductDialogProps) {
  const titleId = useId();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  async function handleDelete() {
    setSubmitting(true);
    setError('');

    try {
      await repository.deleteProduct(product.id);
      onDeleted(product);
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : 'The product could not be deleted.',
      );
      setSubmitting(false);
    }
  }

  return (
    <ProductDialogFrame titleId={titleId} onClose={onClose}>
      <header className="flex items-start justify-between gap-4 border-b border-border-subtle px-6 py-5">
        <div className="flex items-start gap-3">
          <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-danger/10 text-danger">
            <FiAlertTriangle aria-hidden="true" className="size-5" />
          </span>
          <div>
            <h2 id={titleId} className="text-lg font-semibold text-text-primary">
              Delete product?
            </h2>
            <p className="mt-1 text-sm text-text-secondary">
              This removes the product from this workspace.
            </p>
          </div>
        </div>
        <button
          type="button"
          aria-label="Close delete confirmation"
          disabled={submitting}
          onClick={onClose}
          className="grid size-9 shrink-0 place-items-center rounded-lg text-text-secondary transition hover:bg-surface-secondary disabled:opacity-40"
        >
          <FiX aria-hidden="true" className="size-5" />
        </button>
      </header>

      <div className="px-6 py-6">
        <p className="text-sm leading-6 text-text-secondary">
          <span className="font-semibold text-text-primary">{product.name}</span>
          {product.sku ? ` (${product.sku})` : ''} will be permanently deleted.
          This action cannot be undone.
        </p>
        {error && (
          <p role="alert" className="mt-4 rounded-xl bg-danger/10 px-4 py-3 text-sm text-danger">
            {error}
          </p>
        )}
      </div>

      <footer className="flex justify-end gap-3 border-t border-border-subtle px-6 py-4">
        <Button variant="secondary" disabled={submitting} onClick={onClose}>
          Cancel
        </Button>
        <Button
          variant="danger"
          isLoading={submitting}
          leftIcon={<FiTrash2 className="size-4" />}
          onClick={() => void handleDelete()}
        >
          Delete product
        </Button>
      </footer>
    </ProductDialogFrame>
  );
}
