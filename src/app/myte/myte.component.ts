import { Component, OnInit,ViewChild ,ElementRef } from '@angular/core';
import { ConfirmComponent } from '../common/confirm/confirm.component';
import { CommonService} from '../service/common.service';
@Component({
    moduleId: module.id,
    selector: 'myte',
    templateUrl: 'myte.component.html',
    styleUrls: ['myte.component.scss']
})
export class MyteComponent implements OnInit {
    @ViewChild(ConfirmComponent) public confirmModal: ConfirmComponent;
    @ViewChild('headerNav') public headerNav: ElementRef;
    public confirmPopupData:any;
    constructor( private commonService:CommonService){};
    ngOnInit(){
        this.confirmPopupData =  this.commonService.setConfirmOptions('Confirm','Are you sure want to submit without saving details ?','Yes','Cancel','warning');
        this.commonService.configurSaving.subscribe((data)=>{
            if(data){
                this.confirmPopupData =  this.commonService.setConfirmOptions('Success','Data saved successfully','Ok','--','success');
                this.confirmModal.show(null)
                .then((): void => {
                }).catch(()=>{
                }); 
            }else{
                this.confirmPopupData =  this.commonService.setConfirmOptions('Error','Data  not saved','Ok','--','danger');
                this.confirmModal.show(null)
                .then((): void => {
                }).catch(()=>{
                }); 
            }
        })
    }
}
