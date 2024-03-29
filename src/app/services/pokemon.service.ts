import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EMPTY, Observable, forkJoin, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { Skills } from '../interfaces/skills.interface';
import { PokemonDetails } from '../interfaces/pokemon.interface';
import { Pokemon, PokemonsResponse } from '../interfaces/pokemons.interaface';
import { EMPTY_OBSERVER } from 'rxjs/internal/Subscriber';


@Injectable({
  providedIn: 'root'
})

export class PokemonService {

  private baseURL: string = 'https://pokeapi.co/api/v2';
  private limitPage = 20;
  public offsetPage = 0;
  
  constructor(private http:HttpClient) { }

  get params() {
    return {
      limit:this.limitPage,
      offset:this.offsetPage
    }
  }

  // Lista todos mis pokemones
  getPokemons():Observable<Pokemon[]>{
    return this.http.get<PokemonsResponse>(`${this.baseURL}/pokemon`,{params:this.params}).pipe(
    map(res=>res.results)
   )
  }

  // Lista los primeros 20 pokemones
  // getPokemons(limit: number = 20): Observable<Pokemon[]> {
  //   return this.http.get<PokemonsResponse>(`${this.baseURL}/pokemon?limit=${limit}`).pipe(
  //     map(res => res.results)
  //   );
  // }

  //Busqueda por cadena de texto
  getSearchPokemon(texto: string): Observable<Pokemon[]> {
    return this.http.get<{results: Pokemon[]}>(`${this.baseURL}/pokemon?limit=20`)
      .pipe(
        map(response => response.results.filter(pokemon => pokemon.name.includes(texto.toLowerCase())))
      );
  }
    
  //Busqueda por nombre exacto
  getPokemonDetail(name:string):Observable<PokemonDetails>{
    return this.http.get<PokemonDetails>(`${this.baseURL}/pokemon/${name}`);
  }

  getSkills(url: string):Observable<Skills>{
    return this.http.get<Skills>(`${url}`);

  }

  getPaginacionNext(adelante:number){
    this.offsetPage = this.offsetPage + adelante    
    console.log(this.offsetPage);
    return this.http.get<PokemonsResponse>(`https://pokeapi.co/api/v2/pokemon?limit=20&offset=${this.offsetPage}`).pipe(
    map(res=>res.results)
   )
  }

  getPaginacionPrevious(atras:number){
    this.offsetPage= this.offsetPage - atras;
    console.log(this.offsetPage);

    if (this.offsetPage === 0  ) {
      localStorage.setItem('Valor','detener');
      
    }
    
    return this.http.get<PokemonsResponse>(`https://pokeapi.co/api/v2/pokemon?limit=20&offset=${this.offsetPage}`).pipe(
    map(res=>res.results)
   )  
  }

}
