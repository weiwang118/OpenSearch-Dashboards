/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import { IStorageWrapper } from '../../../../opensearch_dashboards_utils/public';
import { setOverrides as setFieldOverrides } from '../../../common';
import { QueryEnhancement } from '../types';

export interface DataSettings {
  // TODO: MQL datasource: we should consider this
  // userQueryDataSource: string;
  userQueryEnhancementsEnabled: boolean;
  userQueryLanguage: string;
  userQueryString: string;
  uiOverrides?: {
    fields?: {
      filterable?: boolean;
      visualizable?: boolean;
    };
    showDocLinks?: boolean;
  };
}

export class Settings {
  constructor(
    private readonly storage: IStorageWrapper,
    private readonly queryEnhancements: Map<string, QueryEnhancement>
  ) {}

  // getUserQueryDataSource() {
  //   return this.storage.get('opensearchDashboards.userQueryDataSource') || 'default';
  // }

  // setUserQueryDataSource(dataSource: string) {
  //   this.storage.set('opensearchDashboards.userQueryDataSource', dataSource);
  //   return true;
  // }

  getUserQueryEnhancementsEnabled() {
    return this.storage.get('opensearchDashboards.userQueryEnhancementsEnabled') || true;
  }

  setUserQueryEnhancementsEnabled(enabled: boolean) {
    this.storage.set('opensearchDashboards.userQueryEnhancementsEnabled', enabled);
    return true;
  }

  getUserQueryLanguage() {
    return this.storage.get('opensearchDashboards.userQueryLanguage') || 'kuery';
  }

  setUserQueryLanguage(language: string) {
    this.storage.set('opensearchDashboards.userQueryLanguage', language);
    return true;
  }

  getUserQueryString() {
    return this.storage.get('opensearchDashboards.userQueryString') || '';
  }

  setUserQueryString(query: string) {
    this.storage.set('opensearchDashboards.userQueryString', query);
    return true;
  }

  getUiOverrides() {
    return this.storage.get('opensearchDashboards.uiOverrides') || {};
  }

  setUiOverrides(overrides?: { [key: string]: any }) {
    if (!overrides) {
      this.storage.remove('opensearchDashboards.uiOverrides');
      setFieldOverrides(undefined);
      return true;
    }
    this.storage.set('opensearchDashboards.uiOverrides', overrides);
    setFieldOverrides(overrides.fields);
    return true;
  }

  setUiOverridesByUserQueryLanguage(language: string) {
    const queryEnhancement = this.queryEnhancements.get(language);
    if (queryEnhancement) {
      const { fields = {}, showDocLinks } = queryEnhancement;
      this.setUiOverrides({ fields, showDocLinks });
    } else {
      this.setUiOverrides({ fields: undefined, showDocLinks: undefined });
    }
  }

  toJSON(): DataSettings {
    return {
      // userQueryDataSource: this.getUserQueryDataSource(),
      userQueryEnhancementsEnabled: this.getUserQueryEnhancementsEnabled(),
      userQueryLanguage: this.getUserQueryLanguage(),
      userQueryString: this.getUserQueryString(),
      uiOverrides: this.getUiOverrides(),
    };
  }

  updateSettings({
    userQueryEnhancementsEnabled,
    userQueryLanguage,
    userQueryString,
    uiOverrides,
  }: DataSettings) {
    // this.setUserQueryDataSource(userQueryDataSource);
    this.setUserQueryEnhancementsEnabled(userQueryEnhancementsEnabled);
    this.setUserQueryLanguage(userQueryLanguage);
    this.setUserQueryString(userQueryString);
    this.setUiOverrides(uiOverrides);
  }
}

interface Deps {
  storage: IStorageWrapper;
  queryEnhancements: Map<string, QueryEnhancement>;
}

export function createSettings({ storage, queryEnhancements }: Deps) {
  return new Settings(storage, queryEnhancements);
}
