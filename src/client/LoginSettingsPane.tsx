import { ISchema, SchemaComponent, useAPIClient, useActionContext, useRequest } from '@nocobase/client-v2';
import { Card, message } from 'antd';
import React from 'react';
import { useForm } from '@formily/react';
import { useLoginSettings } from './LoginSettingsProvider';
import cloneDeep from 'lodash/cloneDeep';
import { uid } from '@nocobase/utils/client';
import { useTranslation } from 'react-i18next';
import { NAMESPACE } from './locale';

const useSaveLoginSettingsValues = () => {
  const { setVisible } = useActionContext();
  const form = useForm();
  const { mutate, data } = useLoginSettings() || {};
  const api = useAPIClient();
  const { t } = useTranslation();

  return {
    async run() {
      await form.submit();
      const values = cloneDeep(form.values);
      mutate({
        data: { ...data?.data, ...values },
      });
      await api.request({
        url: 'loginSettings:update/1',
        method: 'post',
        data: values,
      });
      message.success(t('Saved successfully', { ns: NAMESPACE }));
      setVisible(false);
    },
  };
};

const useLoginSettingsValues = (options: any) => {
  const { visible } = useActionContext();
  const result = useLoginSettings();
  return useRequest(() => Promise.resolve(result?.data), {
    ...options,
    refreshDeps: [visible, result?.data],
  });
};

const useCloseAction = () => {
  const { setVisible } = useActionContext();
  return {
    async run() {
      setVisible(false);
    },
  };
};

const schema: ISchema = {
  type: 'object',
  properties: {
    [uid()]: {
      'x-decorator': 'Form',
      'x-decorator-props': {
        useValues: '{{ useLoginSettingsValues }}',
      },
      'x-component': 'div',
      type: 'void',
      title: `{{t('Login page', { ns: '${NAMESPACE}' })}}`,
      properties: {
        layout: {
          type: 'string',
          title: '{{t("Layout")}}',
          required: true,
          'x-decorator': 'FormItem',
          'x-component': 'Select',
          enum: [
            { label: '{{ t("Default") }}', value: 'default' },
            { label: '{{ t("Center") }}', value: 'center' },
            { label: '{{ t("Left and right") }}', value: 'leftRight' },
          ],
        },
        backgroundImages: {
          type: 'string',
          title: `{{t('Background images', { ns: '${NAMESPACE}' })}}`,
          'x-decorator': 'FormItem',
          'x-component': 'Upload.Attachment',
          'x-component-props': {
            action: 'attachments:create',
            multiple: true,
          },
          'x-reactions': {
            dependencies: ['layout'],
            when: '{{$deps[0] == "default"}}',
            fulfill: {
              state: { hidden: true },
            },
            otherwise: {
              state: { hidden: false },
            },
          },
        },
        titleFontSize: {
          type: 'string',
          title: '{{t("Title font size (px)")}}',
          'x-decorator': 'FormItem',
          'x-component': 'InputNumber',
        },
        technicalSupport: {
          type: 'string',
          title: '{{t("Technical support")}}',
          'x-decorator': 'FormItem',
          'x-component': 'Input',
        },
        footer1: {
          type: 'void',
          'x-component': 'ActionBar',
          'x-component-props': { layout: 'one-column' },
          properties: {
            submit: {
              title: '{{t("Submit")}}',
              'x-component': 'Action',
              'x-component-props': {
                type: 'primary',
                htmlType: 'submit',
                useAction: '{{ useSaveLoginSettingsValues }}',
              },
            },
          },
        },
      },
    },
  },
};

export const LoginSettingsPane = () => {
  const { t } = useTranslation();
  return (
    <Card bordered={false}>
      <SchemaComponent
        schema={schema}
        components={{}}
        scope={{ useSaveLoginSettingsValues, useLoginSettingsValues, useCloseAction }}
      />
    </Card>
  );
};