import { Component, OnInit } from '@angular/core';
import { PrimaryHeaderService } from '../layout/primary-header/primary-header.service';
import { FormGroup, FormControl, Validators } from "@angular/forms";
import {
  HandelError,
  Main
} from "src/app/shared/enumrations/app-enum.enumerations";
import { GlobalRestService } from "src/app/services/rest/global-rest.service";
import { RestMethods } from "src/app/shared/models/app.models";

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

  date:Date;
  public dashboardFormGroup: FormGroup;
  registrationList = [];
  examList = [];
  updateFlag = true;
  enableDashboardDetail = false;
  regGuid;
  examGuid;

  constructor(private primaryHeader: PrimaryHeaderService, private restService: GlobalRestService) {
    this.date = new Date();
   }

  ngOnInit() {
    //setting page title
    this.primaryHeader.pageTitle.next("Dashboard");
    this.dashboardFormGroup = new FormGroup({
      registration: new FormControl('', Validators.required),
      examCode: new FormControl('', Validators.required)
    });
    this.getRegistrationList();
  }

  public showMenu(event) {
    event.preventDefault();
    event.stopPropagation();
    document.querySelector('body').classList.add('az-iconbar-show');
  }

  getRegistrationList(){
    this.registrationList = [];
    this.restService.ApiEndPointUrlOrKey = Main.getRegistrationList;
    this.restService.ApiEndPointMehod = RestMethods.Get;
    this.restService.callApi().subscribe(
      successResponse => {
        this.registrationList = successResponse.registration;
        this.dashboardFormGroup.controls["registration"].setValue(this.registrationList[0]["guid"]);
        this.getExamList();
      })
  }

  getExamList(){
    this.examList = [];
    this.enableDashboardDetail = false;
    this.dashboardFormGroup.controls["examCode"].setValue("");
    this.updateFlag = true;
    let regGuid = this.dashboardFormGroup.controls["registration"].value;
    var keyData = [
      {
        name: "regGuid",
        value: regGuid
      }
    ];
    this.restService.ApiEndPointUrlOrKey = Main.getExamList;
    this.restService.ApiEndPointMehod = RestMethods.Get;
    this.restService.callApi(keyData).subscribe(
      successResponse => {
        this.examList = successResponse.code;
        this.dashboardFormGroup.controls["examCode"].setValue(this.examList[0]["exam_guid"]);
        this.getDashboardDetails()
      })
  }

  getDashboardDetails() {
    this.regGuid = this.dashboardFormGroup.controls["registration"].value;
    this.examGuid = this.dashboardFormGroup.controls["examCode"].value;
    this.enableDashboardDetail = true;
  }

}
