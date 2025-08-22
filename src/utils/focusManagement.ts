// Focus Management Utilities
// This helps fix mouse focus issues across the system

export class FocusManager {
  private static instance: FocusManager;
  private focusedElement: HTMLElement | null = null;
  private isKeyboardUser = false;

  private constructor() {
    this.initializeKeyboardDetection();
    this.initializeFocusTrapping();
  }

  public static getInstance(): FocusManager {
    if (!FocusManager.instance) {
      FocusManager.instance = new FocusManager();
    }
    return FocusManager.instance;
  }

  private initializeKeyboardDetection() {
    // Track if user is using keyboard
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Tab' || e.key === 'ArrowUp' || e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') {
        this.isKeyboardUser = true;
        document.body.classList.add('keyboard-user');
      }
    });

    // Reset on mouse interaction
    document.addEventListener('mousedown', () => {
      this.isKeyboardUser = false;
      document.body.classList.remove('keyboard-user');
    });
  }

  private initializeFocusTrapping() {
    // Track currently focused element
    document.addEventListener('focusin', (e) => {
      this.focusedElement = e.target as HTMLElement;
    });

    // Handle lost focus
    document.addEventListener('focusout', (e) => {
      // Small delay to check if focus moved to another element
      setTimeout(() => {
        if (document.activeElement === document.body || !document.activeElement) {
          this.restoreFocus();
        }
      }, 10);
    });
  }

  public saveFocus(element: HTMLElement) {
    this.focusedElement = element;
  }

  public restoreFocus() {
    if (this.focusedElement && document.contains(this.focusedElement)) {
      try {
        this.focusedElement.focus();
      } catch (error) {
        console.warn('Could not restore focus:', error);
        this.focusFirstFocusableElement();
      }
    } else {
      this.focusFirstFocusableElement();
    }
  }

  private focusFirstFocusableElement() {
    const focusableElements = this.getFocusableElements();
    if (focusableElements.length > 0) {
      focusableElements[0].focus();
    }
  }

  public getFocusableElements(container: HTMLElement = document.body): HTMLElement[] {
    const focusableSelectors = [
      'button:not([disabled]):not([aria-hidden="true"])',
      'input:not([disabled]):not([type="hidden"]):not([aria-hidden="true"])',
      'select:not([disabled]):not([aria-hidden="true"])',
      'textarea:not([disabled]):not([aria-hidden="true"])',
      'a[href]:not([aria-hidden="true"])',
      '[tabindex]:not([tabindex="-1"]):not([aria-hidden="true"])',
      '[role="button"]:not([disabled]):not([aria-hidden="true"])',
      '[role="menuitem"]:not([aria-hidden="true"])',
      '[role="option"]:not([aria-hidden="true"])'
    ].join(', ');

    return Array.from(container.querySelectorAll(focusableSelectors)) as HTMLElement[];
  }

  public trapFocus(container: HTMLElement) {
    const focusableElements = this.getFocusableElements(container);
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement?.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement?.focus();
          }
        }
      }
    };

    container.addEventListener('keydown', handleKeyDown);
    
    // Focus first element
    firstElement?.focus();

    // Return cleanup function
    return () => {
      container.removeEventListener('keydown', handleKeyDown);
    };
  }

  public isKeyboardNavigation(): boolean {
    return this.isKeyboardUser;
  }
}

// Initialize focus manager
export const focusManager = FocusManager.getInstance();

// Helper function to enhance focus for components
export const enhanceFocus = (element: HTMLElement) => {
  // Save focus when element receives focus
  element.addEventListener('focus', () => {
    focusManager.saveFocus(element);
  });

  // Ensure proper keyboard navigation
  element.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      if (element.tagName === 'BUTTON' || element.getAttribute('role') === 'button') {
        e.preventDefault();
        element.click();
      }
    }
  });
};

// Auto-enhance focus for all interactive elements
export const initializeFocusEnhancement = () => {
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (node.nodeType === Node.ELEMENT_NODE) {
          const element = node as HTMLElement;
          
          // Enhance focus for interactive elements
          const interactiveElements = focusManager.getFocusableElements(element);
          interactiveElements.forEach(enhanceFocus);
          
          // Also enhance the element itself if it's interactive
          if (element.matches('button, input, select, textarea, a[href], [tabindex], [role="button"]')) {
            enhanceFocus(element);
          }
        }
      });
    });
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });

  // Enhance existing elements
  const existingElements = focusManager.getFocusableElements();
  existingElements.forEach(enhanceFocus);
};