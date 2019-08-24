import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatTable } from '@angular/material';

import { TableConfig } from '../table.model';

@Component({
  selector: 'ed-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TableComponent implements OnInit {
  @Input() config: TableConfig;
  @Output() removeItem = new EventEmitter();
  @Output() editItem = new EventEmitter();
  @ViewChild('matTable', {static: true}) matTable: MatTable<any>;
  displayedColumns: string[];

  constructor(private changeDetector: ChangeDetectorRef) {}

  ngOnInit() {
    this.config.columns.forEach((column, index) => {
      if (!column.displayProperty) {
        column.displayProperty = `column${index}`;
      }
    });
    this.displayedColumns = this.config.columns.map(({displayProperty}) => displayProperty);

    if (this.config.actions) {
      this.displayedColumns.push('actions');
    }
  }

  onRemove(item: any) {
    this.removeItem.emit(item);
    this.matTable.renderRows();
  }

  public updateTable() {
    this.matTable.renderRows();
    this.changeDetector.markForCheck();
  }
}
