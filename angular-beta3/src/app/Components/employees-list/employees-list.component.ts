import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Employee } from 'src/app/models/employee.model';
import { ApiService } from 'src/app/services/api.service';
import { AuthService } from 'src/app/services/auth.service';
import { EmployeeStoreService } from 'src/app/services/employee-store.service';
import { EmployeesService } from 'src/app/services/employees.service';

@Component({
  selector: 'app-employees-list',
  templateUrl: './employees-list.component.html',
  styleUrls: ['./employees-list.component.css']
})
export class EmployeesListComponent implements OnInit{

  employees : Employee [] = [];

  public role:string = "";
  public users:any = [];
  constructor(
    private api:ApiService, 
    private auth: AuthService , 
    private employeeStore : EmployeeStoreService,
    private employeesService : EmployeesService,
    private router: Router
    ){}
  
  ngOnInit(): void {
    this.api.getUsers()
    .subscribe(res=>{
      this.users=res;
    });
    this.employeeStore.getRoleFromeStore()
    .subscribe(val =>{
      const roleFromToken = this.auth.getRoleFromToken();
      this.role = val || roleFromToken;
    });
    this.employeesService.getAllEmployees()
      .subscribe({
        next:(employees)=>{
          this.employees = employees;
        },error:(response)=>{
          console.log(response)
        }
      })
    
     
  }
  deleteEmployee(id:string){
    this.employeesService.deleteEmployee(id)
    .subscribe({
      next:(response)=>{
        this.router.navigate(['employees']);
      }
    })
  }
  reloadPage(){
    window.location.reload();
  }
  
}
