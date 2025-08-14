import {Component} from '@angular/core';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {By} from '@angular/platform-browser';
import {ModalCloseListenerDirective} from './modal-close-listener.directive';

@Component({
  standalone: true,
  imports: [ModalCloseListenerDirective],
  template: `
    <div
      appModalCloseListener
      (modalClose)="closed = true"
      data-testid="modal">
      <div data-testid="content">content</div>
    </div>
  `
})
class HostComponent {
  active = false;
  closed = false;
}

describe('ModalCloseListenerDirective', () => {
  let fixture: ComponentFixture<HostComponent>;
  let host: HostComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({imports: [HostComponent]}).compileComponents();
    fixture = TestBed.createComponent(HostComponent);
    host = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('emits when active and ESC pressed', () => {
    host.active = true;
    fixture.detectChanges();
    document.dispatchEvent(new KeyboardEvent('keydown', {key: 'Escape'}));
    fixture.detectChanges();
    expect(host.closed).toBeTrue();
  });

  it('does not emit when clicking inside', () => {
    host.active = true;
    fixture.detectChanges();
    const inside = fixture.debugElement.query(By.css('[data-testid="content"]')).nativeElement as HTMLElement;
    inside.dispatchEvent(new MouseEvent('mousedown', {bubbles: true}));
    fixture.detectChanges();
    expect(host.closed).toBeFalse();
  });

  it('emits when clicking outside', () => {
    host.active = true;
    fixture.detectChanges();
    document.dispatchEvent(new MouseEvent('mousedown', {bubbles: true}));
    fixture.detectChanges();
    expect(host.closed).toBeTrue();
  });
});
