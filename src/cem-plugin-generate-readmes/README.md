# <img align="left" src="https://github.com/webcomponents-preview/client/raw/main/src/assets/icons/logo.svg" alt="WCP Logo" height="43px"> @webcomponents-preview/cem-plugin-generate-readmes

[![Workflow status](https://github.com/webcomponents-preview/cem-plugins/actions/workflows/checks.yml/badge.svg)](https://github.com/webcomponents-preview/cem-plugins/actions/workflows/checks.yml)
[![npm Release](https://badgen.net/npm/v/@webcomponents-preview/cem-plugin-generate-readmes/latest?label=@webcomponents-preview/cem-plugin-generate-readmes&color=cyan&icon=npm)](https://www.npmjs.com/package/@webcomponents-preview/cem-plugin-generate-readmes)

Generates individual README.md files for each custom element. If you want to have a single readme file for all your custom elements, take a loot at the [cem-plugin-readme](https://github.com/open-wc/custom-elements-manifest/tree/master/plugins/readme).

The [cem-plugin-readme](https://github.com/open-wc/custom-elements-manifest/tree/master/plugins/readme) is also used under the hood to generate the single readmes files. But as we're not very convinced about the output of this plugin, we're providing an option to use the [`web-component-analyzer`](https://github.com/runem/web-component-analyzer) alternatively for the time being.

As future goal we plan to implement a custom readme transformer to fulfill our needs.
