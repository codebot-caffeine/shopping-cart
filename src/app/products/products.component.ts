import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs';
import { CartService } from '../cart-service';
import { dataService } from '../data-manager.service';
import { CommonServiceService } from '../common-service.service';
@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {
  //array objects for filter
  colorsObject: any = [
    {
      id: 'red',
      value: 'Red',
      checked: false
    },
    {
      id: 'blue',
      value: 'Blue',
      checked: false
    },
    {
      id: 'green',
      value: 'Green',
      checked: false
    }
  ]
  genderObject: any = [
    {
      id: 'male',
      value: 'Men',
      checked: false
    },
    {
      id: 'female',
      value: 'Women',
      checked: false
    }
  ]
  priceObject: any = [
    {
      id: 250,
      value: '0-250',
      checked: false
    },
    {
      id: 450,
      value: '250-450',
      checked: false
    },
    {
      id: 451,
      value: '450+',
      checked: false
    },
  ]
  typeObject: any = [
    {
      id: 'Polo',
      value: 'Polo',
      checked: false
    },
    {
      id: 'Hoodie',
      value: 'Hoodie',
      checked: false
    },
    {
      id: 'Basic',
      value: 'Basic',
      checked: false
    },
  ]

  prefixlive:any = 'https://shopping-cart-nfec.onrender.com/'
  prefixtest:any = 'http://localhost:3000/'
  userId:any = ''
  userData:any = ''
  constructor(private http: HttpClient,private cartService:CartService,private dm : dataService,private tstr:CommonServiceService) {
    // if (!localStorage.getItem('foo')) { 
    //   localStorage.setItem('foo', 'no reload') 
    //   location.reload() 
    // } else {
    //   localStorage.removeItem('foo') 
    // }
    this.userData = localStorage.getItem('userDetails')
    this.userData = JSON.parse(this.userData)
  }

  ngOnInit(): void {
    //if the cart has items product data will be shown accordingly or else api call will be made
    if(this.cartService.getProducts().length > 0){
      this.productsData = this.cartService.getProducts()
      this.filteredData = this.productsData
    }else{
      this.getProducts()
    }
    this.userId = this.userData._id
    // console.log(this.userId)
  }

  filteredData: any = []
  //complete filter function for filtering the shop content basing on filter argument 
  filterObject: { [key: string]: any } = {
  }
  filterFunction(filter: any) {
    let d = []
    //filter object contains keys (color,grade,price etc..,)
    d = this.productsData.filter((item: any) => {
      //original data is the data we get from api call
      return Object.entries(this.filterObject).every(([filter, value]) => {
        let bool = filter == 'price' && value[0] != 451 && item[filter] <= value[0] ? true :
          filter == 'price' && value[0] == 451 && item[filter] > value[0] ? true :
            filter != 'price' ? value.includes(item[filter]) : false
        return bool;//if returned true that particular product will be shown
      });
    });

    this.filteredData = d
  }
  //checkbox operation it allows combination of filter from color,gender,price,type any one or all
  filterShop(event: any, filter: any, i: any) {
    if (event.target.checked) {
      this.filterObject[filter] = []
      this.filterObject[filter].push(event?.target?.defaultValue)
      let dumObj = filter == 'color' ? this.colorsObject :
        filter == 'gender' ? this.genderObject :
          filter == 'price' ? this.priceObject :
            filter == 'type' ? this.typeObject : ''
      let d = ''
      if (filter != 'price') {
        d = dumObj.map((each: any) => {
          let s = each
          if (each.value != event?.target?.defaultValue) {
            each.checked = false
            s = each
          } else {
            each.checked = true
            s = each
          }
          return s
        })
      } else {
        d = dumObj.map((each: any, index: any) => {
          let s = each
          if (index != i) {
            each.checked = false
            s = each
          } else {
            each.checked = true
            s = each
          }
          return s
        })
      }

      filter == 'color' ? this.colorsObject = d : filter == 'gender' ? this.genderObject = d : filter == 'price' ? this.priceObject = d :
        filter == 'type' ? this.typeObject = d :
          ''
      this.filterFunction(filter)
    } else {
      if (filter == 'color') {
        this.colorsObject.map((each: any) => {
          if (each.color == event?.target?.defaultValue) {
            each.checked = false
          }
        })
        delete this.filterObject[filter]
        // this.filterFunction('color')
        this.filterFunction('color')
      }
      if (filter == 'gender') {
        this.colorsObject.map((each: any) => {
          if (each.gender == event?.target?.defaultValue) {
            each.checked = false
          }
        })
        delete this.filterObject[filter]
        this.filterFunction('gender')
      }
      if (filter == 'price') {
        this.priceObject.map((each: any,index:any) => {
          if (index == i) {
            each.checked = false
          }
        })
        delete this.filterObject[filter]
        // this.filterFunction('color')
        this.filterFunction('price')
      }
      if (filter == 'type') {
        this.typeObject.map((each: any) => {
          if (each.type == event?.target?.defaultValue) {
            each.checked = false
          }
        })
        delete this.filterObject[filter]
        this.filterFunction('type')
      }
    }
  }
  productsData: any = []
  //initial product fetching function we can use service also to store multiple apis 
  getProducts() {
    this.http.get<any>(' https://geektrust.s3.ap-southeast-1.amazonaws.com/coding-problems/shopping-cart/catalogue.json ')
      .subscribe((response: Response) => {
        this.productsData = response
        //formatting the response to facilitate for cart usage as count determines the items in cart when added
        this.productsData = this.productsData.map((item:any)=>{
          return {
            color:item.color,
            currency:item.currency,
            gender:item.gender,
            id:item.id,
            imageURL:item.imageURL,
            name:item.name,
            price:item.price,
            quantity:item.quantity,
            type:item.type,
            count:1
          }
        })
        this.filteredData = this.productsData
        // console.log(this.filteredData)
      },((error:any)=>{
        alert(error)
      }));
  }

  cartData:any= []
  //using a service to store and get cart data 
  pushToService(item:any){
     this.cartService.addToCart(item)
     this.productsData = this.productsData.filter((each:any)=>{
      each.quantity = each.id == item.id && each.quantity > 0 ? each.quantity-1 : each.quantity
      return each
     })
     this.pushToCart(item)
     this.cartService.crossCommunication(this.productsData)
  }

  pushToCart(item:any){
    console.log(item)
  }
  
  searchWord:any = ''
  searchList(){
    let d = []
    //filter object contains keys (color,grade,price etc..,)
    d = this.productsData.filter((item: any) => {
      //original data is the data we get from api call
      return item.name.toLowerCase().includes(this.searchWord.toLowerCase())
    });

    this.filteredData = d
    // console.log(d)
  }

  backSpace(event:any){
    if(event.key == 'Backspace' && this.searchWord == ''){
       this.getProducts()
    }else if(event.key == 'Enter' && this.searchWord.length >  2){
       this.searchList()
    }
  }

  addToCart(body:any){
    let bod = {
      '_id': this.userId,
       'cart':{...body}
    }
    console.log(bod)
    this.dm.APIGenericPostMethod('add/cart',bod,this.prefixlive).subscribe((data)=>{
      if(data.status){
        // console.log(data.token)
        this.tstr.showSuccess('Succesfully added to cart.')
        // localStorage.setItem('userDetails',JSON.stringify(data?.response?.userData))
      }else{
        this.tstr.showError('Unable to add to cart.')
        console.log(data,'error')
      }
    })
  }

  removeFromCart(body:any){
    let bod = {
      '_id': this.userId,
       'cart':{...body}
    }
    console.log(bod)
    this.dm.APIGenericPostMethod('/remove/cart',bod,this.prefixlive).subscribe((data)=>{
      if(data.status){
        // console.log(data.token)
        
      }else{
        this.tstr.showError('Unable to remove from cart.')
        console.log(data,'error')
      }
    })
  }

}
