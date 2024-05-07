import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { MessageService } from 'ngx-ixcheck-message-lib';
import { GlobalRestService } from 'src/app/services/rest/global-rest.service';
import { Exam } from 'src/app/shared/enumrations/app-enum.enumerations';
import { HandelError } from 'src/app/shared/models/app.models';

@Component({
  selector: 'app-publish-response',
  templateUrl: './publish-response.component.html',
  styleUrls: ['./publish-response.component.scss']
})
export class PublishResponseComponent implements OnInit {

  public examGuid : any;
  constructor(
    private restService:GlobalRestService,
    private route: ActivatedRoute,
    private messageService: MessageService, 
    private router: Router) { }

  ngOnInit() {

    this.route.params.subscribe((params: Params) => {
      this.examGuid = params['examId'];
      this.publishMockExam();     
    }, error => {
      console.error('Error: ', error);
    });

  }

  publishMockExam()
  {
    var keyData = [
      {
        "name": "examGuid",
        "value": this.examGuid
      }
    ];
      this.restService.ApiEndPointUrlOrKey = Exam.publishMockExam;      
      this.restService.AlertAndErrorAction = HandelError.HideAndReturn;      
      this.restService.callApi(keyData)
        .subscribe(sucessResponse => {   
          this.messageService
          .okRedirectModal(sucessResponse, "SUCCESS", "Go to Main list")
          .subscribe(result => {
            if (result == true) {
              // OK = true for redirection
              this.messageService.hideModal();
              this.router.navigate(["/exam/publish"]);
            } else {
              // NO/CANCEL = false
              this.messageService.hideModal();
            }
          });             

        }, errorResponse => {
          if (errorResponse !== undefined) {
           this.messageService.alert(errorResponse.httpErrorResponse)
          }
        });
  }

}
