import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/shared/api.service';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent implements OnInit {
  public items: any[] = [
    { title: "Flower", url: "https://bit.ly/2cJjYuB" },
    { title: "Mountain", url: "https://bit.ly/2cTBNaL" },
    { title: "Sky", url: "https://bit.ly/2cJl3Cx" },
  ];
  public listProduct: Array<any> = [] ;
  public width = "100%";
  public height = "400px";
  constructor(private api: ApiService) { }

  ngOnInit(): void {
    this.api.getApi("home").subscribe((res)=>{
      this.listProduct = res.data.slice(0,8);
    })
  }

}
