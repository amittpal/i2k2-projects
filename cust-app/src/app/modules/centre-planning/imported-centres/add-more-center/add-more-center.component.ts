import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params } from '@angular/router';
import { TabsetComponent } from 'ngx-bootstrap';
import { PrimaryHeaderService } from 'src/app/modules/layout/primary-header/primary-header.service';
import { FilterService } from 'src/app/services/filter/filter.service';
import { GlobalRestService } from 'src/app/services/rest/global-rest.service';
import { ImportedCentres } from 'src/app/shared/enumrations/app-enum.enumerations';
import { HandelError } from 'src/app/shared/models/app.models';

@Component({
  selector: 'app-add-more-center',
  templateUrl: './add-more-center.component.html',
  styleUrls: ['./add-more-center.component.scss']
})
export class AddMoreCenterComponent implements OnInit {

  @ViewChild('tabset', { static: false }) tabset: TabsetComponent;
  Id: string;
  public addImportDataFromGroup: FormGroup;
  registrationList: any=[];
  public regGuid:any;
  @Input()
  inportData: FormGroup;

  constructor(private route: ActivatedRoute, private primaryHeader: PrimaryHeaderService, private filterService: FilterService, private restService: GlobalRestService) {
  }

  ngOnInit() {
    // set page header title
    this.inportData == this.addImportDataFromGroup;
    this.primaryHeader.pageTitle.next("Add CENTRE");
    this.addImportDataFromGroup = new FormGroup({
      import_number: new FormControl(''),
      regName:new FormControl('',Validators.required),
      import_code: new FormControl('', Validators.required),
      import_name: new FormControl('', Validators.required),
      status: new FormControl('1')
    });

    this.route.params.subscribe((params: Params) => {
      this.getData(params['id']);
    }, error => {
      console.error('Error: ', error);
    });
 
    this.getRegistrationsList();
  }
  public initializeFields(resut: any) {
    this.addImportDataFromGroup = new FormGroup({
      import_number: new FormControl({ value: resut.import_number, disabled: false }),
      regName:new FormControl({value: resut.registration_guid,disabled: false}),
      import_code: new FormControl({ value: resut.code, disabled: false }),
      import_name: new FormControl({ value: resut.name, disabled: false }),
      status: new FormControl({ value: resut.status, disabled: false })

    });
  }
  getData(id: any) {
    var keyData = [
      {
        "name": "Id",
        "value": id
      }
    ];
    this.restService.ApiEndPointUrlOrKey = ImportedCentres.getImportedCentresById;
    this.restService.callApi(keyData)
      .subscribe(sucessResponse => {
        this.initializeFields(sucessResponse.imported_centres[0]);
        this.regGuid=sucessResponse.imported_centres[0].registration_guid;
      });
  }
  ngOnDestroy() {  
  }
  public getRegistrationsList()
  {
    this.restService.ApiEndPointUrlOrKey = ImportedCentres.getRegistrationTypeList;    
    this.restService.AlertAndErrorAction = HandelError.HideAndReturn;    
    this.restService.callApi()
      .subscribe(sucessResponse => {            
        if(sucessResponse.registrations)
        {
          this.registrationList=sucessResponse.registrations;
        }       
      }, errorResponse => {
        if (errorResponse !== undefined) {          
        }
      });    
  }

  
}

