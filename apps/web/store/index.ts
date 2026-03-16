/**
 * =============================================================================
 * BITGARD WEBSITE - REDUX STORE CONFIGURATION
 * =============================================================================
 * 
 * Centralized Redux store using Redux Toolkit. This store manages:
 * - UI state (modals, navigation, theme)
 * - Data cache (products, services, testimonials)
 * - Form state (contact form, newsletter)
 * 
 * We use RTK Query for API data fetching and caching, providing:
 * - Automatic caching and invalidation
 * - Loading/error states
 * - Optimistic updates
 * 
 * @author Bitgard Development Team
 * @version 1.0.0
 */

import { configureStore } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import uiReducer from "./slices/ui-slice";

// -----------------------------------------------------------------------------
// Store Configuration
// -----------------------------------------------------------------------------

/**
 * Configure the Redux store with all reducers and middleware
 * 
 * The store is configured with:
 * - UI slice for navigation, modals, and theme
 * - RTK Query API for data fetching (to be added)
 * - Redux DevTools integration (development only)
 */
export const store = configureStore({
    reducer: {
        // UI state management
        ui: uiReducer,

        // Add RTK Query API reducer here when implemented
        // [api.reducerPath]: api.reducer,
    },

    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            // Disable serializable check for complex objects if needed
            serializableCheck: {
                // Ignore these action types if using non-serializable data
                ignoredActions: [],
            },
        }),
    // Add RTK Query middleware here when implemented
    // .concat(api.middleware),

    // Enable Redux DevTools in development
    devTools: process.env.NODE_ENV !== "production",
});

// -----------------------------------------------------------------------------
// Type Definitions
// -----------------------------------------------------------------------------

/**
 * RootState - Inferred type of the entire Redux store state
 * Use this type when accessing state in selectors
 */
export type RootState = ReturnType<typeof store.getState>;

/**
 * AppDispatch - Type for the dispatch function
 * Use this type when dispatching actions
 */
export type AppDispatch = typeof store.dispatch;

// -----------------------------------------------------------------------------
// Typed Hooks
// -----------------------------------------------------------------------------

/**
 * useAppDispatch - Typed version of useDispatch
 * Use this instead of plain useDispatch for proper typing
 * 
 * @example
 * ```tsx
 * const dispatch = useAppDispatch();
 * dispatch(toggleMobileMenu());
 * ```
 */
export const useAppDispatch = () => useDispatch<AppDispatch>();

/**
 * useAppSelector - Typed version of useSelector
 * Use this instead of plain useSelector for proper typing
 * 
 * @example
 * ```tsx
 * const isMobileMenuOpen = useAppSelector((state) => state.ui.isMobileMenuOpen);
 * ```
 */
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export default store;
