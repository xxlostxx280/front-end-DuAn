import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PanelBarExpandMode, PanelBarItemModel } from "@progress/kendo-angular-layout";
import { ApiService } from 'src/app/shared/api.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  public kendoPanelBarExpandMode = PanelBarExpandMode.Multiple;
  public categoriesView: Array<any> = [];
  public categoriesChild: Array<any> = [];
  public panelItem: Array<any> = [];
  public router: Router;
  public selectedId = "";

  constructor(private api: ApiService, router: Router) {
    this.router = router;
    this.queryItems();
  }

  ngOnInit(): void {

  }
  private queryItems(): void {
    this.api.getApi('listCategory')
      .subscribe(res => {
        this.categoriesView = res.map((item: any) => {
          const data = <PanelBarItemModel><unknown>{
            id: item.id,
            title: item.name,
            children: [],
          }
          this.queryChildItems(data);
          return data;
        })
        this.panelItem = res;
      }, (mess) => {
        alert(mess)
      });
  }
  private queryChildItems(data: any): void {
    this.api.getApi('list-categoryDetail')
      .subscribe((res) => {
        const arr = res.filter((x: any) => x.category.id == data.id)
        data.children = arr.map((result: any) => {
          return <PanelBarItemModel>{ id: result.id, title: result.name };
        })
        this.categoriesChild.push(res);
      }, (mess) => {
        alert(mess)
      })
  }
  stateChange(data: Array<PanelBarItemModel>): boolean {
    const focusedEvent: PanelBarItemModel = data.filter(
      (item) => item.focused === true
    )[0];
    const arrDad = this.panelItem.filter((x: any) => x.name == focusedEvent.title);
    if (arrDad.length == 0) {
      const arrChild = this.categoriesChild[0].find((x: any) => x.id == focusedEvent.id);
      this.selectedId = focusedEvent.id;
      this.removeVietnameseTones(focusedEvent.title,focusedEvent);
      window.location.href = "/collection/" + focusedEvent.content;
    } else {
      const arrChild = this.categoriesView.filter((x: any) => x.title == arrDad[0].name);
      if (arrChild[0].children.length == 0) {
        this.selectedId = focusedEvent.id;
        window.location.href = "/collection/" + focusedEvent.content;
      }
    }
    return false;
  }
  removeVietnameseTones(str:any,data: any):void {
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
    data.content = str;
    return str;
  }
}
