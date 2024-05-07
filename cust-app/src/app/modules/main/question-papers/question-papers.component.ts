import { Component, OnInit, Input } from '@angular/core';
import { AppsettingsConfService } from "src/app/services/conf/appsettings-conf/appsettings-conf.service";
import { MessageService } from "ngx-ixcheck-message-lib";
import { GlobalRestService } from "src/app/services/rest/global-rest.service";
import {
  HandelError,
  Main
} from "src/app/shared/enumrations/app-enum.enumerations";
import { RestMethods } from "src/app/shared/models/app.models";

@Component({
  selector: 'app-question-papers',
  templateUrl: './question-papers.component.html',
  styleUrls: ['./question-papers.component.scss']
})
export class QuestionPapersComponent implements OnInit {

  @Input() regGuid: any;
  @Input() examGuid: any;   
  public questionPaperDetail = ""; 
  
  constructor(
    private configService: AppsettingsConfService,
    private messageService: MessageService,
    private restService: GlobalRestService
  ) { }

  ngOnInit() {
  }

  ngOnChanges() {
    this.getQuestionPaperDetails();
  }

  getQuestionPaperDetails() {

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

    this.restService.ApiEndPointUrlOrKey = Main.getQuestionPaperDetails;
    this.restService.ApiEndPointMehod = RestMethods.Get;
    this.restService.callApi(keyData).subscribe(
      successResponse => {
        this.questionPaperDetail = successResponse.exams[0];
      })
  }

}
