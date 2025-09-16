import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { provideHttpClient } from '@angular/common/http';
import { ToolbarComponent } from './_componenti/toolbar/toolbar.component';
import { FooterComponent } from './_componenti/footer/footer.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { UikitModule } from "./_condivisi/uikit/uikit.module";
import { PaginaNonTrovataComponent } from './_pagine/pagina-non-trovata/pagina-non-trovata.component';

@NgModule({
  declarations: [
    AppComponent,
    ToolbarComponent,
    FooterComponent,
    PaginaNonTrovataComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    UikitModule
],
  providers: [provideHttpClient(),
  provideAnimationsAsync(),
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
