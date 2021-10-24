import { NgModule } from "@angular/core";
import { ModuleWithProviders } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { ListProductByCategoryComponent } from "../component/list-product-by-category/list-product-by-category.component";
import { ListProductComponent } from "../component/list-product/list-product.component";
import { ProductDetailsComponent } from "../component/product-details/product-details.component";
import { DefaultComponent } from "../layout/default/default.component";

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
    }
];
@NgModule({
    imports: [
        RouterModule.forRoot(routes),
    ],
    exports: [RouterModule]
})
export class ClienRoutingModule { }