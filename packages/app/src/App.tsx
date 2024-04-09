import React from 'react';

import {
    SignInPageProps,
} from '@backstage/core-plugin-api';

import {
    SignInPage,
} from '@backstage/core-components';

import {
    createExtensionOverrides,
    createSignInPageExtension,
} from '@backstage/frontend-plugin-api';

import {createApp} from '@backstage/frontend-app-api';


const signInPage = createSignInPageExtension({
    name: 'guest',
    loader: async () => (props: SignInPageProps) =>
        <SignInPage {...props} providers={['guest']} />,
});


const app = createApp({
    features: [
        createExtensionOverrides({
            extensions: [
                signInPage
            ],
        }),
    ],
});

export default app.createRoot();
