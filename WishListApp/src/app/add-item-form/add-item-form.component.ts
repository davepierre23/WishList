import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import { UserForm } from 'src/model/user';
import { AuthService } from '../shared/services/authService/auth.service';
import { UserService } from '../shared/services/userService/user.service';

@Component({
  selector: 'app-add-item-form',
  templateUrl: './add-item-form.component.html',
  styleUrls: ['./add-item-form.component.css']
})
export class AddItemFormComponent implements OnInit {

  //Whether the form is succs or not
  loading = false;
  success = false;

  userNamePattern = '^[a-z0-9_-]{8,15}$';
  passwordPattern = '^[a-z]{1}$';

  signUpForm = this.formBuilder.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    emailAddress: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });
  get firstName() {
    return this.signUpForm.get('firstName');
  }
  get lastName() {
    return this.signUpForm.get('lastName');
  }
  get emailAddress() {
    return this.signUpForm.get('emailAddress');
  }

  get password() {
    return this.signUpForm.get('password');
  }

  createUser(): UserForm {
    return this.signUpForm.value;
  }

  constructor(
    private usersService: UserService,
    private formBuilder: FormBuilder,
    private authService: AuthService
  ) {}

  ngOnInit(): void {}
  async onSubmit() {
    this.loading = true;

    const newUser = this.createUser();
    let result = await this.authService.singUpAccount(newUser);
    console.log(result);
    if (result) {
      this.signUpForm.reset();
      this.success = true;
    }
  }
}
