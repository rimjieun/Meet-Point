import React, { Component } from 'react'
import Navbar from './common/Navbar'

const MainLayout = props => (
  <div className='main flex-col'>
    <Navbar />
    {props.children}
  </div>
);

export default MainLayout