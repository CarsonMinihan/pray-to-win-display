import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UiService } from 'src/app/shared/services/ui.service';
import { UserService } from 'src/app/shared/services/user.service';
import { NewUser } from 'src/app/shared/models/new-user.model';
import { AuthUser } from 'src/app/shared/models/auth-user.model';
import { ReturningUser } from 'src/app/shared/models/returning-user.model';
import {
  trigger,
  style,
  animate,
  transition,
} from '@angular/animations';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  animations: [
    trigger('inOutAnimation', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('0.3s ease-out', style({ opacity: 1 })),
      ]),
      transition(':leave', [
        style({ opacity: 1 }),
        animate('0.3s ease-in', style({ opacity: 0 })),
      ]),
    ]),
  ],
})
export class LoginComponent implements OnInit {
  closeResult = '';

  createAccount: boolean = false;
  matchPassword: boolean = false;
  emptyfield: boolean = false;

  newUser: NewUser = new NewUser();
  user: ReturningUser = new ReturningUser();
  userFormData: AuthUser = new AuthUser('', '', '', '', '');
  confirmpassword: string;

  // @ViewChild('confirmpassword', {static: true}) confirmpassword: ElementRef;

  constructor(
    private router: Router,
    public nav: UiService,
    public myUserService: UserService,
    private ui: UiService
  ) {}

  ngOnInit(): void {
  }

  // this handles both LOGIN & CREATE
  // this part checks if you are making an account or logging in
  handleForm() {

    if (this.createAccount) {
      console.log('CREATING ACCOUNT');

      let newUserData: NewUser = {
        username: this.userFormData.username,
        name: this.userFormData.name,
        password: this.userFormData.password,
        email: this.userFormData.email,
      };
      if (this.userFormData.password == this.userFormData.confirmPassword) {
        this.myUserService.createUser(newUserData).subscribe(
          (res: any) => {
            console.log(res);
            if (res.success) {
              this.ui.showToastMessage(res.message);
              let userData: ReturningUser = {
                username: this.userFormData.username,
                password: this.userFormData.password,
              };

              // after account is created it will then run the login function with that new account
              this.loginSubmit(userData);
            }
          },
          (error) => {
            this.ui.showToastMessage(
              'make sure all fields are filled',
              'danger'
            );
          }
        );
      } else {
        this.ui.showToastMessage("Passwords don't match", 'danger');
      }

      // if you are logging in the it will run the code below
    } else {
      console.log('LOGGING IN');
      let userData: ReturningUser = {
        username: this.userFormData.username,
        password: this.userFormData.password,
      };
      this.loginSubmit(userData);
    }
  }



  toggleCreate() {
    this.createAccount = !this.createAccount;
  }

  // this is the code that will actually log you in and assign you user token and the expiration of the token to your local storage
  loginSubmit(userData): void {
    this.myUserService.loginUser(userData).subscribe(
      
      (res) => {
        console.log(res);
        if (res.success) this.ui.showToastMessage(res.message);
        // if (res.data.token) {
          if (res.token) {
          // localStorage.setItem('UserToken', res.data.token);
          localStorage.setItem('UserToken', res.token);
          // 30 minutes is 1800000
          let expiration = Date.now() + 3000000;
          localStorage.setItem('tokenExpiration', expiration.toString());
          this.router.navigate(['/journal']);
        }
      },
      (res) => {
        console.log(res.error);
        if (!res.error.success && res.error.message) {
          let message = 'Error: ' + res.error.message;
          this.ui.showToastMessage(message, 'danger');
        } else {
          this.ui.showToastMessage('Error: with Authentication.', 'danger');
        }
      }
    );
  }
}
