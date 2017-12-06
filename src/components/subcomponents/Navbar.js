import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = props => (
  <nav className="navbar navbar-expand-lg navbar-light bg-light">
    <a className="navbar-brand" href="#">MeetPoint</a>
    <form className="form-inline my-2 my-lg-0">
      <input className="form-control mr-sm-2" type="search" placeholder="Search" aria-label="Search" />
      <button className="btn btn-outline-success my-2 my-sm-0" type="submit">Search</button>
    </form>
    <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
      <span className="navbar-toggler-icon"></span>
    </button>
    <div className="collapse navbar-collapse" id="navbarSupportedContent">
      <ul className="navbar-nav ml-auto">
        <li className="nav-item active">
          <a className="nav-link" href="#"><i className="fa fa-users" aria-hidden="true"></i></a>
        </li>
        <li className="nav-item active">
          <a className="nav-link" href="#"><i className="fa fa-user-plus" aria-hidden="true"></i></a>
        </li>
        <li className="nav-item active">
          <a className="nav-link" href="#"><i className="fa fa-cog" aria-hidden="true"></i></a>
        </li>
        <li className="nav-item active">
          <a className="nav-link" href="#"><i className="fa fa-info-circle" aria-hidden="true"></i></a>
        </li>
      </ul>
    
    </div>
  </nav>
);

export default Navbar;