import { Component, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { WindowCloseResult, WindowRef, WindowService } from '@progress/kendo-angular-dialog';
import { DialogService } from "@progress/kendo-angular-dialog";

import { QuanityModel } from 'src/app/component/product-details/quantity.model';
import { ApiService } from 'src/app/shared/api.service';
import { MessageService } from 'src/app/shared/message.service';
import { DialogInfoProductComponent } from 'src/app/layout/shopping-cart/infoProductDialog.component'
import { DialogLoginComponent } from './loginDialog.component';
import { NotificationService } from '@progress/kendo-angular-notification';
@Component({
  selector: 'app-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.css']
})
export class ShoppingCartComponent implements OnInit {
  @ViewChild("appendTo", { read: ViewContainerRef })
  public appendTo: ViewContainerRef | undefined;
  public dataSource: Array<any> = [];
  public total: number = 0;
  public loading = false;
  public key = Object.keys(localStorage);
  public badge = localStorage.length;
  public infoProduct: any;

  public listImageProduct: Array<any> = [];
  public listTypeSize: Array<any> = [];
  public listSize: Array<any> = [];
  public listProductByCategory: Array<any> = [];
  public listProductByQuantity: Array<any> = [];
  public listProperty: Array<any> = [];
  public defaultItem: any = {
    name: "Choose...",
    id: null,
  };
  public QuantityObj: QuanityModel = new QuanityModel();
  public formGroup = new FormGroup({
    property: new FormControl(),
    size: new FormControl(),
  });
  constructor(private api: ApiService, private message: MessageService, private dialogService: DialogService,
    private notificationService: NotificationService) { }

  ngOnInit(): void {
    this.key.map((x: any) => {
      let data: any = localStorage.getItem(x);
      let value = JSON.parse(data);
      this.dataSource.push(value);
    })
    this.dataSource.map((x) => {
      this.total = this.total + Number(parseInt(x.Product.price) * parseInt(x.Quantity));
    })
    this.message.receivedStorageCart().subscribe((res)=>{
      this.dataSource = [];
      this.key.map((x: any) => {
        let data: any = localStorage.getItem(x);
        let value = JSON.parse(data);
        this.dataSource.push(value);
      })    
      let same_cart = this.dataSource.filter((x:any)=> {
        if( x.Product.id == res.Product.id && 
          x.Property.idproperty == res.Property.idproperty && 
          x.Size.id == res.Size.id){
          return res;
        }else{
          return null;
        }
      });
      if(same_cart.length == 2){
        this.total = this.total - Number(parseInt(this.dataSource[0].Product.price) * parseInt(this.dataSource[0].Quantity));
        localStorage.removeItem(this.dataSource[0].Id);
        this.message.SendBadgeCart(localStorage.length);
        this.dataSource.splice(this.dataSource.indexOf(this.dataSource[0]),1);
        this.notificationService.show({
          appendTo: this.appendTo,
          content: "Chúng tôi đã xóa 1 sản phẩm trong giỏ hàng của bạn vì bạn đã sửa sản phẩm trùng với sản phẩm đã có trong giỏ hàng",
          animation: { type: "fade", duration: 500 },
          position: { horizontal: "right", vertical: "top" },
          type: { style: "success", icon: true },
        });
      }else{
        this.total = 0;
        this.dataSource.map((x) => {
          this.total = this.total + Number(parseInt(x.Product.price) * parseInt(x.Quantity));
        })
      }
    })
  }
  buyProduct(): void {
    if (sessionStorage.getItem('TOKEN') == null) {
      const dialogRef = this.dialogService.open({
        title: "Đăng nhập",
        content: DialogLoginComponent,
        width: 600,
        height: 400,
      });
    }
  }
  removeCardItem(e: any, data: any, index: any): void {
    let removeItem = JSON.parse(String(localStorage.getItem(data)));
    this.total = this.total - Number(parseInt(removeItem.Product.price) * parseInt(removeItem.Quantity));
    localStorage.removeItem(data);
    this.badge = localStorage.length;
    this.message.SendBadgeCart(this.badge);
    this.dataSource.splice(index, 1);
    this.notificationService.show({
      appendTo: this.appendTo,
      content: "Removed success",
      animation: { type: "fade", duration: 500 },
      position: { horizontal: "right", vertical: "top" },
      type: { style: "success", icon: true },
    });
  }
  infoCardItem(e: any, data: any, index: any): void {
    this.listSize = [];
    this.listProperty = [];
    let info = localStorage.getItem(data);
    this.infoProduct = JSON.parse(String(info));
    const dialogRef = this.dialogService.open({
      title: "Thông tin sản phẩm",
      content: DialogInfoProductComponent,
      width: 750,
      height: 500,
    });
    const getInfoWindow = dialogRef.content.instance;
    getInfoWindow.infoProduct = this.infoProduct;
    this.api.getApi('getProperty-and-size/' + this.infoProduct.Product.id).subscribe((res) => {
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
          getInfoWindow.listProperty = this.listProperty;
          getInfoWindow.formGroup.controls.property.setValue(String(this.infoProduct.Property.idproperty))
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
          getInfoWindow.listSize = this.listSize;
          getInfoWindow.formGroup.controls.size.setValue(this.infoProduct.Size)
          this.formGroup.controls.size.setValue(this.listSize[0]);
        })
      }
    })
  }
  changeQuantity(value: any): void {
    this.QuantityObj.Quantity = value;
  }
}
