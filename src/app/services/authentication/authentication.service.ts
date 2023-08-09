import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { UtilityService } from '../utility/utility.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private accessToken;

  constructor(
    private readonly http: HttpClient,
    private readonly utilityService: UtilityService
  ) { }

  public userLogin(username: string, password: string) {
    return new Observable((observer) => {
      this.http.post('rest/api/auth/login',{
        userName: username,
        password: password
      }, { headers: this.utilityService.getHeaders()}).subscribe({
        next: (data: any) => {
          this.accessToken = data.access_token;
          observer.next();
        },
        error: (data: any) => {
          observer.error(data);
        }
      });
    });
  }

  public getAccessToken() {
    return this.accessToken ? this.accessToken : null;
  }
}
