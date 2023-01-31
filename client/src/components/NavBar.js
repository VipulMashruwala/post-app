import React, { useContext, useState } from 'react';
import { NavLink, useHistory } from 'react-router-dom';
import { UserContext } from '../App';
import './NavBar.css'


const NavBar = () => {
  const { state, dispatch } = useContext(UserContext)
  const history = useHistory()

  const renderLink = () => {
    if (state) {
      return [
        <li key={1} ><NavLink className='link-color' to='/createpost'><span className="material-icons text-icon">create</span>Create Post</NavLink></li>,
        <li key={2}><NavLink className='link-color' to='/profile'> <span className="material-icons text-icon">person</span>Profile</NavLink></li>,
        <li className='link-color user-name-style'>{state.name}</li>,
        <li key={6}> <a className="waves-effect waves-light btn" onClick={() => {
          localStorage.clear();
          dispatch({ type: 'CLEAR' });
          history.replace('/login');

        }}>
          Log out</a></li>
      ]
    }
    else {
      return [
        <li key={3}><NavLink className='link-color' to='/login'>Login</NavLink></li>,
        <li key={4}><NavLink className='link-color' to='/signup'>Sign up</NavLink></li>
      ]
    }
  }

  return (
    <>
      <nav>
        <div className="nav-wrapper light-orange">
          
          <NavLink className="brand-logo" to={state ? '/' : '/login'}>Instagram</NavLink>
          <a data-bs-target="#navbarToggleExternalContent" data-bs-toggle="collapse" className="sidenav-trigger"><i class="material-icons">menu</i></a>
        
          <ul className="right hide-on-med-and-down">
            {renderLink()}
          </ul>
        </div>
      </nav>


      <div className="collapse" id="navbarToggleExternalContent">
        <div className="collapse-color p-4">
          <ul>
            {renderLink()}
          </ul>
        </div>
      </div>
     
    </>
  )
}

export default NavBar;