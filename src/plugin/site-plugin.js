const cheerio = require('cheerio');
const fs = require('fs-extra');
const path = require('path');

let config;
exports.onHandleConfig = function(ev) {
  config = ev.data.config;
};

exports.onHandleContent = function(ev) {
  if (path.extname(ev.data.fileName) !== '.html') return;

  const $ = cheerio.load(ev.data.content);

  // title
  $('head title').text('ESDoc - A Good Documentation Generator for JavaScript');

  // header
  const $header = $('body > header');
  $header.html(`
    <a href="./" class="logo"><img src="./manual/asset/image/logo.png"/></a>
    <a href="./" class="brand">ESDoc</a>
    <ul>
      <li><a href="https://try.esdoc.org" target="_blank">Try it out</a></li>
      <li><a href="./manual/usage.html" class="hair-line">Usage</a></li>
      <li><a href="./manual/feature.html">Features</a></li>
      <li><a href="./manual/config.html">Config</a></li>
      <li><a href="./manual/tags.html">Tags</a></li>
      <li><a href="./manual/api.html">API</a></li>
      <li><a href="./manual/CHANGELOG.html" class="hair-line">Releases</a></li>
      <li><a href="./manual/faq.html">FAQ</a></li>
    </ul>
  `);

  // remove unnecessary scripts
  const scripts = ['script/search_index.js', 'script/search.js', 'script/inherited-summary.js', 'script/test-summary.js', 'script/inner-link.js'];
  for (const script of scripts) {
    $(`script[src="${script}"]`).remove();
  }

  // footer
  $('body > footer').html(`© 2016 <a href="https://twitter.com/h13i32maru">Ryo Maruyama</a>. All rights reserved.`);

  // changelog
  $('#changelog').text('Releases');

  // result
  ev.data.content = $.html();
};

exports.onComplete = function() {
  fs.copySync('./src/favicon.ico', `${config.destination}/favicon.ico`);
};
