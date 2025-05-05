# Shared

- **MVP Logging Interceptor Plan**
  - Create `logging.interceptor.ts` in `src/app/shared/interceptors/`
  - Implement `HttpInterceptor` to:
    - Log HTTP requests and responses
    - Log errors
    - Log debug messages (use a LoggingService)
  - Use Angular `environment` to enable console logging only in development
  - Register the interceptor in `AppModule` providers
- **Centralize message component and service for all messages**
  - perhaps toast messages
    — Add a README file inside the match-words-game directory to document the purpose of the module and its key components, especially useful for onboarding new developers.
  - perhaps angular material: https://material.angular.dev/components/snack-bar/overview

- add a component-less route (guard) for progress/login
  - on the route:
    `canActivateChild: [ProgressGuard],
    children: [...`
  - how the guard decides:

  `canActivateChild(route: ActivatedRouteSnapshot): boolean {
  const free = ['match-words'];
  if (free.includes(route.routeConfig?.path)) return true;
  return this.hasUnlocked(route.routeConfig?.path); // your logic
}`
- extract components
- extract css/ animations/ etc

# Match Words

## General

- Move to a single page without surrounding games

## Gameplay

- Add more categories - colors, food, numbers
- ? a floating helper that says (once?) what you have to do in the game

## Display

- on mobile view, more stages? so the user doesn't have to scroll down?
- transition between the different stages
  - finish existing cards and go to the next batch
- turn completed word cards?

# Match Sounds

## Gameplay

### Plan

Press to hear a sound. Choose the correct word that the sound made.

## Display
