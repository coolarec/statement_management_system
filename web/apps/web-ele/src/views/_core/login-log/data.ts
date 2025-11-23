import type { VbenFormSchema } from '#/adapter/form';
import type { OnActionClickFn, VxeTableGridOptions } from '#/adapter/vxe-table';
import type { LoginLog } from '#/api/core/login-log';

import { $t } from '@vben/locales';

/**
 * 获取登录状态选项
 */
export function getStatusOptions() {
  return [
    { type: 'danger', label: $t('loginLog.statusFailed'), value: 0 },
    { type: 'success', label: $t('loginLog.statusSuccess'), value: 1 },
  ];
}

/**
 * 获取失败原因选项
 */
export function getFailureReasonOptions() {
  return [
    { label: $t('loginLog.failureReasonUnknown'), value: 0 },
    { label: $t('loginLog.failureReasonUserNotExist'), value: 1 },
    { label: $t('loginLog.failureReasonPasswordError'), value: 2 },
    { label: $t('loginLog.failureReasonUserDisabled'), value: 3 },
    { label: $t('loginLog.failureReasonUserLocked'), value: 4 },
    { label: $t('loginLog.failureReasonUserInactive'), value: 5 },
    { label: $t('loginLog.failureReasonAccountAbnormal'), value: 6 },
    { label: $t('loginLog.failureReasonOther'), value: 7 },
  ];
}

/**
 * 获取设备类型选项
 */
export function getDeviceTypeOptions() {
  return [
    { label: $t('loginLog.deviceTypeDesktop'), value: 'desktop' },
    { label: $t('loginLog.deviceTypeMobile'), value: 'mobile' },
    { label: $t('loginLog.deviceTypeTablet'), value: 'tablet' },
    { label: $t('loginLog.deviceTypeOther'), value: 'other' },
  ];
}

/**
 * 获取搜索表单的字段配置
 */
export function useSearchFormSchema(): VbenFormSchema[] {
  return [
    {
      component: 'Input',
      fieldName: 'username',
      label: $t('loginLog.username'),
      componentProps: {
        placeholder: $t('loginLog.searchPlaceholder', [
          $t('loginLog.username'),
        ]),
      },
    },

    {
      component: 'Select',
      fieldName: 'status',
      label: $t('loginLog.status'),
      componentProps: {
        placeholder: $t('loginLog.selectStatus'),
        options: getStatusOptions(),
        clearable: true,
      },
    },
  ];
}

/**
 * 获取表格列配置
 */
export function useColumns(
  onActionClick?: OnActionClickFn<LoginLog>,
): VxeTableGridOptions<LoginLog>['columns'] {
  return [
    {
      type: 'checkbox',
      minWidth: 60,
      align: 'center',
      fixed: 'left',
    },
    {
      field: 'username',
      title: $t('loginLog.username'),
      minWidth: 120,
      fixed: 'left',
    },
    {
      field: 'status',
      title: $t('loginLog.status'),
      minWidth: 100,
      cellRender: {
        name: 'CellTag',
        options: getStatusOptions(),
      },
    },
    {
      field: 'login_ip',
      title: $t('loginLog.loginIp'),
      minWidth: 140,
    },
    {
      field: 'ip_location',
      title: $t('loginLog.ipLocation'),
      minWidth: 150,
    },
    {
      field: 'failure_reason',
      title: $t('loginLog.failureReason'),
      minWidth: 120,
      cellRender: {
        name: 'CellTag',
        options: getFailureReasonOptions().map((opt) => ({
          ...opt,
          type: 'danger',
        })),
      },
      visible: false,
    },
    {
      field: 'failure_message',
      title: $t('loginLog.failureMessage'),
      minWidth: 180,
      showOverflow: 'tooltip',
      visible: false,
    },
    {
      field: 'browser_type',
      title: $t('loginLog.browserType'),
      minWidth: 120,
    },
    {
      field: 'os_type',
      title: $t('loginLog.osType'),
      minWidth: 120,
    },
    {
      field: 'device_type',
      title: $t('loginLog.deviceType'),
      minWidth: 100,
      cellRender: {
        name: 'CellTag',
        options: getDeviceTypeOptions().map((opt) => ({
          ...opt,
          type: 'info',
        })),
      },
    },
    {
      field: 'duration',
      title: $t('loginLog.durationSeconds'),
      minWidth: 120,
      visible: false,
    },
    {
      field: 'remark',
      title: $t('loginLog.remark'),
      minWidth: 150,
      showOverflow: 'tooltip',
      visible: false,
    },
    {
      field: 'sys_create_datetime',
      title: $t('loginLog.loginTime'),
      minWidth: 180,
      sortable: true,
    },
    {
      align: 'right',
      cellRender: {
        attrs: {
          nameField: 'username',
          nameTitle: $t('loginLog.username'),
          onClick: onActionClick,
        },
        name: 'CellOperation',
        options: [
          {
            code: 'detail',
            text: $t('loginLog.detail'),
            icon: 'ep:document',
          },
          {
            code: 'delete',
            text: $t('common.delete'),
            icon: 'ep:delete',
          },
        ],
      },
      field: 'operation',
      fixed: 'right',
      headerAlign: 'center',
      showOverflow: false,
      title: $t('loginLog.operation'),
      minWidth: 150,
    },
  ];
}
