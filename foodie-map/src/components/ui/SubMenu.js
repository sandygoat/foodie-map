import React, { useState } from "react";
import * as BiIcons from "react-icons/bi";
import * as RiIcons from "react-icons/ri";
import * as Io5Icons from "react-icons/io5";

import classes from "./SubMenu.module.css";

function SubMenu(props) {
  const [subnav, setSubnav] = useState(false);

  const showSubnav = () => setSubnav(!subnav);
  function selectHandler(photoURLs) {
    props.action(photoURLs);
  }

  return (
    <>
      <div
        className={classes.SidebarLink}
        onClick={props.item.members && showSubnav}
      >
        <div className={classes.rowC}>
          <BiIcons.BiFoodMenu />
          <div className={classes.SidebarLabel}>{props.item.category}</div>
        </div>
        <div>
          {props.item.members.length !== 0 && subnav ? (
            <RiIcons.RiArrowUpSFill />
          ) : props.item.members.length !== 0 ? (
            <RiIcons.RiArrowDownSFill />
          ) : null}
        </div>
      </div>
      {subnav &&
        props.item.members.map((item) => {
          return (
            <div
              className={classes.DropdownLink}
              key={item.id}
              onClick={() => {
                selectHandler(item.photoURLs);
              }}
            >
              <Io5Icons.IoFastFood />
              <div className={classes.subSidebarLabel}>{item.title}</div>
            </div>
          );
        })}
    </>
  );
}

export default SubMenu;
