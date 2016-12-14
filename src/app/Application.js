const React                 = require('react');
const ReactRouter           = require('react-router');
const Redirect              = ReactRouter.Redirect;
const Router                = ReactRouter.Router;
const Route                 = ReactRouter.Route;
const IndexRoute            = ReactRouter.IndexRoute;
const browserHistory        = ReactRouter.browserHistory;
const applyRouterMiddleware = ReactRouter.applyRouterMiddleware;
const useScroll             = require('react-router-scroll').useScroll;

const App                   = require('./components');
const base                  = require('./settings.json').base;
const HomePage              = require('./components/HomePage/HomePage');
const AddAuthorPage         = require('./components/HomePage/Author/AddAuthorPage');
const NotFoundPage          = require('./components/NotFoundPage/NotFoundPage');

const Application = React.createClass({
  render: function render() {
    return (
      <Router history={browserHistory} render={applyRouterMiddleware(useScroll())}>
        <Route path={base.href} component={App}>
          <IndexRoute component={HomePage} />
          <Route path='add-author' component={AddAuthorPage} />
          <Redirect from='info' to='about-us' />
          <Route path='**' component={NotFoundPage} />
        </Route>
        <Route path='**' component={NotFoundPage} />
      </Router>
    );
  },
});

module.exports = Application;