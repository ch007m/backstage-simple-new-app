import React from 'react';

import {
    configApiRef, createApiFactory,
    SignInPageProps,
} from '@backstage/core-plugin-api';

import {
    SignInPage,
} from '@backstage/core-components';

import {
    createExtensionOverrides,
    createSignInPageExtension,
} from '@backstage/frontend-plugin-api';

import {
    createApiExtension,
} from '@backstage/frontend-plugin-api';

import {createApp} from '@backstage/frontend-app-api';
import {ScmAuth, ScmIntegrationsApi, scmIntegrationsApiRef} from "@backstage/integration-react";


const signInPage = createSignInPageExtension({
    name: 'guest',
    loader: async () => (props: SignInPageProps) =>
        <SignInPage {...props} providers={['guest']} />,
});

const scmAuthExtension = createApiExtension({
    factory: ScmAuth.createDefaultApiFactory(),
});

const scmIntegrationApi = createApiExtension({
    factory: createApiFactory({
        api: scmIntegrationsApiRef,
        deps: { configApi: configApiRef },
        factory: ({ configApi }) => ScmIntegrationsApi.fromConfig(configApi),
    }),
});


const app = createApp({
    features: [
        createExtensionOverrides({
            extensions: [
                signInPage,
                scmIntegrationApi, /* Needed to scaffold a template */
                scmAuthExtension, /* Needed to scaffold a template */
            ],
        }),
    ],
});

export default app.createRoot();
