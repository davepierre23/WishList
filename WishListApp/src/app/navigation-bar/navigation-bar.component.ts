import { Component, OnInit } from '@angular/core';
import { AuthService } from '../shared/services/authService/auth.service';
@Component({
  selector: 'app-navigation-bar',
  templateUrl: './navigation-bar.component.html',
  styleUrls: ['./navigation-bar.component.css']
})
export class NavigationBarComponent implements OnInit {

  constructor(private authService: AuthService) {}

  ngOnInit(): void {}

  onSignOut() {
    this.authService.signOutAccount();
  }
}

