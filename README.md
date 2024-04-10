# [Backstage](https://backstage.io)

This is your newly scaffolded Backstage App, Good Luck!

To start the app, run:

```sh
yarn install
yarn dev
```

## New-frontend and PageExtension

Documentation page: https://backstage.io/docs/frontend-system/architecture/extension-overrides

To register some Scaffold fields part of this application, we have extended the code to use the function `createPageExtension({`
where we load the Quarkus plugin and add the fields coming from the plugin under the tag `<ScaffolderFieldExtensions>`

Snippet code:
```typescript
const scaffolderPage = createPageExtension({
    namespace: 'scaffolder',
    defaultPath: '/my-create',
    // routeRef is mandatory otherwise we got: No path for routeRef{type=absolute,id=scaffolder}
    routeRef: scaffolderPlugin.routes.root,
    loader: () =>
        import('@qshift/plugin-quarkus').then(m =>
                <ScaffolderFieldExtensions>
                    <m.QuarkusVersionListField/>
                </ScaffolderFieldExtensions>
        ),
});
```

When we execute `yarn dev`n, the link `/my-create` appears within the left menu bar but if we click on the link, the screen is white.
Chrome DevTool console don't report errors like the log on the terminal.
Unfortunately, the home screen reports: ERROR 404: PAGE NOT FOUND

**Remark**: If we wrap the tags `<ScaffolderFieldExtensions>` with `<ScaffolderPage>` then we got as error: `App context is not available`
