# Svelte Native

<https://svelte-native.technology/>

TODO: Read this interview with the creator: <https://www.nativescript.org/blog/an-interview-with-svelte-native-creator-david-pershouse>

TODO: Watch YouTube video "Svelte Native - Alcohol Calculator App" from Svelte Master.

## Using TypeScript

Supposedly it will work if you use both the svelte preprocessor and rollup-plugin-typescript.
The preprocessor will handle TS in svelte files the rollup will handle importing `.ts` files.
Try this! You got it to work in Sapper except for reactive statements.

## Overview

Svelte Native copies the approach used by NativeScript-Vue to
integrate use of NativeScript with Svelte for creating mobile applications.
See <https://svelte-native.technology/>.

It was created by David Pershouse who is
halfnelson on GitHub and @halfnelson_au on Twitter.

NativeScript uses HTML, CSS, and JavaScript to create
apps that run on Android and iOS devices.
It was created and is maintained by Telerik Corp.
Native components are used rather than WebViews, just like in React Native.
See <https://nativescript.org/>.

Svelte Native supports all NativeScript UI packages.

Supposedly all native device APIs can be used in Svelte Native.

Svelte native provides a thin layer over the NativeScript API.
This should enable it to easily remain compatible with
future NativeScript versions.

When using NativeScript elements in Svelte Native
their name must begin with a lowercase letter.
This distinguishes them from custom Svelte components
whose names must start with an uppercase letter.

## Getting Started

The steps to get started are:

1. Install NativeScript globally by entering `npm install -g nativescript`
2. Verify installation by entering `tns`.
3. Install the "NativeScript Playground" app on an Android or iOS device.
4. Create a new app by entering `npx degit halfnelson/svelte-native-template {app-name}`.
5. `cd {app-name}`
6. Enter `tns preview --bundle` to build the app and display a QR code.j
7. Launch the "NativeScript Playground.
8. Scan the QR code.
9. Modify the app and the changes will live reload on the phone.
   The first time this is done, it will ask to install
   the "NativeScript Preview App". Click "Install".
   The live reload is very fast ... about three seconds for a small app.

To create a Svelte Native project that uses TypeScript:

```bash
tns create my-awesome-app --template tns-template-blank-svelte
```

The official tutorial and API documentation are at
<https://svelte-native.technology/>.

## Provided Components

SvelteNative wraps nearly all of the NativeScript components
as Svelte components.
They are globally available and so can be used
in custom Svelte components without importing them.

When the provided components are used in custom Svelte components,
their names must start lowercase,
unlike the names in their documentation.
This distinguishes them from custom components
whose names must start uppercase.

The provided library of general purpose UI components include
`ActivityIndicator`, `Button`, `DatePicker`, `Frame`, `HtmlView`,
`Image`, `Label`, `ListPicker`, `ListView`, `Page`, `Progress`,
`ScrollView`, `SearchBar`, `SegmentedBar`, `Slider`, `Switch`,
`TabView`, `TextField`, `TextView`, `TimePicker`, and `WebView`.

There are six approaches for layout of components.
They are `AbsoluteLayout`, `DockLayout`, `FlexboxLayout`,
`GridLayout`, `StackLayout`, and `WrapLayout`.

There are five kinds of dialogs.
They are `ActionDialog`, `AlertDialog`, `ConfirmDialog`,
`LoginDialog`, and `PromptDialog`.

Components for "actions" include
`ActionBar`, `ActionItem`, and `NavigationButton`.

Components for tabs include `Tabs`, `TabStrip`,
`TabStripItem`, `TabContentItem`, and `BottomNavigation`.

## Styling

TODO: Add this!
