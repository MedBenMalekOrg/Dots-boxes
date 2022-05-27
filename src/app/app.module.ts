import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {AppComponent} from './app.component';
import {BoxComponent} from './box/box.component';
import {ModalComponent} from './modal/modal.component';
import {ModalDirective} from './modal.directive';
import {initializeApp, provideFirebaseApp} from '@angular/fire/app';
import {environment} from '../environments/environment';
import {provideFirestore, getFirestore} from '@angular/fire/firestore';
import {RouterModule, Routes} from '@angular/router';
import {GameComponent} from './game/game.component';
import { HomeComponent } from './home/home.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { LogoComponent } from './logo/logo.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path: ':id',
    component: GameComponent
  }
]

@NgModule({
  declarations: [
    AppComponent,
    BoxComponent,
    ModalComponent,
    ModalDirective,
    GameComponent,
    HomeComponent,
    LogoComponent
  ],
  imports: [
    BrowserModule,
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideFirestore(() => getFirestore()),
    RouterModule.forRoot(routes),
    FormsModule,
    ReactiveFormsModule

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
