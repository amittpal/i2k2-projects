import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { AppsettingsConfService } from 'src/app/services/conf/appsettings-conf/appsettings-conf.service';
import { PrimaryHeaderService } from '../../../../layout/primary-header/primary-header.service';
import { MessageService } from 'ngx-ixcheck-message-lib';
import { GlobalRestService } from 'src/app/services/rest/global-rest.service';
import { HandelError, Author, ImportAuthors } from 'src/app/shared/enumrations/app-enum.enumerations';
import { RestMethods } from 'src/app/shared/models/app.models';
import { ActivatedRoute, Params, Router } from '@angular/router';

@Component({
  selector: 'app-assign-questions',
  templateUrl: './assign-questions.component.html',
  styleUrls: ['./assign-questions.component.scss']
})
export class AssignQuestionsComponent implements OnInit {
  @Input() examId: any;
  shiftNumber: any;
  langGuid: any;
  primary: any;
  public examShiftFormGroup: FormGroup;
  examShiftDetails: any = {};
  numberOfShifts: any = [];
  items:any=[];
  total_assigned_students = 0;
  total_remaining_students = 0;
  lastSeenIdMin: any;
  lastSeenIdMax: any;
  lastOffset: any;
  itemCount: any;
  notFound: any;
  searchUserModal: any;
  orgItems: any;
  assignmentId: any;
  authorList = [];
  languageList: any;

  public questiondata: any = {
    "author_guid": "",
    "reviewer_guid": "",
    "approver_guid": "",
  };
  assignQuestionsDetails: any = [];
  // disableApprovar: boolean = false;
  // disableAuthor: boolean = false;
  // disableReviewer: boolean = false;
  
  allowBulkUpdate = false;  
  constructor(private configService: AppsettingsConfService, private route: ActivatedRoute, private router: Router, private primaryHeader: PrimaryHeaderService,
    private messageService: MessageService, private restService: GlobalRestService) { }

  ngOnInit() {
    //setting page title  
    this.getRouteParam();
    this.primaryHeader.pageTitle.next("MANAGE QUESTION ASSIGNMENTS");   
    this.createExamShiftForm();
    this.getAuthorList();
    
        
  }
  getRouteParam() {
    this.route.params.subscribe((params: Params) => {
      this.assignmentId = params['id'];
      this.shiftNumber = params['shiftNo'];
      this.langGuid = params['language_guid'];
      this.primary = params['primary'];
    }, error => {
      console.error('Error: ', error);
    });
  }
  

  updateProductDetails(updatedItem: any) {
    if(updatedItem)
    {
      let itemIndex=this.items.findIndex(i=>i.line_num===updatedItem.line_num);
      if(itemIndex>-1)
      {
        this.items[itemIndex]=Object.create(updatedItem);
      }
    }
  }
   
  // setAuthorType(event: any) {        
  //   let author=this.authorList.find(a=>a.guid===event.target.value);
  //   if(author)
  //   {
  //     this.items.forEach(authorItem => {
  //       authorItem.author_guid=author.guid;
  //       authorItem.author_name=author.name;
  //     });
  //     this.disableAuthor = true;
  //   }
  
  // }

  // setReviewerType(event: any) {

  //   let reviewer=this.authorList.find(a=>a.guid===event.target.value);
  //   if(reviewer)
  //   {
  //     this.items.forEach(reviewerItem => {
  //       reviewerItem.reviewer_guid=reviewer.guid;
  //       reviewerItem.reviewer_name=reviewer.name;
  //     });
  //     this.disableReviewer = true;
  //   }    
  // }


  // setApprovarType(event: any) {    
  //   let approver=this.authorList.find(a=>a.guid===event.target.value);
  //   if(approver)
  //   {
  //     this.items.forEach(approverItem => {
  //       approverItem.approver_guid=approver.guid;
  //       approverItem.approver_name=approver.name;
  //     });
  //     this.disableApprovar = true;
  //   }  
  // }

  getIntialData() {   
    var keyData = [
      {
        "name": "assignmentId",
        "value": this.assignmentId
      }
    ];

    this.restService.ApiEndPointUrlOrKey = Author.getAssignmentQuestionDetail;
    this.restService.ApiEndPointMehod = RestMethods.Get;
    this.restService.callApi(keyData).subscribe(successResponse => {     
      this.setupInitialData(successResponse);      
    },
      errorResponse => {
        this.messageService.alert(errorResponse);
      })


    /// Get Language List
    this.restService.ApiEndPointUrlOrKey = Author.getLanguageList;
    this.restService.ApiEndPointMehod = RestMethods.Get;
    this.restService.callApi().subscribe(successResponse => {
      this.languageList = successResponse.languages;
    },
      errorResponse => {
        this.messageService.alert(errorResponse);
      })
  }

  setupInitialData(successResponse:any)
  {
    
    this.examShiftDetails=successResponse.exams[0];     
    //mapping items as per table 3  
    if(successResponse.assignments)
    {
      this.items=successResponse.assignments
      .map((existingArray,index)=>(
        {
          
          "line_num":index+1,
          "author_name":(this.authorList
            .find(a=>a.guid===existingArray.author_guid) ? this.authorList
            .find(a=>a.guid===existingArray.author_guid).name:""),
  
          "reviewer_name":(this.authorList
            .find(a=>a.guid===existingArray.reviewer_guid) ? this.authorList
            .find(a=>a.guid===existingArray.reviewer_guid).name:""),
  
          "approver_name":(this.authorList
            .find(a=>a.guid===existingArray.approver_guid) ? this.authorList
            .find(a=>a.guid===existingArray.approver_guid).name:""),
  
          ...existingArray                           
        }));  
                        
    } 
   


    if(this.examShiftDetails.enable_review_process !== '1')
    {
      this.examShiftFormGroup.get('reviewer_id').disable();
    }
    if(this.examShiftDetails.enable_approval_process !== '1')
    {
      this.examShiftFormGroup.get('approvar_id').disable();
    }
  }

  createExamShiftForm() {
    this.examShiftFormGroup = new FormGroup({
      reviewer_id: new FormControl(''),
      author_id: new FormControl(''),
      approvar_id: new FormControl('')
    }); 
    this.examShiftFormGroup.disable();   
  }
   
  getParams() {    
    let mappedData=this.items
    .map((e)=>(
      {        
        "author_guid":e.author_guid,
        "reviewer_guid":e.reviewer_guid,
        "approver_guid":e.approver_guid, 
        "question_number":e.question_number       
      }));

    let params = {
      author_assigment_id: this.assignmentId,
      assignQuestions:mappedData,
    };

    return params;
  }

  formSubmit() {
    let keyData = [
      {
        "name": "assignmentId",
        "value": this.assignmentId
      }
    ];
     let params = this.getParams();
    this.restService.ApiEndPointUrlOrKey = Author.saveAssignQuestion;
    this.restService.ApiEndPointMehod = RestMethods.Put;
    this.restService.HttpPostParams = params;
    this.restService.callApi(keyData).subscribe(successResponse => {        
      this.messageService.okRedirectModal(successResponse, 'SUCCESS', 'Go Back to List').subscribe(result => {
        if (result == true) {
          this.messageService.hideModal();   
          this.router.navigate(["/author/assignments/exams/" + this.examShiftDetails.exam_id + "/shifts/" + this.shiftNumber + "/language/" + this.langGuid + "/primary/" + this.primary + "/manage"]);
        }
        else {
          this.messageService.hideModal();
        }
      });          
      //this.messageService.alert(successResponse);
    }, errorResponse => {
      this.messageService.alert(errorResponse.httpErrorResponse);
    }
    )


    // if (this.examShiftFormGroup.valid === false) {
    //   let form = document.getElementById('examShiftForm');
    //   form.classList.add('was-validated');
    // } else if (this.examShiftFormGroup.valid === true) {

     
    // }
  }

  getAuthorList()
  {
    let search_config: any = {  
      "imported_authors_filter":
      {
        "imported_authors": {

        },
        "cols": [],
        "paging": {
          "total_rows": 0,
          "returned_rows": 0,
          "direction": 0,
          "order_dir": "",
          "page_size": 10,
          "sort_by": "",
          "last_offset": 0,
          "last_seen_id_max": 0,
          "last_seen_id_min": 0
        }
      }
    };
    this.restService.ApiEndPointUrlOrKey = ImportAuthors.getImporteedAuthors;
      this.restService.ApiEndPointMehod = RestMethods.Post;
      this.restService.HttpPostParams = search_config;
      this.restService.AlertAndErrorAction = HandelError.HideAndReturn;
      this.restService.callApi()
        .subscribe(sucessResponse => {
         //console.log(sucessResponse);
         this.authorList=sucessResponse.import_authors;    
         this.getIntialData();                         
        }, errorResponse => {
          if (errorResponse !== undefined) {
            this.notFound = true;            
          }
        }
        );
  }

  
  /*bulk table update*/  
  onBulkUpdateButtonClick() {
    if (this.allowBulkUpdate) {
      this.messageService.confirm(["Are you sure you want to proceed ?"],
        "Confirmation", "Update", "Cancel").subscribe(result => {
          if (result == true) {
             let bulkFormValues = this.examShiftFormGroup.value;             
            if (bulkFormValues) {
              //updating bulk values in table
              //approver
              if (typeof bulkFormValues.approvar_id == "object") {
                this.items.map(el => {
                  el.approver_name = bulkFormValues.approvar_id.name;
                  el.approver_guid = bulkFormValues.approvar_id.guid;
                });
              }
              //author
              if (typeof bulkFormValues.author_id == "object") {
                this.items.map(el => {
                  el.author_name = bulkFormValues.author_id.name;
                  el.author_guid = bulkFormValues.author_id.guid;
                });
              }
               //reviewer
               if (typeof bulkFormValues.reviewer_id == "object") {
                this.items.map(el => {
                  el.reviewer_name = bulkFormValues.reviewer_id.name;
                  el.reviewer_guid = bulkFormValues.reviewer_id.guid;
                });
              }
              this.examShiftFormGroup.reset();              
              this.examShiftFormGroup.disable();
              this.allowBulkUpdate = false;              
            
            this.messageService.hideModal();
             }          
        }
        else {
          this.messageService.hideModal();
        }
      });
    }
    else {

      this.messageService.confirm(["This will update/overwrite all entries for all questions in this section"],
        "Confirmation", "Unlock", "Cancel").subscribe(result => {
          if (result == true) {
             this.allowBulkUpdate = true;
             this.examShiftFormGroup.enable();
             this.messageService.hideModal();
          }
          else {
            this.messageService.hideModal();
          }
        });
    }

  }
}
