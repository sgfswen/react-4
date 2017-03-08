import React from 'react';

export default ({ children, router }) => (
  <div>
    <h2 class="text-center">
      React App
    </h2>
    <div class='container-fluid'>
      {children && React.cloneElement(children)}
    </div>
  </div>
);
