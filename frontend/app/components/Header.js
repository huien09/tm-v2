import React from "react"
import { Link } from "react-router-dom"

function Header() {
  return (
    <header className="header-bar bg-primary mb-3">
      <div className="container d-flex flex-column flex-md-row align-items-center p-3">
        <h3 className="my-0 mr-md-auto font-weight-normal">
          <Link to="/Home" className="text-white">
            Home
          </Link>
        </h3>
      </div>
    </header>
  )
}

export default Header
