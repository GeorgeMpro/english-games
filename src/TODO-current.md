# TODO

## Error Handling

- when offline but has items shows error message - cannot get items - clean this up
  - disable/don't display
- central error handling
- backend error
- server error
- error message service
  - https://angular.dev/guide/testing/components-scenarios#async-test-with-fakeasync
  - https://angular.dev/guide/testing/components-scenarios#async-observable-helpers (for async error observable)

## Testing & Cleanup

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

### Testing Methods From Official Documentation

- [test routing](https://angular.dev/guide/testing/components-scenarios#routing-component)
- [test component when hosted](https://angular.dev/guide/testing/components-scenarios#component-inside-a-test-host)
- [test nested components](https://angular.dev/guide/testing/components-scenarios#nested-component-tests)
- [test router link wired correctly](https://angular.dev/guide/testing/components-scenarios#bydirective-and-injected-directives)
- [test using a page object](https://angular.dev/guide/testing/components-scenarios#use-a-page-object)
- [test using overridden providers](https://angular.dev/guide/testing/components-scenarios#override-component-providers)

## General

### mobile

Create a mobile directive

- notice screen size
- transform card scale
- vertical/ horizontal mode
- extract css class?

### Design / Style

- Use directives for dynamic styling
  - card animation and selection
  - modal opening and confetti
  - light and dark mode
- Use directives for iframe (above feature)
- confetti
  - [canvas confetti or make it you own](https://www.kirilv.com/canvas-confetti/)
- extract card match/select/ to directive class
- ? use ["chips"](https://material.angular.dev/components/chips/examples) for selecting multiple categories for the game.

## Features

### SeeGuru

- Access category button
  - display read categories from seeguru
  - display My Collection
- display My Collection
  - if not enough Word On Study - add from new words
- add a "mix" words from categories option
  - mix all categories
  - mix selected categories

### Phase 2

- stage pass
  - add animation on stage pass
  - ? display progress bar on x out of y
- interceptors?
- Accessibility
  - ? ARIA
  - ? add keyboard navigation
- Mobile
  - add mobile screen stages - no scrolling down
  - add different display for mobile device screen  (detect view)
- ? add dark mode
- ? text to speech
  - slow mode
  - mute
- light/ dark theme
