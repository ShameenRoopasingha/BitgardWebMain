/**
 * =============================================================================
 * BITGARD WEBSITE - REDUX PROVIDER
 * =============================================================================
 * 
 * Client-side Redux provider component for Next.js App Router.
 * This wrapper enables Redux state management throughout the application.
 * 
 * @author Bitgard Development Team
 * @version 1.0.0
 */

"use client";

import { Provider } from "react-redux";
import { store } from "@/store";
import { ReactNode } from "react";

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

interface ReduxProviderProps {
    /** Child components to wrap with Redux context */
    children: ReactNode;
}

// -----------------------------------------------------------------------------
// Redux Provider Component
// -----------------------------------------------------------------------------

/**
 * ReduxProvider - Wraps the application with Redux store context
 * 
 * This component must be a client component ("use client") because
 * Redux requires client-side JavaScript for state management.
 * 
 * @example
 * ```tsx
 * // In layout.tsx
 * <ReduxProvider>
 *   <App />
 * </ReduxProvider>
 * ```
 */
export function ReduxProvider({ children }: ReduxProviderProps) {
    return <Provider store={store}>{children}</Provider>;
}

export default ReduxProvider;
