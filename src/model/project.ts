import { normalizePath, Vault } from "obsidian";
import { indexBodyFor } from "./index-file";
import type {
  LongformProjectSettings,
  LongformPluginSettings,
  IndexFileMetadata,
} from "./types";

export function addProject(
  path: string,
  project: LongformProjectSettings,
  settings: LongformPluginSettings
): LongformPluginSettings {
  return {
    ...settings,
    projects: {
      ...settings.projects,
      [path]: project,
    },
  };
}

export function removeProject(
  path: string,
  settings: LongformPluginSettings
): LongformPluginSettings {
  const newSettings = settings;
  delete newSettings.projects[path];
  return newSettings;
}

export function isLongformProject(
  path: string,
  settings: LongformPluginSettings
): boolean {
  return !!settings.projects[path];
}

export function isInLongformProject(
  path: string,
  settings: LongformPluginSettings
): boolean {
  return !!Object.keys(settings.projects).find((p) => path.startsWith(p));
}

export function projectFor(
  path: string,
  settings: LongformPluginSettings
): LongformProjectSettings | null {
  // console.log(settings.projects);
  return (
    Object.values(settings.projects).find(
      (p: LongformProjectSettings) => p && path.startsWith(p.path)
    ) || null
  );
}

export function indexFilePath(project: LongformProjectSettings): string {
  return normalizePath(`${project.path}/${project.indexFile}.md`);
}

export function isIndexFile(
  path: string,
  project: LongformProjectSettings
): boolean {
  return path === indexFilePath(project);
}

export async function saveProjectIndex(
  vault: Vault,
  projectPath: string,
  settings: LongformPluginSettings,
  state: IndexFileMetadata
): Promise<void> {
  // Get general settings
  const projectSettings = projectFor(projectPath, settings);
  if (!projectSettings) {
    return;
  }

  const body = indexBodyFor(state);
  await vault.adapter.write(indexFilePath(projectSettings), body);
}
