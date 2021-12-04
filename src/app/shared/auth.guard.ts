import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { Observable } from "rxjs";
import { AuthService } from "./auth.service";

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate {
    constructor(private auth: AuthService,private router: Router){
        
    }
    canActivate() {
        if(this.auth.IsLoggedIn()){
            if(sessionStorage.getItem('ROLE') != "ROLE_CUSTOMER"){
                return true;
            }else{
                this.router.navigate(['pageNotFound']);
                return false;
            }
        }
        this.router.navigate(['login']);
        return false;
    }
}