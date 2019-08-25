import { DecimalPipe } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { filter, takeWhile } from 'rxjs/operators';

import { ExpenseDialogComponent } from '../expense-dialog/expense-dialog.component';
import { Expense, WithTableComponent, MemberService } from '../shared';

@Component({
  selector: 'ed-expense-list',
  templateUrl: './expense-list.component.html',
  styleUrls: ['./expense-list.component.scss'],
  providers: [DecimalPipe],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExpenseListComponent extends WithTableComponent implements OnInit {
  constructor(
    public memberService: MemberService,
    protected changeDetector: ChangeDetectorRef,
    private matDialog: MatDialog,
    private decimalPipe: DecimalPipe
  ) {
    super(changeDetector);
  }

  ngOnInit(): void {
    this.setTableConfig();
    this.memberService.resultsChange$
      .pipe(takeWhile(() => this.isAlive))
      .subscribe(() => this.updateView());
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
          this.memberService.resultsChange$.next();
        } else {
          this.memberService.addExpense(data);
        }

        this.updateView();
      });
  }

  protected setTableConfig(): void {
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
  }
}
