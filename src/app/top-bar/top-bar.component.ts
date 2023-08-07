import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-top-bar',
  templateUrl: './top-bar.component.html',
  styleUrls: ['./top-bar.component.css']
})
export class TopBarComponent implements OnInit {
  title = 'shoppingCart';
  loggedIn = false
  token = false

  constructor(private router:Router) { 
    if(localStorage.getItem('token')){
      this.loggedIn = true
      this.token=false
    }
  }

  ngOnInit(): void {
  }

  backToSignIn(){
    localStorage.removeItem('userDetails')
    localStorage.removeItem('token')
    this.loggedIn = false
    this.token = false
    this.router.navigate(['login'])
  }

}
