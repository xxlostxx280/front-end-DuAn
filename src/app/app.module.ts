import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { GridModule } from '@progress/kendo-angular-grid';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import '@angular/localize/init';
import { ReactiveFormsModule } from '@angular/forms';
import '@angular/compiler';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './routing/app-routing.module';
import { DefaultModule } from './layout/default/default.module';
import { LayoutModule } from '@progress/kendo-angular-layout';
import { IconsModule } from '@progress/kendo-angular-icons';
import { PagerModule } from '@progress/kendo-angular-pager';
import { MenuModule } from '@progress/kendo-angular-menu';
import { ScrollViewModule } from '@progress/kendo-angular-scrollview';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ClienRoutingModule } from './routing/client-routing.module';
import { ListViewModule } from '@progress/kendo-angular-listview';
import { InputsModule } from '@progress/kendo-angular-inputs';



@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    FontAwesomeModule,
    BrowserModule,
    GridModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    HttpClientModule,
    LayoutModule,
    IconsModule,
    PagerModule,
    MenuModule,
    ScrollViewModule,
    AppRoutingModule,
    ClienRoutingModule,
    DefaultModule,
    ListViewModule,
    InputsModule,

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
