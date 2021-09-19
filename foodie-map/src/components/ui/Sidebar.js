import SubMenu from "./SubMenu";
import { IconContext } from "react-icons/lib";
import classes from "./Sidebar.module.css";

function Sidebar(props) {
  const actionHandler = (photoURLs) => props.showGallery(photoURLs);

  return (
    <>
      <IconContext.Provider value={{ color: "#afa" }}>
        <div className={classes.sidebarNav}>
          <div className={classes.sidebarWrap}>
            {props.collections.map((item, index) => {
              return <SubMenu item={item} key={index} action={actionHandler} />;
            })}
          </div>
        </div>
      </IconContext.Provider>
    </>
  );
}

export default Sidebar;
