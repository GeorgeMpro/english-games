# TODO

## Now Active


### Navigation
- redirect kids or match words

### Name change

- change kids > vocabulary

### Dark Mode

- [ ] add dark mode toggle
- [ ] extract css classes to dark mode
- [ ] move to scss?
- [ ] use system settings to choose -dark or light mode
- [ ] dim the images and cards
  - can use the css filter:
  - do not use bright shadows! do not just invert the colors
    - more opacity - closer
  - do not use too heavy a font
- [ ] useful [link](https://css-tricks.com/a-complete-guide-to-dark-mode-on-the-web/?utm_source=chatgpt.com#aa-handling-user-agent-styles)
- [ ] [link](https://css-tricks.com/dark-mode-and-variable-fonts/)
- [ ] [link](https://css-tricks.com/understanding-web-accessibility-color-contrast-guidelines-and-ratios/)

Flow:

- need to save preference local storage
- get system preference
- able to change preference
-

### Connecting to backend

Need Authentication:

- display My Collection
- if not enough Word On Study - add from new words

### Testing & Cleanup

- extract helper methods
- use [harness](https://angular.dev/guide/testing/component-harnesses-overview) for testing components logic
  - for end game modal
  - match game component
  - reusable game cards
- add docs
- testing
  - services in spec files
  - components ( render, clicks, etc)
- Centralize message service
  - enum
  - extract message out of logical service
- handle error
  - logical
  - network
  - backend
  - connectivity

### Error Handling

- when offline but has items shows error message - cannot get items - clean this up
  - disable/don't display
- interceptor - central error handling
  - error message component?
  - error for modal and error in general by context
- backend error
- server error
- error message service
  - https://angular.dev/guide/testing/components-scenarios#async-test-with-fakeasync
  - https://angular.dev/guide/testing/components-scenarios#async-observable-helpers (for async error observable)

# Phase 2

## General

- Use directives for dynamic styling
  - card animation and selection
  - modal opening and confetti
- Use directives for iframe (above feature)
- extract card match/select/ to directive class

## Design

- confetti
  - [canvas confetti or make it you own](https://www.kirilv.com/canvas-confetti/)
- stage pass
  - add animation on stage pass - [link](https://material.angular.dev/components/progress-bar/overview)
  - ? display progress bar on x out of y

## Mobile

Create a mobile directive

- notice screen size
- transform card scale
- vertical/ horizontal mode
- extract css class?

- add mobile screen stages - no scrolling down
- add different display for mobile device screen  (detect view)

## Uncategorized

- interceptors?
- Accessibility
  - ? ARIA
  - ? add keyboard navigation
- ? text to speech
  - slow mode
  - mute
- ?Light/Dark Theme

# Testing Methods From Official Documentation

- [ ] [test routing](https://angular.dev/guide/testing/components-scenarios#routing-component)
- [test component when hosted](https://angular.dev/guide/testing/components-scenarios#component-inside-a-test-host)
- [test nested components](https://angular.dev/guide/testing/components-scenarios#nested-component-tests)
- [test router link wired correctly](https://angular.dev/guide/testing/components-scenarios#bydirective-and-injected-directives)
- [test using a page object](https://angular.dev/guide/testing/components-scenarios#use-a-page-object)
- [test using overridden providers](https://angular.dev/guide/testing/components-scenarios#override-component-providers)
