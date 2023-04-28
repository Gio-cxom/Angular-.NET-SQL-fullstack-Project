import { Component,OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ResetPassword } from 'src/app/models/reset-password.model';

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

  constructor( private fb:FormBuilder){}

  ngOnInit(): void {
    this.resetPasswordForm=this.fb.group({
      password:[null,Validators.required],
      confimPassword:[null,Validators.required]
    })
  }

}
