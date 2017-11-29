import { Injectable, EventEmitter } from '@angular/core';
import { Subject } from 'rxjs/Subject'
import { LocationData, TimeSheetDetails } from '../app.interface';
@Injectable()
export class CommonService{
   // private subject = new Subject<any>();
    public menuItems = new EventEmitter();
    public editAssignMent = new EventEmitter();
    public reloadChargeCodes = new EventEmitter();
    public configurSaving = new EventEmitter();
    public getAllConfigEmp = new EventEmitter();
    public findWithAttr(array, attr, value) {
        for (var i = 0; i < array.length; i += 1) {
            var val = (array[i][attr]).trim()
            if (val === value) {
                return true;
            }
        }
        return false;
    }
    public filterMultiSelectData(data, filterModel, key) {
        if (filterModel.substring(0, 2).toLocaleLowerCase() == "e0") {
            return data.filter(function (obj) {
                return obj['userId'].toLocaleLowerCase().indexOf(filterModel.toLocaleLowerCase()) > -1;
            });
        } else {
            return data.filter(function (obj) {
                return obj[key].toLocaleLowerCase().indexOf(filterModel.toLocaleLowerCase()) > -1;
            });
        }

    }
    public setConfirmOptions(
        title:string, 
        message:string,
        confirmText:string,
        cancelText:string,
        type:string,
        isCheck?:string,
        disclaimerText?:string){
            
        var obj = {
          title:title,
          message:message,
          confirmText:confirmText,
          cancelText:cancelText,
          type:type,
          isCheckBox:isCheck?isCheck:'No',
          disclaimerText:disclaimerText ?disclaimerText:''
        };
        return obj;
    }
    public findSelectedChargeCode( obj, select ){
        let arr =  obj.filter((obj)=>{
          if(select === 'selected'){
             return obj.assignmentId !== '';
          }else{
           return obj.isSelectValid == true;
          }
         });
         return arr;
     }

     public findDuplicates( arrs ){
        var sorted, i, isDuplicate;
        var names = 'assignmentId';
        sorted = arrs.concat().sort(function (a, b) {
            if (a[names] > b[names]) return 1;
            if (a[names] < b[names]) return -1;
            return 0;
        });
        for (i = 0; i < arrs.length; i++) {
            isDuplicate = (
                (sorted[i - 1] && sorted[i - 1][names] !== '' && sorted[i - 1][names] == sorted[i][names]) || 
                (sorted[i + 1] && sorted[i + 1][names] !== '' && sorted[i + 1][names] == sorted[i][names])
            );
            sorted[i].isSelectValid = isDuplicate;
        }
     }
     public findPeriodStartDate(val) {
        let strtPeriodArry = val;
        let period;
        if (val[0] >= 1 && val[0] <= 15) {
            strtPeriodArry[0] = 1;
            period = strtPeriodArry.join(' ');
        } else {
            strtPeriodArry[0] = 16;
            period = strtPeriodArry.join(' ');
        }
        return period;
    }

    public mapLocationTimeInHours( arr, locationData){
        
    }

    public findLocationOurs( obj, rowData ){
        let country = obj.find((ele)=>{
            return ele.loc_id == rowData.countryId
        });
        return country;
    }
    
}