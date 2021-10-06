import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PanelBarExpandMode, PanelBarItemModel } from "@progress/kendo-angular-layout";
import { ApiService } from 'src/app/shared/api.service';
import { items } from '../header/menu';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  public kendoPanelBarExpandMode = PanelBarExpandMode.Multiple;
  public categoriesView: Array<any> = [];
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
      }, (mess) => {
        alert(mess)
      })
  }
  public stateChange(data: Array<PanelBarItemModel>): boolean {
    const focusedEvent: PanelBarItemModel = data.filter(
      (item) => item.focused === true
    )[0];
    const arrDad = this.panelItem.filter((x: any) => x.name == focusedEvent.title);
    if (arrDad.length == 0) {
      this.selectedId = focusedEvent.id;
      this.router?.navigate(["/list-product/category/" + focusedEvent.id]);
    } else {
      const arrChild = this.categoriesView.filter((x: any) => x.title == arrDad[0].name);
      if (arrChild[0].children.length == 0) {
        this.selectedId = focusedEvent.id;
        this.router?.navigate(["/list-product/" + focusedEvent.id]);
      }
    }
    return false;
  }

}
