import { DeleteOutlined, UploadOutlined } from '@ant-design/icons';
import { Alert, Button, Form, Input, InputNumber, Select, Space, Spin, Typography, Upload, message, theme } from 'antd';
import type { UploadRequestOption } from 'rc-upload/lib/interface';
import React, { useCallback, useEffect, useState } from 'react';
import { useApp } from '@nocobase/client-v2';
import { normalizeAttachmentArray } from '../shared/login-layout';
import { useT } from './locale';
import { defaultLoginSettings, normalizeLoginSettings, type Attachment, type LoginSettings } from './types';

const getResponseData = (response: any): LoginSettings | undefined => response?.data?.data;

export const LoginSettingsPage = () => {
  const app = useApp();
  const { token } = theme.useToken();
  const t = useT();
  const [form] = Form.useForm<LoginSettings>();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [uploadingCount, setUploadingCount] = useState(0);
  const uploading = uploadingCount > 0;
  const [error, setError] = useState<unknown>();
  const backgroundImages = normalizeAttachmentArray<Attachment>(
    Form.useWatch<Attachment[]>('backgroundImages', { form, preserve: true }),
  );

  const loadSettings = useCallback(async () => {
    setLoading(true);
    setError(undefined);

    try {
      const response = await app.apiClient.request({
        url: 'loginSettings:get/1?appends=backgroundImages',
        method: 'get',
        skipNotify: true,
      });
      form.setFieldsValue(normalizeLoginSettings(getResponseData(response)));
    } catch (nextError) {
      setError(nextError);
    } finally {
      setLoading(false);
    }
  }, [app, form]);

  useEffect(() => {
    void loadSettings();
  }, [loadSettings]);

  const uploadBackgroundImage = async (options: UploadRequestOption) => {
    const { file, onError, onSuccess } = options;
    setUploadingCount((count) => count + 1);

    try {
      const formData = new FormData();
      formData.append('file', file as File);
      const response = await app.apiClient.request({
        url: 'attachments:create',
        method: 'post',
        data: formData,
      });
      const attachment = getResponseData(response) as Attachment | undefined;

      if (!attachment?.id) {
        throw new Error('Attachment upload did not return an id');
      }

      const currentBackgroundImages = normalizeAttachmentArray<Attachment>(form.getFieldValue('backgroundImages'));
      form.setFieldValue('backgroundImages', [...currentBackgroundImages, attachment]);
      onSuccess?.(response?.data, file as File);
    } catch (nextError) {
      onError?.(nextError as Error);
    } finally {
      setUploadingCount((count) => Math.max(0, count - 1));
    }
  };

  const saveSettings = async () => {
    const values = await form.validateFields();
    setSubmitting(true);

    try {
      await app.apiClient.request({
        url: 'loginSettings:update/1',
        method: 'post',
        data: {
          ...values,
          backgroundImages: normalizeAttachmentArray<Attachment>(form.getFieldValue('backgroundImages')).map((attachment) => attachment.id).filter(Boolean),
        },
      });
      message.success(t('Saved successfully'));
      await loadSettings();
    } finally {
      setSubmitting(false);
    }
  };

  const removeBackgroundImage = (id?: number) => {
    form.setFieldValue(
      'backgroundImages',
      backgroundImages.filter((attachment) => attachment.id !== id),
    );
  };

  return (
    <div
      style={{
        minHeight: '100%',
        maxWidth: 920,
        margin: '0 auto',
        padding: token.paddingLG,
      }}
    >
      <div
        style={{
          background: token.colorBgContainer,
          border: `${token.lineWidth}px solid ${token.colorBorderSecondary}`,
          borderRadius: token.borderRadiusLG,
          boxShadow: token.boxShadowTertiary,
          padding: token.paddingLG,
        }}
      >
        <h1 style={{ marginTop: 0, marginBottom: token.marginLG }}>{t('Login settings')}</h1>

        {error ? (
          <Alert
            showIcon
            type="error"
            message={t('Failed to load login settings')}
            description={error instanceof Error ? error.message : String(error)}
            style={{ marginBottom: token.marginLG }}
          />
        ) : null}

        {loading ? (
          <div style={{ minHeight: 220, display: 'grid', placeItems: 'center' }}>
            <Spin />
          </div>
        ) : (
          <Form
            form={form}
            layout="vertical"
            initialValues={defaultLoginSettings}
            disabled={submitting}
            onFinish={() => void saveSettings()}
          >
            <Form.Item name="layout" label={t('Layout')} rules={[{ required: true, message: t('Please select a layout') }]}>
              <Select
                options={[
                  { label: t('Default'), value: 'default' },
                  { label: t('Center'), value: 'center' },
                  { label: t('Left and right'), value: 'left-right' },
                ]}
              />
            </Form.Item>

            <Form.Item label={t('Background images')}>
              <Space direction="vertical" size={token.marginSM} style={{ width: '100%' }}>
                {backgroundImages.length ? (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: token.marginSM }}>
                    {backgroundImages.map((attachment) => (
                      <div
                        key={attachment.id || attachment.url}
                        style={{
                          position: 'relative',
                          width: 152,
                          height: 88,
                          overflow: 'hidden',
                          borderRadius: token.borderRadius,
                          border: `${token.lineWidth}px solid ${token.colorBorder}`,
                          background: token.colorFillAlter,
                        }}
                      >
                        {attachment.url ? (
                          <img
                            alt={attachment.title || attachment.filename || t('Background image')}
                            src={attachment.url}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                        ) : null}
                        <Button
                          aria-label={t('Delete')}
                          icon={<DeleteOutlined />}
                          size="small"
                          shape="circle"
                          onClick={() => removeBackgroundImage(attachment.id)}
                          style={{ position: 'absolute', top: 6, right: 6 }}
                        />
                      </div>
                    ))}
                  </div>
                ) : null}
                <Upload
                  accept="image/*"
                  multiple
                  showUploadList={false}
                  customRequest={uploadBackgroundImage}
                  beforeUpload={(file) => {
                    if (!file.type.startsWith('image/')) {
                      message.error(t('Only image files are supported'));
                      return Upload.LIST_IGNORE;
                    }
                    return file;
                  }}
                >
                  <Button icon={<UploadOutlined />} loading={uploading}>
                    {t('Upload')}
                  </Button>
                </Upload>
              </Space>
            </Form.Item>

            <Form.Item
              name="titleFontSize"
              label={t('Title font size (px)')}
              rules={[{ required: true, message: t('Please enter a font size') }]}
            >
              <InputNumber min={12} max={96} precision={0} style={{ width: 160 }} />
            </Form.Item>

            <Form.Item name="technicalSupport" label={t('Technical support')}>
              <Input.TextArea autoSize={{ minRows: 2, maxRows: 4 }} />
            </Form.Item>

            <Button type="primary" htmlType="submit" loading={submitting}>
              {t('Submit')}
            </Button>
          </Form>
        )}

        <div style={{ marginTop: token.marginLG, textAlign: 'right' }}>
          <Typography.Link
            href="https://github.com/oxmode-org/nocobase-login-page"
            target="_blank"
            rel="noreferrer"
            style={{ fontSize: token.fontSizeSM, color: token.colorTextTertiary }}
          >
            {t('View source (AGPL-3.0)')}
          </Typography.Link>
        </div>
      </div>
    </div>
  );
};

export default LoginSettingsPage;
