import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({
  name: 'imgSecurity',
  standalone: true
})
export class ImgSecurityPipe implements PipeTransform {

  constructor(private donSanitizer: DomSanitizer){
  }

  transform(url:string): any {
    return this.donSanitizer.bypassSecurityTrustResourceUrl(url);
  }
}
