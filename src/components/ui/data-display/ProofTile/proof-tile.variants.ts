import { cva, type VariantProps } from 'class-variance-authority';

export const proofTileVariants = cva(
  [
    'bg-card rounded-[22px] flex flex-col items-start text-start',
    'border-[1.5px] border-border',
    'transition-transform duration-300',
    'hover:-translate-y-[3px]',
    'h-full',
  ],
  {
    variants: {
      size: {
        /** Compact proof tile: icon and a single bold line, vertically centered */
        sm: 'p-5 gap-2 justify-center',
        /** Feature tile: icon (or number), title, and a short description */
        md: 'p-6 gap-3',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  }
);

export type ProofTileVariants = VariantProps<typeof proofTileVariants>;
