import {ComponentFixture} from '@angular/core/testing';

/**
 * Retrieves a DOM element within the component's template using the `data-testid` attribute.
 *
 * @param fixture - The `ComponentFixture` of the component under test.
 * @param dataTestId - The value of the `data-testid` attribute to query.
 * @returns The DOM element matching the `data-testid` or `null` if not found.
 *
 * @example
 * // Example usage in a test:
 * const button = getElementByDataTestId(fixture, 'submit-button');
 * expect(button).not.toBeNull();
 */
export function getElementByDataTestId<T extends HTMLElement>(
  fixture: ComponentFixture<any>,
  dataTestId: string
): T;
export function getElementByDataTestId(fixture: ComponentFixture<any>, dataTestId: string) {
  return fixture.nativeElement.querySelector(`[data-testid=${dataTestId}]`)!;
}

// todo doc
export function getQuerySelectorAll(
  fixture: ComponentFixture<any>,
  dataTestId: string): HTMLElement[] {
  return fixture.nativeElement.querySelectorAll(`[data-testid=${dataTestId}]`);
}

/**
 * Verifies that clicking a DOM element with a specific `data-testid`
 * triggers a method call on the given target object.
 *
 * This utility simplifies testing interactions by combining element selection,
 * event simulation, and method spying into a single function.
 *
 * @template T - The component type
 * @param fixture - The `ComponentFixture` of the component under test.
 * @param testId - The `data-testid` attribute used to locate the element.
 * @param spyTarget - The object containing the method to spy on (e.g., component or service).
 * @param methodName - The name of the method to spy on (can be private or public).
 *
 * @example
 * // Example usage in a test:
 * it('should call onSubmit when the submit button is clicked', () => {
 *   expectClickCallsMethod(fixture, 'submit-button', component, 'onSubmit');
 * });
 */
export function expectClickCallsMethod<T>(
  fixture: ComponentFixture<T>,
  testId: string,
  spyTarget: T | object,
  methodName: keyof T | string
): void {
  const button = getElementByDataTestId(fixture, testId);
  expect(button).not.toBeNull();

  const spy = spyOn(spyTarget as any, methodName as any);
  button.click();

  expect(spy).toHaveBeenCalled();
}

// todo doc
export function simulateButtonClick(fixture: ComponentFixture<any>, dataTestId: string) {
  const replayButton = getElementByDataTestId(fixture, dataTestId);
  expect(replayButton).not.toBeNull();
  replayButton.click();
}
