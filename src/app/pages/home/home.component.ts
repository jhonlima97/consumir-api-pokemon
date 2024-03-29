import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Pokemon } from '../../interfaces/pokemons.interaface';
import { PokemonService } from '../../services/pokemon.service';
import { HttpClientModule } from '@angular/common/http';
import { ImgSecurityPipe } from '../../pipes/img-security.pipe';
import { mergeMap,map, toArray } from 'rxjs/operators';
import { of } from 'rxjs';


@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  providers: [PokemonService, HttpClientModule],
  imports: [CommonModule, ImgSecurityPipe]
})

export class HomeComponent implements OnInit{
  
  pokemons: Pokemon[] = [];
  adelante = 0;
  atras = 0;
  btnActive = true;

  // Crea un objeto para almacenar las imágenes que ya has cargado
  private pokemonImages: { [name: string]: string } = {};

  constructor(
    private _Router: Router,
    private _PokemonService: PokemonService
    ){

      this._PokemonService.getPokemons().pipe(
        mergeMap(pokemons => pokemons),
        mergeMap(pokemon => this._PokemonService.getPokemonDetail(pokemon.name).pipe(
          map(details => {
            const imgPokemon = details.sprites.other?.['official-artwork'].front_default;
            if (typeof imgPokemon === 'string') {
              // Almacena la imagen en el objeto pokemonImages para que puedas reutilizarla más tarde
              this.pokemonImages[pokemon.name] = imgPokemon;
              pokemon.imgPokemon = imgPokemon;
              console.log("Name pokemon: ", pokemon.name);
              console.log("Image pokemon: ", pokemon.imgPokemon);
            }
            return pokemon;
          })
        )),
        toArray()
      ).subscribe(pokemons => {
        this.pokemons = pokemons;
      }); 
  }

  ngOnInit(): void {
    localStorage.removeItem('Valor');
    this._PokemonService.getPokemons().subscribe(res=>{
      this.pokemons=res;
    })
  }

  onclickPokemon(name:string){
    this._PokemonService.getPokemonDetail(name).subscribe(pokemon=>{
    this._Router.navigate(['/pokemon', pokemon.name])
    })
  }

  paginarNext(){
  this.adelante=20
  this._PokemonService.getPaginacionNext(this.adelante).subscribe(pokemons => {
    // Solo obtén los detalles de los primeros Pokémon que se mostrarán
    const pokemonsToLoad = pokemons.slice(0, this.adelante);
    pokemonsToLoad.forEach(pokemon => {
      if (this.pokemonImages[pokemon.name]) {
        pokemon.imgPokemon = this.pokemonImages[pokemon.name];
      } else {
        this._PokemonService.getPokemonDetail(pokemon.name).subscribe(details => {
          const imgPokemon = details.sprites.other?.['official-artwork'].front_default;
          if (typeof imgPokemon === 'string') {
            // Almacena la imagen en el objeto pokemonImages para que puedas reutilizarla más tarde
            this.pokemonImages[pokemon.name] = imgPokemon;
            pokemon.imgPokemon = imgPokemon;
          }
        });
      }
    });
    this.pokemons = pokemons;
  });

  localStorage.removeItem('Valor');   
  this.btnActive=false;
  }

  paginarPrevious(){
    this.atras= 20;
    this._PokemonService.getPaginacionPrevious(this.atras).pipe(
      mergeMap(pokemons => pokemons),
      mergeMap(pokemon => {
        // Si ya has cargado la imagen de este Pokémon, no necesitas volver a cargarla
        if (this.pokemonImages[pokemon.name]) {
          pokemon.imgPokemon = this.pokemonImages[pokemon.name];
          return of(pokemon);
        }
    
        // Si no has cargado la imagen de este Pokémon, haz una solicitud para obtenerla
        return this._PokemonService.getPokemonDetail(pokemon.name).pipe(
          map(details => {
            const imgPokemon = details.sprites.other?.['official-artwork'].front_default;
            if (typeof imgPokemon === 'string') {
              // Almacena la imagen en el objeto pokemonImages para que puedas reutilizarla más tarde
              this.pokemonImages[pokemon.name] = imgPokemon;
              pokemon.imgPokemon = imgPokemon;
            }
            return pokemon;
          })
        );
      }),
      toArray()
    ).subscribe(pokemons => {
      this.pokemons = pokemons;
      if (localStorage.getItem('Valor')==='detener') {
        this.btnActive=true;
      }
    });
  }
  

}
