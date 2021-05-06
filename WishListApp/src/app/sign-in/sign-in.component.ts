import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Users } from 'src/model/user';
import { AuthService } from '../shared/services/authService/auth.service';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css']
})
export class SignInComponent implements OnInit {
  isAuthenicated!: Observable<Users | null | undefined>;
  hasSubmitted = false;
  success = false;

  userNamePattern = '^[a-z0-9_-]{8,15}$';
  passwordPattern = '^[a-z]{1}$';

  loginForm = this.formBuilder.group({
    emailAddress: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });
  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    public router: Router
  ) {}

  ngOnInit(): void {
    // check to see if the user has been already authenciated
    // if so then navigate to home page
    this.isAuthenicated = this.authService.authenciatedUser;
    this.isAuthenicated.subscribe((user) => {
      console.debug('The user data about to be checked', user);
      if (user) {
        console.debug('The user has been created and authenicated');
        this.router.navigate(['home']);
      } else {
        console.debug('User has not been auhtenciated yet');
      }
    });
  }

  get emailAddress() {
    return this.loginForm.get('emailAddress');
  }

  get password() {
    return this.loginForm.get('password');
  }

  login() {
    const onSuccess = () => {
      console.debug('User has succesfully login');
      this.hasSubmitted = true;
      this.router.navigate(['home']);
    };

    const onFail = () => {
      console.debug('User has not login');
      this.loginForm.reset();
    };

    let loginResult = this.authService.loginInAccount(
      this.loginForm.value.emailAddress,
      this.loginForm.value.password
    );
    loginResult.then((hasLogin) => {
      if (hasLogin) {
        onSuccess();
      } else {
        onFail();
      }
    });
  }
}
