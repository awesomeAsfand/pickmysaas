import { cva, type VariantProps } from 'class-variance-authority';

/**
 * v2 cards: large rounded paper cards with a thin rule, no glow or blue
 * borders. `solid` is the tinted panel; `elevated` keeps a soft shadow.
 */
export const cardVariants = cva(['rounded-[22px]', 'transition-[transform,background-color] duration-300 ease-out'], {
  variants: {
    variant: {
      default: 'bg-card border-[1.5px] border-border',
      solid: 'bg-paper-2 border-[1.5px] border-transparent',
      outline: 'bg-transparent border-[1.5px] border-ink',
      ghost: 'bg-transparent border border-transparent',
      elevated: 'bg-card border-[1.5px] border-border',
    },
    padding: {
      none: '',
      sm: 'p-5',
      md: 'p-6 md:p-7',
      lg: 'p-7 md:p-9',
    },
    hover: {
      true: 'hover:-translate-y-[3px]',
    },
  },
  defaultVariants: {
    variant: 'default',
    padding: 'md',
  },
});

export type CardVariants = VariantProps<typeof cardVariants>;
