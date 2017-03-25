# new-spiral

> WebVR spiral for the future

A simple, browser-based spiral that supports WebVR either through a supported browser, or [webvr-polyfill] on mobile.

## Install

You don't need to install new-spiral if you just want to view it.

### Prebuilt

Download the files from the [gh-pages branch] and host them from a web server.

### Custom

```
git clone https://github.com/nemurimasu/new-spiral/
cd new-spiral
yarn install
yarn build
```

Copy files from the dist folder to your web server.

## Usage

If your browser supports WebVR, a small button will appear in the top left, allowing you to enter VR mode when clicked. See [webvr.info] for more information about browsers with support for WebVR.

### Development

`yarn serve` will launch a development server.

## License

[MIT License]

[webvr-polyfill]: https://github.com/googlevr/webvr-polyfill
[gh-pages branch]: https://github.com/nemurimasu/new-spiral/tree/gh-pages
[webvr.info]: https://webvr.info/
[MIT License]: https://choosealicense.com/licenses/mit/
