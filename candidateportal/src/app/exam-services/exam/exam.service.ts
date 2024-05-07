import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { UserDetails } from 'src/app/exam-shared/classes/user-details.class';
@Injectable({
  providedIn: 'root'
})
export class ExamService {

  public examUserDetails : BehaviorSubject<UserDetails>  = new BehaviorSubject<UserDetails>(new UserDetails());
  constructor() { }

  setDetails(userDetails:UserDetails)
  {
    this.examUserDetails.next(userDetails);
  }

  getDetails()
  {    
    return this.examUserDetails.value;
  }
}
