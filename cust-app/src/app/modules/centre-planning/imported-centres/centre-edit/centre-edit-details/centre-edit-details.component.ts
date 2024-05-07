import { Component, Input, OnInit, Output,EventEmitter } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Params } from '@angular/router';
import { MessageService } from 'ngx-ixcheck-message-lib';
import { PrimaryHeaderService } from 'src/app/modules/layout/primary-header/primary-header.service';
import { AppsettingsConfService } from 'src/app/services/conf/appsettings-conf/appsettings-conf.service';
import { GlobalRestService } from 'src/app/services/rest/global-rest.service';
import { ImportedCentres } from 'src/app/shared/enumrations/app-enum.enumerations';
import { HandelError, RestMethods } from 'src/app/shared/models/app.models';

@Component({
  selector: 'app-centre-edit-details',
  templateUrl: './centre-edit-details.component.html',
  styleUrls: ['./centre-edit-details.component.scss']
})
export class CentreEditDetailsComponent implements OnInit {
  @Input("rowItemData") rowItemData: any;
  @Output() updateEvent = new EventEmitter<any>();
  public editCentresFormGroup: FormGroup;
  private appRoutes:any={};
  public items = [];
  public itemCount = 0;
  public lastSeenIdMax = 0;
  public lastSeenIdMin = 0;
  public lastOffset = 0;
  public offset = 0;
  public notFound: boolean = false;
  public displayMessage: any;
  public centreDetails: any = [];

  disabledNormalSeat:boolean=false;
  disabledPwdSeat:boolean=false;

  public centresData: any = {
    id:"",
    normal_seats: "",
    pwd_seats: "" 
  };

  constructor(private route: ActivatedRoute, private restService: GlobalRestService,private configService: AppsettingsConfService,
    private messageService: MessageService, private primaryHeader: PrimaryHeaderService) {
  
   this.restService.ShowLoadingSpinner = true;
   this.restService.AlertAndErrorAction = HandelError.ShowAndReturn;
   this.configService.getAppRoutes.subscribe(configData => {
     this.appRoutes = configData;
   }, error => {
     console.error('Error for configService.getAppRoutes: ', error);
   });}

  ngOnInit() {
    this.primaryHeader.pageTitle.next("Centre Edit");
    this.initializeFields();
    this. getCentresList();
    this.route.params.subscribe((params: Params) => {
     
    }, error => {
      console.error('Error: ', error);
    });
  }

  public initializeFields() {
    this.editCentresFormGroup = new FormGroup({
      import_number: new FormControl(""),
      code: new FormControl(""),
      name: new FormControl(""),
      status: new FormControl("")     
    });
  }


  getCentresList() {
    var keyData = [

      {
        name: "id",
        value: this.rowItemData["id"],
      },
      {
        name: "cityGuid",
        value: this.rowItemData["city_guid"],
      }
    ];
    this.restService.ApiEndPointUrlOrKey = ImportedCentres.getImportedCentresListDetails;
    this.restService.ApiEndPointMehod = RestMethods.Get;
    this.restService.AlertAndErrorAction = HandelError.HideAndKill;
    this.restService.callApi(keyData).subscribe(
      (sucessResponse) => {
        this.items = sucessResponse.import_centers;
        this.itemCount = this.items.length;
      },
      (errorResponse) => {
        if (errorResponse !== undefined) {
          console.log("undefined");
        }
      }
    );
  }

  ngDoCheck() {
    if (this.items) {
      this.itemCount = this.items.length;
    }
  }

  public initializeData(result:any) {
    this.editCentresFormGroup = new FormGroup({
      import_number: new FormControl({value: result.import_number, disabled: true}),
      name: new FormControl({value: result.name, disabled: true}),
      code: new FormControl({value: result.code, disabled: true}),
      description: new FormControl({value: result.description, disabled: true}),
      status: new FormControl({value: result.status, disabled: true})
    });    
  }
  // child-component
  public getChildComponentData(childData: any) {
    let linenumber = childData["id"];
    this.items.forEach((element, i) => {
      if (element["id"] == linenumber) {
        this.items[i] = childData;
      }
    });
  }

  public updateProductDetails(updatedItem: any) {
    let i = 0;
    for (i; i < this.itemCount; i++) {
      if (
        this.items[i].id === updatedItem.prodInfo.id
      ) {
        this.items[i] = updatedItem.prodInfo;
        // this.calTotalAmount();
        break;
      }
    }
  }

  setNormalSeat() {
    let normalSeat = this.editCentresFormGroup.get("normal_seats").value;
    if (normalSeat) {
      this.items.forEach((element) => {
        element["normal_seats"] = normalSeat;
      });
      this.disabledNormalSeat = true;
    } else {
      this.items.forEach((element) => {
        element["normal_seats"] = 0;
      });
      this.disabledNormalSeat = false;
    }
  }


  setPwdSeat() {
      let pwdSeat = this.editCentresFormGroup.get("pwd_seats").value;
      if (pwdSeat) {
        this.items.forEach((element) => {
          element["pwd_seats"] = pwdSeat;
        });
        this.disabledPwdSeat = true;
      } else {
        this.items.forEach((element) => {
          element["pwd_seats"] = 0;
        });
        this.disabledPwdSeat = false;
      }
  }

  public formSubmit() {
      this.centreDetails = [];

      try {
        this.items.forEach((data) => {
          // console.log(JSON.stringify(data));
          this.centresData.id=data["id"];
          this.centresData.normal_seats = data["normal_seats"];
          this.centresData.pwd_seats = data["pwd_seats"];
          this.centreDetails.push(Object.assign({}, this.centresData));
          
        });

       
      } catch (err) {
        this.messageService.ok("Please add centres details");
        return false;
      }

      let params={
        'imported_centres':this.centreDetails
      } 

      // call api code here...
      if (Object.keys(this.appRoutes).length !== 0) {
      
        this.restService.ApiEndPointUrlOrKey = ImportedCentres.updateImportedCentres
        this.restService.ApiEndPointMehod = RestMethods.Post;
        this.restService.HttpPostParams = params;

        console.log(this.centreDetails);
        this.restService.AlertAndErrorAction = HandelError.ShowAndReturn;
        this.restService.callApi().subscribe(
          (sucessResponse) => {
            this.messageService
              .okRedirectModal(sucessResponse, "SUCCESS")
              .subscribe((result) => {
                if (result == true) {
                  // OK = true for redirection
                  this.messageService.hideModal();
                  //this.ngOnInit();
                  this.updateEvent.emit(event)
                  // this.nextTab.emit(3); // Select next tab
                } else {
                  // NO/CANCEL = false
                  this.messageService.hideModal();
                }
              });
          },
          (errorResponse) => {
            if (errorResponse !== undefined) {
              //this.messageService.ok(errorResponse);
            }
          }
        );
      }
    
  }

  public reset() {
    let form = document.getElementById("addQuestionsForm");
    form.classList.remove("was-validated");
    this.editCentresFormGroup.reset();
    this.items.forEach((a) => {
      a["subject_guid"] = "";
      a["subject"] = "";
      a["difficulty_level_guid"] = "";
      a["difficulty_levels"] = "";
      a["duration_uom_guid"] = "";
      a["duration"] = "";
      a["duration_um"] = "";
      a["marks"] = "";
      a["negative_marks"] = "";
      a["question_type_guid"] = "";
      a["question_type"] = "";
    });
  }

}