import { Component, OnInit, Input, OnChanges,SimpleChanges, ElementRef, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-empty-table',
  templateUrl: './empty-table.component.html',
  styleUrls: ['./empty-table.component.css']
})
export class EmptyTableComponent implements OnInit,OnChanges,AfterViewInit {
  @Input() tableData:any;
  @Input() calendarData:any;
  @Input() parentElent:ElementRef;
  public _tableData:any;
  private rowHeaderHeight:number = 58;
  private rowBodyHeight:number = 38;
  private originalRowsCountHeight:number;
  public rowsCount: any;
  constructor() { }

  public ngOnInit() {
    console.log(this.tableData);
  }
  public ngOnChanges(change:SimpleChanges){
    if(change && change.tableData.currentValue){
        this._tableData = change.tableData.currentValue;
        this.originalRowsCountHeight = ((this._tableData.details.length + 1)) * 38;
        this.getRows(this.parentElent);
    }
  }

  public ngAfterViewInit(){
    
    // this.getRows(this.parentElent);
  }

  private getRows( ele:any){
    let offsetTop = ele.getBoundingClientRect().top;
    let wH = window.innerHeight;
    this.rowsCount = Math.floor((wH-offsetTop-40-this.rowHeaderHeight-this.originalRowsCountHeight)/this.rowBodyHeight);
    console.log(this.rowsCount);
    this.rowsCount = new Array(this.rowsCount-1);
  }


}
