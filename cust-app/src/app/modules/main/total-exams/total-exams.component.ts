import { Component, Input, OnInit, EventEmitter, Output, OnChanges } from "@angular/core";
import { AppsettingsConfService } from "src/app/services/conf/appsettings-conf/appsettings-conf.service";
import { MessageService } from "ngx-ixcheck-message-lib";
import { GlobalRestService } from "src/app/services/rest/global-rest.service";
import {
  HandelError,
  Main
} from "src/app/shared/enumrations/app-enum.enumerations";
import { RestMethods } from "src/app/shared/models/app.models";

@Component({
  selector: 'app-total-exams',
  templateUrl: './total-exams.component.html',
  styleUrls: ['./total-exams.component.scss']
})
export class TotalExamsComponent implements OnInit {

  @Input() regGuid: any;
  @Input() examGuid: any;
  public totalExams = "";
  public date = "";
  public shift = "";

  constructor(
    private configService: AppsettingsConfService,    
    private messageService: MessageService,
    private restService: GlobalRestService
  ) { }

  ngOnInit() {}

  ngOnChanges(){
    this.getTotalExam();
  }

  getTotalExam() {

    var keyData = [
      {
        name: "regGuid",
        value: this.regGuid
      },
      {
        name: "examGuid",
        value: this.examGuid
      }      
    ];

    this.restService.ApiEndPointUrlOrKey = Main.getTotalExam;
    this.restService.ApiEndPointMehod = RestMethods.Get;
    this.restService.callApi(keyData).subscribe(
      successResponse => {
        this.totalExams = successResponse.exams[0]["total_exams"];
      })
  }

}
