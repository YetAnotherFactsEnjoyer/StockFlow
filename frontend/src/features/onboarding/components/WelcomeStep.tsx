import type { IconType } from 'react-icons';
import {
  FiBox,
  FiBriefcase,
  FiDatabase,
  FiPenTool,
  FiRefreshCw,
  FiShield,
  FiUsers,
} from 'react-icons/fi';
import {
  motion,
  type Variants,
  useReducedMotion,
} from 'motion/react';

type LogoAccent = 'blue' | 'teal';

interface SetupItem {
  number: string;
  title: string;
  icon: IconType;
  color: LogoAccent;
  isActive?: boolean;
}

const setupItems: SetupItem[] = [
  {
    number: '01',
    title: 'Organization and regional settings',
    icon: FiBriefcase,
    color: 'blue',
    isActive: true,
  },
  {
    number: '02',
    title: 'Brand identity',
    icon: FiPenTool,
    color: 'teal',
  },
  {
    number: '03',
    title: 'Inventory behavior',
    icon: FiBox,
    color: 'blue',
  },
  {
    number: '04',
    title: 'Team roles and permissions',
    icon: FiUsers,
    color: 'teal',
  },
  {
    number: '05',
    title: 'Existing stock',
    icon: FiDatabase,
    color: 'blue',
  },
];

const accentStyles: Record<
  LogoAccent,
  {
    text: string;
    mutedText: string;
    soft: string;
    ring: string;
  }
> = {
  blue: {
    text: 'text-[#0b4aa2]',
    mutedText: 'text-[#0b4aa2]/65',
    soft: 'bg-[rgba(11,74,162,0.08)]',
    ring: 'ring-[rgba(11,74,162,0.72)]',
  },
  teal: {
    text: 'text-[#11b8b2]',
    mutedText: 'text-[#11b8b2]/70',
    soft: 'bg-[rgba(17,184,178,0.10)]',
    ring: 'ring-[rgba(17,184,178,0.68)]',
  },
};

const trustPoints = [
  {
    title: 'Self-hosted',
    description: 'Your configuration remains under your control.',
    icon: FiShield,
  },
  {
    title: 'Resumable',
    description: 'Your progress can be saved and continued later.',
    icon: FiRefreshCw,
  },
];

const pageVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 14,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.32,
      ease: 'easeOut',
      staggerChildren: 0.06,
    },
  },
};

const itemVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 12,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.28,
      ease: 'easeOut',
    },
  },
};

const stepGridVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.07,
      delayChildren: 0.05,
    },
  },
};

const stepCardVariants: Variants = {
  hidden: {
    opacity: 0,
    x: -16,
    scale: 0.98,
  },
  visible: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: {
      duration: 0.3,
      ease: 'easeOut',
    },
  },
};

export default function WelcomeStep() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.section
      aria-labelledby="welcome-title"
      className="mx-auto w-full max-w-6xl"
      variants={pageVariants}
      initial={shouldReduceMotion ? false : 'hidden'}
      animate="visible"
    >
      <motion.div
        variants={itemVariants}
        className="flex items-center gap-3"
      >
      </motion.div>

      <motion.div
        variants={itemVariants}
        className="mt-12"
      >
        <h1
          id="welcome-title"
          className="max-w-5xl text-5xl font-bold tracking-tight text-text-primary sm:text-6xl"
        >
          Create a workspace built around your organization.
        </h1>

        <p className="mt-6 max-w-3xl text-xl leading-9 text-text-secondary">
          Configure your company identity, inventory rules, team access, and
          existing stock before entering StockFlow.
        </p>
      </motion.div>

      <motion.div
        variants={itemVariants}
        className="mt-12"
      >
        <h2 className="text-lg font-bold text-text-primary">
          During setup you will define
        </h2>

        <motion.ol
          variants={stepGridVariants}
          className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5"
        >
          {setupItems.map((item) => (
            <SetupOverviewItem
              key={item.number}
              number={item.number}
              title={item.title}
              Icon={item.icon}
              color={item.color}
              isActive={item.isActive}
            />
          ))}
        </motion.ol>
      </motion.div>

      <motion.div
        variants={itemVariants}
        className="mt-12 grid gap-6 sm:grid-cols-2"
      >
        {trustPoints.map((point) => (
          <TrustPoint
            key={point.title}
            title={point.title}
            description={point.description}
            Icon={point.icon}
          />
        ))}
      </motion.div>
    </motion.section>
  );
}

function SetupOverviewItem({
  number,
  title,
  Icon,
  color,
  isActive = false,
}: {
  number: string;
  title: string;
  Icon: IconType;
  color: LogoAccent;
  isActive?: boolean;
}) {
  const accent = accentStyles[color];

  return (
    <motion.li
      variants={stepCardVariants}
      whileHover={{
        y: -3,
      }}
      className={[
        'min-h-44 rounded-[1.75rem] bg-white p-5 text-center shadow-sm transition-colors',
        'flex flex-col items-center justify-center',
        isActive
          ? `ring-2 ${accent.ring}`
          : 'ring-1 ring-[#0b4aa2]/10',
      ].join(' ')}
    >
      <div
        className={[
          'grid size-14 place-items-center rounded-2xl',
          isActive
            ? `${accent.soft} ${accent.text}`
            : `${accent.soft} ${accent.mutedText}`,
        ].join(' ')}
      >
        <Icon
          aria-hidden="true"
          className="size-8"
        />
      </div>

      <div className="mt-4">
        <p
          className={[
            'text-xs font-bold uppercase tracking-[0.14em]',
            isActive
              ? accent.text
              : accent.mutedText,
          ].join(' ')}
        >
          {number}
        </p>

        <h3
          className={[
            'mt-2 text-sm font-bold leading-5',
            isActive
              ? accent.text
              : 'text-[#12284c]',
          ].join(' ')}
        >
          {title}
        </h3>
      </div>
    </motion.li>
  );
}

function TrustPoint({
  title,
  description,
  Icon,
}: {
  title: string;
  description: string;
  Icon: IconType;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-lg bg-[#11b8b2]/10 text-[#0b4aa2]">
        <Icon />
      </div>

      <div>
        <h2 className="text-sm font-bold text-text-primary">
          {title}
        </h2>

        <p className="mt-1 text-sm leading-6 text-text-secondary">
          {description}
        </p>
      </div>
    </div>
  );
}
