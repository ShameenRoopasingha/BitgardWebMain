/**
 * =============================================================================
 * BITGARD WEBSITE - UI SLICE
 * =============================================================================
 * 
 * Redux slice for managing UI state across the application.
 * 
 * Manages:
 * - Mobile navigation state
 * - Modal visibility
 * - Active section (for scroll spy)
 * - Loading states
 * - Theme preferences
 * 
 * @author Bitgard Development Team
 * @version 1.0.0
 */

import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

/**
 * Modal types available in the application
 */
type ModalType = "contact" | "product-demo" | "newsletter" | null;

/**
 * Section IDs for scroll spy navigation
 */
type SectionId =
    | "hero"
    | "products"
    | "services"
    | "about"
    | "team"
    | "testimonials"
    | "contact";

/**
 * UI State interface
 */
interface UIState {
    /** Whether the mobile menu is open */
    isMobileMenuOpen: boolean;

    /** Currently active section (for scroll spy highlight) */
    activeSection: SectionId;

    /** Currently open modal, null if none */
    activeModal: ModalType;

    /** Global loading state */
    isLoading: boolean;

    /** Whether header should be transparent (hero section) */
    isHeaderTransparent: boolean;

    /** Whether the page has been scrolled */
    hasScrolled: boolean;
}

// -----------------------------------------------------------------------------
// Initial State
// -----------------------------------------------------------------------------

const initialState: UIState = {
    isMobileMenuOpen: false,
    activeSection: "hero",
    activeModal: null,
    isLoading: false,
    isHeaderTransparent: true,
    hasScrolled: false,
};

// -----------------------------------------------------------------------------
// Slice Definition
// -----------------------------------------------------------------------------

const uiSlice = createSlice({
    name: "ui",
    initialState,
    reducers: {
        /**
         * Toggle the mobile navigation menu
         */
        toggleMobileMenu: (state) => {
            state.isMobileMenuOpen = !state.isMobileMenuOpen;
        },

        /**
         * Close the mobile navigation menu
         */
        closeMobileMenu: (state) => {
            state.isMobileMenuOpen = false;
        },

        /**
         * Set the currently active section (for scroll spy)
         * @param action - Section ID to set as active
         */
        setActiveSection: (state, action: PayloadAction<SectionId>) => {
            state.activeSection = action.payload;

            // Update header transparency based on section
            state.isHeaderTransparent = action.payload === "hero";
        },

        /**
         * Open a modal by type
         * @param action - Modal type to open
         */
        openModal: (state, action: PayloadAction<ModalType>) => {
            state.activeModal = action.payload;

            // Close mobile menu when opening a modal
            state.isMobileMenuOpen = false;
        },

        /**
         * Close the currently active modal
         */
        closeModal: (state) => {
            state.activeModal = null;
        },

        /**
         * Set global loading state
         * @param action - Loading state boolean
         */
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.isLoading = action.payload;
        },

        /**
         * Update scroll state (for header styling)
         * @param action - Whether the page has been scrolled
         */
        setHasScrolled: (state, action: PayloadAction<boolean>) => {
            state.hasScrolled = action.payload;

            // If scrolled, header is no longer transparent
            if (action.payload) {
                state.isHeaderTransparent = false;
            }
        },

        /**
         * Reset UI state to initial values
         */
        resetUI: () => initialState,
    },
});

// -----------------------------------------------------------------------------
// Exports
// -----------------------------------------------------------------------------

// Export actions for dispatching
export const {
    toggleMobileMenu,
    closeMobileMenu,
    setActiveSection,
    openModal,
    closeModal,
    setLoading,
    setHasScrolled,
    resetUI,
} = uiSlice.actions;

// Export reducer for store configuration
export default uiSlice.reducer;

// Export types for use in components
export type { UIState, ModalType, SectionId };
