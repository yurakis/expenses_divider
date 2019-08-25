import { ChangeDetectorRef, OnDestroy, ViewChild } from '@angular/core';
import { TableConfig } from './table.model';
import { TableComponent } from './table/table.component';

export abstract class WithTableComponent implements OnDestroy {
  @ViewChild('tableComponent', {static: true}) tableComponent: TableComponent;
  protected tableConfig: TableConfig;
  protected isAlive = true;

  protected constructor(protected changeDetector: ChangeDetectorRef) {}

  ngOnDestroy(): void {
    this.isAlive = false;
  }

  protected updateView() {
    this.tableComponent.updateTable();
    this.changeDetector.markForCheck();
  }

  protected abstract setTableConfig(): void;
}
