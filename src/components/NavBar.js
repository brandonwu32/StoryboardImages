import "./NavBar.css"
import { NavLink } from "react-router-dom";

function NavBar() {

    return (
        <div className = "navBar">
            <NavLink to = "/"><button className = "menuButton"><p className = "buttonText">Home</p></button></NavLink>
            <NavLink to = "/storyboard"><button className = "menuButton"><p className = "buttonText">Storyboard</p></button></NavLink>
            <NavLink to = "/"><button className = "menuButton"><p className = "buttonText">Home</p></button></NavLink>
        </div>
    );
}

export default NavBar;