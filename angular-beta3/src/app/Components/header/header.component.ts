import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { EmployeeStoreService } from 'src/app/services/employee-store.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit{

  public fullName: string ="";

  constructor( private auth : AuthService, private employeeStore : EmployeeStoreService){}

  ngOnInit(): void {
    this.employeeStore.getFullNameFromStore()
    .subscribe(val=>{
      let fullNameFromToken = this.auth.getfullNameFromToken();
      this.fullName = val || fullNameFromToken;
    })
  }

  logout(){
    this.auth.signOut();
  }
  loggedin(){
    var classList='';
    if(this.auth.isLoggedIn() == true){
      classList='logout'
    }
    else{
      classList='login'
    }
    return classList;
   }
   loggedin2(){
    var classList='';
    if(this.auth.isLoggedIn() == false){
      classList='logout'
    }
    else{
      classList='login'
    }
    return classList;
   }
   loggedin3(){
    var classList='';
    if(this.auth.isLoggedIn() == true){
      classList='login2'
    }else{
      classList='sign-div'
    }
    return classList;
   }
}
