import { Component, OnInit, AfterViewChecked,OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators,AbstractControl } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal/modal-options.class';
import { ChargeCodeDetails,FunctionData, BusinessUnitData, DeliverUnitData,ChargeObj  } from '../../../../app.interface';
import { CommonService } from '../../../../service/common.service';
import { Subscription } from 'rxjs/Subscription';
import { DataService } from '../../../../service/DataService';
import { compact,find } from 'lodash';

@Component({
  selector: 'app-add-assignment',
  templateUrl: './add-assignment.component.html',
  styleUrls: ['./add-assignment.component.css']
})
export class AddAssignmentComponent implements OnInit,OnDestroy {
  public title:string;
  public functionGroups:FunctionData[];
  public businessUnitData:BusinessUnitData[] = [{
    bu_id:'',
    bu_name:'Select Business Unit'
  }];
  public deliveryUnitData:DeliverUnitData[] = [{
      du_id: '',
      du_name: 'Select Delivery Unit',
      bu_id: 0
  }]
  public chargeCodeTypeData:string[] = [''];
  public subChargeCodeTypeData:string[] = [''];
  public accountIdData:string[] = [''];
  private isNotDelivery = ['business_unit','delivery_unit','account_id','charge_code_type','charge_code_subtype','client'];

  constructor(
    public bsModalRef: BsModalRef,
    private formBuilder:FormBuilder,
    private commonService: CommonService, private dataService:DataService) {}

  public addAssignment:FormGroup;
  public iFormValid:boolean = true;
  public editData:ChargeObj;
  public editPopup:Subscription;
  public busy:Subscription;
  public formObject:any = {
    charge_code_id: undefined,
    charge_code: undefined,
    charge_code_description: undefined,
    charge_code_owner: undefined,
    charge_code_type: '',
    charge_code_subtype: '',
    client: undefined,
    country: 'India',
    function_group:'1',
    business_unit:'',
    delivery_unit:'',
    account_id:'',
  };

  private validationMessages = {
    'charge_code':        {
      'required':  'Charge code is required.'
    },
    'charge_code_description':        {
      'required':  'Charge code description is required.'
    },
    'charge_code_owner':        {
      'required':  'Charge code owner is required.'
    },
    'charge_code_type':        {
      'required':  'Charge code type is required.'
    },
    'charge_code_subtype':        {
      'required':  'Charge code sub type is required.'
    },
    'client':        {
      'required':  'Client is required.'
    },
    'country':        {
      'required':  'Country is required.'
    },
    'function_group':        {
      'required':  'Function group is required.'
    },
    'business_unit':        {
      'required':  'Business unit is required.'
    },
    'delivery_unit':        {
      'required':  'Delivery unit is required.'
    },
    'account_id':        {
      'required':  'Account id is required.'
    },
    
  }

  public formErrors = {
    charge_code: '',
    charge_code_description: '',
    charge_code_owner: '',
    charge_code_type: '',
    charge_code_subtype: '',
    client: '',
    country: '',
    function_group:'',
    business_unit:'',
    delivery_unit:'',
    account_id:'',
  };

  private formObjects = {
    function_group: [
      this.formObject.function_group,
      [Validators.required]
    ],
    business_unit: [
      this.formObject.business_unit,
      [Validators.required]
    ],
    delivery_unit: [
      this.formObject.delivery_unit,
      [Validators.required]
    ],
    account_id: [
      this.formObject.account_id,
      [Validators.required]
    ],
    charge_code_type:[
      this.formObject.charge_code_type,
      [Validators.required]
    ],
    charge_code_subtype: [
      this.formObject.charge_code_subtype,
      [Validators.required]
    ],
    client: [
      this.formObject.client,
      [Validators.required]
    ],
    country: [
      this.formObject.country,
      [Validators.required]
    ],
    charge_code: [
      this.formObject.charge_code,
      [Validators.required]
    ],
    charge_code_owner: [
      this.formObject.charge_code_owner,
      [Validators.required]
    ],
    charge_code_description: [
      this.formObject.charge_code_description,
      [Validators.required]
    ],
  };
 
  public ngOnInit() {
    this.buildForm(this.formObjects);
    this.editPopup = this.commonService.editAssignMent.subscribe((res)=>{
      if(!res.isSave){
        this.editData = res.data;
        this.setEditData(res);
      }
      this.getChargeCodeType();
      this.geSubtChargeCodeType();
      this.getAllFunctionGroups();
      if(res.isSave){
         this.changeGroup(1);
      }
      this.selectedValueChanges();

    });
  }

  private setEditData( res ){
    this.addAssignment.patchValue({
      charge_code_id: res.data.charge_code_id,
      charge_code: res.data.charge_code,
      charge_code_description: res.data.charge_code_description,
      charge_code_owner: res.data.charge_code_owner,
      charge_code_type: res.data.charge_code_type,
      charge_code_subtype: res.data.charge_code_subtype,
      client: res.data.client,
      country: res.data.country,
      function_group:res.data.function_grp_id == 0 ? '':res.data.function_grp_id,
      business_unit:res.data.bu_id,
      delivery_unit:res.data.du_id,
      account_id:res.data.project ? res.data.project:''
    });
    
    if(res.data.function_grp_id)
      this.changeGroup(res.data.function_grp_id);
    if(res.data.bu_id)
      this.changeBusinessUnit(res.data.bu_id);
    if(res.data.du_id)
      this.changeDeliveryUnit(res.data.du_id);
  }
  private getAllFunctionGroups(){
    this.busy = this.dataService.getFunctionGroups().subscribe((data)=>{
      data.details.unshift({
        function_grp_id:'',
        function_grp_name:'Select Groups'
      })
      this.functionGroups = data.details;
    })
  }

  public buildForm( objs: any):void {
    this.addAssignment = this.formBuilder.group(objs);
    this.addAssignment.valueChanges.subscribe(data => this.onValuesChanged());
    this.onValuesChanged();
  }

  
  public ngOnDestroy() {
    this.editPopup.unsubscribe();
  }
  
  public onValuesChanged(data?: any) {
    if (!this.addAssignment) { return; }
    const form = this.addAssignment;
    for(const field in this.formErrors) {
      this.formErrors[field] = '';
      const control = form.get(field);
  
      if (control && control.invalid) {
        const messages = this.validationMessages[field];
        for (const key in control.errors) {
          this.formErrors[field] += messages[key] + ' ';
        }
      }
    }
  }
  public onSubmit() {
    if (this.addAssignment.valid) {
      this.formObject = this.addAssignment.value;
      let saveObj = this.mapSaveObj( this.formObject );
      this.busy =  this.dataService.saveChargeCode(saveObj).subscribe((data)=>{
         if(data.actionStatus){
            this.commonService.reloadChargeCodes.emit({save:true});
         }
         this.bsModalRef.hide();
       })
    } else {
    }
  }

  public mapSaveObj( obj ){
    let bu_name = find(this.businessUnitData, function(o) { return o.bu_id ==  obj.business_unit});
    let du_name = find(this.deliveryUnitData, function(o) { return o.du_id ==  obj.delivery_unit});
    let function_grp_name = find(this.functionGroups, function(o) { return o.function_grp_id ==  obj.function_group});
    let objs:any = {
      details:this.getSaveObj(obj,bu_name,du_name, function_grp_name),
      actionStatus:true,
      errorMessage:null
    };

    if(this.editData){
      objs.details[0].charge_code_id = this.editData.charge_code_id;
    }
    return objs;
  }

  private getSaveObj( obj: any,bu_name:any,du_name:any, function_grp_name:any){
    let arr = [];
    if(obj.function_group == '1'){
      arr[0]={
        charge_code: obj.charge_code,
        charge_code_description: obj.charge_code_description,
        charge_code_owner: obj.charge_code_owner,
        charge_code_type: obj.charge_code_type,
        charge_code_subtype: obj.charge_code_subtype,
        client: obj.client,
        country: obj.country,
        bu_id: parseInt(obj.business_unit),
        bu_name: bu_name.bu_name,
        du_id: parseInt(obj.delivery_unit),
        du_name: du_name.du_name,
        project: obj.account_id,
        function_grp_id: parseInt(obj.function_group),
        function_grp_name: function_grp_name.function_grp_name,
      }
    }else{
      arr[0]={
        charge_code: obj.charge_code,
        charge_code_description: obj.charge_code_description,
        charge_code_owner: obj.charge_code_owner,
        country: obj.country,
        function_grp_id: parseInt(obj.function_group),
        function_grp_name: function_grp_name.function_grp_name,
      }
    }

    return arr;
  }
  public changeGroup( data){
    let id = parseInt(data);
    this.busy = this.dataService.getBusinessUnit(id).subscribe((data)=>{
      data.details.unshift({
        bu_id:'',
        bu_name:'Select Business Unit'
      })
      this.businessUnitData = data.details;
    })
  }

  public changeBusinessUnit( data:string ){
    let id = parseInt(data);
    this.busy = this.dataService.getDeliveryUnit(id).subscribe((data)=>{
      data.details.unshift({
        du_id: '',
        du_name: 'Select Delivery Unit',
        bu_id: 0
      });
      this.deliveryUnitData = data.details;
    });
  }

  public changeDeliveryUnit( data){
    let id = parseInt(data);
    let bu_id = parseInt(this.addAssignment.value.business_unit);
    this.busy = this.dataService.getAccountIds(bu_id,id).subscribe((data)=>{
      var filterData = compact(data.details);
      filterData.unshift('');
      this.accountIdData = filterData;
    });
  }
  public getChargeCodeType(){
    this.busy = this.dataService.getChargeCodeType().subscribe((data)=>{
      data.details.unshift('');
      this.chargeCodeTypeData = data.details;
    })
  }
  
  public geSubtChargeCodeType(){
    this.busy = this.dataService.getSubChargeCodeType().subscribe((data)=>{
      data.details.unshift('');
      this.subChargeCodeTypeData = data.details;
    })
  }

  private setValidity( val: any){
    
      for(var i=0; i<this.isNotDelivery.length; i++){
        let data = this.isNotDelivery[i]
        if(val != 1){
        this.addAssignment.controls[data].clearValidators();
        this.addAssignment.controls[data].updateValueAndValidity();
        this.addAssignment.updateValueAndValidity();
      }else{
        this.addAssignment.controls[data].setValidators([Validators.required]);
        this.addAssignment.controls[data].updateValueAndValidity();
        this.addAssignment.updateValueAndValidity();
      }
    }
  }
  private selectedValueChanges(){
    
    this.addAssignment.controls['function_group'].valueChanges.subscribe((value)=>{
      this.setValidity(value);
      if(value && value == 1){
        this.changeGroup(value)
      }else{
        this.businessUnitData =  [{
          bu_id:'',
          bu_name:'Select Business Unit'
        }];
        this.addAssignment.patchValue({
          business_unit:''
        })
      }
    });
    this.addAssignment.controls['business_unit'].valueChanges.subscribe((value)=>{
      if(value){
      this.changeBusinessUnit(value)
      }else{
        this.deliveryUnitData =  [{
          du_id: '',
          du_name: 'Select Delivery Unit',
          bu_id: 0
      }];
        this.addAssignment.patchValue({
          delivery_unit:''
        })
      }
    });

    this.addAssignment.controls['delivery_unit'].valueChanges.subscribe((value)=>{
      if(value){
      this.changeDeliveryUnit(value)
      }else{
        this.accountIdData =  [''];
        this.addAssignment.patchValue({
          account_id:''
        })
      }
    })
  }

}
