import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-row-details',
  templateUrl: './row-details.component.html',
  styleUrls: ['./row-details.component.scss']
})
export class RowDetailsComponent implements OnInit {
  @Input() rowItemData;
  @Output() private updatedDetails = new EventEmitter<any>();
  constructor() { }
  referenceDetailsFormGroup:FormGroup;    
  ngOnInit() {    
    this.referenceDetailsFormGroup=new FormGroup({      
      line_num:new FormControl(this.rowItemData.line_num, [Validators.required]),   
      //id:new FormControl(this.rowItemData.id),
      question_id:new FormControl(this.rowItemData.question_id),
      //status:new FormControl(this.rowItemData.status),   
      reference:new FormControl(this.rowItemData.reference, [Validators.required,Validators.maxLength(200)]),
      remark:new FormControl(this.rowItemData.remark, [Validators.required,Validators.maxLength(200)])    
    })
  }
  
  onReferenceDetailsFormSubmit()
  {
    if(this.referenceDetailsFormGroup.valid)
    {            
      this.updatedDetails.emit(this.referenceDetailsFormGroup.value);
    }
  }

  onCancel(){    
    this.updatedDetails.emit(this.rowItemData);
  }

}
