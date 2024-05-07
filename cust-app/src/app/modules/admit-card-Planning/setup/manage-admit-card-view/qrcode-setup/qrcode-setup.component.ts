import { Component, OnInit, Input } from '@angular/core';
import { Params, ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { GlobalRestService } from 'src/app/services/rest/global-rest.service';
import { AdmitCard } from 'src/app/shared/enumrations/app-enum.enumerations';
import { TabsetComponent } from 'ngx-bootstrap';

@Component({
  selector: 'app-qrcode-setup',
  templateUrl: './qrcode-setup.component.html',
  styleUrls: ['./qrcode-setup.component.scss']
})
export class QrcodeSetupComponent implements OnInit {

  constructor(private route: ActivatedRoute,private restService: GlobalRestService) { }

  @Input() tabset: TabsetComponent;
  qrCodeSetupFormGroup: FormGroup;
  admitCardQrCodeSetupDetails:any={};
  registrationGuid="";  
  // Data for QR Code's placeholder tags// Will recieve through api in future
  qrCodePlaceHolderTags : string[] = ['[Name]', '[Father Name]' , '[Date Of Birth]'];

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
        qrCode_body_template: new FormControl({value:'',disabled:true},[Validators.required])
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
      getQrCodeDetails(id: any) {
        var keyData = [
          {
          "name": "registrationGuid",
          "value": id
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

}
