import React from 'react';
import './navbarstyle.css'; 
import { Link } from 'react-router-dom';

function Header() {

  return (
    <div className="header1">
      <div className='navbar-content-container'>

        <Link className='navbar-link' to="/EventViewer">EVENTVIEWER</Link>
      </div>

    </div>
  );
}

export default Header;