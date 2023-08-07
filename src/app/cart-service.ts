import { Injectable } from "@angular/core";

@Injectable({
    providedIn:'root'
})
export class CartService{
   cartData:any= []
   
   increaseCount(item:any){
    this.cartData.filter((i:any)=>{
        if(i.id == item.id){
            i.count = item.quantity+1 >= i.count ? i.count+1 :  i.count 
            return i
        }else{
            return i
        }
    })
   }

   addToCart(item:any){
    this.cartData.includes(item) ? this.increaseCount(item) : this.cartData.push(item)
   }

   getCartItems(){
    return this.cartData
   }

   productData:any = []
   crossCommunication(productData:any){
    this.productData = productData
   }

   getProducts(){
    return this.productData
   }
}