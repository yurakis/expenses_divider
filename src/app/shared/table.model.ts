export interface TableColumn {
  displayName: string;
  displayProperty?: string;
  width?: number;
  transformFn?: (item: any) => any;
}

export interface TableConfig {
  columns: TableColumn[];
  items: any[];
  actions?: {
    remove?: boolean;
    edit?: boolean;
  };
}
