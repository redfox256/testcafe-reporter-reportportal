# testcafe-reporter-y
[![Build Status](https://travis-ci.org/redfox256/testcafe-reporter-y.svg)](https://travis-ci.org/redfox256/testcafe-reporter-y)

This is the **y** reporter plugin for [TestCafe](http://devexpress.github.io/testcafe).

<p align="center">
    <img src="https://raw.github.com/redfox256/testcafe-reporter-y/master/media/preview.png" alt="preview" />
</p>

## Install

```
npm install testcafe-reporter-y
```

## Usage

When you run tests from the command line, specify the reporter name by using the `--reporter` option:

```
testcafe chrome 'path/to/test/file.js' --reporter report-portal
```


When you use API, pass the reporter name to the `reporter()` method:

```js
testCafe
    .createRunner()
    .src('path/to/test/file.js')
    .browsers('chrome')
    .reporter('report-portal') // <-
    .run();
```

## Author
Darryn 
