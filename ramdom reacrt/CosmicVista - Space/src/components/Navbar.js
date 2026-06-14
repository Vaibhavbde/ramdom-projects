import React from 'react'
import "../stylesheets/Navbar.css"
import { Link,useNavigate } from 'react-router-dom'
function Navbar() {
    return (
        <>
            <nav className="navbar navbar-expand-lg my-2">
                <div className="container-fluid inside_navbar">
                    <a className="navbar-brand" href="#">CosmicVista</a>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                            <Link className="nav-item" to="/">
                                <a className="nav-link active" aria-current="page" href="#">Home</a>
                            </Link>
                            <Link className="nav-item" to='/information'>
                                <a className="nav-link active" aria-current="page" href="#">Space Information</a>
                            </Link>
                            <Link className="nav-item" to='/events'>
                                <a className="nav-link active" aria-current="page" href="#">Events</a>
                            </Link>
                            <Link className="nav-item" to='/chat'>
                                <a className="nav-link active" aria-current="page" href="#">Chat</a>
                            </Link>
                        </ul>
                        <form className="d-flex" role="search">
                            <input className="form-control me-2" type="search" placeholder="Search" aria-label="Search" />
                            <button className="btn btn-outline-success" type="submit">Search</button>
                        </form>
                    </div>
                </div>
            </nav>
        </>
    )
}

export default Navbar