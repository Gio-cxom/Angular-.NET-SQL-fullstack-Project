import { Component,OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import { confimPasswordValidator } from 'src/app/Helpers/confim-password.validator';
import ValidateForm from 'src/app/Helpers/validateform';
import { ResetPassword } from 'src/app/models/reset-password.model';
import { ResetPasswordService } from 'src/app/services/reset-password.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit{

  resetPasswordForm!:FormGroup;
  emailToReset!:string;
  emailToken!:string;
  resetPasswordObj = new ResetPassword();

  constructor( 
    private toast:NgToastService, 
    private fb:FormBuilder, 
    private activatedRoute: ActivatedRoute, 
    private resetService:ResetPasswordService,
    private router :Router
    ){}

  ngOnInit(): void {
    this.resetPasswordForm=this.fb.group({
      password:[null,
        [
          Validators.required,
          Validators.pattern(/^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/),
          Validators.minLength(8),
        ]
      ],
      confimPassword:[null,
        [
          Validators.required,
          Validators.pattern(/^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/),
          Validators.minLength(8),
        ]
      ],
    },{
      validator: confimPasswordValidator("password", "confimPassword")
    });

    this.activatedRoute.queryParams
    .subscribe(val =>{
      this.emailToReset = val['email'];
      let uriToken = val['code'];
      this.emailToken = uriToken.replace(/ /g,'+');
    })
  }

  reset(){
    if(this.resetPasswordForm.valid){
      this.resetPasswordObj.email = this.emailToReset;
      this.resetPasswordObj.newPassword = this.resetPasswordForm.value.password;
      this.resetPasswordObj.confimPassword=this.resetPasswordForm.value.confimPassword;
      this.resetPasswordObj.emailToken = this.emailToken;
      this.resetService.resetPassword(this.resetPasswordObj)
      .subscribe({
        next:(res)=>{
            this.toast.success({
              detail:'SUCCESS',
              summary:"პაროლი შეიცვლილია!",
              duration:3000,
            });
            this.router.navigate(['login'])
        },
        error:(err)=>{
          this.toast.error({
            detail:'ERROR',
            summary:"მინიმუმ 8 სიმბოლო @*!Z",
            duration:3000,
          });
        }
      })
    }else{
      ValidateForm.validateAllFormFields(this.resetPasswordForm);
    }
  }

}
