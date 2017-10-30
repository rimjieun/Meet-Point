import React from 'react'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import MainLayout from './../components/MainLayout'
import Home from './../components/pages/Home'
import About from './../components/pages/About'


const routes = (
  <Router>
    <MainLayout>
      <Route exact path='/' component={Home} />
      <Route path ='/about' component={About} />
    </MainLayout>
  </Router>
);

export default routes;