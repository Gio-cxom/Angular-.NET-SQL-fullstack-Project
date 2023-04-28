import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Employee } from 'src/app/models/employee.model';
import { EmployeesService } from 'src/app/services/employees.service';

@Component({
  selector: 'app-view-employee',
  templateUrl: './view-employee.component.html',
  styleUrls: ['./view-employee.component.css']
})
export class ViewEmployeeComponent implements OnInit{

  employees : Employee [] = [];

  employeeDetails:Employee = {
    id:'',
    name: '',
    surname:'',
    image: '',
    email: '',
    raiting: '',
    personalId: 0,
    category: ''
  };
  constructor(private employeesService :EmployeesService, private route: ActivatedRoute, private employeeService: EmployeesService, private router:Router){}

  ngOnInit(): void {
    this.route.paramMap.subscribe({
      next: (params)=>{
        const id = params.get('id')

        if(id){
          this.employeeService.getEmployee(id)
          .subscribe({
            next: (response)=>{
               this.employeeDetails = response;
            }
          })
        }
      }
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
}
