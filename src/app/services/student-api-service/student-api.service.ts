import { Injectable } from '@angular/core';
import { UtilityService } from '../utility/utility.service';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

export interface FilterOptions {
  type?: string;
  age?: number;
  class?: string;
}

export interface Student {
  name: string;
  gender: string;
  phone: number;
  age: number;
  class: string;
  type: string;
  id?: number;
}

const REST = 'rest/api/students';

@Injectable({
  providedIn: 'root'
})
export class StudentApiService {

  constructor(private readonly http: HttpClient,private readonly utilityService: UtilityService) { }

  public getData(filter?: FilterOptions) {
    
    return new Observable((observer) => {
      let restApi: string;
      if (filter) {
        let params = [];
        if (filter.type) {
          params.push(`type=${filter.type}`);
        }
        if (filter.age) {
          params.push(`age=${filter.age}`);
        }
        if (filter.class) {
          params.push(`class=${filter.class}`);
        }
        restApi  = `${REST}?${params.join('&')}`
      }
      this.http.get(restApi || REST,{ headers: this.utilityService.getHeaders()}).subscribe({
        next: (data) => {
          observer.next(data);
        },
        error: (err) => {
          observer.error(err)
        }
      });
    })
  }

  public deleteStudentData(id) {
    return new Observable((observer) => {
      this.http.delete(`${REST}/${id}`,{ headers: this.utilityService.getHeaders()}).subscribe({
        next: () => {
          observer.next();
        },
        error: (err) => {
          observer.error(err)
        }
      });
    })
  }

  public addStudent(student: Student) {
    return new Observable((observer) => {
      this.http.post(REST,student,  { headers: this.utilityService.getHeaders()}).subscribe({
        next: () => {
          observer.next();
        },
        error: (err) => {
          observer.error(err)
        }
      });
    })
  }

  public editStudent(student: Student) {
    return new Observable((observer) => {
      this.http.patch(`${REST}/${student.id}`,student,  { headers: this.utilityService.getHeaders()}).subscribe({
        next: () => {
          observer.next();
        },
        error: (err) => {
          observer.error(err)
        }
      });
    })
  }
}
