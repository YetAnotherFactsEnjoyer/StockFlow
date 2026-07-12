import type { ChangeEvent, ReactNode } from 'react';

import { useOnboarding } from '../context/useOnboarding';

const industryOptions = [
  {
    value: '',
    label: 'Select an industry',
  },
  {
    value: 'ecommerce',
    label: 'E-commerce / Retail',
  },
  {
    value: 'manufacturing',
    label: 'Manufacturing',
  },
  {
    value: 'wholesale',
    label: 'Wholesale / Distribution',
  },
  {
    value: 'other',
    label: 'Other',
  },
];

const currencyOptions = [
  {
    value: 'USD',
    label: 'USD — United States Dollar ($)',
  },
  {
    value: 'EUR',
    label: 'EUR — Euro (€)',
  },
  {
    value: 'GBP',
    label: 'GBP — British Pound (£)',
  },
  {
    value: 'CAD',
    label: 'CAD — Canadian Dollar ($)',
  },
];

type OrganizationField =
  | 'name'
  | 'slug'
  | 'industry'
  | 'currency';

export default function OrganizationStep() {
  const { state, dispatch } = useOnboarding();

  const { organization } = state;

  function handleChange(
    event: ChangeEvent<
      HTMLInputElement | HTMLSelectElement
    >,
  ) {
    const field =
      event.target.name as OrganizationField;

    dispatch({
      type: 'UPDATE_ORGANIZATION',
      payload: {
        [field]: event.target.value,
      },
    });
  }

  return (
    <div className="mx-auto w-full max-w-5xl">
      <header className="max-w-2xl">
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">
          Organization information
        </h1>

        <p className="mt-3 text-base leading-7 text-text-secondary">
          Enter the main details that will identify your
          workspace and configure its financial defaults.
        </p>
      </header>

      <form
        className="mt-8 overflow-hidden rounded-2xl border border-border-subtle bg-surface"
        onSubmit={(event) => event.preventDefault()}
      >
        <FormSection
          title="Company details"
          description="These details will be displayed throughout your StockFlow workspace."
        >
          <div className="grid gap-6 md:grid-cols-2">
            <FormField
              label="Organization name"
              htmlFor="name"
              required
              helper="Use your company, brand, or operation name."
            >
              <input
                id="name"
                name="name"
                type="text"
                value={organization.name}
                onChange={handleChange}
                placeholder="Acme Logistics Ltd."
                autoComplete="organization"
                required
                className="min-h-12 w-full rounded-lg border border-border-subtle bg-white px-4 text-base font-medium text-text-primary outline-none transition placeholder:font-normal placeholder:text-text-secondary/65 focus:border-brand-default focus:ring-4 focus:ring-brand-default/10"
              />
            </FormField>

            <FormField
              label="Workspace identifier"
              htmlFor="slug"
              required
              helper="Used as the unique identifier for this workspace."
            >
              <div className="flex min-h-12 overflow-hidden rounded-lg border border-border-subtle bg-white transition focus-within:border-brand-default focus-within:ring-4 focus-within:ring-brand-default/10">
                <span className="flex items-center border-r border-border-subtle bg-surface-secondary px-3 text-sm font-medium text-text-secondary">
                  /
                </span>

                <input
                  id="slug"
                  name="slug"
                  type="text"
                  value={organization.slug}
                  onChange={handleChange}
                  placeholder="acme-logistics"
                  required
                  spellCheck={false}
                  className="min-w-0 flex-1 bg-white px-4 text-base font-medium text-text-primary outline-none placeholder:font-normal placeholder:text-text-secondary/65"
                />
              </div>
            </FormField>
          </div>
        </FormSection>

        <FormSection
          title="Business settings"
          description="These settings define the default behavior used for stock management and valuation."
          separated
        >
          <div className="grid gap-6 md:grid-cols-2">
            <FormField
              label="Industry"
              htmlFor="industry"
              required
              helper="Choose the option that best matches your inventory workflow."
            >
              <div className="relative">
                <select
                  id="industry"
                  name="industry"
                  value={organization.industry}
                  onChange={handleChange}
                  required
                  className="min-h-12 w-full appearance-none rounded-lg border border-border-subtle bg-white px-4 pr-11 text-base font-medium text-text-primary outline-none transition focus:border-brand-default focus:ring-4 focus:ring-brand-default/10"
                >
                  {industryOptions.map((option) => (
                    <option
                      key={option.value || 'empty'}
                      value={option.value}
                      disabled={!option.value}
                    >
                      {option.label}
                    </option>
                  ))}
                </select>

                <SelectArrow />
              </div>
            </FormField>

            <FormField
              label="Base currency"
              htmlFor="currency"
              required
              helper="Used for prices, purchasing, reporting, and stock valuation."
            >
              <div className="relative">
                <select
                  id="currency"
                  name="currency"
                  value={organization.currency}
                  onChange={handleChange}
                  required
                  className="min-h-12 w-full appearance-none rounded-lg border border-border-subtle bg-white px-4 pr-11 text-base font-medium text-text-primary outline-none transition focus:border-brand-default focus:ring-4 focus:ring-brand-default/10"
                >
                  {currencyOptions.map((option) => (
                    <option
                      key={option.value}
                      value={option.value}
                    >
                      {option.label}
                    </option>
                  ))}
                </select>

                <SelectArrow />
              </div>
            </FormField>
          </div>
        </FormSection>
      </form>
    </div>
  );
}

interface FormSectionProps {
  title: string;
  description: string;
  separated?: boolean;
  children: ReactNode;
}

function FormSection({
  title,
  description,
  separated = false,
  children,
}: FormSectionProps) {
  return (
    <section
      className={[
        'px-6 py-7 sm:px-8 sm:py-8',
        separated
          ? 'border-t border-border-subtle'
          : '',
      ].join(' ')}
    >
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-text-primary">
          {title}
        </h2>

        <p className="mt-1 text-sm leading-6 text-text-secondary">
          {description}
        </p>
      </div>

      {children}
    </section>
  );
}

interface FormFieldProps {
  label: string;
  htmlFor: string;
  helper?: string;
  required?: boolean;
  children: ReactNode;
}

function FormField({
  label,
  htmlFor,
  helper,
  required = false,
  children,
}: FormFieldProps) {
  return (
    <div>
      <label
        htmlFor={htmlFor}
        className="block text-sm font-semibold text-text-primary"
      >
        {label}

        {required && (
          <span
            aria-hidden="true"
            className="ml-1 text-danger"
          >
            *
          </span>
        )}
      </label>

      <div className="mt-2">
        {children}
      </div>

      {helper && (
        <p className="mt-2 text-sm leading-5 text-text-secondary">
          {helper}
        </p>
      )}
    </div>
  );
}

function SelectArrow() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 20 20"
      fill="none"
      className="pointer-events-none absolute right-4 top-1/2 size-4 -translate-y-1/2 text-text-secondary"
    >
      <path
        d="M5 7.5L10 12.5L15 7.5"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
