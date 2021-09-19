import { Link } from "react-router-dom";

import classes from "./MainNavigation.module.css";
import * as RiIcons from "react-icons/ri";

function MainNavigation() {
  return (
    <header className={classes.header}>
      <Link to="/" className={classes.navIconBox}>
        <RiIcons.RiRoadMapFill className={classes.navIcon} />
      </Link>

      <Link to="/favorites" className={classes.navIconBox}>
        <RiIcons.RiHeartFill className={classes.navIcon} />
      </Link>
    </header>
  );
}

export default MainNavigation;
