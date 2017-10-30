import React, { Component } from 'react'
import { Link } from 'react-router-dom'

const Navbar = props => (
  <nav className='main-nav'>
    <div className='user-tools'>
      <div className='search-box'>
        <form>
          <input type='search' name='search' className='search' />
        </form>
        <i className='fa fa-search search' aria-hidden='true'></i>
        <i className='fa fa-times search' aria-hidden='true'></i>
      </div>
      <div className='user-options'>
        <i className='fa fa-users tools' aria-hidden='true'></i>
        <i className='fa fa-user-plus tools' aria-hidden='true'></i>
      </div>
    </div>
    <div className='logo'>
      <Link to='/about'>MeetPoint</Link>
    </div>
  </nav>
);

export default Navbar