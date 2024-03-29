import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Skills } from '../../interfaces/skills.interface';
import { Pokemon } from '../../interfaces/pokemons.interaface';
import { PokemonService } from '../../services/pokemon.service';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ImgSecurityPipe } from "../../pipes/img-security.pipe";
import { catchError, forkJoin, of } from 'rxjs';

@Component({
    selector: 'app-search',
    standalone: true,
    templateUrl: './search.component.html',
    styleUrl: './search.component.css',
    providers: [PokemonService, HttpClientModule],
    imports: [RouterModule,CommonModule, ImgSecurityPipe]
})

export class SearchComponent implements OnInit {

  pokemons: Pokemon[] = [];

  namePokemon: string = '';
  imgPokemon: any;
  skills: any;
  descripcion: any;
  especie?: Skills;
  noExiste = false;
  txtSearch='';
  imgAnimated:any;

  constructor(
    private _Router: Router,
    private _activatedRoute: ActivatedRoute,
    private _PokemonService: PokemonService
  ){
    this._activatedRoute.params.subscribe(params=>{
      this.noExiste = false;
      this.txtSearch = params['texto'];

    // Obtengo los pokemones segun parametro ingresado
      this._PokemonService.getSearchPokemon(this.txtSearch).subscribe((pokemons: Pokemon[]) => {
        if (pokemons.length > 0) {
          forkJoin(
            pokemons.map(pokemon =>
              this._PokemonService.getPokemonDetail(pokemon.name).pipe(catchError(error => {
                if (error.status === 404) {
                  // No hacemos nada si el Pokémon no se encuentra
                  return of(null);
                } else {
                  // Si es otro tipo de error, lo lanzamos para manejarlo en otro lugar
                  throw error;
                }
              }))
            )
          ).subscribe(detailsArray => {
            this.pokemons = detailsArray.map((details, index) => {
              if (details && details.sprites && details.sprites.other) {
                console.log("name: ", details.name);
                return {
                  ...pokemons[index],
                  imgPokemon: details.sprites.other['official-artwork'].front_default,
                  name: details.name
                };
              } else {
                return pokemons[index];
              }
            });
          });
        } else {
          this.noExiste = true;
        }
      });
      
      // Obtengo un solo pokemon de acuerdo a su name exacto
      this._PokemonService.getPokemonDetail(this.txtSearch).subscribe({
        next: (pokemon) => {

          this.imgAnimated= pokemon.sprites.versions?.['generation-v']['black-white'].animated?.front_default;  
          this.imgPokemon = pokemon.sprites.other?.['official-artwork'].front_default;
          this.namePokemon = pokemon.name;
          this.skills = pokemon.species;
    
          this._PokemonService.getSkills(this.skills.url).subscribe((res: Skills) => {
  
          for (let i = 0; i < res.genera.length; i++) {
            const element1 = res.genera[i];
            if (element1.language.name == 'es') {
              this.especie= element1.genus;            
               
             }
           }
  
            for (let i = 0; i < res.flavor_text_entries.length; i++) {
              const element = res.flavor_text_entries[i];
  
              if (element.language.name == 'es') {
                this.descripcion = element.flavor_text  
              }  
            }
          })             
        },
        error: ()=>{
          this.noExiste = true
        }  
      })
    })
  }

  ngOnInit(): void {
    
  }

  onclickPokemon(name:string){
    this._PokemonService.getPokemonDetail(name).subscribe(pokemon=>{
    this._Router.navigate(['/pokemon', pokemon.name])
    })
  }
    
}

