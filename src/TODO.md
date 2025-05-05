# Shared

- add component-less route (guard) for progress/login
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

## Gameplay

- limit the number of active tiles > when done with them move to next ones
  - ? 6 cards at a time
  - ? 3 stages
    - display x out of 3 so they know the state
- Add more Animals
- Add more categories - colors, food, numbers
- Add Reset button
- Manage the progress of the current game - how many correct, how many wrong matches
  - give some sort of feedback—stars? x out of y?
- ? a floating helper that says (once?) what you have to do in the game

## Display

- Center the image around the object so no parts are cut off

- transition between the different stages
  - finish existing cards and go to the next batch
- turn completed words

# Match Sounds

## Gameplay

### Plan

Press to hear a sound. Choose the correct word that the sound made.

## Display
