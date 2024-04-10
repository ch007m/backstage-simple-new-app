import React from 'react';

import {
    configApiRef,
    createApiFactory,
    SignInPageProps,
} from '@backstage/core-plugin-api';

import {
    SignInPage,
} from '@backstage/core-components';

import {
    createPageExtension,
    createExtensionOverrides,
    createSignInPageExtension,
} from '@backstage/frontend-plugin-api';

import {
    createApiExtension,
} from '@backstage/frontend-plugin-api';

import {createApp} from '@backstage/frontend-app-api';
import {ScmAuth, ScmIntegrationsApi, scmIntegrationsApiRef} from "@backstage/integration-react";
import userSettingsPlugin from '@backstage/plugin-user-settings/alpha';
import techdocsPlugin from "@backstage/plugin-techdocs/alpha";
import scaffolderPlugin from "@backstage/plugin-scaffolder/alpha";
import {compatWrapper, convertLegacyApp} from "@backstage/core-compat-api";
import {ScaffolderFieldExtensions} from "@backstage/plugin-scaffolder-react";
import {ScaffolderPage} from "@backstage/plugin-scaffolder";
import {FlatRoutes} from "@backstage/core-app-api";
import {Route} from "react-router";

/*function ScaffolderFieldExtensionsPage() {
    return (
        <ScaffolderFieldExtensions>
            <QuarkusVersionListField/>
            <QuarkusExtensionListField/>
            <QuarkusQuickstartPickerField/>
        </ScaffolderFieldExtensions>
    );
};*/

const signInPage = createSignInPageExtension({
    name: 'guest',
    loader: async () => (props: SignInPageProps) =>
        <SignInPage {...props} providers={['guest']}/>,
});

const scmAuthExtension = createApiExtension({
    factory: ScmAuth.createDefaultApiFactory(),
});

const scmIntegrationApi = createApiExtension({
    factory: createApiFactory({
        api: scmIntegrationsApiRef,
        deps: {configApi: configApiRef},
        factory: ({configApi}) => ScmIntegrationsApi.fromConfig(configApi),
    }),
});

/*
  /create appears within the left menu bar but if we click on the link, the screen is white
  The home screen reports: ERROR 404: PAGE NOT FOUND
  DevTool console don't report errors

  If we wrap the tags <ScaffolderFieldExtensions> with <ScaffolderPage> then we got as error: App context is not available

  Documentation page: https://backstage.io/docs/frontend-system/architecture/extension-overrides
 */
const scaffolderPage = createPageExtension({
    namespace: 'scaffolder',
    defaultPath: '/my-create',
    // routeRef is mandatory otherwise we got: No path for routeRef{type=absolute,id=scaffolder}
    routeRef: scaffolderPlugin.routes.root,
    loader: () =>
        import('@qshift/plugin-quarkus').then(m =>
                compatWrapper(
                    <ScaffolderFieldExtensions>
                       <m.QuarkusVersionListField/>
                    </ScaffolderFieldExtensions>
                )
        ),
});

/*
   /create don't appear on the left menu bar when
   we use this convertLegacyApp function and pass it as
   features to:  createApp({
   The home screen reports: ERROR 404: PAGE NOT FOUND
const legacyPlugins = convertLegacyApp(
    <FlatRoutes>
        <Route
            path="/create"
            element={
                <ScaffolderPage>
                    <ScaffolderFieldExtensions>
                        <QuarkusVersionListField/>
                    </ScaffolderFieldExtensions>
                </ScaffolderPage>
            }
        />
    </FlatRoutes>,
);
*/


const app = createApp({
    features: [
        userSettingsPlugin, /* Needed to see on the left menu bar the settings link */
        techdocsPlugin, /* Needed to compose, render techdocs, etc */
        scaffolderPlugin,
        //...legacyPlugins,
        createExtensionOverrides({
            extensions: [
                signInPage,
                scmIntegrationApi, /* Needed to scaffold a template */
                scmAuthExtension, /* Needed to scaffold a template */
                scaffolderPage,
            ],
        }),
    ],
});

export default app.createRoot();
