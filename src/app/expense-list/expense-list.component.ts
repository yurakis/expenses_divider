import { DecimalPipe } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material';
import { filter, takeWhile } from 'rxjs/operators';

import { ExpenseDialogComponent } from '../expense-dialog/expense-dialog.component';
import { Expense, IsAliveComponent, MemberService, TableComponent, TableConfig } from '../shared';

@Component({
  selector: 'ed-expense-list',
  templateUrl: './expense-list.component.html',
  styleUrls: ['./expense-list.component.scss'],
  providers: [DecimalPipe],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExpenseListComponent extends IsAliveComponent implements OnInit {
  @ViewChild('tableComponent', {static: true}) tableComponent: TableComponent;
  tableConfig: TableConfig;

  constructor(
    public memberService: MemberService,
    private matDialog: MatDialog,
    private changeDetector: ChangeDetectorRef,
    private decimalPipe: DecimalPipe
  ) {
    super();
  }

  ngOnInit(): void {
    this.tableConfig = {
      items: this.memberService.expenses,
      actions: {
        edit: true,
        remove: true
      },
      columns: [
        {
          displayName: 'Name',
          displayProperty: 'name'
        },
        {
          width: 50,
          displayName: 'Amount',
          transformFn: ({amount}: Expense) => this.decimalPipe.transform(amount)
        },
        {
          displayName: 'Payer',
          transformFn: ({payer}: Expense) => payer.name
        },
        {
          displayName: 'Consumers',
          transformFn: ({consumers}: Expense) => consumers.map(({name}) => name).join(', ')
        }
      ]
    };

    this.memberService.resultsChange$
      .pipe(takeWhile(() => this.isAlive))
      .subscribe(() => this.changeDetector.markForCheck());
  }

  get totalAmount(): number {
    return this.memberService.expenses.reduce((sum, {amount}) => sum += amount, 0);
  }

  openExpenseDialog(expense: Expense = null) {
    this.matDialog
      .open(ExpenseDialogComponent, {data: expense})
      .afterClosed()
      .pipe(filter(Boolean))
      .subscribe((data) => {
        if (expense) {
          Object.assign(expense, data);
        } else {
          this.memberService.addExpense(data);
        }

        this.tableComponent.updateTable();
        this.changeDetector.markForCheck();
      });
  }
}
