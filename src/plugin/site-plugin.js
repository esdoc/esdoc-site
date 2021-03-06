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
      <li><a href="./manual/usage.html">Usage</a></li>
      <li><a href="./manual/feature.html">Features</a></li>
      <li><a href="./manual/config.html">Config</a></li>
      <li><a href="./manual/tags.html">Tags</a></li>
      <li><a href="./manual/api.html">API</a></li>
      <li><a href="./manual/CHANGELOG.html" class="hair-line">Releases</a></li>
      <li><a href="./manual/faq.html">FAQ</a></li>
      <li><a style="position:relative; top:3px;" href="https://github.com/esdoc/esdoc"><img width="20px" src="./image/github.png"></a></li>
      <li><span class="hair-line" style="margin: 0.4em; padding: 0"/></li>
      <li><a href="https://github.com/esdoc/esdoc-plugins" target="_blank" class="button hair-line">Plugins</a></li>
      <li><a href="https://try.esdoc.org" target="_blank" class="button">Try it out</a></li>
      <li><a href="https://doc.esdoc.org" target="_blank" class="button">Hosting</a></li>
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
