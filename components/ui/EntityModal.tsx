'use client'

import { Modal, Form, Input, Button, Space, Select } from 'antd'
import { ReactNode } from 'react'

const { TextArea } = Input

export interface EntityModalField {
  name: string
  label: string
  required?: boolean
  type?: 'input' | 'textarea' | 'select'
  placeholder?: string
  rows?: number
  options?: { label: string; value: string | number }[]
}

interface EntityModalProps {
  open: boolean
  title: string
  loading?: boolean
  onCancel: () => void
  onSubmit: (values: any) => Promise<void> | void
  fields?: EntityModalField[]
  submitText?: string
  cancelText?: string
  extra?: ReactNode
}

/**
 * Generic modal for creating/editing entities
 * Consolidates duplicate modal/form patterns across pages
 *
 * @example
 * <EntityModal
 *   open={isOpen}
 *   title="Create Project"
 *   onSubmit={handleCreate}
 *   onCancel={close}
 *   fields={[
 *     { name: 'name', label: 'Name', required: true, placeholder: 'Project name' },
 *     { name: 'description', label: 'Description', type: 'textarea', placeholder: 'Optional description' }
 *   ]}
 * />
 */
export default function EntityModal({
  open,
  title,
  loading = false,
  onCancel,
  onSubmit,
  fields = [
    { name: 'name', label: 'Name', required: true, placeholder: 'Enter name' },
    { name: 'description', label: 'Description', type: 'textarea', placeholder: 'Optional description', rows: 3 },
  ],
  submitText = 'Create',
  cancelText = 'Cancel',
  extra,
}: EntityModalProps) {
  const [form] = Form.useForm()

  const handleFinish = async (values: any) => {
    await onSubmit(values)
    form.resetFields()
  }

  const handleCancel = () => {
    form.resetFields()
    onCancel()
  }

  return (
    <Modal
      title={title}
      open={open}
      onCancel={handleCancel}
      footer={null}
      destroyOnHidden
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        preserve={false}
      >
        {fields.map((field) => (
          <Form.Item
            key={field.name}
            name={field.name}
            label={field.label}
            rules={[
              {
                required: field.required,
                message: `Please ${field.type === 'select' ? 'select' : 'enter'} ${field.label.toLowerCase()}`,
              },
            ]}
          >
            {field.type === 'textarea' ? (
              <TextArea
                rows={field.rows || 3}
                placeholder={field.placeholder}
              />
            ) : field.type === 'select' ? (
              <Select
                placeholder={field.placeholder}
                options={field.options}
              />
            ) : (
              <Input placeholder={field.placeholder} />
            )}
          </Form.Item>
        ))}

        {extra && <div style={{ marginBottom: 16 }}>{extra}</div>}

        <Form.Item style={{ marginBottom: 0 }}>
          <Space>
            <Button type="primary" htmlType="submit" loading={loading}>
              {submitText}
            </Button>
            <Button onClick={handleCancel}>{cancelText}</Button>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  )
}
