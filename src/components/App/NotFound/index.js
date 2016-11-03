import React from 'react';
import { Link } from 'react-router';

import './NotFound.styl';
import { baseHref } from '../../../routes';

export default () => (
  <div class='text-center'>
    <h2>):</h2>

    <pre class='error-container'>
      {`
                 _ _      __     _ _
   o O O         | | |    /  \\   | | |
  o         ___   |_  _|  | () |  |_  _|
 TS__[O]   |___|   _|_|_  _\\__/_   _|_|_
 [======|_|"""""|_|"""""|_|"""""|_|"""""|
./o--000'"\`-0-0-'"\`-0-0-'"\`-0-0-'"\`-0-0-'
      `}
    </pre>

    <div class='panel panel-heading'>
      <p>
        Sorry, but page you are looking is not found
        Please, contact support team.
      </p>

      <div class='small muted'>
        using ancii text
        <a target='_blank' href='http://patorjk.com/software/taag/#p=display&f=Train&t=%20_404'>
          from here
        </a>
      </div>
    </div>

    <Link class='btn btn-block' to={baseHref}>GO HOME</Link>
  </div>
);