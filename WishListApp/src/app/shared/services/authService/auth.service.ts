import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { UserForm, Users } from '../../../../model/user';
import { Router } from '@angular/router';
import {
  AngularFirestore,
  AngularFirestoreDocument,
} from '@angular/fire/firestore';
//https://fireship.io/lessons/angularfire-google-oauth/
import { Observable, of, from } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  dbName: string = 'users';
  userLogInData: any = null;
  user$?: Observable<Users | null | undefined> = of(null);
  constructor(
    private afs: AngularFirestore,
    public authenticater: AngularFireAuth, // Inject Firebase auth service
    public router: Router
  ) {
    this.user$ = this.authenticater.authState.pipe(
      switchMap((user) => {
        // Logged in
        if (user) {
          return this.afs
            .doc<Users>(`${this.dbName}/${user.uid}`)
            .valueChanges();
        } else {
          // Logged out
          return of(null);
        }
      })
    );
  }

  updateUserData(user: any, userForm: UserForm) {
    // Sets user data to firestore on login
    const userRef: AngularFirestoreDocument<Users> = this.afs.doc(
      `${this.dbName}/${user.uid}`
    );

    const data: Users = {
      uid: user.uid,
      email: user.email,
      displayName: `${userForm.firstName} ${userForm.lastName}`,
    };
    return userRef.set(data, { merge: true });
  }
  //used to Sign in account and provide authenication whenever
  singUpAccount(userForm: UserForm) {
    return this.authenticater
      .createUserWithEmailAndPassword(userForm.emailAddress, userForm.password)
      .then((result) => {
        if (result.user) {
          window.alert('You have succesful sign up an account');
          this.updateUserData(result.user, userForm); //update the user with a new name

          return true;
        } else {
          window.alert(JSON.stringify(result));
          return false;
        }

        //TODO maybe add the send verifcation email and such
      })
      .catch((error) => {
        window.alert(error.message);
        return false;
      });
  }

  //used to Sign out of accounts when enver they press the button
  async signOutAccount() {
    await this.authenticater.signOut();
    this.user$ = of(null);
    this.router.navigate(['sign-in']);
  }

  //used to Sign out of accounts when enver they press the button
  loginInAccount(email: any, password: any) {
    return this.authenticater
      .signInWithEmailAndPassword(email, password)
      .then((result) => {
        if (result.user) {
          this.user$ = this.afs
            .doc<Users>(`${this.dbName}/${result.user.uid}`)
            .valueChanges();
          return true;
        } else {
          window.alert(JSON.stringify(result));
          return false;
        }
      })
      .catch((error) => {
        window.alert(error.message);
      });
  }

  //check to see if there a Users Observable set already
  get authenciatedUser(): Observable<Users | null | undefined> {
    if (this.user$) {
      return this.user$;
    } else {
      return of(null);
    }
  }
}
