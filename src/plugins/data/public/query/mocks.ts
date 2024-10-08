/*
 * SPDX-License-Identifier: Apache-2.0
 *
 * The OpenSearch Contributors require contributions made to
 * this file be licensed under the Apache-2.0 license or a
 * compatible open source license.
 *
 * Any modifications Copyright OpenSearch Contributors. See
 * GitHub history for details.
 */

/*
 * Licensed to Elasticsearch B.V. under one or more contributor
 * license agreements. See the NOTICE file distributed with
 * this work for additional information regarding copyright
 * ownership. Elasticsearch B.V. licenses this file to you under
 * the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

import { Observable } from 'rxjs';
import { QueryService, QuerySetup, QueryStart } from '.';
import { timefilterServiceMock } from './timefilter/timefilter_service.mock';
import { createFilterManagerMock } from './filter_manager/filter_manager.mock';
import { queryStringManagerMock } from './query_string/query_string_manager.mock';

type QueryServiceClientContract = PublicMethodsOf<QueryService>;

const createSetupContractMock = (isEnhancementsEnabled: boolean = false) => {
  const setupContract: jest.Mocked<QuerySetup> = {
    filterManager: createFilterManagerMock(),
    timefilter: timefilterServiceMock.createSetupContract(),
    queryString: queryStringManagerMock.createSetupContract(isEnhancementsEnabled),
    state$: new Observable(),
  };

  return setupContract;
};

const createStartContractMock = (isEnhancementsEnabled: boolean = false) => {
  const startContract: jest.Mocked<QueryStart> = {
    addToQueryLog: jest.fn(),
    filterManager: createFilterManagerMock(),
    queryString: queryStringManagerMock.createStartContract(isEnhancementsEnabled),
    savedQueries: jest.fn() as any,
    state$: new Observable(),
    timefilter: timefilterServiceMock.createStartContract(),
    getOpenSearchQuery: jest.fn(),
  };

  return startContract;
};

const createMock = () => {
  const mocked: jest.Mocked<QueryServiceClientContract> = {
    setup: jest.fn(),
    start: jest.fn(),
    stop: jest.fn(),
  };

  mocked.setup.mockReturnValue(createSetupContractMock());
  mocked.start.mockReturnValue(createStartContractMock());
  return mocked;
};

export const queryServiceMock = {
  create: createMock,
  createSetupContract: createSetupContractMock,
  createStartContract: createStartContractMock,
};
