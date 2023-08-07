import { Component, OnInit } from '@angular/core';
import { CartService } from '../cart-service';
import { dataService } from '../data-manager.service';
import { CommonServiceService } from '../common-service.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {

  constructor(private cartService:CartService,private dm:dataService,private tstr:CommonServiceService) { 
    let userData :any = localStorage.getItem('userDetails')
    userData = JSON.parse(userData)
    this.userId = userData._id
  }
  cartData:any= []
  productData:any = []
  userId:any = ''
  ngOnInit(): void {
    this.getCartItems()
  }
  
  prefixlive:any = 'https://shopping-cart-nfec.onrender.com/'
  prefixtest:any = 'http://localhost:3000/'
  getCartItems(){
    let bod = {
      '_id': this.userId
    }
    // console.log(bod)
    this.dm.APIGenericPostMethod('get/cartitems',bod,this.prefixlive).subscribe((data)=>{
      if(data.status){
        // console.log(data.token)
        this.cartData = data.response?.userData?.cart
        // localStorage.setItem('userDetails',JSON.stringify(data?.response?.userData))
      }else{
        this.tstr.showError('Unable to get cart items.')
      }
    })
  }


}
