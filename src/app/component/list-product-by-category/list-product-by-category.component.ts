import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/shared/api.service';

@Component({
  selector: 'app-list-product-by-category',
  templateUrl: './list-product-by-category.component.html',
  styleUrls: ['./list-product-by-category.component.css']
})
export class ListProductByCategoryComponent implements OnInit {

  constructor(private api: ApiService) { }

  ngOnInit(): void {
    this.api.getApi('')
  }

}
