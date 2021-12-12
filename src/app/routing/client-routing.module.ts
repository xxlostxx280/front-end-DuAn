import { NgModule } from "@angular/core";
import { ModuleWithProviders } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { HistoryAndWalletComponent } from "../layout/history-and-wallet/history-and-wallet.component";
import { ListProductByCategoryComponent } from "../component/list-product-by-category/list-product-by-category.component";
import { ListProductComponent } from "../component/list-product/list-product.component";
import { ProductDetailsComponent } from "../component/product-details/product-details.component";
import { DefaultComponent } from "../layout/default/default.component";
import { AuthGuard } from "../shared/auth.guard";

const routes: Routes = [
    {
        path: 'list-product',
        component: DefaultComponent,
        children: [
            {
                path: '',
                component: ListProductComponent
            },
            {
                path: 'Sale',
                component: ListProductComponent
            },
            {
                path: 'New',
                component: ListProductComponent
            },
            {
                path: 'Highlights',
                component: ListProductComponent
            },
            {
                path: 'collection/:id/:id',
                component: ListProductByCategoryComponent,
            },
            {
                path: 'info/:id',
                component: ProductDetailsComponent
            },
        ]
    },
    {
        path: 'collection',
        component: DefaultComponent,
        children: [
            {
                path: ':id',
                component: ListProductByCategoryComponent
            }
        ]
    },
    {
        path: 'history-and-wallet',
        component: HistoryAndWalletComponent,
        canActivate: [AuthGuard],
    },
];
@NgModule({
    imports: [
        RouterModule.forRoot(routes),
    ],
    exports: [RouterModule]
})
export class ClienRoutingModule { }