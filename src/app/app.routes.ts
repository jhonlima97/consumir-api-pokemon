import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { PokemonComponent } from './pages/pokemon/pokemon.component';
import { SearchComponent } from './pages/search/search.component';

export const routes: Routes = [
    {path:'home', component: HomeComponent},
    {path:'pokemon/:name', component: PokemonComponent},
    {path:'search/:texto', component: SearchComponent},
  
    {path:'', pathMatch:'full', redirectTo:'/home'},
    {path:'**', pathMatch:'full', redirectTo:'/home'},

];