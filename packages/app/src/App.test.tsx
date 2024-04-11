import {renderWithEffects} from '@backstage/test-utils';
import { createExtensionTester } from '@backstage/frontend-test-utils';
import {
    coreExtensionData, createExtension, createPageExtension, createSignInPageExtension,
} from "@backstage/frontend-plugin-api";
import {screen} from "@testing-library/react";
import React from 'react';
import {ScaffolderPage} from "@backstage/plugin-scaffolder";

// Rarely, and only in windows CI, do these tests take slightly more than the
// default five seconds
jest.setTimeout(15_000);

describe('App', () => {
    it('should render', async () => {
        process.env = {
            NODE_ENV: 'test',
            APP_CONFIG: [
                {
                    data: {
                        app: {
                            title: 'Test',
                            support: {url: 'http://localhost:7007/support'},
                        },
                        backend: {baseUrl: 'http://localhost:7007'},
                        lighthouse: {
                            baseUrl: 'http://localhost:3003',
                        },
                        techdocs: {
                            storageUrl: 'http://localhost:7007/api/techdocs/static/docs',
                        },
                    },
                    context: 'test',
                },
            ] as any,
        };

        const {default: app} = await import('./App');
        const rendered = await renderWithEffects(app);
        expect(rendered.baseElement).toBeInTheDocument();
    });

    it('should work using createExtensionOverrides', async () => {

        const scaffolderPageExtension = createPageExtension({
            namespace: 'scaffolder',
            defaultPath: '/my-create',
            loader: async () =>
                import('@qshift/plugin-quarkus').then(() =>
                        <ScaffolderPage/>
                    /*
                      <div data-testid="field-content">
                        <m.QuarkusVersionListField/>
                      </div>
                    */
                ),
        });

        createExtensionTester(scaffolderPageExtension).render();

        await expect( screen.findByText('scaffolder')).resolves.toBeInTheDocument();
    });
});

describe('createSignInPageExtension', () => {
    it('renders a sign-in page', async () => {
        const SignInPage = createSignInPageExtension({
            name: 'test',
            loader: async () => () => <div data-testid="sign-in-page" />,
        });

        createExtensionTester(
            createExtension({
                name: 'dummy',
                attachTo: { id: 'ignored', input: 'ignored' },
                output: {
                    element: coreExtensionData.reactElement,
                },
                factory: () => ({ element: <div /> }),
            }),
        )
            .add(SignInPage)
            .render();

        await expect(
            screen.findByTestId('sign-in-page'),
        ).resolves.toBeInTheDocument();
    });
});
