import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { ExamHeaderService } from './exam-header.service';
import { Subscription, config } from 'rxjs';
import { Router } from '@angular/router';
@Component({
  selector: 'app-exam-header',
  templateUrl: './exam-header.component.html',
  styleUrls: ['./exam-header.component.scss']
})
export class ExamHeaderComponent implements OnInit, OnDestroy {
  public page_title: string = "";
  public mobile_page_title: string = "";
  public user_name:string="";
  public class_name:string="";
  public section_name:string="";
  public current_question:string="";
  public timer_value:string="";
  public roll_number:string="";

  public config : any;
  public subscriptions: Subscription[] = [];
  examDetails: boolean = false;
  instructions: boolean = false;
  //Setting up page title
  // @Input() get pageTitle() {
  //   return this.pageTitle;
  // }
  // set pageTitle(pageTitleValue: string) {
  //   this.page_title = pageTitleValue;
  // }
  constructor(private ExamHeaderService: ExamHeaderService,
              private router: Router
              ) { }
  ngOnInit() {
    //Setting up page title   
    this.setPageTitle();
    
       
  }
  public setPageTitle() {      
    this.ExamHeaderService.instructions.subscribe(value => this.instructions = value);    
    this.subscriptions.push(
      this.ExamHeaderService.pageTitle.subscribe(value =>
         this.page_title = value
         ));    
    
    this.ExamHeaderService.mobilePageTitle.subscribe(value=>{
      this.mobile_page_title=value;
    });   
       
    this.ExamHeaderService.timerValue.subscribe(value=>{
      this.timer_value=value;
    })   

    this.ExamHeaderService.exam_config.subscribe(value => {
      this.ExamHeaderService.examDetails.subscribe(detail => this.examDetails = detail);
      // console.log(value)
      this.roll_number=value.roll_number?"Roll#: "+value.roll_number:"";
      this.user_name=value.name?" "+value.name:"";
    }) 

  }
  public setBackButtonConfig(){
    this.subscriptions.push(this.ExamHeaderService.header_config.subscribe(value => this.config = value));
   
  }
  openFilter(event) {

  }
  ngOnDestroy() {
    //Unsubscribing all subscriptions to avoid memory leak    
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }
  public navigate(){
    if(this.config.navigate_url != "")
    this.router.navigate([this.config.navigate_url]);
    this.config = {
      "show_button": false,
      "navigate_url": "",
      "page_title" : ""
    }
  }
}