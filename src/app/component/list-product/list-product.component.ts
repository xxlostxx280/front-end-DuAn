import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/shared/api.service';
import { PageChangeEvent, PagerSettings } from "@progress/kendo-angular-listview";
import { MessageService } from 'src/app/shared/message.service';
import { HttpClient } from '@angular/common/http';
import { DialogService, WindowService } from '@progress/kendo-angular-dialog';
import { NotificationService } from '@progress/kendo-angular-notification';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-list-product',
  templateUrl: './list-product.component.html',
  styleUrls: ['./list-product.component.css']
})
export class ListProductComponent implements OnInit {
  public listProduct: Array<any> = [];
  public dataSource: any = [];
  public pageSize = 20;
  public skip = 0;
  public pagedDestinations = [];
  public total = 0;

  constructor(private api: ApiService, private message: MessageService, public http: HttpClient, private windowService: WindowService, private dialogService: DialogService,
    private notificationService: NotificationService, private formBuilder: FormBuilder) {
  }
  public Product: ApiService = new ApiService(this.http, this.windowService, this.dialogService, this.notificationService, this.message, this.formBuilder);
  public Quantity: ApiService = new ApiService(this.http, this.windowService, this.dialogService, this.notificationService, this.message, this.formBuilder);

  ngOnInit(): void {
    this.Product.Controller = "ProductController";
    this.Quantity.Controller = "QuantityController";
    this.Product.Read.Execute().subscribe((res) => {
      this.Product.dataSource = res.data;
    });
    this.Quantity.Read.Execute().subscribe((res) => {
      this.Quantity.dataSource = res.data;
      this.Product.dataSource.map((x)=>{
        let arr = this.Quantity.dataSource.filter((val)=> val.product.id == x.id)
        if(arr.length > 0){
          this.listProduct.push(x);
        }
      })
      this.total = this.listProduct.length;
      this.pageData();
    })
    this.message.receviedFilterProduct().subscribe((rs)=>{
      this.listProduct = [];
      if(rs == "all"){
        this.Product.dataSource.map((x)=>{
          let arr = this.Quantity.dataSource.filter((val)=> val.product.id == x.id)
          if(arr.length > 0){
            this.listProduct.push(x);
          }
        })
      }
      if(rs == "discount"){
        this.Product.dataSource.map((x)=>{
          let arr = this.Quantity.dataSource.filter((val)=> val.product.id == x.id && val.product.discount > 0)
          if(arr.length > 0){
            this.listProduct.push(x);
          }
        })
      }
      if(rs == "new"){}
      if(rs == "selling"){}
    })
  }
  public onPageChange(e: PageChangeEvent): void {
    this.skip = e.skip;
    this.pageSize = e.take;
    this.pageData();
  }

  private pageData(): void {
    this.dataSource = this.listProduct.slice(
      this.skip,
      this.skip + this.pageSize
    );
  }
}
