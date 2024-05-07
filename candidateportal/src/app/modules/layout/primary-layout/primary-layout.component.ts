import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-primary-layout',
  templateUrl: './primary-layout.component.html',
  styleUrls: ['./primary-layout.component.scss']
})
export class PrimaryLayoutComponent implements OnInit {
  public page_title: string = "";
  constructor(private router: Router) {
  }
  ngOnInit() {
    this.page_title = "Hey";
  }
  // clickClose(event, clickAndFollowLink) {
  //   event.preventDefault();
  //   event.stopPropagation();
  //   if (clickAndFollowLink == false) {
  //     event.preventDefault();
  //     event.stopPropagation();
  //   }
  //   let elements = document.querySelectorAll('.nav-link');
  //   let elemParent = document.getElementById('side-nav');
  //   for (let element = 0; element < elements.length; element++) {
  //     elements[element].classList.remove('on-hover');
  //   }
  //   elemParent.classList.remove('on-hover');

  //   document.querySelector('.az-iconbar-aside').classList.remove('show');
  //   document.querySelector('.az-iconbar-aside').classList.add('in-transit');

  //   let width = (window.innerWidth > 0) ? window.innerWidth : screen.width;
  //   if (width <= 991) {
  //     document.querySelector('body').classList.remove('az-iconbar-show');
  //   }
  // }
  // closeNavigation(event) {
  //   setTimeout(() => {
  //     this.clickClose(event, false);
  //   }, 3000);
  // }
}
