import {
  FiCheckCircle,
} from 'react-icons/fi';

import type {
  DashboardAttentionViewModel,
} from '../types/dashboardViewModel';
import {
  AttentionItem,
} from './AttentionItem';

interface AttentionQueueProps {
  attention: DashboardAttentionViewModel;
  onReviewProduct: (productId: string) => void;
  onReviewAll: () => void;
}

export function AttentionQueue({
  attention,
  onReviewProduct,
  onReviewAll,
}: AttentionQueueProps) {
  return (
    <section className="flex h-full flex-col overflow-hidden rounded-xl border border-border-subtle bg-surface">
      <div className="flex items-center justify-between gap-5 border-b border-border-subtle bg-surface-secondary/50 px-5 py-4">
        <div>
          <h2 className="text-sm font-semibold text-text-primary">
            Needs Your Attention
          </h2>
          <p className="mt-1 text-xs text-text-secondary">
            {attention.total > 0
              ? `${attention.total} actionable ${attention.total === 1 ? 'issue' : 'issues'} across ${attention.affectedProductCount} ${attention.affectedProductCount === 1 ? 'product' : 'products'}.`
              : 'Current stock and configuration checks are clear.'}
          </p>
        </div>

        {attention.hasMore && (
          <button
            type="button"
            onClick={onReviewAll}
            className="min-h-9 shrink-0 rounded-lg px-2 text-sm font-semibold text-brand-default outline-none hover:text-brand-hover focus-visible:ring-2 focus-visible:ring-brand-default/30"
          >
            Review all
          </button>
        )}
      </div>

      {attention.items.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center p-8 text-center">
          <span className="mx-auto grid size-11 place-items-center rounded-xl bg-success/10 text-success">
            <FiCheckCircle aria-hidden="true" className="size-5" />
          </span>
          <h3 className="mt-4 font-bold text-text-primary">
            Everything is under control
          </h3>
          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-text-secondary">
            No active products are currently out of stock, below their reorder threshold, or missing required configuration.
          </p>
        </div>
      ) : (
        <div className="max-h-[360px] flex-1 overflow-y-auto">
          {attention.items.map((item, index) => (
            <AttentionItem
              key={item.id}
              item={item}
              index={index}
              onAction={() =>
                onReviewProduct(item.productId)
              }
            />
          ))}
        </div>
      )}
    </section>
  );
}
