/**
 * Scroll Utility Functions
 * Centralized scroll logic for consistent behavior across components
 */

export interface ScrollOptions {
    offset?: number;
    delay?: number;
    behavior?: ScrollBehavior;
}

const DEFAULT_OPTIONS: ScrollOptions = {
    offset: 0,
    delay: 0,
    behavior: 'smooth'
};

/**
 * Scroll to an element with optional offset and delay
 */
export const scrollToElement = (
    element: HTMLElement | null,
    options?: ScrollOptions
): void => {
    if (!element) return;

    const { offset, delay, behavior } = { ...DEFAULT_OPTIONS, ...options };

    const doScroll = () => {
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - (offset || 0);

        window.scrollTo({
            top: offsetPosition,
            behavior
        });
    };

    if (delay && delay > 0) {
        setTimeout(doScroll, delay);
    } else {
        doScroll();
    }
};

/**
 * Scroll to an element by its ID
 */
export const scrollToElementById = (
    id: string,
    options?: ScrollOptions
): void => {
    const element = document.getElementById(id);
    scrollToElement(element, options);
};

/**
 * Scroll to top of page
 */
export const scrollToTop = (options?: ScrollOptions): void => {
    const { behavior } = { ...DEFAULT_OPTIONS, ...options };
    window.scrollTo({ top: 0, behavior });
};
