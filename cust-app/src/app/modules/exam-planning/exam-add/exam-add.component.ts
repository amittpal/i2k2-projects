import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'ngx-ixcheck-message-lib';
import { AppsettingsConfService } from 'src/app/services/conf/appsettings-conf/appsettings-conf.service';
import { GlobalRestService } from 'src/app/services/rest/global-rest.service';
import { Exam } from 'src/app/shared/enumrations/app-enum.enumerations';
import { HandelError, RestMethods } from 'src/app/shared/models/app.models';
import { PrimaryHeaderService } from '../../layout/primary-header/primary-header.service';
import { SharedService } from '../setup-exam-planning/plan-exam-setup/service/shared.service';

@Component({
  selector: 'app-exam-add',
  templateUrl: './exam-add.component.html',
  styleUrls: ['./exam-add.component.scss']
})
export class ExamAddComponent implements OnInit {

  public addExamFormGroup: FormGroup;
  private appRoutes: any = {};
  orderList: any = [];
  examNumber = 0;

  constructor(
    private configService: AppsettingsConfService,
    private router: Router,
    private SharedService: SharedService,
    private primaryHeader: PrimaryHeaderService,
    private messageService: MessageService,
    private restService: GlobalRestService
  ) {
    this.restService.ShowLoadingSpinner = true;
    this.restService.AlertAndErrorAction = HandelError.ShowAndReturn;
    this.configService.getAppRoutes.subscribe(
      configData => {
        this.appRoutes = configData;
      },
      error => {
        console.error("Error for configService.getAppRoutes: ", error);
      }
    );
  }

  ngOnInit() {
    //setting page title
    this.primaryHeader.pageTitle.next(" EXAM ADD");
    this.initializeFields();
    this.getExamOrderList();
  }

  getExamOrderList() {
    this.restService.ApiEndPointUrlOrKey = Exam.getOrderList;
    this.restService.AlertAndErrorAction = HandelError.ShowAndReturn;
    this.restService.callApi().subscribe(
      sucessResponse => {
        this.orderList = sucessResponse.orders;
      },
      errorResponse => {
        if (errorResponse !== undefined) {
          //this.messageService.ok(errorResponse);
        }
      }
    );
  }

  public initializeFields() {
    this.addExamFormGroup = new FormGroup({
      id: new FormControl(""),
      guid: new FormControl(""),
      exam_number: new FormControl("", Validators.required),
      order_id: new FormControl("", Validators.required),
      plan_status_guid: new FormControl(""),
      status: new FormControl("1", Validators.required),
      exam_public_label: new FormControl("", Validators.required),
    });
  }


  public formSubmit() {
    if (this.addExamFormGroup.valid === false) {
      let form = document.getElementById("addExamForm");
      form.classList.add("was-validated");
    } else if (this.addExamFormGroup.valid === true) {
      let params = this.addExamFormGroup.value;

      // call api code here...
      if (Object.keys(this.appRoutes).length !== 0) {
        this.restService.ApiEndPointUrlOrKey = Exam.saveOrder;
        this.restService.ApiEndPointMehod = RestMethods.Post;
        params['access_token']=localStorage.getItem('crmaccessToken')
        this.restService.HttpPostParams = params;
        this.restService.AlertAndErrorAction = HandelError.ShowAndReturn;
        this.restService.callApi().subscribe(
          sucessResponse => {
            this.messageService
              .okRedirectModal(sucessResponse, "SUCCESS", "Go to list")
              .subscribe(result => {
                if (result == true) {
                  this.router.navigate(['exam/planning']);
                  // OK = true for redirection
                  this.messageService.hideModal();
                } else {
                  // NO/CANCEL = false
                  this.messageService.hideModal();
                }
              });
          },
          errorResponse => {
            if (errorResponse !== undefined) {
              //this.messageService.ok(errorResponse);
            }
          }
        );
      }
    }
  }
  public checkInput(event) {
    var ctrlCode = (event.ctrlKey) ? event.ctrlKey : event.metaKey;  // get key cross-browser
    var charCode = (event.which) ? event.which : event.keyCode;      // get key cross-browser

    if ( // Allow: home, end, left, right, down, up
      (charCode >= 35 && charCode <= 40)
      // Allow: Ctrl+A,Ctrl+C,Ctrl+V, Command+A
      || (charCode == 65 || charCode == 86 || charCode == 67) && (ctrlCode === true)) {
      return true;
    }
    if (charCode > 31
      && (charCode < 48 || charCode > 57)) {
      return false;
    }
    else {
      return true
    }
  }
  public reset() {
    let form = document.getElementById("addExamForm");
    form.classList.remove("was-validated");
    this.addExamFormGroup.reset();
    this.initializeFields();
    let params = {};
  }

  public generateExamNumber(){
    let sixdigitsrandomnumber = Math.floor(100000 + Math.random() * 900000);
    let sixdigitsrandomstring = this.createRandomString(6);
    let examPublicLabel = "E" + sixdigitsrandomnumber + sixdigitsrandomstring;

    this.examNumber = sixdigitsrandomnumber;
    this.addExamFormGroup.controls["exam_number"].setValue(sixdigitsrandomnumber);
    this.addExamFormGroup.controls["exam_public_label"].setValue(examPublicLabel);
  }

  public createRandomString(length) {
  var result = [];
  var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result.push(characters.charAt(Math.floor(Math.random() *
      charactersLength)));
  }
  return result.join('');
}
}
