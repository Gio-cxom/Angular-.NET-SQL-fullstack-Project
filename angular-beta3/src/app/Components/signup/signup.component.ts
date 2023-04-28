import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import ValidateForm from 'src/app/Helpers/validateform';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit{

  signUpForm!:FormGroup;

  constructor(private fb:FormBuilder, private auth: AuthService, private router:Router){}

  ngOnInit(): void {
    this.signUpForm = this.fb.group({
      firstName:['',Validators.required],
      lastName:['',Validators.required],
      userId:['',Validators.required],
      email:['',Validators.required],
      password:['',Validators.required],
    })
  }
  onSignup(){
    if(this.signUpForm.valid){
       
      this.auth.signUp(this.signUpForm.value)
      .subscribe({
        next:(res=>{
          alert(res.message);
          this.signUpForm.reset();
          this.router.navigate(['login']);
        }),
        error:(err=>{
          alert(err?.error.message)
        })
      })


    }else{
      ValidateForm.validateAllFormFields(this.signUpForm)
    }
  }
}
