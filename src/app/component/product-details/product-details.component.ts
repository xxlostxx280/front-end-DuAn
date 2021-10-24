import { Component, OnInit, AfterContentInit, DoCheck } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormControl, FormGroup, } from "@angular/forms";
import { ApiService } from 'src/app/shared/api.service';
import { MessageService } from 'src/app/shared/message.service';
import SwiperCore, { Pagination, SwiperOptions, Autoplay, Navigation, Thumbs } from "swiper";
import { QuanityModel } from './quantity.model';

SwiperCore.use([Pagination]);
SwiperCore.use([Autoplay]);
SwiperCore.use([Navigation, Thumbs]);

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent implements OnInit {
  public infoProduct: any;
  public listImageProduct: Array<any> = [];
  public listTypeSize: Array<any> = [];
  public listSize: Array<any> = [];
  public listProductByCategory: Array<any> = [];
  public listProductByQuantity: Array<any> = [];
  public listProperty: Array<any> = [];
  public badge = 0;
  public dataSource: Array<any> = [];

  public defaultItem: any = {
    name: "Choose...",
    id: null,
  };
  public config: SwiperOptions = {
    freeMode: true,
    pagination: { clickable: true },
    breakpoints: {
      // when window width is >= 320px
      540: {
        slidesPerView: 2,
        spaceBetween: 10
      },
      // when window width is >= 480px
      720: {
        slidesPerView: 2,
        spaceBetween: 20
      },
      // when window width is >= 640px
      960: {
        slidesPerView: 3,
        spaceBetween: 30
      },
      1140: {
        slidesPerView: 4,
        spaceBetween: 30
      }
    },
    autoplay: {
      delay: 5000,
    },
  };
  public thumbsSwiper: any;

  public QuantityObj: QuanityModel = new QuanityModel();
  public formGroup = new FormGroup({
    property: new FormControl(),
    size: new FormControl(),
  });
  constructor(private api: ApiService, private messageService: MessageService) { }

  ngOnInit(): void {
    let url = window.location.href;
    let id = url.replace('http://localhost:4200/list-product/info/', '');
    this.QuantityObj.Quantity = 1;
    this.api.getApi('list-product/info/' + id).subscribe((res) => {
      let description = res.data.description;
      let descriptionDetail = res.data.descriptionDetail;
      this.infoProduct = res.data;
      this.infoProduct.description = decodeURIComponent(description.replace(/\+/g, ""));
      this.infoProduct.descriptionDetail = decodeURIComponent(descriptionDetail.replace(/\+/g, " "));
      this.QuantityObj.Product = res.data;
    })
    this.api.getApi('list-type-size').subscribe((res) => {
      this.listTypeSize = res.data;
    }, (err: any) => {

    })
    this.api.getApi('getProperty-and-size/' + id).subscribe((res) => {
      this.listProductByQuantity = res.data;
      if (res.status) {
        this.api.getApi('list-property').subscribe((rs) => {
          this.listProductByQuantity.map((val: any, idx: any) => {
            let data = rs.data.filter((x: any) => x.idproperty == val.property.idproperty);
            if (data.length > 0) {
              if (this.listProperty.length == 0) {
                this.listProperty.push(data[0]);
              } else {
                let color_same = this.listProperty.filter((x: any) => {
                  if (x.idproperty == data[0].idproperty)
                    return x;
                  else
                    return null;
                });
                if (color_same.length == 0) {
                  this.listProperty.push(data[0]);
                }
              }
            }
          })
          this.QuantityObj.Property = this.listProperty[0];
          this.formGroup.controls.property.setValue(String(this.listProperty[0].idproperty));
        })
        this.api.getApi('list-size').subscribe((rs) => {
          this.listProductByQuantity.map((val: any, idx: any) => {
            let data = rs.data.filter((x: any) => x.id == val.size.id);
            if (data.length > 0) {
              if (this.listSize.length == 0) {
                this.listSize.push(data[0]);
              } else {
                let size_same = this.listSize.filter((x: any) => {
                  if (x.id == data[0].id)
                    return x;
                  else
                    return null;
                });
                if (size_same.length == 0) {
                  this.listSize.push(data[0]);
                }
              }
            }
          })
          this.QuantityObj.Size = this.listSize[0];
          this.formGroup.controls.size.setValue(this.listSize[0]);
        })
      }
    })
    this.api.getApi('list-image/' + id).subscribe((res) => {
      this.listImageProduct = res.data;
    })
    this.api.getApi('GetProductByCategory/' + id).subscribe((res) => {
      this.listProductByCategory = res.data;
    })
  }
  changeProperty(e: any): void {
    let property = this.listProperty.filter((x: any) => x.idproperty == e.idproperty)
    this.QuantityObj.Property = property[0];
  }
  changeSize(value: any): void {
    this.QuantityObj.Size = value;
  }
  changeQuantity(value: any): void {
    this.QuantityObj.Quantity = value;
  }
  addSoppingCart(): void {
    this.dataSource = [];
    let key = Object.keys(localStorage);
    let charset: string =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let random1: string = [...Array(10)]
      .map((x: any) => charset[Math.floor(Math.random() * charset.length)])
      .join("");
    key.map((x) => {
      this.dataSource.push(JSON.parse(String(localStorage.getItem(x))))
    });
    let anotherProduct = this.dataSource.filter((x) => x.Product.id == this.QuantityObj.Product.id);
    if (localStorage.length == 0 || anotherProduct.length == 0) {
      this.QuantityObj.Id = random1;
      localStorage.setItem(random1, JSON.stringify(this.QuantityObj))
      this.badge = localStorage.length;
      this.messageService.SendBadgeCart(this.badge);
    } else {
      let same_cart = anotherProduct.filter((x)=> {
        if( x.Product.id == this.QuantityObj.Product.id && 
          x.Property.idproperty == this.QuantityObj.Property.idproperty && 
          x.Size.id == this.QuantityObj.Size.id){
          return this.QuantityObj;
        }else{
          return null;
        }
      });
      if(same_cart.length == 0){
        this.QuantityObj.Id = random1;
        localStorage.setItem(random1, JSON.stringify(this.QuantityObj));
        this.badge = localStorage.length;
        this.messageService.SendBadgeCart(this.badge);
      }
    }
  }
}
