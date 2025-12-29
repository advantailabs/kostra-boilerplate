// Tremor Raw TabNavigation [v0.0.1]

import * as NavigationMenuPrimitives from '@radix-ui/react-navigation-menu';
import React, { JSX } from 'react';

import { cx, focusRing } from '@/lib/utils';

function getSubtree(
  options: { asChild: boolean | undefined; children: React.ReactNode },
  content: React.ReactNode | ((_children: React.ReactNode) => React.ReactNode)
) {
  const { asChild, children } = options;
  if (!asChild) return typeof content === 'function' ? content(children) : content;

  const firstChild = React.Children.only(children) as unknown as JSX.Element;
  return React.cloneElement(firstChild, {
    children: typeof content === 'function' ? content(firstChild.props.children) : content,
  });
}

const TabNavigation = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitives.Root>,
  Omit<
    React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitives.Root>,
    'orientation' | 'defaultValue' | 'dir'
  >
>(({ className, children, ...props }, forwardedRef) => (
  <NavigationMenuPrimitives.Root ref={forwardedRef} {...props} asChild={false}>
    <NavigationMenuPrimitives.List
      className={cx(
        // base
        'flex items-center justify-start whitespace-nowrap border-b [scrollbar-width:none] [&::-webkit-scrollbar]:hidden',
        // border color
        'border-border',
        className
      )}
    >
      {children}
    </NavigationMenuPrimitives.List>
  </NavigationMenuPrimitives.Root>
));

TabNavigation.displayName = 'TabNavigation';

const TabNavigationLink = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitives.Link>,
  Omit<React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitives.Link>, 'onSelect'> & {
    disabled?: boolean;
  }
>(({ asChild, disabled, className, children, ...props }, forwardedRef) => (
  <NavigationMenuPrimitives.Item className="flex" aria-disabled={disabled}>
    <NavigationMenuPrimitives.Link
      aria-disabled={disabled}
      className={cx(
        'group relative flex shrink-0 select-none items-center justify-center',
        disabled ? 'pointer-events-none' : ''
      )}
      ref={forwardedRef}
      onSelect={() => { }}
      asChild={asChild}
      {...props}
    >
      {getSubtree({ asChild, children }, children => (
        <span
          className={cx(
            // base
            '-mb-px flex items-center justify-center whitespace-nowrap border-b-2 border-transparent px-3 pb-2 text-sm font-medium transition-all',
            // text color
            'text-text-muted',
            // hover
            'group-hover:text-text',
            // border hover
            'group-hover:border-border',
            // selected
            'group-data-[active]:border-primary group-data-[active]:text-primary',
            // disabled
            disabled ? 'pointer-events-none text-text-muted' : '',
            focusRing,
            className
          )}
        >
          {children}
        </span>
      ))}
    </NavigationMenuPrimitives.Link>
  </NavigationMenuPrimitives.Item>
));

TabNavigationLink.displayName = 'TabNavigationLink';

export { TabNavigation, TabNavigationLink };
