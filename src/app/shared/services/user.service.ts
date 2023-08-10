import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { NewUser } from '../models/new-user.model';
import { ReturningUser } from '../models/returning-user.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  newUserData: NewUser;
  returningUserData: ReturningUser;

  url: string = "http://localhost:3000"
  // url: string = environment.apiUrl;

  constructor(private myhttp: HttpClient) {}

  httpHeader = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };

  // this function creates a header for requests with your user token attached so the backend knows it's you
  // the backend is also checking you ip address to see if it's you or just someone who got a hold of your token

  getHeaderWithToken(){
    let httpHeaderToken = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-access-token':  localStorage.getItem("UserToken"),
      }),
    };
    return httpHeaderToken
  }

  createUser(newUser: NewUser): Observable<NewUser> {
    return this.myhttp.post<NewUser>(
      // this.url + '/auth/create',
      this.url + '/auth',
      newUser,
      this.httpHeader
    );
  }


  // loginUser(user: ReturningUser): Observable<any> {
  //   return this.myhttp.post<ReturningUser>(
  //     this.url + '/auth/login',
  //     user,
  //     this.httpHeader
  //   );
  // }

  //this is a bybass for displaying functionlity

  loginUser(user: ReturningUser): Observable<any> {
    return this.myhttp.get<ReturningUser>(
      this.url + '/auth',
      this.httpHeader
    );
  }

  // this is what allow you to refresh you token on the front so it doesn't expire
  refreshUser(): Observable<any> {
    let header = this.getHeaderWithToken();
    return this.myhttp.get<any>(
      // this.url + '/auth/refresh',

      this.url + '/refresh',
      header
    );
  }

  logoutUser(): Observable<any> {
    let header = this.getHeaderWithToken();
    return this.myhttp.get<any>(
      // this.url + '/auth/logout',
      this.url + '/logout',
      header
    );
  }

}
