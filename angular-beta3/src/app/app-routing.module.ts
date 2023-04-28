import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './Components/login/login.component';
import { SignupComponent } from './Components/signup/signup.component';
import { EmployeesListComponent } from './Components/employees-list/employees-list.component';
import { AuthGuard } from './Guards/auth.guard';
import { AddEmployeeComponent } from './Components/add-employee/add-employee.component';
import { EditEmployeeComponent } from './Components/edit-employee/edit-employee.component';
import { ViewEmployeeComponent } from './Components/view-employee/view-employee.component';
import { CalendarComponent } from './Components/calendar/calendar.component';
import { ResetComponent } from './reset/reset.component';
import { ResetPasswordComponent } from './Components/reset-password/reset-password.component';

const routes: Routes = [
  {path: '', redirectTo:'signup', pathMatch:'full'},
  {path:'login', component: LoginComponent},
  {path:'signup', component: SignupComponent},
  {path:'employees', component: EmployeesListComponent},
  {path:'employees/add', component: AddEmployeeComponent, canActivate:[AuthGuard]},
  {path:'employees/edit/:id', component: EditEmployeeComponent, canActivate:[AuthGuard]},
  {path:'employees/view/:id', component: ViewEmployeeComponent, canActivate:[AuthGuard]},
  {path:'employees/calendar', component: CalendarComponent,},
  {path:'reset', component: ResetComponent,},
  {path:'reset-password',component: ResetPasswordComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
