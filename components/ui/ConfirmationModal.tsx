"use client";

import { Modal, Button, Space } from "antd";
import { ReactNode } from "react";
import { COLORS } from "@/theme";

interface ConfirmationModalProps {
  open: boolean;
  title: string;
  description: string | ReactNode;
  confirmText?: string;
  cancelText?: string;
  loading?: boolean;
  danger?: boolean;
  onConfirm: () => void | Promise<void>;
  onCancel: () => void;
}

/**
 * Reusable confirmation modal for destructive actions
 * Supports danger variant with red styling for delete operations
 *
 * @example
 * <ConfirmationModal
 *   open={isOpen}
 *   title="Delete Project?"
 *   description="Are you sure you want to delete this project?"
 *   confirmText="Delete"
 *   danger
 *   loading={deleting}
 *   onConfirm={handleDelete}
 *   onCancel={handleCancel}
 * />
 */
export default function ConfirmationModal({
  open,
  title,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  loading = false,
  danger = false,
  onConfirm,
  onCancel,
}: ConfirmationModalProps) {
  const handleConfirm = async () => {
    await onConfirm();
  };

  return (
    <Modal
      title={title}
      open={open}
      onCancel={onCancel}
      footer={null}
      destroyOnHidden
      closable={!loading}
      maskClosable={!loading}
      keyboard={!loading} // Disable Esc when loading
    >
      <div
        style={{
          marginBottom: 24,
          color: COLORS.text.primary,
          lineHeight: 1.6,
        }}
      >
        {typeof description === "string" ? <p>{description}</p> : description}
      </div>

      <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
        <Button onClick={onCancel} disabled={loading}>
          {cancelText}
        </Button>
        <Button
          type="primary"
          danger={danger}
          loading={loading}
          onClick={handleConfirm}
        >
          {confirmText}
        </Button>
      </div>
    </Modal>
  );
}
