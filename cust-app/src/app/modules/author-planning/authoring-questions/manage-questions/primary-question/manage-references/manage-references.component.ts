import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-manage-references',
  templateUrl: './manage-references.component.html',
  styleUrls: ['./manage-references.component.scss']
})
export class ManageReferencesComponent implements OnInit {  
  @Input() refrences; 
  @Input() QuestionId;
  @Output() private updatedReferencesList = new EventEmitter<any>();
  constructor() { }

  ngOnInit() {
    this.addInitialData();
  }


  getUpdatedDetails(updatedDetails: any)
  {       
    if(updatedDetails)
    {
      let itemIndex=this.refrences.findIndex(i=>i.line_num===updatedDetails.line_num);
      if(itemIndex > -1)
      {
        this.refrences[itemIndex]=updatedDetails;
      }
      this.updatedReferencesList.emit(this.refrences);
    }
    //console.log(updatedDetails);  
  }  
  onDragged(dragEvent: any) {  
    const [e, el] = dragEvent.args;
    // do something
  }

  addInitialData()
  {
    if(this.refrences.length==0)
    {     
      let item={        
        "line_num":1,           
        "question_id": this.QuestionId,     
        "reference":"",
        "remark":""           
      }
      this.refrences.push(item);    
    }   
  }

  onAddRow() {        
    let lastItem=this.refrences[this.refrences.length-1];    
      let item={        
        "line_num":lastItem.line_num+1,                
        "question_id": this.QuestionId,
        "reference":"",
        "remark":""        
      }
      this.refrences.push(item);        
  }

}
