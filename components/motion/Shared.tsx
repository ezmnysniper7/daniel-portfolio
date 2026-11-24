import * as React from 'react';

type ViewTransitionProps = { name: string; children: React.ReactNode };

// React ships <ViewTransition> in the build Next.js uses; the installed type package does not know it yet.
const ViewTransition = (React as unknown as { ViewTransition?: React.ComponentType<ViewTransitionProps> }).ViewTransition;

/**
 * Marks an element that exists on two pages (a card's picture and the case study's header picture).
 * Browsers with the View Transitions API move it from one place to the other on navigation; the rest just navigate.
 */
export function Shared({ name, children }: ViewTransitionProps) {
  return ViewTransition ? <ViewTransition name={name}>{children}</ViewTransition> : <>{children}</>;
}
