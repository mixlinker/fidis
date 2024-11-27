type buttonType = {
  icon: string;
  name: string;
  type: string;
};
type columnType = {
  [key: string]: any;
  field: string;
  label: string;
  type?: string;
  width?: number;
};

type pageType = {
  current: number;
  pageSize: number;
  total: number;
};

type columnStorageType = {
  field: string;
  width: number;
};

export type { buttonType, columnStorageType, columnType, pageType };
