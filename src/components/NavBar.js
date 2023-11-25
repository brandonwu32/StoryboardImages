import "./NavBar.css"
import { NavLink } from "react-router-dom";

function NavBar() {

    return (
        <div className = "navBar">
            <NavLink to = "/"><button className = "menuButton"><p className = "buttonText">Home</p></button></NavLink>
            <NavLink to = "/storyboard"><button className = "menuButton"><p className = "buttonText">Storyboard</p></button></NavLink>
            <a href = "https://yixqiao.github.io/Visualizer/" rel="noopener noreferrer" target="_blank"><button className = "menuButton"><p className = "buttonText">Music</p></button></a>
        </div>
    );
}

export default NavBar;