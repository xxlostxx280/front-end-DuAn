import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ApiService } from 'src/app/shared/api.service';

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
  public slideIndex = 1;

  public disabled = true;
  public activeIndex = 1;
  public defaultItem: any = {
    name: "Choose...",
    id: null,
  };
  constructor(private api: ApiService) { }

  ngOnInit(): void {
    let url = window.location.href;
    let id = url.replace('http://localhost:4200/list-product/info/', '');
    this.showSlides(this.slideIndex);
    this.api.getApi('list-product/info/' + id).subscribe((res) => {
      let description = res.data.description;
      let descriptionDetail = res.data.descriptionDetail;
      this.infoProduct = res.data;
      this.infoProduct.description = decodeURIComponent(description.replace(/\+/g, ""));
      this.infoProduct.descriptionDetail = decodeURIComponent(descriptionDetail.replace(/\+/g, " "));
    })
    // this.api.getApi('list-image/'+id).subscribe((res)=>{
    //   this.listImageProduct = res.data;
    // })
    this.api.getApi('list-type-size').subscribe((res) => {
      this.listTypeSize = res.data;
    }, (err: any) => {

    })
    this.api.getApi('GetProductByCategory/' + id).subscribe((res) => {
      this.listProductByCategory = res.data;
    })
  }

  changeType(e: any): void {
    this.api.postApi('list-size', e.target.value).subscribe((res) => {
      this.listSize = res.data;
      this.disabled = false;
    })
  }
  showSlides(e: any): void {
    var i;
    var slides = document.getElementsByClassName("mySlides");
    
  }
  plusSlides(e: any): void {
    this.showSlides(this.slideIndex += e);
  }
}
