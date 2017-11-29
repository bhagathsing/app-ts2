import { Component, OnInit,TemplateRef, ViewChild, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router} from '@angular/router';
import { BsModalService,ModalDirective } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/modal-options.class';
import { ConfirmComponent } from '../../common/confirm/confirm.component';
import { Ng2Storage } from '../../service/storage';
import { DataService } from '../../service/DataService';
import { User, UserData } from '../../app.interface';
import { CommonService} from '../../service/common.service';
@Component({
  selector: 'app-superviser-view',
  templateUrl: './superviser-view.component.html',
  styleUrls: ['./superviser-view.component.css']
})
export class SuperviserViewComponent implements OnInit, AfterViewInit {
  @ViewChild(ConfirmComponent) public confirm: ConfirmComponent;
  
  public modalRef: BsModalRef;
  public tabValue='review';
  public tabMenu = [
    {menuName:'Record',url:'./record'},
    {menuName:'Review',url:'./review'},
    {menuName:'Assignments',url:'./assignments'}
  ];
 

  constructor(
    private modalService: BsModalService, 
    private currentRoute:ActivatedRoute, 
    private router: Router,
    private storage: Ng2Storage, 
    private dataService: DataService,
    private commonService:CommonService ) {}
 
    
    public ngOnInit() {
      this.commonService.menuItems.subscribe((data)=>{
      this.tabMenu = data;
      })
    }
    public ngAfterViewInit(){
    }
    public openModal(template: TemplateRef<any>) {
      // this.modalRef = this.modalService.show(template);
    //  this.confirm.show()
    //  .then((obj) => {
    //     console.log('POPUP');
    //  }).catch((data)=>{
    //     console.log(data);
    //  })
      this.router.navigate(['/login']);
      this.storage.removeSession('user_data');
      this.storage.clearAllSession();
    }
  public onchangeformenu(selectVal:string){
    this.tabValue=selectVal;
  }
 
}
