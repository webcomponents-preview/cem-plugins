# <img align="left" src="https://github.com/webcomponents-preview/client/raw/main/src/assets/icons/logo.svg" alt="WCP Logo" height="43px"> Custom Elements Manifest Analyzer Plugins

[![Workflow status](https://github.com/webcomponents-preview/cem-plugins/actions/workflows/checks.yml/badge.svg)](https://github.com/webcomponents-preview/cem-plugins/actions/workflows/checks.yml)
[![@webcomponents-preview/cem-plugin-examples](https://badgen.net/npm/v/@webcomponents-preview/cem-plugin-examples/latest?label=@webcomponents-preview/cem-plugin-examples&color=cyan&icon=npm)](https://www.npmjs.com/package/@webcomponents-preview/cem-plugin-examples)
[![@webcomponents-preview/cem-plugin-grouping](https://badgen.net/npm/v/@webcomponents-preview/cem-plugin-grouping/latest?label=@webcomponents-preview/cem-plugin-grouping&color=cyan&icon=npm)](https://www.npmjs.com/package/@webcomponents-preview/cem-plugin-grouping)
[![@webcomponents-preview/cem-plugin-inline-readme](https://badgen.net/npm/v/@webcomponents-preview/cem-plugin-inline-readme/latest?label=@webcomponents-preview/cem-plugin-inline-readme&color=cyan&icon=npm)](https://www.npmjs.com/package/@webcomponents-preview/cem-plugin-inline-readme)

A collection of plugins for the [@custom-elements-manifest/analyzer](https://github.com/open-wc/custom-elements-manifest/tree/master/packages/analyzer) package. Have a look at the [documentation](https://custom-elements-manifest.open-wc.org/analyzer/config/#config-file) for more information about how to use plugins.

## Plugins in this repository

- [@webcomponents-preview/cem-plugin-examples](https://github.com/webcomponents-preview/cem-plugins/tree/main/src/cem-plugin-examples) - Adds inline examples tagged by `@example` to the manifest of the analyzed custom element class.
- [@webcomponents-preview/cem-plugin-inline-readme](https://github.com/webcomponents-preview/cem-plugins/tree/main/src/cem-plugin-inline-readme) - Adds the provided readme contents to the analyzed custom element class declaration.

> Those plugins allow to create a manifest with additional informations that are consumed by the [WebComponents Preview client](https://github.com/webcomponents-preview/client).
