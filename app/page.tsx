"use client";

import { Button, Row, Col, Empty, Tabs } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import Link from "next/link";
import AppShell from "@/components/layout/AppShell";
import ProjectCard from "@/components/ui/ProjectCard";
import LoadingState from "@/components/ui/LoadingState";
import ErrorBoundary from "@/components/error/ErrorBoundary";
import EntityModal from "@/components/ui/EntityModal";
import ContextMenu from "@/components/ui/ContextMenu";
import { useFetchEntity } from "@/hooks/useFetchEntity";
import { useCreateEntity } from "@/hooks/useCreateEntity";
import { useUpdateEntity } from "@/hooks/useUpdateEntity";
import { useModalWithType } from "@/hooks/useModalState";
import type { Project } from "@/types/entities";
import { TYPOGRAPHY, COLORS } from "@/theme";
import { useState } from "react";
import { message } from "antd";

export default function ProjectsPage() {
  // Custom hooks for data fetching, creating, and modal state
  const {
    data: projects,
    loading: fetchLoading,
    refetch,
  } = useFetchEntity<Project[]>("/api/projects", [], {
    errorMessage: "Failed to fetch projects",
  });

  const { loading: createProjectLoading, create: createProject } =
    useCreateEntity("/api/projects", {
      successMessage: "Project created successfully",
      onSuccess: refetch,
    });

  const { loading: createPhalakLoading, create: createPhalak } =
    useCreateEntity("/api/boards", {
      successMessage: "Phalak created successfully",
      onSuccess: refetch,
    });

  const modal = useModalWithType(["project", "phalak"] as const, "project");

  // Inline edit state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState<string>("");

  const handleCreate = async (values: {
    name: string;
    description?: string;
    projectId?: string;
  }) => {
    if (modal.type === "project") {
      await createProject(values);
    } else {
      // For phalak, projectId is required
      await createPhalak(values);
    }
    modal.close();
  };

  // Context menu handlers
  const handleDelete = (id: string) => {
    console.log("Delete:", id);
    // TODO: Implement delete functionality
  };

  const handleRename = (id: string, name: string) => {
    setEditingId(id);
    setEditingName(name);
  };

  const handleEditCancel = () => {
    setEditingId(null);
    setEditingName("");
  };

  const handleEditSave = async (id: string) => {
    const trimmedName = editingName.trim();

    if (!trimmedName) {
      message.error("Name cannot be empty");
      return;
    }

    try {
      await fetch(`/api/projects/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: trimmedName }),
      });

      message.success("Project renamed successfully");
      setEditingId(null);
      setEditingName("");
      refetch();
    } catch (error) {
      message.error("Failed to rename project");
      console.error("Error renaming project:", error);
    }
  };

  const handleCopy = (id: string) => {
    console.log("Copy:", id);
    // TODO: Implement copy functionality
  };

  const handleCut = (id: string) => {
    console.log("Cut:", id);
    // TODO: Implement cut functionality
  };

  const handlePaste = (id: string) => {
    console.log("Paste:", id);
    // TODO: Implement paste functionality
  };

  const tabItems = [
    {
      key: "projects",
      label: <span style={TYPOGRAPHY.label.large}>Projects</span>,
    },
    {
      key: "phalaks",
      label: <span style={TYPOGRAPHY.body.regular}>Phalaks</span>,
    },
  ];

  return (
    <ErrorBoundary>
      <AppShell
        heading="Your Workspace"
        actions={[
          {
            label: "+ New Projects",
            onClick: () => modal.open("project"),
            type: "default",
          },
          {
            label: "+ New Phalaks",
            onClick: () => modal.open("phalak"),
            type: "default",
          },
        ]}
      >
        {/* Tabs */}
        <Tabs
          defaultActiveKey="projects"
          items={tabItems}
          tabBarStyle={{
            borderBottom: `1px solid ${COLORS.border.medium}`,
          }}
        />

        {/* Projects Grid */}
        {fetchLoading ? (
          <LoadingState message="Loading projects..." />
        ) : !projects || projects.length === 0 ? (
          <Empty description="No projects yet" style={{ padding: "48px" }}>
            <Button
              icon={<PlusOutlined />}
              onClick={() => modal.open("project")}
            >
              Create Your First Project
            </Button>
          </Empty>
        ) : (
          <Row gutter={[20, 20]}>
            {projects.map((project) => (
              <Col key={project.id}>
                <ContextMenu
                  onDelete={() => handleDelete(project.id)}
                  onRename={() => handleRename(project.id, project.name)}
                  onCopy={() => handleCopy(project.id)}
                  onCut={() => handleCut(project.id)}
                  onPaste={() => handlePaste(project.id)}
                >
                  <Link
                    href={`/projects/${project.id}`}
                    style={{ textDecoration: "none" }}
                  >
                    <ProjectCard
                      id={project.id}
                      name={project.name}
                      description={project.description}
                      phalakCount={project.boards?.length || 0}
                      subFolderCount={project.folders?.length || 0}
                      type="project"
                      isEditing={editingId === project.id}
                      editingName={editingName}
                      onEditingNameChange={setEditingName}
                      onEditSave={() => handleEditSave(project.id)}
                      onEditCancel={handleEditCancel}
                    />
                  </Link>
                </ContextMenu>
              </Col>
            ))}
          </Row>
        )}

        <EntityModal
          open={modal.isOpen}
          title={modal.type === "project" ? "Create Project" : "Create Phalak"}
          loading={
            modal.type === "project"
              ? createProjectLoading
              : createPhalakLoading
          }
          onCancel={modal.close}
          onSubmit={handleCreate}
          fields={
            modal.type === "project"
              ? [
                  {
                    name: "name",
                    label: "Name",
                    required: true,
                    placeholder: "Film Production",
                  },
                  {
                    name: "description",
                    label: "Description",
                    type: "textarea",
                    placeholder: "Optional description",
                  },
                ]
              : [
                  {
                    name: "name",
                    label: "Name",
                    required: true,
                    placeholder: "Phalak name",
                  },
                  {
                    name: "description",
                    label: "Description",
                    type: "textarea",
                    placeholder: "Optional description",
                  },
                  {
                    name: "projectId",
                    label: "Project",
                    required: true,
                    type: "select",
                    placeholder: "Select a project",
                    options:
                      projects?.map((p) => ({ label: p.name, value: p.id })) ||
                      [],
                  },
                ]
          }
        />
      </AppShell>
    </ErrorBoundary>
  );
}
