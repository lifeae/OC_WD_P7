import React, {Component, Fragment} from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';

class Welcome extends Component {
  render() {
    return (
      <Fragment>
          <Link to='/connexion'>
            <button>Connexion</button>
          </Link>
          <Link to='/inscription'>
            <button>Inscription</button>
          </Link>
      </Fragment>
    );
  }
}

export default Welcome;
