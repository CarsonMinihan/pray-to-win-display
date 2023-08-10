import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { UiService } from '../ui.service';
import { UserService } from '../user.service';

@Injectable({
  providedIn: 'root',
})
export class AuthguardService {
  constructor(
    public ui: UiService,
    public userService: UserService,
    private router: Router,
    private nav: UiService
  ) {}

  gettoken() {

    //checks if they have a token and if it is valid, if it is it will refresh the token if the set experatioon time is 
    //passed on the front end
    if (!!localStorage.getItem('UserToken')) {
      if (Date.now() >= parseInt(localStorage.getItem('tokenExpiration'))) {
        this.userService.refreshUser().subscribe(
          (res) => {
            console.log(res);
            if (res.success && res.data.token) {
              localStorage.clear();
              localStorage.setItem('UserToken', res.data.token);
              let expiration = Date.now() + 3000000;
              localStorage.setItem('tokenExpiration', expiration.toString());
              console.log(res);
            }
          },
          (res) => {
            if (!res.error.success && res.error.message) {
              this.ui.showToastMessage('Please log back in', 'danger');
              localStorage.clear();
              this.nav.hide();
              this.router.navigate(['/login']);
            }
          }
        );
      } else {
        console.log('Token NOT expired');
      }
    }
    return !!localStorage.getItem('UserToken');
  }
}
