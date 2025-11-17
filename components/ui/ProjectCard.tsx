"use client";

import { Card, Input } from "antd";
import { FolderOutlined, FileOutlined } from "@ant-design/icons";
import { COLORS, TYPOGRAPHY, COMMON_STYLES, SPACING, RADIUS } from "@/theme";
import { KeyboardEvent } from "react";

interface ProjectCardProps {
  id: string;
  name: string;
  description?: string | null;
  phalakCount?: number;
  subFolderCount?: number;
  coverImage?: string | null;
  type?: "project" | "folder" | "phalak";
  // Inline edit props
  isEditing?: boolean;
  editingName?: string;
  onEditingNameChange?: (name: string) => void;
  onEditSave?: () => void;
  onEditCancel?: () => void;
}

export default function ProjectCard({
  id,
  name,
  description,
  phalakCount = 0,
  subFolderCount = 0,
  coverImage,
  type = "folder",
  isEditing = false,
  editingName = "",
  onEditingNameChange,
  onEditSave,
  onEditCancel,
}: ProjectCardProps) {
  const cardVariant = coverImage ? "image" : "folder";
  const isPhalak = type === "phalak";
  const totalChildren = phalakCount + subFolderCount;

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      onEditSave?.();
    } else if (e.key === "Escape") {
      e.preventDefault();
      onEditCancel?.();
    }
  };

  const handleBlur = () => {
    // Save on blur (click outside)
    onEditSave?.();
  };

  const handleInputClick = (e: React.MouseEvent) => {
    // Prevent Link navigation when clicking input
    e.preventDefault();
    e.stopPropagation();
  };

  const handleInputFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    // Select all text when input is focused for easy replacement
    e.target.select();
  };

  return (
    <Card
      hoverable
      variant="outlined"
      style={{
        width: 289,
        height: cardVariant === "image" ? 272 : 192,
        border: `0.5px solid ${COLORS.border.medium}`,
        borderRadius: RADIUS.lg,
        position: "relative",
      }}
      styles={{
        body: {
          padding: cardVariant === "image" ? 0 : SPACING.lg,
          height: "100%",
        },
      }}
    >
      {cardVariant === "folder" ? (
        // Folder/Phalak variant
        <>
          <div
            style={{
              ...COMMON_STYLES.flexColumn,
              alignItems: "flex-start",
              justifyContent: "center",
              height: "100%",
            }}
          >
            {isPhalak ? (
              <FileOutlined
                style={{
                  fontSize: 48,
                  color: COLORS.secondary,
                  marginBottom: SPACING.lg,
                }}
              />
            ) : (
              <FolderOutlined
                style={{
                  fontSize: 48,
                  color: COLORS.primary,
                  marginBottom: SPACING.lg,
                }}
              />
            )}
            <div
              style={{
                ...TYPOGRAPHY.label.large,
                color: COLORS.text.primary,
                marginBottom: SPACING.sm,
              }}
              onClick={handleInputClick}
            >
              {isEditing ? (
                <Input
                  value={editingName}
                  onChange={(e) => onEditingNameChange?.(e.target.value)}
                  onKeyDown={handleKeyDown}
                  onBlur={handleBlur}
                  onClick={handleInputClick}
                  onFocus={handleInputFocus}
                  autoFocus
                  maxLength={100}
                  style={{
                    ...TYPOGRAPHY.label.large,
                    padding: 0,
                    border: "none",
                    outline: `1px solid ${COLORS.primary}`,
                    outlineOffset: "-1px",
                    backgroundColor: COLORS.background.white,
                  }}
                />
              ) : (
                name
              )}
            </div>
            {description && (
              <div
                style={{
                  ...TYPOGRAPHY.body.tiny,
                  color: COLORS.text.secondary,
                  ...COMMON_STYLES.truncateLines(2),
                }}
              >
                {description}
              </div>
            )}
          </div>

          {/* Children Count Badge */}
          {!isPhalak && totalChildren > 0 && (
            <div
              style={{
                position: "absolute",
                bottom: SPACING.md - 4,
                right: SPACING.md - 4,
                color: COLORS.primary,
                fontSize: 13,
                fontWeight: 300,
                fontFamily: "Inter, sans-serif",
              }}
            >
              {totalChildren}
            </div>
          )}
        </>
      ) : (
        // Image variant
        <div style={{ height: "100%", ...COMMON_STYLES.flexColumn }}>
          {/* Cover Image */}
          <div
            style={{
              height: 192,
              borderTopLeftRadius: RADIUS.lg,
              borderTopRightRadius: RADIUS.lg,
              overflow: "hidden",
              background: coverImage
                ? `url(${coverImage})`
                : COLORS.border.light,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            {!coverImage && (
              <div
                style={{
                  ...COMMON_STYLES.flexCenter,
                  height: "100%",
                  color: COLORS.border.dark,
                }}
              >
                <FolderOutlined style={{ fontSize: 48 }} />
              </div>
            )}
          </div>
          {/* Footer */}
          <div
            style={{
              height: 80,
              background: COLORS.background.white,
              borderTop: `0.5px solid ${COLORS.border.medium}`,
              borderBottomLeftRadius: RADIUS.lg,
              borderBottomRightRadius: RADIUS.lg,
              display: "flex",
              alignItems: "center",
              padding: "0 22px",
            }}
          >
            <div
              style={{
                ...TYPOGRAPHY.body.large,
                fontWeight: 500,
                color: COLORS.text.primary,
              }}
              onClick={handleInputClick}
            >
              {isEditing ? (
                <Input
                  value={editingName}
                  onChange={(e) => onEditingNameChange?.(e.target.value)}
                  onKeyDown={handleKeyDown}
                  onBlur={handleBlur}
                  onClick={handleInputClick}
                  onFocus={handleInputFocus}
                  autoFocus
                  maxLength={100}
                  style={{
                    ...TYPOGRAPHY.body.large,
                    fontWeight: 500,
                    padding: 0,
                    border: "none",
                    outline: `1px solid ${COLORS.primary}`,
                    outlineOffset: "-1px",
                    backgroundColor: COLORS.background.white,
                  }}
                />
              ) : (
                name
              )}
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}
