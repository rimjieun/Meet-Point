import React from 'react'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import Main from './../components/Main'
import Home from './../components/pages/Home'
import About from './../components/pages/About'


const routes = (
  <Router>
    <Main>
      <Route exact path='/' component={Home} />
      <Route path ='/about' component={About} />
    </Main>
  </Router>
);

export default routes;