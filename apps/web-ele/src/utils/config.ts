import { $t } from '#/locales';

const reportTypes: any = {
  1: $t('report.project.year_report'),
  2: $t('report.project.month_report'),
  3: $t('report.project.date_report'),
  4: $t('report.project.classes_report'),
  5: $t('report.project.other_report'),
};
const executeOption: any = {
  0: $t('report.project.hand_run'),
  1: $t('report.project.per_year'),
  2: $t('report.project.per_month'),
  3: $t('report.project.per_date'),
  4: $t('report.project.per_hour'),
  5: $t('report.project.time_task'),
};

export default {
  executeOption,
  file_url: '/mixservice/storage/',
  reportTypes,
};
