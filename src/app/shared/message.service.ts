import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, Subject } from "rxjs";

@Injectable({
    providedIn: "root"
})
export class MessageService {
    private subjectBadge = new Subject<string>();
    private subjectStorage = new Subject<any>();
    private subjectTokenAccount = new Subject<any>();
    private subjectDataAfterUpdate = new Subject<any>();
    private behaviorSubjectData = new BehaviorSubject<any[]>([]);
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

    SendTokenAccount(message: any){
        this.subjectTokenAccount.next(message)
    }
    receivedTokenAccount():Observable<any>{
        return this.subjectTokenAccount.asObservable();
    }

    SendDataAfterUpdate(message: any){
        this.subjectDataAfterUpdate.next(message);
    }
    receivedDataAfterUpadte():Observable<any>{
        return this.subjectDataAfterUpdate.asObservable();
    }
    
    ///// Thay đổi data sau khi sửa data trên grid ///////
    SendDataBehavior(message: any){
        this.behaviorSubjectData.next(message);
    }
    receivedDataBehavior(): Observable<any>{
        return this.behaviorSubjectData.asObservable();
    }
}