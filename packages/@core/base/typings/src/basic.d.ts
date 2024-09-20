interface BasicOption {
  label: string;
  value: string;
}

type SelectOption = BasicOption;

type TabOption = BasicOption;

interface BasicUserInfo {
  alias: string;
  id: number;
  name: string;
}

export type { BasicOption, BasicUserInfo, SelectOption, TabOption };
