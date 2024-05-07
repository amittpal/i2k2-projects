import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
@Injectable({
    providedIn: 'root'
})
export class PaymentGetewayService {
    public paymentBy: BehaviorSubject<any> = new BehaviorSubject<any>("");
    constructor() { }

}