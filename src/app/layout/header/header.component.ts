import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { Align } from '@progress/kendo-angular-popup';
import { ApiService } from 'src/app/shared/api.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  public items: any[] = [];
  public showLogin: boolean = false;
  public showAvartar: boolean = true;
  public anchorAlign: Align = { horizontal: 'right', vertical: 'bottom' };
  public popupAlign: Align = { horizontal: 'right', vertical: 'top' };
  public showPopup = false;

  constructor(private api: ApiService) { }

  ngOnInit(): void {
    if (sessionStorage.getItem("UserId") != null) {
      this.showLogin = true;
      this.showAvartar = false;
    }
    this.api.getApi('listCategory')
      .subscribe(res => {
        this.items = res;
      }, (mess) => {
        alert(mess)
      });
    this.api.getApi('list-categoryDetail')
    .subscribe((res)=>{
      res.map((dt:any)=>{
        this.items.push(dt);
      })
      console.log(this.items)
    },(mess)=>{
      alert(mess)
    })
  }
  handlePopup(): void {
    this.showPopup = !this.showPopup;
  }
}
