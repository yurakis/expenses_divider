import { DecimalPipe } from '@angular/common';
import { ChangeDetectorRef, OnDestroy, ViewChild } from '@angular/core';
import { TableConfig } from './table.model';
import { TableComponent } from './table/table.component';

export abstract class WithTableComponent implements OnDestroy {
  @ViewChild('tableComponent', {static: true}) tableComponent: TableComponent;
  public tableConfig: TableConfig;
  protected isAlive = true;

  protected constructor(
    protected changeDetector: ChangeDetectorRef,
    protected decimalPipe: DecimalPipe
  ) {}

  ngOnDestroy(): void {
    this.isAlive = false;
  }

  protected updateView() {
    this.tableComponent.updateTable();
    this.changeDetector.markForCheck();
  }

  public transformNumber(n: number): string {
    return this.decimalPipe.transform(n, '1.0-2');
  }

  protected abstract setTableConfig(): void;
}
