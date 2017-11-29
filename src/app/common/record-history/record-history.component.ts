import { Component, OnInit, AfterViewChecked, OnDestroy, TemplateRef, ViewChild } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { Subscription } from 'rxjs/Subscription';
import { User, UserData, TimeSheetSummaryReport } from '../../app.interface';
import { Ng2Storage } from '../../service/storage';
import { DataService } from '../../service/DataService';
import { CommonService } from '../../service/common.service';

declare const $: any;

@Component({
  selector: 'app-record-history',
  templateUrl: './record-history.component.html',
  styleUrls: ['./record-history.component.css']
})
export class RecordHistoryComponent implements OnInit {
  public busy: Subscription;
  private empData:UserData;
  public historyData: TimeSheetSummaryReport;
  constructor(
    private storage: Ng2Storage,
    public bsModalRef: BsModalRef,
    private dataService: DataService,
    private commonService: CommonService,
    private modalService: BsModalService
  ) { }

  public ngOnInit() {
    this.empData = this.storage.getSession('user_data');
    $.fn.dataTableExt.sErrMode = 'throw';
    $('#tableGrid1').DataTable().clear().destroy();
    this.getTimeSheetReportHistory();
  }
  public getTimeSheetReportHistory(){
    this.dataService.getTimeSheetSummaryReport(this.empData.userId).subscribe((data: TimeSheetSummaryReport)=>{
      this.historyData = data;
      let getRowsCount = 5;
      let pageLengthArray1 = [10, 25, 50, -1];
          pageLengthArray1.unshift(getRowsCount);
      let pageLengthArray2 = [10, 25, 50, "All"];
          pageLengthArray2.unshift(getRowsCount);

          setTimeout(()=>{
            $('#tableGrid1').DataTable({
              "lengthMenu": [pageLengthArray1, pageLengthArray2 ],
              "order": [[ 1, "asc" ]]
            });
            $("#tableGrid_filter").find('.form-control').removeClass('input-sm');
            $("#tableGrid_length").find('.form-control').removeClass('input-sm');
            
          },4)

    });
  }
}
