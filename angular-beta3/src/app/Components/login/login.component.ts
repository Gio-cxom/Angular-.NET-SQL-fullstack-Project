import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import ValidateForm from 'src/app/Helpers/validateform';
import { AuthService } from 'src/app/services/auth.service';
import { EmployeeStoreService } from 'src/app/services/employee-store.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit{
  
  loginForm!:FormGroup;



  constructor(
    private fb: FormBuilder,
    private auth:AuthService,
    private router: Router,
    private toast: NgToastService,
    private employeeStore: EmployeeStoreService 
    ){}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['',Validators.required],
      password:['',Validators.required]
    })
  }

  onLogin(){
    if(this.loginForm.valid){
      
     this.auth.login(this.loginForm.value)
     .subscribe({
      next:(res)=>{
        this.auth.storeToken(res.token)
        const tokenPayload = this.auth.decodedToken();
        this.employeeStore.setFullNameForStore(tokenPayload.unique_name);
        this.employeeStore.setRoleForStore(tokenPayload.role);
        this.toast.success({detail:"მოგესალმებით", summary:res.message, duration:5000});
        this.loginForm.reset();
        this.router.navigate(["employees"])
      },
      error:(err)=>{
        this.toast.error({detail:"შეცდომა!", summary:err?.error.message, duration:5000})
      }
     })

    }else{
       ValidateForm.validateAllFormFields(this.loginForm);
       alert("შეავსეთ ფორმა!")
    }
  }
}
