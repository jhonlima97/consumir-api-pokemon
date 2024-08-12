import { Component, OnInit } from '@angular/core';
import { Skills } from '../../interfaces/skills.interface';
import { PokemonService } from '../../services/pokemon.service';
import { ImgSecurityPipe } from "../../pipes/img-security.pipe";
import { ActivatedRoute } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-pokemon',
    standalone: true,
    templateUrl: './pokemon.component.html',
    providers: [PokemonService, HttpClientModule],
    imports: [CommonModule, ImgSecurityPipe]
})

export class PokemonComponent implements OnInit {
  namePokemon: string='';
  imgPokemon:any;
  skills:any;
  descripcion: any;
  especie?: Skills;
  noExiste=false;
  imgAnimated:any;
  
  constructor(
    private _PokemonService:PokemonService, 
    private _activatedRoute: ActivatedRoute) { 

    const {name}=this._activatedRoute.snapshot.params;
    
    this._PokemonService.getPokemonDetail(name).subscribe(pokemon =>{

    this.imgAnimated = pokemon.sprites.versions?.['generation-v']['black-white'].animated?.front_default;
    console.log(this.imgAnimated)
    // Obtenemos la imagen de cada Pokemon
    this.imgPokemon =pokemon.sprites.other?.['official-artwork'].front_default;
    // Obtenemos el name de cada Pokemon  
    this.namePokemon = pokemon.name;
    // Obtenemos la especie de cada Pokemon  
    this.skills= pokemon.species;
  
    this._PokemonService.getSkills(this.skills.url).subscribe((res:Skills)=>{
      //this.especie= res.genera[5].genus;          
      for (let i = 0; i < res.genera.length; i++) {
        const element1 = res.genera[i];
        if (element1.language.name == 'es') {
          
          this.especie= element1.genus;            
          
        }
      }
    
      console.log(res);
      for (let i = 0; i < res.flavor_text_entries.length; i++) {
        const element2 = res.flavor_text_entries[i];
                    
        if (element2.language.name == 'es') {
          this.descripcion = element2.flavor_text
        }
        
        
      }

    })

    })

  }

  ngOnInit(): void {
  }

}
