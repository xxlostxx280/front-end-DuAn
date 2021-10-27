import { AfterViewInit, Component, ElementRef, Injectable, OnInit, ViewChild } from '@angular/core';
import { BreadCrumbItem } from '@progress/kendo-angular-navigation';
import { Align } from '@progress/kendo-angular-popup';
import { ApiService } from 'src/app/shared/api.service';
import { MessageService } from 'src/app/shared/message.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
@Injectable({
  providedIn: 'root'
})
export class HeaderComponent implements OnInit {
  public items: Array<any> = []; // menu item router
  public itemsParent: Array<any> = []; // menu items cha 
  public itemsChild: Array<any> = []; // menu items con
  public menu_item = {
    text: '',
    path: '',
    child: {},
  }
  public breadcrumb: BreadCrumbItem[] = [
    {
      icon: "home",
    },
    {
      text: "Item 2",
      disabled: true,
    },
    {
      text: "Item 3",
    },
    {
      text: "Item 4",
    },
  ];
  public url : string | undefined;
  public showLogin: boolean = true;
  public showAvatar: boolean = false;
  public badge = localStorage.length;
  public menu: Array<any> = [];

  constructor(private api: ApiService, private message: MessageService) { }

  ngOnInit(): void {
    if (sessionStorage.getItem("USERNAME") != null) {
      this.showLogin = false;
      this.showAvatar = true;
    }
    this.message.receivedMessage().subscribe((rs) => {
      this.badge = rs;
    })
    this.message.receivedTokenAccount().subscribe((rs)=>{
      this.showAvatar = true;
      this.showLogin = false;
    })
    this.api.getApi('listCategory').subscribe((res) => {
      this.itemsParent = res;
    });
    this.api.getApi('list-categoryDetail').subscribe((res) => {
      this.itemsChild = res;
      this.mapItems();
    })
  }
  openLogin(): void {
    window.location.href = '/login';
  }
  signOut(): void {
    sessionStorage.removeItem('USERNAME');
    sessionStorage.removeItem('TOKEN');
    this.showLogin = true;
    this.showAvatar = false;
  }

  //convert categorydetail thành menu item
  mapItems(): void {                             
    this.itemsParent.map((x)=>{
      let routeChild = this.itemsChild.filter((val)=> val.category.id == x.id);
      let arr: { text: string; path: string; }[] = [];
      let menu_item = {
        text: '',
        path: '',
        items: {},
      }
      routeChild.map((val)=>{
        this.removeVietnameseTones(val.name)
        let menu_item_child = {
          text: '',
          path: ''  
        }
        menu_item_child.text = val.name;
        menu_item_child.path = '/collection/' + this.url;
        arr.push(menu_item_child);
      })
      menu_item.text = x.name;
      menu_item.items = arr;
      this.items.push(menu_item);
    })
  }
  onSelect(e:any){
    if (e.item.items == undefined) {
      window.location.href = e.item.path;
    }
  }
  removeVietnameseTones(str:any):void {
    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g,"a"); 
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g,"e"); 
    str = str.replace(/ì|í|ị|ỉ|ĩ/g,"i"); 
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g,"o"); 
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g,"u"); 
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g,"y"); 
    str = str.replace(/đ/g,"d");
    str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, "A");
    str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, "E");
    str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, "I");
    str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, "O");
    str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, "U");
    str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, "Y");
    str = str.replace(/Đ/g, "D");
    // Some system encode vietnamese combining accent as individual utf-8 characters
    // Một vài bộ encode coi các dấu mũ, dấu chữ như một kí tự riêng biệt nên thêm hai dòng này
    str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, ""); // ̀ ́ ̃ ̉ ̣  huyền, sắc, ngã, hỏi, nặng
    str = str.replace(/\u02C6|\u0306|\u031B/g, ""); // ˆ ̆ ̛  Â, Ê, Ă, Ơ, Ư
    // Remove extra spaces
    // Bỏ các khoảng trắng liền nhau
    str = str.replace(/\s/g,"-");
    str = str.trim();
    // Remove punctuations
    // Bỏ dấu câu, kí tự đặc biệt
    str = str.replace(/!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|{|}|\||\\/g," ");
    this.url = str;
    return str;
  }
}
