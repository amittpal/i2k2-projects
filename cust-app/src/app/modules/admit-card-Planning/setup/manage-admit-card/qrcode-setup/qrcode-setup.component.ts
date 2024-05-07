import { Component, OnInit, Input } from '@angular/core';
import { Params, ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { GlobalRestService } from 'src/app/services/rest/global-rest.service';
import { AdmitCard } from 'src/app/shared/enumrations/app-enum.enumerations';
import { MessageService } from 'ngx-ixcheck-message-lib';
import { TabsetComponent } from 'ngx-bootstrap';

@Component({
  selector: 'app-qrcode-setup',
  templateUrl: './qrcode-setup.component.html',
  styleUrls: ['./qrcode-setup.component.scss']
})
export class QrcodeSetupComponent implements OnInit {

  qrCodeSetupFormGroup: FormGroup;
  submitted = false;
  admitCardQrCodeSetupDetails:any={};
  registrationGuid="";  
  @Input() tabset: TabsetComponent;

  // Data for QR Code's placeholder tags// Will recieve through api in future
  qrCodePlaceHolderTags : string[] = ['[Name]', '[Father Name]' , '[Date Of Birth]'];
  

  constructor(private route: ActivatedRoute,
    private restService: GlobalRestService,
    private messageService: MessageService) { }

  ngOnInit() {
    this.initializeForm();

    this.route.params.subscribe((params: Params) => {
      this.registrationGuid =params['registrationGuid'];
     if(this.registrationGuid)
     {
       this.getQrCodeDetails(this.registrationGuid);
     }            
   }, error => {
     console.error('Error: ', error);
   });
  }

  // New instance of formgroup
  initializeForm() {    
    this.qrCodeSetupFormGroup = new FormGroup({
      qrCode_body_template: new FormControl('',[Validators.required])
    });    
  }

  // Initialize formcontrols of form group
  initializeFields(qrCodeDetails:any)
  {
    if(qrCodeDetails)
    {
      this.qrCodeSetupFormGroup.patchValue({
        qrCode_body_template: qrCodeDetails.qr_barcode
      });
    }
  }

    // Get qrCode setup data through api
    getQrCodeDetails(registrationGuid: any) {
       var keyData = [
        {
        "name": "registrationGuid",
        "value": registrationGuid
        }
      ];
      this.restService.ApiEndPointUrlOrKey = AdmitCard.getQrBarCodeById;
      this.restService.callApi(keyData)
        .subscribe(successResponse => {          
          this.admitCardQrCodeSetupDetails = successResponse.qr_barcode[0];
          this.initializeFields(successResponse.qr_barcode[0]);           
        },
        errorResponse=>{
          //this.messageService.alert(errorResponse);
        }      
        );  
    } 

  // used when user double click on QR Code placeholder to get the text
  tagDblclick(event){
    let bodyText = this.qrCodeSetupFormGroup.get('qrCode_body_template').value;
    let clickedText = event.target.innerText;
    
    switch (clickedText) {
      case "[Name]": {        
        clickedText = "Name : " + clickedText ;
        break;
      }
      case "[Father Name]": {        
        clickedText = "F Name : " + clickedText ;
        break;
      }
      case "[Date Of Birth]": {        
        clickedText = "DOB : " + clickedText ;
        break;
      }      
      default: {
        clickedText = "";
        break;
      }
    }

    this.qrCodeSetupFormGroup.controls["qrCode_body_template"].setValue(bodyText == null ? "" : (bodyText != "" ) ?  bodyText  + ", " + clickedText : clickedText);
    this.qrCodeSetupFormGroup.controls["qrCode_body_template"].markAsDirty();
  }

  reset(){    
    if(this.admitCardQrCodeSetupDetails)
    {      
      let qrCode = this.admitCardQrCodeSetupDetails;
      this.qrCodeSetupFormGroup.reset({        
        qrCode_body_template: qrCode.qr_barcode  
      });
    }
  }

    // form submission
    onAddQrCodeSetupFormsubmit(){
      this.submitted = true;
      if(this.qrCodeSetupFormGroup.valid)
      {    
        let params=
        {     
          "exam_guid": "",
          "registration_guid": this.registrationGuid,
          "qr_barcode": this.qrCodeSetupFormGroup.get("qrCode_body_template").value
        };

          this.restService.ApiEndPointUrlOrKey = AdmitCard.addQrBarCodeDetails;        
          this.restService.ShowLoadingSpinner=true;
          this.restService.HttpPostParams=params;      
          this.restService.callApi()
            .subscribe(sucessResponse => { 
              this.messageService.okRedirectModal(sucessResponse, 'SUCCESS', 'Next').subscribe(result => {
                if (result == true) {
                  this.messageService.hideModal();                       
                  this.tabset.tabs[5].active=true;             
                }
                else {
                  this.messageService.hideModal();
                }
              });                 
            },
            errorResponse=>{
              this.messageService.alert(errorResponse);
            }); 
      }
    }

}
