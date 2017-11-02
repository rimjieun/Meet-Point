import React, { Component } from 'react'
import { Link } from 'react-router-dom'

const Navbar = props => (
  <nav className='flex-row content-spread'>
    <div className='tools flex-row content-spread panel-container'>
      <div className='search relative'>
        <form>
          <input type='search' name='search' className='search' />
        </form>
        <i className='fa fa-search search absolute' aria-hidden='true'></i>
        <i className='fa fa-times search absolute' aria-hidden='true'></i>
      </div>
      <div className='options'>
        <i className='fa fa-users options' aria-hidden='true'></i>
        <i className='fa fa-user-plus options' aria-hidden='true'></i>
      </div>
    </div>
    <div className='logo'>
      <Link to='/about'>MeetPoint</Link>
    </div>
  </nav>
);

export default Navbar