import { DecimalPipe } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { takeWhile } from 'rxjs/operators';

import { WithTableComponent, MemberService, ResultItem, Results, TableComponent, TableConfig } from '../shared';

@Component({
  selector: 'ed-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.scss'],
  providers: [DecimalPipe],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ResultsComponent extends WithTableComponent implements OnInit {
  results: Results;

  constructor(
    public memberService: MemberService,
    protected changeDetector: ChangeDetectorRef,
    private decimalPipe: DecimalPipe
  ) {
    super(changeDetector);
  }

  ngOnInit(): void {
    this.setTableConfig();
    this.memberService.resultsChange$
      .pipe(takeWhile(() => this.isAlive))
      .subscribe(() => this.updateResults());
  }

  protected setTableConfig(): void {
    this.results = [];
    this.tableConfig = {
      items: this.results,
      columns: [
        {
          displayName: 'From',
          transformFn: ({from}: ResultItem) => from.name
        },
        {
          displayName: 'To',
          transformFn: ({to}: ResultItem) => to.name
        },
        {
          displayName: 'Amount',
          transformFn: ({amount}: ResultItem) => this.decimalPipe.transform(amount)
        }
      ]
    };
  }

  private updateResults() {
    const expenses = this.memberService.expenses;

    this.results.length = 0;

    if (expenses.length === 0) {
      return;
    }

    expenses.forEach((expense) => {
      expense.consumers.forEach((consumer) => {
        if (consumer === expense.payer) {
          return;
        }

        const foundResult = this.results.find((resultItem) => resultItem.from === consumer && resultItem.to === expense.payer);
        const amount = expense.amount / expense.consumers.length;

        if (foundResult) {
          foundResult.amount += amount;
        } else {
          this.results.push({
            amount,
            from: consumer,
            to: expense.payer
          });
        }
      });
    });

    this.updateView();
  }
}
