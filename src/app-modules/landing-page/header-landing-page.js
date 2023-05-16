import React from "react"

const LandingHeader = () => {
    return (
        <div className="header_landing">
        <header>
            <nav className="navbar navbar-expand-lg navbar-light py-3">
                <a className="navbar-brand" href="#">Notenetic</a>
                <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav ml-auto">
                        <li className="nav-item active">
                            <a className="nav-link" href="#">Home</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="#">About</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="#">Contact us</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="#">Blogs</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="#">Join us</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="tel:+1 234 56 78 123"><span className="phone_icon"><img src="/phone.svg" /></span>
                                +1 234 56 78 123</a>
                        </li>
                    </ul>
                </div>
            </nav>
        </header>

 
        </div>
    )
}

export default LandingHeader

