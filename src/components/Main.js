import React, { Component } from 'react'
import { Navbar } from './subcomponents'

const Main = props => (
  <div className='main flex-col'>
    <Navbar />
    {props.children}
  </div>
);

export default Main