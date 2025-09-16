import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PaginaNonTrovataComponent } from './_pagine/pagina-non-trovata/pagina-non-trovata.component';

const routes: Routes = [
  { path: '', loadChildren: () => import('./_pagine/homepage/homepage.module').then(m => m.HomepageModule) },
  { path: 'homepage', loadChildren: () => import('./_pagine/homepage/homepage.module').then(m => m.HomepageModule) },
  { path: 'pokedex', loadChildren: () => import('./_pagine/pokedex/pokedex.module').then(m => m.PokedexModule) },                                   
  { path: 'pokedex/:pokemon', loadChildren: () => import('./_pagine/dettaglio/dettaglio.module').then(m => m.DettaglioModule) },
  { path: 'quiz', loadChildren: () => import('./_pagine/quiz/quiz.module').then(m => m.QuizModule) },
  { path: '**', component:PaginaNonTrovataComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { scrollPositionRestoration:'enabled', anchorScrolling:'enabled'})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
