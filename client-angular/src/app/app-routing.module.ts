import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './authentication/guards/auth.guard';

// Components
import { HomeComponent } from './home/home.component';
//import { SigninComponent } from './authentication/signin/signin.component';
//import { SignupComponent } from './authentication/signup/signup.component';
//import { AuthGuard } from './authentication/guards/auth.guard';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'home' },
  { path: 'home', component: HomeComponent },
  { path: 'authentication', loadChildren: './authentication/authentication.module#AuthenticationModule', canActivate: [AuthGuard] }
  //{ path: 'signin', component: SigninComponent },
  //{ path: 'signup', component: SignupComponent },
  //{ path: 'furniture', loadChildren: './furniture/furniture.module#FurnitureModule', canActivate: [AuthGuard] },
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }