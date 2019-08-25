import { DecimalPipe } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { takeWhile } from 'rxjs/operators';

import { WithTableComponent, MemberService, ResultItem, Results } from '../shared';

@Component({
  selector: 'ed-result-list',
  templateUrl: './result-list.component.html',
  styleUrls: ['./result-list.component.scss'],
  providers: [DecimalPipe],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ResultListComponent extends WithTableComponent implements OnInit {
  results: Results;

  constructor(
    public memberService: MemberService,
    protected changeDetector: ChangeDetectorRef,
    protected decimalPipe: DecimalPipe
  ) {
    super(changeDetector, decimalPipe);
  }

  ngOnInit(): void {
    this.setTableConfig();
    this.memberService.resultsChange$
      .pipe(takeWhile(() => this.isAlive))
      .subscribe(() => this.updateResults());
    window.setTimeout(() => this.updateResults());
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
          transformFn: ({amount}: ResultItem) => this.transformNumber(amount)
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

    const results: Results = [];

    /**
     * Step 1. Add all results
     */
    expenses.forEach((expense) => {
      expense.consumers.forEach((consumer) => {
        if (consumer === expense.payer) {
          return;
        }

        const foundResult = results.find((resultItem) => resultItem.from === consumer && resultItem.to === expense.payer);
        const amount = expense.amount / expense.consumers.length;

        if (foundResult) {
          foundResult.amount += amount;
        } else {
          results.push({
            amount,
            from: consumer,
            to: expense.payer
          });
        }
      });
    });

    /**
     * Step 2. Filter two-way results
     */
    results.forEach((resultItem) => {
      const foundResultItemIndex = results.findIndex(({from, to}) => from === resultItem.to && to === resultItem.from);

      if (foundResultItemIndex === -1) {
        return;
      }

      const foundResultItem = results[foundResultItemIndex];
      const amountDiff = resultItem.amount - foundResultItem.amount;

      if (amountDiff < 0) {
        resultItem.from = foundResultItem.to;
        resultItem.to = foundResultItem.from;
      }

      resultItem.amount = Math.abs(amountDiff);
      results.splice(foundResultItemIndex, 1);
    });

    /**
     * Step 3. Results Optimization
     */
    const findResult = (from, to) => results.find((item) => item.from === from && item.to === to);

    results.forEach((resultItem) => {
      const foundResultItems = results
        .filter((item) => item.to === resultItem.from && Boolean(findResult(item.from, resultItem.to)))
        .sort((a, b) => a.amount - b.amount);

      foundResultItems.forEach((item) => {
        const amountDiff = resultItem.amount - item.amount;
        const foundResult = findResult(item.from, resultItem.to);

        if (amountDiff > 0) {
          foundResult.amount += item.amount;
          resultItem.amount = amountDiff;
          item.amount = 0;
        } else {
          foundResult.amount += resultItem.amount;
          resultItem.amount = 0;
          item.amount = Math.abs(amountDiff);
        }
      });
    });

    this.results.push(...results.filter(({amount}) => amount > 0));
    this.updateView();
  }
}
