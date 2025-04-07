
import React from "react";
import { NavLink } from "react-router-dom";
import { NavigationItemsProps } from "./types";

const NavigationMenuContent: React.FC<NavigationItemsProps> = ({ items, isActive }) => {
  return (
    <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
      {items.map((item) => (
        <NavLink
          key={item.title}
          to={item.href}
          className={({ isActive: active }) => 
            `block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none !transition-none !duration-0 hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground ${
              active ? 'bg-accent text-accent-foreground' : ''
            }`
          }
        >
          <div className="flex items-center text-sm font-medium leading-none">
            <div className="mr-2 text-akhanya">{item.icon}</div>
            <div>{item.title}</div>
          </div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {item.description}
          </p>
        </NavLink>
      ))}
    </ul>
  );
};

export default NavigationMenuContent;
