import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from './navbar/navbar.component';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    FormsModule,
    NavbarComponent
  ],
  exports: [NavbarComponent]
})
export class SharedModule { }
