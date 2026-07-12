import {
  AnimatePresence,
  LayoutGroup,
  motion,
  useReducedMotion,
} from 'motion/react';
import type { IconType } from 'react-icons';
import {
  FiArrowRight,
  FiBox,
  FiCheck,
  FiDatabase,
  FiEdit3,
  FiFileText,
  FiPackage,
  FiUploadCloud,
} from 'react-icons/fi';

import { useOnboarding } from '../context/useOnboarding';
import type { ImportDraft } from '../types/onboarding';

const MOTION_EASE = [0.22, 1, 0.36, 1] as const;
const SPRING_TRANSITION = {
  type: 'spring',
  stiffness: 240,
  damping: 28,
  mass: 0.8,
} as const;

const importOptions: Array<{
  id: ImportDraft['mode'];
  eyebrow: string;
  title: string;
  description: string;
  icon: IconType;
}> = [
  {
    id: 'MANUAL',
    eyebrow: 'Start clean',
    title: 'Build it manually',
    description: 'Begin with an empty catalog and add products as you go.',
    icon: FiEdit3,
  },
  {
    id: 'CSV',
    eyebrow: 'Bring your data',
    title: 'Import a CSV file',
    description: 'Move an existing product catalog into your workspace.',
    icon: FiFileText,
  },
  {
    id: 'SEED',
    eyebrow: 'Explore first',
    title: 'Use demo data',
    description: 'Try StockFlow with a ready-made sample inventory.',
    icon: FiDatabase,
  },
];

export default function ImportStep() {
  const { state, dispatch } = useOnboarding();
  const reduceMotion = useReducedMotion();

  function handleSelectMode(mode: ImportDraft['mode']) {
    dispatch({
      type: 'UPDATE_IMPORT',
      payload: { mode },
    });
  }

  return (
    <div className="mx-auto w-full max-w-6xl">
      <header className="max-w-2xl">
        <p className="text-sm font-semibold text-brand-default">
          Import your data
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">
          How do you want to start?
        </h1>
        <p className="mt-3 text-base leading-7 text-text-secondary">
          Choose the fastest path for your inventory. You can always add or
          import more products later.
        </p>
      </header>

      <div className="mt-8 grid items-stretch gap-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(420px,1.1fr)]">
        <LayoutGroup id="import-methods">
          <div className="space-y-3">
            {importOptions.map((option) => {
              const selected = state.import.mode === option.id;
              const Icon = option.icon;

              return (
                <motion.button
                  key={option.id}
                  type="button"
                  onClick={() => handleSelectMode(option.id)}
                  whileHover={reduceMotion ? undefined : { x: 4 }}
                  whileTap={reduceMotion ? undefined : { scale: 0.985 }}
                  className="relative isolate flex w-full items-center gap-4 overflow-hidden rounded-2xl border border-border-subtle p-4 text-left outline-none focus-visible:ring-4 focus-visible:ring-brand-default/15 sm:p-5"
                >
                  {selected && (
                    <motion.span
                      layoutId="selected-import-method"
                      className="absolute inset-0 -z-10 rounded-2xl border-2 border-brand-default bg-surface"
                      transition={
                        reduceMotion
                          ? { duration: 0 }
                          : SPRING_TRANSITION
                      }
                    />
                  )}
                  {!selected && (
                    <span className="absolute inset-0 -z-10 bg-surface" />
                  )}

                  <span
                    className={[
                      'flex size-12 shrink-0 items-center justify-center rounded-xl transition-colors',
                      selected
                        ? 'bg-brand-default text-white'
                        : 'bg-surface-secondary text-text-secondary',
                    ].join(' ')}
                  >
                    <Icon className="size-5" />
                  </span>

                  <span className="min-w-0 flex-1">
                    <span className="block text-xs font-semibold uppercase tracking-wider text-text-secondary">
                      {option.eyebrow}
                    </span>
                    <span className="mt-0.5 block font-semibold text-text-primary">
                      {option.title}
                    </span>
                    <span className="mt-1 block text-sm leading-5 text-text-secondary">
                      {option.description}
                    </span>
                  </span>

                  <span
                    className={[
                      'flex size-7 shrink-0 items-center justify-center rounded-full border transition-colors',
                      selected
                        ? 'border-brand-default bg-brand-default text-white'
                        : 'border-border-subtle text-transparent',
                    ].join(' ')}
                  >
                    <FiCheck className="size-4" />
                  </span>
                </motion.button>
              );
            })}
          </div>
        </LayoutGroup>

        <motion.div
          layout
          transition={reduceMotion ? { duration: 0 } : SPRING_TRANSITION}
          className="min-h-[390px] overflow-hidden rounded-[24px] border border-border-subtle bg-surface-secondary p-4 sm:p-6"
        >
          <motion.div
            layout
            animate={
              reduceMotion
                ? undefined
                : { scale: [0.985, 1], opacity: [0.92, 1] }
            }
            transition={{ duration: 0.42, ease: MOTION_EASE }}
            className="flex h-full min-h-[340px] flex-col rounded-2xl border border-border-subtle bg-surface p-5 shadow-sm sm:p-7"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
                  Workspace preview
                </p>
                <p className="mt-1 font-semibold text-text-primary">
                  Your starting inventory
                </p>
              </div>
              <span className="flex size-9 items-center justify-center rounded-lg bg-text-primary text-surface">
                <FiPackage className="size-4" />
              </span>
            </div>

            <div className="relative flex flex-1 overflow-hidden">
            <AnimatePresence initial={false} mode="popLayout">
              <motion.div
                key={state.import.mode}
                layout
                initial={
                  reduceMotion
                    ? false
                    : { opacity: 0, x: 18, scale: 0.97 }
                }
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={
                  reduceMotion
                    ? undefined
                    : { opacity: 0, x: -14, scale: 0.985 }
                }
                transition={
                  reduceMotion
                    ? { duration: 0 }
                    : {
                        opacity: { duration: 0.22 },
                        x: SPRING_TRANSITION,
                        scale: SPRING_TRANSITION,
                      }
                }
                className="flex w-full flex-1 flex-col"
              >
                {state.import.mode === 'MANUAL' && <ManualPreview />}
                {state.import.mode === 'CSV' && <CsvPreview reduceMotion={reduceMotion} />}
                {state.import.mode === 'SEED' && <SeedPreview reduceMotion={reduceMotion} />}
              </motion.div>
            </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

function ManualPreview() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center py-8 text-center">
      <div className="relative flex size-24 items-center justify-center rounded-3xl bg-surface-secondary text-text-secondary">
        <FiBox className="size-10" />
        <span className="absolute -bottom-2 -right-2 flex size-9 items-center justify-center rounded-full bg-brand-default text-xl font-medium text-white">
          +
        </span>
      </div>
      <p className="mt-7 text-lg font-semibold text-text-primary">
        A clean slate
      </p>
      <p className="mt-2 max-w-xs text-sm leading-6 text-text-secondary">
        Your workspace starts empty, ready for the first product you create.
      </p>
      <div className="mt-6 flex items-center gap-2 rounded-xl bg-text-primary px-4 py-2.5 text-sm font-semibold text-surface">
        Add your first product <FiArrowRight className="size-4" />
      </div>
    </div>
  );
}

function CsvPreview({ reduceMotion }: { reduceMotion: boolean | null }) {
  return (
    <div className="flex flex-1 flex-col justify-center py-6">
      <motion.div
        animate={reduceMotion ? undefined : { y: [0, -5, 0] }}
        transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
        className="mx-auto flex size-20 items-center justify-center rounded-2xl bg-brand-default text-white"
      >
        <FiUploadCloud className="size-9" />
      </motion.div>
      <p className="mt-5 text-center text-lg font-semibold text-text-primary">
        CSV to products
      </p>
      <div className="mt-6 flex items-center gap-2">
        {['File', 'Check', 'Import'].map((label, index) => (
          <div key={label} className="contents">
            <motion.div
              initial={reduceMotion ? false : { opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: reduceMotion ? 0 : index * 0.12 }}
              className="flex flex-1 flex-col items-center gap-2"
            >
              <span className="flex size-9 items-center justify-center rounded-full bg-surface-secondary text-xs font-bold text-text-primary">
                {index + 1}
              </span>
              <span className="text-xs font-medium text-text-secondary">{label}</span>
            </motion.div>
            {index < 2 && <span className="h-px flex-1 bg-border-subtle" />}
          </div>
        ))}
      </div>
    </div>
  );
}

function SeedPreview({ reduceMotion }: { reduceMotion: boolean | null }) {
  const products = [
    ['BX', 'Storage boxes', '128 units'],
    ['LM', 'Desk lamps', '42 units'],
    ['CH', 'Office chairs', '16 units'],
  ];

  return (
    <div className="flex flex-1 flex-col justify-center py-5">
      <div className="space-y-2.5">
        {products.map(([initials, name, stock], index) => (
          <motion.div
            key={name}
            initial={reduceMotion ? false : { opacity: 0, x: 18 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: reduceMotion ? 0 : index * 0.1, ease: MOTION_EASE }}
            className="flex items-center gap-3 rounded-xl border border-border-subtle p-3"
          >
            <span className="flex size-10 items-center justify-center rounded-lg bg-surface-secondary text-xs font-bold text-text-primary">
              {initials}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm font-semibold text-text-primary">{name}</span>
              <span className="text-xs text-text-secondary">Sample product</span>
            </span>
            <span className="rounded-full bg-brand-default px-2.5 py-1 text-xs font-semibold text-white">{stock}</span>
          </motion.div>
        ))}
      </div>
      <p className="mt-5 text-center text-sm text-text-secondary">
        Ready to explore, edit, or remove anytime.
      </p>
    </div>
  );
}
