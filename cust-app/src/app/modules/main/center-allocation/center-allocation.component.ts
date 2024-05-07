import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-center-allocation',
  templateUrl: './center-allocation.component.html',
  styleUrls: ['./center-allocation.component.scss']
})
export class CenterAllocationComponent implements OnInit {

  @Input() regGuid: any;
  @Input() examGuid: any;
  constructor() { }

  ngOnInit() {
  }

}
