import { Injectable } from "@angular/core";
import { Observable, Subject } from "rxjs";

@Injectable({
    providedIn: "root"
})
export class MessageService {
    private subjectBadge = new Subject<string>();
    private subjectStorage = new Subject<any>();

    constructor() { }

    SendBadgeCart(message: any) {
        this.subjectBadge.next(message)
    }
    receivedMessage(): Observable<any> {
        return this.subjectBadge.asObservable(); 
    }

    SendStorageCart(message: any){
        this.subjectStorage.next(message);
    }
    receivedStorageCart():Observable<any>{
        return this.subjectStorage.asObservable();
    }

}