import { Component, Input, ElementRef, OnInit, OnChanges, SimpleChanges, Output, EventEmitter, NgZone } from '@angular/core';
import { ApiService } from 'src/app/shared/api.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  public chart: any;
  public date = new Date();
  public chartDayOfMonth: Array<any> = [];
  constructor(public api: ApiService) { }

  ngOnInit(): void {
    this.api.Controller = "StatisController";
    this.getDataDayOfMonth(this.date.getMonth(), this.date.getFullYear());
  }
  getDataDayOfMonth(month: any, year: any): void {
    this.api.getApi('Manager/' + this.api.Controller + '/getEveryDayOfTheMonth?month=' + month + '&year=' + year)
      .subscribe((rs) => {
        this.chartDayOfMonth = [];
        rs.data.map((val: any, idx: any) => {
          let day = new Date(val.day).getDate();
          let chartDayOfMonth = {
            day: day,
            total: val.total
          }
          this.chartDayOfMonth.push(chartDayOfMonth);
        })
      }, (error) => {
        if (error.status == 500) {
          let id = encodeURIComponent('Bạn không có quyền vào trang đó').replace(/'/g, "%27").replace(/"/g, "%22")
          window.location.href = "/login/" + id;
        } else {
          this.api.Notification.notificationError('');
        }
      })
  }
  onChange(event: any): void {
    let e = event;
    this.getDataDayOfMonth(event.getMonth(), event.getFullYear());
  }
}
