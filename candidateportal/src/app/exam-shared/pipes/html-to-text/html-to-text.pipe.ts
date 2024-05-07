import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Pipe({
  name: 'htmlToText'
})
export class HtmlToTextPipe implements PipeTransform {
  transform(htmlString: string): string {
    let element= document.createElement('div') as HTMLDivElement
    element.innerHTML=htmlString;    
    return element.innerText
  }

}
