import {Directive} from '@angular/core';

@Directive({
  selector: '[iframeMode]',
  standalone: true,
})
export class IframeModeDirective {
  // todo
  //  Notice: if not adding iframe-mode class - change to service
  static isEmbedded(): boolean {
    const {self, top} = this.getContext();
    return self !== top;
  };

  private static getContext():
    { self: any, top: any } {
    return {
      self: window.self,
      top: window.top,
    };
  }
}
