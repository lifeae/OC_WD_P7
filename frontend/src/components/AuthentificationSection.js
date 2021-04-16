import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';

class AuthentificationSection extends Component {

  render() {
    return (
      <Fragment>
        <Link to={{
          pathname: '/login',
          state: { isUserConnected: this.props.isUserConnected }
        }}>
          <button>Connexion</button>
        </Link>
        <Link to={{
          pathname: '/signup',
          state: { isUserConnected: this.props.isUserConnected }
        }}>
          <button>Inscription</button>
        </Link>
      </Fragment>
    );
  }
}

export default AuthentificationSection;