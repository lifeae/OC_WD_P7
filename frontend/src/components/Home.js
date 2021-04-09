import React, {Component, Fragment} from 'react';
import DEBUG from '../debug';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';

class Home extends Component {
  render() {
    return (
      <Fragment>
        <h1>Tu es connecté bro' !</h1>
      </Fragment>
    );
  }
}

export default Home;
