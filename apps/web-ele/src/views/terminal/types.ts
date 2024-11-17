type additionItemType = {
  data: [string, string][];
  title: string;
};

type additionType = additionItemType[] | undefined;

type configItemType = {
  [key: string]: any;
  name: string;
  uid: string;
};

export type { additionItemType, additionType, configItemType };
