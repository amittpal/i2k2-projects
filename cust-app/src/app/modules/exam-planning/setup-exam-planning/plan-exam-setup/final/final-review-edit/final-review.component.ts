import {
  Component,
  OnInit,
  OnDestroy,
  Output,
  EventEmitter
} from "@angular/core";
import { GlobalRestService } from "src/app/services/rest/global-rest.service";
import {
  HandelError,
  Exam
} from "src/app/shared/enumrations/app-enum.enumerations";
import { NgxIxcheckTableParams } from "ngx-ixcheck-table-lib";
import { AppsettingsConfService } from "src/app/services/conf/appsettings-conf/appsettings-conf.service";
// import bubbleConfig from "../../../../assets/config/bubbleconfig.json";
import { PrimaryHeaderService } from "src/app/modules/layout/primary-header/primary-header.service";
import { RestMethods } from "src/app/shared/models/app.models";
import { SharedService } from "../../service/shared.service";
import { Subscription } from "rxjs";
import { MessageService } from "ngx-ixcheck-message-lib";
import { Router } from "@angular/router";
@Component({
  selector: "app-final-review",
  templateUrl: "./final-review.component.html",
  styleUrls: ["./final-review.component.scss"]
})
export class FinalReviewComponent implements OnInit, OnDestroy {
  @Output() private nextTab = new EventEmitter<number>(); // Sends tab id to parent component
  public items = [];
  public itemCount = 0;
  public lastSeenIdMax = 0;
  public lastSeenIdMin = 0;
  public lastOffset = 0;
  public offset = 0;
  // public config = bubbleConfig
  public resultModal: string;
  //public resetFilterFlag: boolean = false;
  public updatedFilter: any;
  // public count: Number = 0;
  public notFound: boolean = false;
  public displayMessage: any;
  public paginationStyle = "minimal";
  private appRoutes: any = {};

  public defaultPagingParams: any = {
    total_rows: 0,
    returned_rows: 0,
    direction: 0,
    order_dir: "",
    page_size: 10,
    sort_by: "",
    offset: 0,
    last_offset: 0,
    last_seen_id_max: 0,
    last_seen_id_min: 0
  };
  /////////////////////////
  sectionList: any;
  emailIdSub: Subscription;
  IdSub: Subscription;
  examId: any;
  Id: any;
  subjectList: any = [];
  constructor(
    private messageService: MessageService,
    private configService: AppsettingsConfService,
    private SharedService: SharedService,
    private restService: GlobalRestService,
    private primaryHeader: PrimaryHeaderService,
    private router: Router
  ) {
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
    this.primaryHeader.pageTitle.next("Manage Exam");

    this.getExamId();
  }

  getExamId() {
    this.emailIdSub = this.SharedService.ExamId.subscribe(examId => {
      if (examId != null) {
        this.examId = examId;
        // this.Id = id;
        this.getData();
      }
    });

    // Restrict New user to call API
    // this.IdSub = this.SharedService.ID.subscribe(id => {
    //   // debugger
    //   if (id != null) {
    //     // New User
    //     this.emailIdSub = this.SharedService.ExamId.subscribe(examId => {
    //       if (examId != null) {
    //         this.examId = examId;
    //         this.Id = id;
    //         this.getData();
    //       }
    //     });
    //   }
    // });
  }

  ngOnDestroy() {
    // prevent memory leak when component destroyed
    if (this.IdSub) {
      this.IdSub.unsubscribe();
    }
    if (this.emailIdSub) {
      this.emailIdSub.unsubscribe();
    }
  }

  public sendToParent(tabId: number) {
    this.nextTab.emit(2); // Select next tab
  }

  onDelete(id) {
    if (this.items.length > 1) {
      this.messageService
        .confirm(
          ["Are you sure you want to delete this record?"],
          "Delete",
          "Yes",
          "NO",
          "error"
        )
        .subscribe(result => {
          if (result == true) {
            this.messageService.hideModal();
            const keyData = [
              {
                name: "examId",
                value: this.examId
              },
              {
                name: "sectionId",
                value: id
              }
            ];
            let params = { exam_id: this.examId, section_id: id };
            this.restService.ApiEndPointUrlOrKey = Exam.deleteSection;
            this.restService.HttpPostParams = params;
            this.restService.callApi(keyData).subscribe(
              successResponse => {
                // this.messageService.ok(successResponse.message[0]);
                this.messageService
                  .okRedirectModal(successResponse, "SUCCESS")
                  .subscribe(result => {
                    if (result == true) {
                      // OK = true for redirection
                      this.messageService.hideModal();
                      // this.getData();
                      this.items = this.items.filter(list => list.id !== id);
                      // this.getData(this._getRemoteParameters(), false);
                    } else {
                      // NO/CANCEL = false
                      this.messageService.hideModal();
                    }
                  });
              },
              () => {
                this.messageService.hideModal();
              }
            );
          } else {
            this.messageService.hideModal();
          }
        });
    } else {
      this.messageService.ok("Minimum one selection is required");
    }
  }

  updateSection(id: any) {
    // console.log(id);
    this.SharedService.sectionId.next(id);
    this.nextTab.emit(1); // Select section tab
  }

  public getData(params?: NgxIxcheckTableParams) {
    this.subjectList = [];
    var keyData = [
      {
        name: "examId",
        value: this.examId
      }
    ];

    // Get Section List According to ExamId
    this.restService.ApiEndPointUrlOrKey = Exam.getSectionList;
    this.restService.callApi(keyData).subscribe(
      sucessResponse => {
        // console.log(JSON.stringify(sucessResponse));
        this.items = sucessResponse.sections;
        let subjects = sucessResponse.subjects;
        this.getSubjectList(subjects);
        this.sectionList = sucessResponse.sections;
      },
      errorResponse => {
        console.error("ERROR: ", errorResponse.message[0]);
      }
    );
  }

  getSubjectList(subjects: any) {
    subjects.forEach(name => {
      this.subjectList.push(name.subject);
    });

  }

  public rowClick(_event) {}

  public rowDoubleClick(_event) {}

  public formSubmit() {
    if (Object.keys(this.appRoutes).length !== 0) {
      var keyData = [
        {
          name: "examId",
          value: this.examId
        }
      ];
      this.restService.ApiEndPointUrlOrKey = Exam.finalizeExam;
      this.restService.ApiEndPointMehod = RestMethods.Put;
      this.restService.AlertAndErrorAction = HandelError.ShowAndReturn;
      this.restService.callApi(keyData).subscribe(
        sucessResponse => {
          this.messageService
            .okRedirectModal(sucessResponse, "SUCCESS", "Go to Main list")
            .subscribe(result => {
              if (result == true) {
                // OK = true for redirection
                this.messageService.hideModal();
                this.router.navigate(["/exam/planning"]);
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
