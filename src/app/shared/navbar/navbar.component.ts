import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { ImgSecurityPipe } from '../../pipes/img-security.pipe';

@Component({
  selector: 'app-navbar',
  standalone: true,
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
  providers: [HttpClientModule],
  imports: [CommonModule, ImgSecurityPipe, RouterModule]
})
export class NavbarComponent implements OnInit {

  @ViewChild('txtSearch') searchInput!:ElementRef

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  regresar(){
    location.href = 'home';
  }

  search(texto:string){
    console.log(texto);
    texto = texto.trim();
    if (texto.length === 0) {
      return;
    }else{

    this.router.navigate(['search', texto]);
    this.searchInput.nativeElement.value = '';
    
    }
  }

}
