import { cva, type VariantProps } from 'class-variance-authority';

/**
 * v2 pill buttons. `primary` is the ink pill that turns blue on hover, as in
 * the v2 header and forms. Inside a dark section Button.astro swaps it to a
 * paper pill. The plain-CSS equivalents for new markup are `.ds-btn*` in
 * src/styles/ds.css; both are shown on /styleguide/.
 */
export const buttonVariants = cva(
  [
    'group',
    'inline-flex items-center justify-center gap-2.5',
    'font-semibold rounded-full whitespace-nowrap border-[1.5px]',
    'transition-[background-color,color,border-color,transform] duration-200 ease-out',
    'focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-ring',
    'disabled:pointer-events-none disabled:opacity-50',
    '[&_svg]:pointer-events-none [&_svg]:shrink-0',
  ],
  {
    variants: {
      variant: {
        primary:
          'btn-primary bg-ink border-ink text-white hover:bg-blue hover:border-blue active:scale-[0.98]',
        secondary:
          'bg-paper-2 border-paper-2 text-ink hover:bg-sand hover:border-sand active:scale-[0.98]',
        outline:
          'btn-outline bg-transparent border-ink text-ink hover:bg-ink hover:text-white active:scale-[0.98]',
        'brand-outline':
          'bg-transparent border-blue text-blue hover:bg-blue hover:text-white active:scale-[0.98]',
        ghost: 'border-transparent text-ink-2 hover:text-ink hover:bg-paper-2 active:scale-[0.98]',
        link: 'border-transparent rounded-none px-0 text-ink underline decoration-[1.5px] underline-offset-4 hover:text-blue',
        destructive:
          'bg-destructive border-destructive text-destructive-foreground hover:opacity-90 active:scale-[0.98]',
      },
      size: {
        sm: 'min-h-10 px-4 py-2 text-sm [&_svg]:h-4 [&_svg]:w-4',
        md: 'min-h-12 px-5 py-2.5 text-[15px] [&_svg]:h-[18px] [&_svg]:w-[18px]',
        lg: 'min-h-14 px-6 py-3 text-base [&_svg]:h-5 [&_svg]:w-5',
      },
      fullWidth: {
        true: 'w-full',
      },
      icon: {
        true: 'rounded-full',
      },
    },
    compoundVariants: [
      { icon: true, size: 'sm', class: 'h-10 w-10 px-0' },
      { icon: true, size: 'md', class: 'h-12 w-12 px-0' },
      { icon: true, size: 'lg', class: 'h-14 w-14 px-0' },
    ],
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
);

export type ButtonVariants = VariantProps<typeof buttonVariants>;
