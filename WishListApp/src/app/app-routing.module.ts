import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddItemFormComponent } from './add-item-form/add-item-form.component';
import { HomePageComponent } from './home-page/home-page.component';
import { AuthGuard } from './shared/guards/auth.guard';
import { SignInComponent } from './sign-in/sign-in.component'
import { SignUpComponent } from './sign-up/sign-up.component'


const routes: Routes = [

  { path: 'sign-in', component: SignInComponent},
  { path: 'sign-up', component: SignUpComponent},
  { path: 'addItem', component: AddItemFormComponent, canActivate: [AuthGuard]},
  { path: 'home', component: HomePageComponent, canActivate: [AuthGuard]},
  { path: '', redirectTo: 'sign-in', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
