import { cva, type VariantProps } from 'class-variance-authority';

/**
 * v2 badges. `brand` is the section marker: plain 13px label text, no chip
 * (icons are dropped). The others are small pills. Never below 12px (fix 11).
 */
export const badgeVariants = cva(['inline-flex items-center font-medium', 'transition-colors', '[&>svg]:shrink-0 [&>svg]:h-3.5 [&>svg]:w-3.5'], {
  variants: {
    variant: {
      default: 'bg-paper-2 text-ink border border-transparent',
      success: 'bg-[var(--success-light)] text-[var(--success-foreground)] border border-transparent',
      warning: 'bg-[var(--warning-light)] text-[var(--warning-foreground)] border border-transparent',
      error: 'bg-[var(--error-light)] text-[var(--error-foreground)] border border-transparent',
      info: 'bg-[var(--info-light)] text-[var(--info-foreground)] border border-transparent',
      brand: 'ds-badge-marker bg-transparent text-ink-3 border-0 !px-0 [&>svg]:hidden',
    },
    size: {
      sm: 'text-xs px-2.5 py-1 gap-1',
      md: 'text-[13px] px-3 py-1.5 gap-1.5',
    },
    pill: {
      true: 'rounded-full',
      false: 'rounded-lg',
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'md',
    pill: false,
  },
});

export type BadgeVariants = VariantProps<typeof badgeVariants>;
