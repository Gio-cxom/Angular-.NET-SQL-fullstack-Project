import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule,FormBuilder, FormGroup, Validators, FormsModule,FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import ValidateForm from 'src/app/Helpers/validateform';
import { Employee } from 'src/app/models/employee.model';
import { AuthService } from 'src/app/services/auth.service';
import { EmployeeStoreService } from 'src/app/services/employee-store.service';
import { EmployeesService } from 'src/app/services/employees.service';

@Component({
  selector: 'app-add-employee',
  templateUrl: './add-employee.component.html',
  styleUrls: ['./add-employee.component.css']
})
export class AddEmployeeComponent implements OnInit{

   editForm!:FormGroup;
   public role:string = "";
  addEmployeeRequest : Employee = {
    id:'',
    name: '',
    surname:'',
    image: '',
    email: '',
    raiting: '',
    personalId: 0,
    category: ''
  }
  constructor(private employeeService: EmployeesService, private router:Router,
    private auth: AuthService , 
    private employeeStore : EmployeeStoreService){}

  ngOnInit(): void {
    
    this.employeeStore.getRoleFromeStore()
    .subscribe(val =>{
      const roleFromToken = this.auth.getRoleFromToken();
      this.role = val || roleFromToken;
      
    });
  }
  addEmployee(){
      this.employeeService.addEmployee(this.addEmployeeRequest)
      .subscribe({
        next:(employee)=>{
          this.router.navigate(['employees'])
        }
      });
    }

}
