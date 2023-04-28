import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Route, Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import { EmployeeStoreService } from '../services/employee-store.service';
import ValidateForm from 'src/app/Helpers/validateform';
import { ResetPasswordService } from '../services/reset-password.service';

@Component({
  selector: 'app-reset',
  templateUrl: './reset.component.html',
  styleUrls: ['./reset.component.css']
})
export class ResetComponent implements OnInit{

  loginForm!:FormGroup;
  public resetPasswordEmail!: string;
  public isValidEmail!:boolean;
  constructor(
    private fb: FormBuilder,
    private auth:AuthService,
    private router: Router,
    private toast: NgToastService,
    private employeeStore: EmployeeStoreService,
    private resetService:ResetPasswordService
    ){}

    ngOnInit(): void {
      this.loginForm = this.fb.group({
        email: ['',Validators.required]
      })
    }
    checkValidEmail(event:string){
       const value = event;
       const pattern = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,3}$/;
       this.isValidEmail = pattern.test(value);
       return this.isValidEmail;
    }
    confirmToSend(){
      if(this.checkValidEmail(this.resetPasswordEmail)){
         console.log(this.resetPasswordEmail)
         this.resetService.sendResetPasswordLink(this.resetPasswordEmail)
         .subscribe({
          next:(res)=>{
            this.toast.error({
              detail:'Success',
              summary:'პაროლი შეიცვალა!',
              duration:5000,
            })
            this.resetPasswordEmail='';
            this.router.navigate(["login"]);
          },error:(err)=>{
            this.toast.error({
              detail:'ERROR',
              summary:'შეცდომა!',
              duration:5000,
            })
          }
         })
      }
    }
}
