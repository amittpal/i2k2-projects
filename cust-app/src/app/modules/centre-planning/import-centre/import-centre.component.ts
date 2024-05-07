import { Component, OnInit, ViewChild,Input } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { TabsetComponent } from 'ngx-bootstrap';
import { PrimaryHeaderService } from 'src/app/modules/layout/primary-header/primary-header.service';
import { FilterService } from 'src/app/services/filter/filter.service';
import { GlobalRestService } from '../../../services/rest/global-rest.service';
import { HandelError, ImportedCentres } from '../../../shared/enumrations/app-enum.enumerations';
import { MessageService } from 'ngx-ixcheck-message-lib';



@Component({
  selector: 'app-import-centre',
  templateUrl: './import-centre.component.html',
  styleUrls: ['./import-centre.component.scss']
})
export class ImportCentreComponent implements OnInit {
  @ViewChild('tabset', { static: false }) tabset: TabsetComponent;
  stateId: string;
  Id: string;
  public addImportDataFromGroup:FormGroup;
  public cityGuid:any;
  public stateGuid = [];
  public centresData:any;
  registrationList: any=[];
  public regGuid:any;
 
  @Input()
  inportData:FormGroup=this.addImportDataFromGroup;

  constructor(private messageService: MessageService, private route: ActivatedRoute,private primaryHeader: PrimaryHeaderService,private filterService: FilterService,private restService: GlobalRestService) 
  { 
   }

  ngOnInit() {
    //this.tabset.tabs[1].active=false;
    //this.tabset.tabs[2].active=false;
    // set page header title

    this.primaryHeader.pageTitle.next("IMPORT CENTRE");
    this.addImportDataFromGroup=new FormGroup({
      import_number:new FormControl(''),
      regName:new FormControl('',Validators.required),
      import_code:new FormControl('',Validators.required),
      import_name:new FormControl('',Validators.required),
      status:new FormControl('1')
    });


   this.getData();
   this.getRegistrationsList();
   
    this.route.params.subscribe((params: Params) => {
      this.stateId = params['stateId'];
    }, error => {
      console.error('Error: ', error);
    });   
  } 

  public initializeFields(resut:any)
  {   
        this.addImportDataFromGroup=new FormGroup({
        import_number:new FormControl({value:resut.import_number,disabled:false}),
        regName:new FormControl('',Validators.required),
        import_code:new FormControl('',Validators.required),
        import_name:new FormControl('',Validators.required),
        status:new FormControl('1')
       
      }); 
  }

  getData() {
    
    this.restService.ApiEndPointUrlOrKey = ImportedCentres.getImportedNumber;
    this.restService.callApi()
      .subscribe(sucessResponse => {
        this.initializeFields(sucessResponse.import_number[0]);
      });
  }


  public updateCityTable(data:any)
  {
    if(data!=undefined)
    {
   this.cityGuid=
    {

     "guid":data.formData.city_guid

    }
  }
}

public updateStateTable(data:any)
{
  this.stateGuid=[];
  let state = data.formData.state_guid;
  for (let i = 0; i < state.count; i++) {
    this.stateGuid.push(
      {
        guid: state[i]
      }
    );

  }
  
}

public updateCentreTable(data:any)
{
  this.centresData=data.formData;
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

onChange(event:any)
{

  debugger;
  this.filterService.cityListValue.subscribe((data) => {
    this.centresData = data;
  });

    if(this.centresData.length>0)
    {
      this.messageService.confirm(["Are you sure you want to change registration,It will remove centres?"], "Alert", "Yes", "NO", "error").subscribe(result => {
        if (result == true) {
          this.messageService.hideModal();
          this.tabset.tabs[0].active=true;
          this.regGuid=event.target.value;    
        } else {
          this.messageService.hideModal();
          this.regGuid='';
        }
      })
    }

    else
    {
      this.tabset.tabs[0].active=true;
      this.regGuid=event.target.value;
    }
 
}

  ngOnDestroy()
  {
     if(this.filterService.stateListValue)
      {
       this.filterService.stateListValue.next("");
      }
      if(this.filterService.cityListValue)
      {
        this.filterService.cityListValue.next("");
      }
  }



}
