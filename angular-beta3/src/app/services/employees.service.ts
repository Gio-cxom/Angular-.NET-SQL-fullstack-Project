import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Employee } from '../models/employee.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmployeesService {

  private baseApiUrl:string = "https://localhost:7168";

  constructor(private http:HttpClient) { }

  getAllEmployees(): Observable<Employee[]> {
    return this.http.get<Employee[]>(this.baseApiUrl + '/api/employees');
  }
  addEmployee(AddEmployeeRequest: Employee): Observable<Employee> {
    AddEmployeeRequest.id = '00000000-0000-0000-0000-000000000000';
    return this.http.post<Employee>(this.baseApiUrl + '/api/employees', AddEmployeeRequest);
  }
  getEmployee(id: string): Observable<Employee>{
    return this.http.get<Employee>(this.baseApiUrl + '/api/employees/'+id);
  }

  updateEmployee(id: string, updateEmployeeRequest: Employee): Observable<Employee>{
   return this.http.put<Employee>(this.baseApiUrl + '/api/employees/'+id, updateEmployeeRequest)
  }

  deleteEmployee(id:string): Observable<Employee>{
    return this.http.delete<Employee>(this.baseApiUrl + '/api/employees/'+id)
  }
}
