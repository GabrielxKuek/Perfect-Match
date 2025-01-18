import PropTypes from "prop-types";
import { NavLink } from "react-router-dom";

const NavItem = ({ label, to, activeClassName = "text-orange-500", inactiveClassName = "text-black hover:text-orange-500" }) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex flex-col items-center cursor-pointer ${
          isActive ? activeClassName : inactiveClassName
        }`
      }
    >
      <span className="text-sm font-medium">{label}</span>
    </NavLink>
  );
};

NavItem.propTypes = {
  label: PropTypes.string.isRequired,
  to: PropTypes.string.isRequired,
  activeClassName: PropTypes.string,
  inactiveClassName: PropTypes.string,
};

const BottomNavbar = () => {
  const navItems = [
    { label: "Home", to: "/" },
    { label: "Signup", to: "/signup" },
    { label: "Login", to: "/login" },
    { label: "Profile", to: "/profile" },
    { label: "Swipe", to: "/swipe" },
    { label: "Chat", to: "/chat" },
    { label: "Not Found", to: "/some-nonexistent-route" }, // Example for testing 404
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-neutral-200 p-4">
      <div className="max-w-screen-xl mx-auto flex justify-around items-center">
        {navItems.map((item) => (
          <NavItem key={item.to} label={item.label} to={item.to} />
        ))}
      </div>
    </nav>
  );
};

export default BottomNavbar;
