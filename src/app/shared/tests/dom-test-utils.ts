import {ComponentFixture} from '@angular/core/testing';
import {TestbedHarnessEnvironment} from '@angular/cdk/testing/testbed';
import {MatChipOptionHarness} from '@angular/material/chips/testing';
import {MatchWordsGameComponent} from '../../age-category/kids/match-words-game/match-words-game.component';
import {CategoryChooserModalComponent} from '../components/category-chooser-modal/category-chooser-modal.component';
import {By} from '@angular/platform-browser';

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

export async function triggerNewGameWithSelectedCategories(
  fixture: ComponentFixture<MatchWordsGameComponent>,
  ancestorTestId: string) {
  // set available categories
  const modalInstance = setupOpenChosenCategoryModal(fixture);

  modalInstance.availableCategories = ['Animals', 'Colors'];
  fixture.detectChanges();

  await toggleAllChips(fixture, ancestorTestId);

  const spy = spyOn(fixture.componentInstance, 'onNewGameWithCategories').and.callThrough();
  clickButtonByTestId(fixture, 'new-categories-game-button');

  return {modalInstance, spy};
}

async function toggleAllChips(fixture: ComponentFixture<any>, ancestorTestId: string) {
  const loader = TestbedHarnessEnvironment.documentRootLoader(fixture);
  const chips = await loader.getAllHarnesses(
    MatChipOptionHarness.with({ancestor: `[data-testid="${ancestorTestId}"]`})
  );
  for (const chip of chips) {
    await chip.toggle();
  }
}

export function clickButtonByTestId(
  fixture: ComponentFixture<MatchWordsGameComponent>,
  btnTestId: string,
  expectEnabled: boolean = false) {
  const btn = getElementByDataTestId(fixture, btnTestId) as HTMLButtonElement;
  if (expectEnabled) {
    expect(btn.disabled).toBeFalse();
  }

  btn.click();
}

export function setupOpenChosenCategoryModal(fixture: ComponentFixture<MatchWordsGameComponent>): CategoryChooserModalComponent {
  fixture.componentInstance.onChooseCategory();
  fixture.detectChanges();

  return fixture.debugElement
    .query(By.directive(CategoryChooserModalComponent))
    .componentInstance as CategoryChooserModalComponent;
}
