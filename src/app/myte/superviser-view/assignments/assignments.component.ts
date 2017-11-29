import { Component, OnInit,TemplateRef, ViewChild,ElementRef, AfterViewInit } from '@angular/core';
import { BsModalService,BsModalRef } from 'ngx-bootstrap/modal';
import { AddAssignmentComponent } from './add-assignment/add-assignment.component';
import { ChargeCodeDetails  } from '../../../app.interface';
import { Ng2Storage } from '../../../service/storage';
import { DataService } from '../../../service/DataService';
import { Subscription } from 'rxjs/Subscription';
import { CommonService } from '../../../service/common.service';
import { ConfirmComponent } from '../../../common/confirm/confirm.component';
import { AssignmentSettingsComponent } from './assignment-settings/assignment-settings.component';


declare const $: any;

@Component({
  selector: 'app-assignments',
  templateUrl: './assignments.component.html',
  styleUrls: ['./assignments.component.css']
})
export class AssignmentsComponent implements OnInit, AfterViewInit {
  @ViewChild(ConfirmComponent) public confirmModal: ConfirmComponent;
  @ViewChild('gridParent')  parentElent:ElementRef;
  public modalRef: BsModalRef;
  public assignmentData:ChargeCodeDetails;
  public busy:Subscription;
  public confirmPopupData:any;
  public empData:any;
  public selectedAssignees = [];

  public gridHeaderLeft=0;
  public gridBodyTop=0;
  public gridBodyHeight = 200;

  public isDesc: boolean = false;
  public column: string = 'charge_code';
  public direction: number;
  public leftTableRowCount;
  public config = {
    animated: true,
    keyboard: true,
    backdrop: true,
    ignoreBackdropClick: false,
    class: ' modal-lg add-assign'
  };

  public headerRowHeight:number = 40;
  public bodyRowHeight:number = 30;
  public gridHeaders:{name:string; field:string,width:string}[] = [
    {name:'Charge Code',field:'charge_code',width:'140'},
    {name:'Charge Code Description',field:'charge_code_description',width:'250'},
    {name:'Client',field:'client',width:'100'},
    {name:'Charge Code Type',field:'charge_code_type',width:'180'},
    {name:'Sub Type',field:'charge_code_subtype',width:'160'},
    {name:'Owner',field:'charge_code_owner',width:'190'},
    {name:'Country',field:'country',width:'180'}
  ]

  constructor(
    private modalService: BsModalService, 
    private dataService:DataService,
    private storage: Ng2Storage,
    private commonService: CommonService) {}

  public ngOnInit() {
    this.getChargeCodeDetails();
    this.confirmPopupData =  this.commonService.setConfirmOptions('Error','Please select assignment','Ok','--','danger');
    this.commonService.reloadChargeCodes.subscribe((data)=>{
      $.fn.dataTableExt.sErrMode = 'throw';
      $('#tableGrid').DataTable().clear().destroy();
        this.getChargeCodeDetails();
    });
  }
  public ngAfterViewInit(){
    
  }
  public sort(property){
    this.isDesc = !this.isDesc; //change the direction    
    this.column = property;
    this.direction = this.isDesc ? 1 : -1;
  };

  public addAssignment() {
    let obj ={
      isSave:true,
      data:null
    };
    this.modalRef = this.modalService.show(AddAssignmentComponent,this.config);
    this.modalRef.content.isSave = true;
    this.modalRef.content.title = 'Add Charge Code';
    this.commonService.editAssignMent.emit(obj);
  }

  public getChargeCodeDetails(){
    this.empData = this.storage.getSession('user_data');

    this.busy = this.dataService.getChargeCodeDetails(this.empData.du_id).subscribe((data)=>{
      this.assignmentData = data;
      this.getRows(this.parentElent.nativeElement);
      let getRowsCount = Math.floor((((this.gridBodyHeight - 150)/this.bodyRowHeight) - 3));
      console.log(getRowsCount);
      getRowsCount = getRowsCount <= 1 ? 3: getRowsCount;
      let pageLengthArray1 = [10, 25, 50, -1];
          pageLengthArray1.unshift(getRowsCount);
      let pageLengthArray2 = [10, 25, 50, "All"];
          pageLengthArray2.unshift(getRowsCount);

      
          
      setTimeout(()=>{
        $('#tableGrid').DataTable({
          "lengthMenu": [pageLengthArray1, pageLengthArray2 ],
          "order": [[ 1, "asc" ]]
        });
        $("#tableGrid_filter").find('.form-control').removeClass('input-sm');
        $("#tableGrid_length").find('.form-control').removeClass('input-sm');
        
      },4)
    });
    
   
  }
    private getRows( ele:any){
    let offsetTop = ele.getBoundingClientRect().top;
    let wH = window.innerHeight;
    this.leftTableRowCount = Math.floor((wH-offsetTop-97-40));

    let getHeight = wH-offsetTop-136;
    
    this.gridBodyHeight = getHeight;
  }

  public editChargeCode( obj ){
    this.modalRef = this.modalService.show(AddAssignmentComponent, this.config);
    let objs ={
      isSave:false,
      data:obj
    };
    this.modalRef.content.isSave = false;
    this.modalRef.content.title = 'Edit Charge Code';
    this.commonService.editAssignMent.emit(objs);
  }

  public deleteChargeCode( obj ){
    this.confirmPopupData =  this.commonService.setConfirmOptions('Success','Data saved successfully','Ok','--','success');
    this.confirmModal.show(null)
    .then((): void => {
    }).catch(()=>{
    });
  }

  public assignmentSetting() {
    if(!this.selectedAssignees.length){
      this.confirmPopupData =  this.commonService.setConfirmOptions('Error','Please select assignment','Ok','--','danger');
      this.confirmModal.show(null)
      .then((): void => {
      }).catch(()=>{
      });
      return;
    }
    this.modalRef = this.modalService.show(AssignmentSettingsComponent);
    
    this.modalRef.content.selectedData=this.selectedAssignees;
  }

  public populateAssignieesData(data,status){
    console.log(data,status);
    if(this.selectedAssignees.indexOf(data) === -1 && status){
       this.selectedAssignees.push(data);
    }else if(!status)
    {
        let index = this.selectedAssignees.indexOf(status);
        this.selectedAssignees.splice(index, 1);
    }
  }

  public moveGridHeader( event ){
    this.gridHeaderLeft=-event.target.scrollLeft;
    this.gridBodyTop=-event.target.scrollTop;
  }
}
