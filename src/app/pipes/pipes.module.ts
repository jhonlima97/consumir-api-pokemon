import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImgSecurityPipe } from './img-security.pipe';


@NgModule({
  declarations: [],
  imports: [
    CommonModule, ImgSecurityPipe
  ],
  exports: [ImgSecurityPipe]
})
export class PipesModule { }
