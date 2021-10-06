import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FlexLayoutModule } from "@angular/flex-layout";
import { RouterModule } from "@angular/router";
import { HeaderComponent } from "./header/header.component";
import { FooterComponent } from "./footer/footer.component";
import { SidebarComponent } from "./sidebar/sidebar.component";
import { LayoutModule, PanelBarService } from "@progress/kendo-angular-layout";
import { ButtonsModule } from "@progress/kendo-angular-buttons";
import { PagerModule } from "@progress/kendo-angular-pager";
import { PopupModule } from "@progress/kendo-angular-popup";
import { MenusModule } from "@progress/kendo-angular-menu";
import { IconsModule } from "@progress/kendo-angular-icons";
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { LabelModule } from "@progress/kendo-angular-label";
import { InputsModule } from "@progress/kendo-angular-inputs";
import { ScrollViewModule } from "@progress/kendo-angular-scrollview";
import { HomePageComponent } from './home-page/home-page.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@NgModule({
    declarations:[
        HeaderComponent,
        SidebarComponent,
        FooterComponent,
        HomePageComponent,
    ],
    imports:[
        FontAwesomeModule,
        ScrollViewModule,
        ReactiveFormsModule,
        FormsModule,
        LabelModule,
        InputsModule,
        BrowserModule,
        BrowserAnimationsModule,
        IconsModule,
        ButtonsModule,
        PopupModule,
        MenusModule,
        PagerModule,
        CommonModule,
        RouterModule,
        FlexLayoutModule,
        LayoutModule,
    ],
    exports:[
        HeaderComponent,
        SidebarComponent,
        FooterComponent,
        HomePageComponent,
    ],
    providers: [
        PanelBarService
    ]
})
export class shareModule{}