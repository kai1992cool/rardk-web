import { Directive, ElementRef, Input, OnChanges } from '@angular/core';
import { Router } from '@angular/router';

// found here https://javascript.plainenglish.io/handle-css-and-links-in-dynamically-injected-html-using-angular-74c074ca2fd7
@Directive({
    selector: '[html]',
    standalone: true,
})
export class HtmlDirective implements OnChanges {
  private _uniqueId: string;

  @Input()
  public html: string;

  constructor(private _elementRef: ElementRef, private _router: Router) {}

  public ngOnChanges(): void {
    if (this.html) {
      this._uniqueId ||= [...this._elementRef.nativeElement.attributes].find(
        (attr) => attr.name.startsWith('_ngcontent-')
      ).name;

      this._elementRef.nativeElement.innerHTML = this.html;

      const descandants = this._elementRef.nativeElement.querySelectorAll('*');

      for (const element of descandants) {
        element.setAttribute(this._uniqueId, '');

        if (element.tagName === 'A') {
          const href: string = element.href?.toLowerCase();

          if (href?.startsWith(location.origin.toLowerCase())) {
            element.addEventListener('click', (e: MouseEvent) => {
              this._router.navigate([href.substring(location.origin.length)]);
              e.preventDefault();
            });
          }
        }
      }
    } else {
      this._elementRef.nativeElement.innerHTML = null;
    }
  }
}
