import React from 'react';
import { render } from 'react-dom';
import Application from './app/Application';

// // prepare base href using webpack
// import $ from 'jquery';
// import { base } from './app/settings';
// // <base href="/..."/>
// $('base').attr('href', base.href);

// bootstrap app
render(
  <Application />,
  document.querySelector('.app')
);
