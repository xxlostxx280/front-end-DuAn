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
  public pageSize = 12;
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
      this.total = res.data.length;
      this.pageData();
    });
    this.Quantity.Read.Execute().subscribe((res) => {
      this.Quantity.dataSource = res.data;
      this.Product.dataSource = this.Quantity.dataSource.map((val, idx) => {
        for (let i = 0; i < this.Product.dataSource.length; i++) {
          if(val.product.id == this.Product.dataSource[i].id){
            this.listProduct.push(this.Product.dataSource[i]);
          }
        }
      })
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
