import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/shared/api.service';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent implements OnInit {
  public items: any[] = [
    { title: "Flower", url: "https://i.pinimg.com/originals/6c/52/58/6c52584568600f7c77f91f49be6ea1b4.jpg" },
    { title: "Mountain", url: "https://cdn.shopify.com/s/files/1/2595/4890/files/main-banner-1_3b5bf70a-0c67-4a9a-a718-591a5e523437_1400x.progressive.png.jpg?v=1559885493" },
    { title: "Sky", url: "https://cdn.shopify.com/s/files/1/0064/5667/2338/files/August-website-banner-1_1024x1024.jpg?v=1618915575" },
  ];
  public listProduct: Array<any> = [] ;
  public width = "100%";
  public height = "600px";
  constructor(private api: ApiService) { }

  ngOnInit(): void {
    this.api.getApi("Customer/ProductController/home").subscribe((res)=>{
      this.listProduct = res.data.slice(0,8);
    })
  }

}
