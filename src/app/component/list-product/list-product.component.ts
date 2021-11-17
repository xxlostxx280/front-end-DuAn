import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/shared/api.service';
import { PageChangeEvent, PagerSettings } from "@progress/kendo-angular-listview";

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

  constructor(private api: ApiService) { }

  ngOnInit(): void {
    this.api.Controller = "ProductController";
    this.api.Read.Execute().subscribe((res)=>{
      this.listProduct = res.data;
      this.total = res.data.length;
      this.pageData();
    },(ex)=>{

    });
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
