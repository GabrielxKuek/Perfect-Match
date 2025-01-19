import PropTypes from "prop-types";
import { NavLink } from "react-router-dom";
import { UserPlus, LogIn, User, Heart, Star, MessageCircle } from "lucide-react";

const NavItem = ({ label, to, icon: Icon, activeClassName = "text-orange-500", inactiveClassName = "text-black hover:text-orange-500" }) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex flex-col items-center justify-center p-2 rounded-lg transition-colors duration-200 ${
          isActive ? activeClassName : inactiveClassName
        }`
      }
    >
      <Icon className="w-5 h-5" />
      <span className="text-xs font-medium mt-1">{label}</span>
    </NavLink>
  );
};

NavItem.propTypes = {
  label: PropTypes.string.isRequired,
  to: PropTypes.string.isRequired,
  icon: PropTypes.elementType.isRequired,
  activeClassName: PropTypes.string,
  inactiveClassName: PropTypes.string,
};

const BottomNavbar = () => {
  const navItems = [
    { label: "Signup", to: "/signup", icon: UserPlus },
    { label: "Login", to: "/login", icon: LogIn },
    { label: "Profile", to: "/profile", icon: User },
    { label: "Swipe", to: "/swipe", icon: Heart },
    { label: "Standouts", to: "/standouts", icon: Star },
    { label: "Chat", to: "/chat", icon: MessageCircle },
  ];

  return (
    <>
      {/* Spacer div to prevent content from being hidden behind the navbar */}
      <div className="h-20" />
      
      {/* Fixed navbar */}
      <nav className="fixed bottom-0 left-0 right-0 bg-[#FFFFFC] border-t border-gray-200 shadow-lg pb-safe">
        <div className="max-w-screen-xl mx-auto px-4 py-2">
          <div className="grid grid-cols-6 gap-1">
            {navItems.map((item) => (
              <NavItem
                key={item.to}
                label={item.label}
                to={item.to}
                icon={item.icon}
                activeClassName="text-[#FF7F11] bg-[#BEB7A4]/10"
                inactiveClassName="text-black hover:text-[#FF7F11] hover:bg-[#BEB7A4]/5"
              />
            ))}
          </div>
        </div>
      </nav>
    </>
  );
};

export default BottomNavbar;