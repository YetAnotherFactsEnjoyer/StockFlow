import type { ReactNode } from 'react';
import {
  LayoutGroup,
  motion,
  useReducedMotion,
} from 'motion/react';
import type { IconType } from 'react-icons';
import {
  FiBox,
  FiCheck,
  FiMonitor,
  FiMoon,
  FiPackage,
  FiSun,
  FiTruck,
  FiUsers,
} from 'react-icons/fi';

import { useOnboarding } from '../context/useOnboarding';
import type { BrandingDraft } from '../types/onboarding';

const palettes = [
  ['Ocean', '#2457D6', '#11B8B2'],
  ['Navy', '#173B57', '#D3912B'],
  ['Forest', '#2F6B4F', '#69A77C'],
  ['Graphite', '#343B46', '#4EA5D9'],
] as const;

const appearances: Array<{
  value: BrandingDraft['colorMode'];
  label: string;
  icon: IconType;
}> = [
  {
    value: 'light',
    label: 'Light',
    icon: FiSun,
  },
  {
    value: 'dark',
    label: 'Dark',
    icon: FiMoon,
  },
  {
    value: 'system',
    label: 'System',
    icon: FiMonitor,
  },
];

const HEX_COLOR_PATTERN = /^#[0-9A-F]{6}$/i;
const MOTION_EASE = [0.22, 1, 0.36, 1] as const;

const DARK_BACKGROUND = '#101318';
const DARK_OUTER_SURFACE = '#0D1015';
const DARK_SURFACE = '#181D25';
const DARK_SURFACE_SECONDARY = '#202630';
const DARK_BORDER = '#2A303A';
const DARK_SEPARATOR = '#303743';
const DARK_TEXT = '#FFFFFF';
const DARK_MUTED_TEXT = '#929CAA';
const DARK_SUBTLE_TEXT = '#7D8797';

function validHex(value: string) {
  return HEX_COLOR_PATTERN.test(value);
}

function initials(name: string) {
  const words = name
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  return words.length === 0
    ? 'SF'
    : words
        .slice(0, 2)
        .map((word) => word[0]?.toUpperCase())
        .join('');
}

export default function BrandingStep() {
  const { state, dispatch } = useOnboarding();
  const reduceMotion = useReducedMotion();
  const { branding } = state;

  const primary = validHex(branding.primaryColor)
    ? branding.primaryColor
    : '#2457D6';

  const accent = validHex(branding.accentColor)
    ? branding.accentColor
    : '#11B8B2';

  const isDark = branding.colorMode === 'dark';

  function update(payload: Partial<BrandingDraft>) {
    dispatch({
      type: 'UPDATE_BRANDING',
      payload,
    });
  }

  return (
    <div className="mx-auto w-full max-w-[1400px]">
      <header className="mb-6 max-w-2xl">
        <p className="text-sm font-semibold text-brand-default">
          Brand identity
        </p>

        <h1 className="mt-1.5 text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">
          Make the workspace yours
        </h1>

        <p className="mt-2 text-base text-text-secondary">
          Choose the identity your team will see every day.
        </p>
      </header>

      <div className="grid gap-6 lg:h-[68vh] lg:min-h-[620px] lg:max-h-[740px] lg:grid-cols-[minmax(0,1fr)_370px]">
        <Preview
          name={
            branding.applicationName ||
            'Your workspace'
          }
          primary={primary}
          accent={accent}
          isDark={isDark}
          reduceMotion={reduceMotion}
        />

        <section className="flex min-h-[620px] overflow-hidden rounded-[24px] border border-border-subtle bg-surface shadow-sm lg:h-full lg:min-h-0">
          <div className="flex min-h-0 w-full flex-col">
            <header className="border-b border-border-subtle px-5 py-5">
              <h2 className="font-semibold text-text-primary">
                Brand settings
              </h2>

              <p className="mt-1 text-sm text-text-secondary">
                Changes are animated in the preview.
              </p>
            </header>

            <div className="min-h-0 flex-1 overflow-y-auto">
              <div className="divide-y divide-border-subtle">
                <Section title="Workspace name">
                  <input
                    value={branding.applicationName}
                    onChange={(event) =>
                      update({
                        applicationName:
                          event.target.value,
                      })
                    }
                    placeholder="StockFlow"
                    maxLength={40}
                    className="min-h-11 w-full rounded-xl border border-border-subtle bg-surface px-3.5 text-sm font-medium text-text-primary outline-none transition focus:border-brand-default focus:ring-4 focus:ring-brand-default/10"
                  />
                </Section>

                <Section title="Color palette">
                  <LayoutGroup id="brand-palette">
                    <div className="grid grid-cols-2 gap-2">
                      {palettes.map(
                        ([name, first, second]) => {
                          const selected =
                            branding.primaryColor.toUpperCase() ===
                              first &&
                            branding.accentColor.toUpperCase() ===
                              second;

                          return (
                            <motion.button
                              key={name}
                              type="button"
                              whileTap={
                                reduceMotion
                                  ? undefined
                                  : {
                                      scale: 0.97,
                                    }
                              }
                              onClick={() =>
                                update({
                                  primaryColor: first,
                                  accentColor: second,
                                })
                              }
                              className="relative isolate flex min-h-16 items-center gap-3 overflow-hidden rounded-xl border border-border-subtle px-3 text-left"
                            >
                              {selected && (
                                <motion.span
                                  layoutId="active-palette"
                                  className="absolute inset-0 -z-10 rounded-xl border border-text-primary bg-surface-secondary"
                                  transition={
                                    reduceMotion
                                      ? {
                                          duration: 0,
                                        }
                                      : {
                                          duration: 0.28,
                                          ease: MOTION_EASE,
                                        }
                                  }
                                />
                              )}

                              <span className="flex -space-x-1.5">
                                <span
                                  className="size-8 rounded-full border-2 border-white"
                                  style={{
                                    backgroundColor:
                                      first,
                                  }}
                                />

                                <span
                                  className="size-8 rounded-full border-2 border-white"
                                  style={{
                                    backgroundColor:
                                      second,
                                  }}
                                />
                              </span>

                              <span className="truncate text-sm font-medium text-text-primary">
                                {name}
                              </span>

                              {selected && (
                                <FiCheck className="ml-auto size-4" />
                              )}
                            </motion.button>
                          );
                        },
                      )}
                    </div>
                  </LayoutGroup>
                </Section>

                <Section title="Appearance">
                  <LayoutGroup id="brand-appearance">
                    <div className="grid grid-cols-3 rounded-xl border border-border-subtle bg-surface-secondary p-1">
                      {appearances.map((option) => {
                        const Icon = option.icon;

                        const selected =
                          branding.colorMode ===
                          option.value;

                        return (
                          <button
                            key={option.value}
                            type="button"
                            onClick={() =>
                              update({
                                colorMode:
                                  option.value,
                              })
                            }
                            className="relative isolate flex min-h-11 items-center justify-center gap-2 rounded-lg text-xs font-semibold"
                          >
                            {selected && (
                              <motion.span
                                layoutId="active-appearance"
                                className="absolute inset-0 -z-10 rounded-lg bg-white shadow-sm"
                                transition={
                                  reduceMotion
                                    ? {
                                        duration: 0,
                                      }
                                    : {
                                        type: 'spring',
                                        stiffness: 420,
                                        damping: 36,
                                      }
                                }
                              />
                            )}

                            <motion.span
                              animate={{
                                color: selected
                                  ? '#172033'
                                  : '#667085',
                              }}
                              className="flex items-center gap-2"
                            >
                              <Icon className="size-4" />

                              {option.label}
                            </motion.span>
                          </button>
                        );
                      })}
                    </div>
                  </LayoutGroup>
                </Section>

                <Section title="Custom colors">
                  <ColorField
                    label="Primary"
                    value={branding.primaryColor}
                    fallback="#2457D6"
                    reduceMotion={reduceMotion}
                    onChange={(value) =>
                      update({
                        primaryColor: value,
                      })
                    }
                  />

                  <ColorField
                    label="Accent"
                    value={branding.accentColor}
                    fallback="#11B8B2"
                    reduceMotion={reduceMotion}
                    onChange={(value) =>
                      update({
                        accentColor: value,
                      })
                    }
                  />
                </Section>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="space-y-4 px-5 py-5">
      <h3 className="text-sm font-semibold text-text-primary">
        {title}
      </h3>

      {children}
    </section>
  );
}

function ColorField({
  label,
  value,
  fallback,
  reduceMotion,
  onChange,
}: {
  label: string;
  value: string;
  fallback: string;
  reduceMotion: boolean | null;
  onChange: (value: string) => void;
}) {
  const color = validHex(value)
    ? value
    : fallback;

  return (
    <label className="grid grid-cols-[2.75rem_1fr] gap-2">
      <span className="relative grid min-h-10 cursor-pointer place-items-center rounded-lg border border-border-subtle">
        <motion.span
          animate={{
            backgroundColor: color,
          }}
          transition={
            reduceMotion
              ? {
                  duration: 0,
                }
              : {
                  duration: 0.35,
                  ease: MOTION_EASE,
                }
          }
          className="size-5 rounded-md border border-black/10"
        />

        <input
          type="color"
          value={color}
          onChange={(event) =>
            onChange(
              event.target.value.toUpperCase(),
            )
          }
          aria-label={`${label} color picker`}
          className="absolute inset-0 opacity-0"
        />
      </span>

      <input
        value={value}
        onChange={(event) =>
          onChange(
            event.target.value.toUpperCase(),
          )
        }
        aria-label={`${label} hex color`}
        maxLength={7}
        className={[
          'min-h-10 rounded-lg border px-3 font-mono text-xs uppercase outline-none',
          validHex(value)
            ? 'border-border-subtle'
            : 'border-danger',
        ].join(' ')}
      />
    </label>
  );
}

function Preview({
  name,
  primary,
  accent,
  isDark,
  reduceMotion,
}: {
  name: string;
  primary: string;
  accent: string;
  isDark: boolean;
  reduceMotion: boolean | null;
}) {
  const transition = reduceMotion
    ? {
        duration: 0,
      }
    : {
        duration: 0.45,
        ease: MOTION_EASE,
      };

  const rows = [
    ['Wireless scanner', 'SCN-2048', '82'],
    ['Shipping labels', 'LBL-1102', '19'],
    ['Storage bins', 'BIN-4400', '124'],
  ];

  return (
    <motion.section
      animate={{
        backgroundColor: isDark
          ? DARK_OUTER_SURFACE
          : '#FFFFFF',

        borderColor: isDark
          ? DARK_BORDER
          : '#D8DEE8',
      }}
      transition={transition}
      className="flex min-h-[620px] flex-col overflow-hidden rounded-[26px] border shadow-[0_22px_60px_rgba(23,32,51,0.10)] lg:h-full lg:min-h-0"
    >
      <motion.div
        animate={{
          backgroundColor: isDark
            ? DARK_BACKGROUND
            : '#F3F5F8',
        }}
        transition={transition}
        className="grid min-h-0 flex-1 grid-cols-[210px_minmax(0,1fr)]"
      >
        <motion.aside
          animate={{
            backgroundColor: isDark
              ? DARK_SURFACE
              : '#FFFFFF',

            borderColor: isDark
              ? DARK_BORDER
              : '#D8DEE8',
          }}
          transition={transition}
          className="border-r p-5"
        >
          <div className="flex items-center gap-3">
            <motion.div
              animate={{
                backgroundColor: primary,
              }}
              transition={transition}
              className="grid size-11 place-items-center rounded-xl text-xs font-bold text-white"
            >
              {initials(name)}
            </motion.div>

            <motion.span
              animate={{
                color: isDark
                  ? DARK_TEXT
                  : '#172033',
              }}
              transition={transition}
              className="truncate text-sm font-bold"
            >
              {name}
            </motion.span>
          </div>

          <nav className="mt-10 space-y-1.5">
            <Nav
              active
              icon={<FiBox />}
              label="Overview"
              primary={primary}
              isDark={isDark}
              transition={transition}
            />

            <Nav
              icon={<FiPackage />}
              label="Products"
              primary={primary}
              isDark={isDark}
              transition={transition}
            />

            <Nav
              icon={<FiTruck />}
              label="Suppliers"
              primary={primary}
              isDark={isDark}
              transition={transition}
            />

            <Nav
              icon={<FiUsers />}
              label="Team"
              primary={primary}
              isDark={isDark}
              transition={transition}
            />
          </nav>
        </motion.aside>

        <main className="min-w-0 p-7">
          <div className="flex items-start justify-between">
            <div>
              <motion.p
                animate={{
                  color: isDark
                    ? DARK_MUTED_TEXT
                    : '#667085',
                }}
                transition={transition}
                className="text-xs"
              >
                Inventory overview
              </motion.p>

              <motion.h3
                animate={{
                  color: isDark
                    ? DARK_TEXT
                    : '#172033',
                }}
                transition={transition}
                className="mt-1 text-2xl font-bold"
              >
                Good morning, Alex
              </motion.h3>
            </div>

            <motion.button
              animate={{
                backgroundColor: primary,
              }}
              transition={transition}
              className="rounded-xl px-4 py-2.5 text-xs font-semibold text-white"
            >
              Add product
            </motion.button>
          </div>

          <div className="mt-7 grid grid-cols-3 gap-4">
            <Metric
              label="Products"
              value="248"
              isDark={isDark}
              transition={transition}
            />

            <Metric
              label="Low stock"
              value="12"
              color={accent}
              isDark={isDark}
              transition={transition}
            />

            <Metric
              label="Suppliers"
              value="36"
              isDark={isDark}
              transition={transition}
            />
          </div>

          <motion.section
            animate={{
              backgroundColor: isDark
                ? DARK_SURFACE
                : '#FFFFFF',

              borderColor: isDark
                ? DARK_BORDER
                : '#D8DEE8',
            }}
            transition={transition}
            className="mt-5 overflow-hidden rounded-2xl border"
          >
            <motion.p
              animate={{
                color: isDark
                  ? DARK_TEXT
                  : '#172033',

                borderColor: isDark
                  ? DARK_SEPARATOR
                  : '#E6E9EF',
              }}
              transition={transition}
              className="border-b px-5 py-4 text-xs font-semibold"
            >
              Recent products
            </motion.p>

            {rows.map(
              ([product, sku, stock], index) => (
                <motion.div
                  key={sku}
                  animate={{
                    borderColor: isDark
                      ? DARK_SEPARATOR
                      : '#E6E9EF',
                  }}
                  transition={transition}
                  className={[
                    'flex items-center justify-between px-5 py-4',
                    index < rows.length - 1
                      ? 'border-b'
                      : '',
                  ].join(' ')}
                >
                  <div>
                    <motion.p
                      animate={{
                        color: isDark
                          ? DARK_TEXT
                          : '#172033',
                      }}
                      transition={transition}
                      className="text-xs font-semibold"
                    >
                      {product}
                    </motion.p>

                    <motion.p
                      animate={{
                        color: isDark
                          ? DARK_SUBTLE_TEXT
                          : '#8992A3',
                      }}
                      transition={transition}
                      className="mt-1 text-[9px]"
                    >
                      {sku}
                    </motion.p>
                  </div>

                  <motion.span
                    animate={{
                      backgroundColor: isDark
                        ? DARK_SURFACE_SECONDARY
                        : '#F0F2F5',

                      color: isDark
                        ? '#D2D7DE'
                        : '#667085',
                    }}
                    transition={transition}
                    className="rounded-md px-2 py-1 text-[9px]"
                  >
                    {stock} units
                  </motion.span>
                </motion.div>
              ),
            )}
          </motion.section>
        </main>
      </motion.div>
    </motion.section>
  );
}

type PreviewTransition = {
  duration: number;
  ease?: readonly [
    number,
    number,
    number,
    number,
  ];
};

function Nav({
  icon,
  label,
  active = false,
  primary,
  isDark,
  transition,
}: {
  icon: ReactNode;
  label: string;
  active?: boolean;
  primary: string;
  isDark: boolean;
  transition: PreviewTransition;
}) {
  return (
    <motion.div
      animate={{
        backgroundColor: active
          ? primary
          : isDark
            ? DARK_SURFACE_SECONDARY
            : '#F5F7FA',

        color: active
          ? '#FFFFFF'
          : isDark
            ? DARK_MUTED_TEXT
            : '#667085',

        borderColor: active
          ? primary
          : isDark
            ? DARK_BORDER
            : '#E6E9EF',
      }}
      transition={transition}
      className="flex items-center gap-3 rounded-xl border px-3 py-3 text-xs"
    >
      {icon}

      {label}
    </motion.div>
  );
}

function Metric({
  label,
  value,
  color,
  isDark,
  transition,
}: {
  label: string;
  value: string;
  color?: string;
  isDark: boolean;
  transition: PreviewTransition;
}) {
  return (
    <motion.div
      animate={{
        backgroundColor: isDark
          ? DARK_SURFACE
          : '#FFFFFF',

        borderColor: isDark
          ? DARK_BORDER
          : '#D8DEE8',
      }}
      transition={transition}
      className="rounded-2xl border p-4"
    >
      <motion.p
        animate={{
          color: isDark
            ? DARK_MUTED_TEXT
            : '#667085',
        }}
        transition={transition}
        className="text-[11px]"
      >
        {label}
      </motion.p>

      <motion.p
        animate={{
          color:
            color ??
            (isDark
              ? DARK_TEXT
              : '#172033'),
        }}
        transition={transition}
        className="mt-2 text-2xl font-bold"
      >
        {value}
      </motion.p>
    </motion.div>
  );
}
