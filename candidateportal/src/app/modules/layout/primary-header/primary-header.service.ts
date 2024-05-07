import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CandidateInfo } from 'src/app/shared/classes/candidate/candidate-info.class';
@Injectable({
  providedIn: 'root'
})
export class PrimaryHeaderService {
  public pageTitle: BehaviorSubject<any> = new BehaviorSubject<any>(" ");
  public userLoginStatus: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  constructor() {}
  public config: any = {
    "show_button": false,
    "navigate_url": "",
    "page_title" : ""
  };

  public saveCanidateInfoToStorage(candidateInfo:CandidateInfo)
  {
    if(candidateInfo)
    {
      localStorage.setItem("candidateInfo", JSON.stringify(candidateInfo));
    }
  }

  public getCanidateInfoFromStorage()
  {
    const info:CandidateInfo= JSON.parse(localStorage.getItem("candidateInfo"));    
    if(info)
    {
      return info;
    }
  }
  public removeCandidateInfoFromStorage()
  {
    if(localStorage.getItem("candidateInfo"))
    localStorage.removeItem("candidateInfo");   
  }

  public header_config: BehaviorSubject<any> = new BehaviorSubject<any>(this.config);
}