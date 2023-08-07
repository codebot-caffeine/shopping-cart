import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators ,FormGroup} from '@angular/forms';
import { dataService } from '../data-manager.service';
import { Router } from '@angular/router';
import { CommonServiceService } from '../common-service.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  prefixlive:any = 'https://shopping-cart-nfec.onrender.com'
  prefixtest:any = 'http://localhost:3000'
  signUp:boolean = false
  signIn:boolean = true

  signUpAccount = this.fb.group({
    'Email' : new FormControl('',[Validators.required,Validators.email]),
    'UserName': new FormControl('',[Validators.required,Validators.maxLength(30)]),
    'Password':new FormControl('',[Validators.required])
  })

  signInAccount = this.fb.group({
    'Email': new FormControl('',[Validators.required,Validators.email]),
    'Password':new FormControl('',[Validators.required])
  })

  constructor(public fb:FormBuilder,private dm : dataService,private router:Router,private tstr:CommonServiceService) { }

  ngOnInit(): void {
  }
  
  // https://shopping-cart-nfec.onrender.com
  signupsubmit(){
    if(this.signUpAccount.valid){
      this.dm.APIGenericPostMethod('/signup',this.signUpAccount.value,this.prefixlive).subscribe((data)=>{
        if(data.status){
          this.signUpAccount.reset()
          this.signIn = true
          this.signUp = false
          // localStorage.setItem('token',data?.token)
        }else{
          this.tstr.showError('Unable to signup.')
        }
      })
    }
  }

  signinsubmit(){
    if(this.signInAccount.valid){
      this.dm.APIGenericPostMethod('/signin',this.signInAccount.value,this.prefixlive).subscribe((data)=>{
        if(data.status){
          // console.log(data.token)
          this.signInAccount.reset()
          localStorage.setItem('token',data?.response.token)
          localStorage.setItem('userDetails',JSON.stringify(data?.response?.userData))
          setTimeout(()=>{
            this.router.navigate(['products'])
          })
        }else{
          this.tstr.showError('Check your mail and password.')
        }
      })
    }
  }

}
