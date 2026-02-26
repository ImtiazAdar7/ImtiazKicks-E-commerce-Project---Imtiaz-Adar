import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import CartSidebar from "./CartSidebar";
import {
  FiShoppingCart,
  FiUser,
  FiLogOut,
  FiShield,
  FiMenu,
  FiX,
} from "react-icons/fi";
/**
 * @author Imtiaz Adar
 * @email imtiazadarofficial@gmail.com
 */
const Navbar = () => {
  const { user, logout } = useAuth();
  const { getCartCount, setIsCartOpen } = useCart();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    closeMobileMenu();
    navigate("/");
  };

  return (
    <>
      <nav className="navbar">
        <div className="navbar-container">
          <Link to="/" className="navbar-logo" onClick={closeMobileMenu}>
            👟 ImtiazKicks
          </Link>

          {/* Desktop Menu */}
          <div className="navbar-menu">
            <Link to="/" className="nav-link">
              Home
            </Link>
            <Link to="/products" className="nav-link">
              Products
            </Link>
            <Link to="/categories" className="nav-link">
              Categories
            </Link>

            {user && (
              <>
                <Link to="/profile" className="nav-link">
                  Profile
                </Link>
                {/* Only show My Orders for regular users, not admins */}
                {user.role !== "admin" && (
                  <Link to="/orders" className="nav-link">
                    My Orders
                  </Link>
                )}
                {user.role === "admin" && (
                  <Link to="/admin" className="nav-link admin-link">
                    <FiShield /> Admin
                  </Link>
                )}
              </>
            )}
          </div>

          <div className="navbar-right">
            {user ? (
              <>
                {/* Only show balance and deposit link for regular users */}
                {user.role !== "admin" && (
                  <Link to="/deposit" className="balance-badge">
                    ৳{user.balance}
                  </Link>
                )}
                {/* For admin, show just a badge with role (no deposit link) */}
                {user.role === "admin" && (
                  <span className="admin-badge">
                    👑 Admin
                  </span>
                )}
                <div className="cart-icon" onClick={() => setIsCartOpen(true)}>
                  <FiShoppingCart size={24} />
                  {getCartCount() > 0 && (
                    <span className="cart-count">{getCartCount()}</span>
                  )}
                </div>
                <div className="user-menu desktop-only">
                  <FiUser size={20} />
                  <span>{user.name.split(" ")[0]}</span>
                </div>
                <button
                  className="logout-btn desktop-only"
                  onClick={handleLogout}
                >
                  <FiLogOut />
                </button>
              </>
            ) : (
              <div className="auth-buttons desktop-only">
                <Link to="/login" className="btn btn-outline">
                  Login
                </Link>
                <Link to="/register" className="btn btn-primary">
                  Register
                </Link>
                <Link to="/admin/login" className="btn btn-admin">
                  <FiShield /> Admin
                </Link>
              </div>
            )}

            {/* Hamburger Menu Button */}
            <button className="hamburger-btn" onClick={toggleMobileMenu}>
              {isMobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={`mobile-menu ${isMobileMenuOpen ? "active" : ""}`}>
          <div className="mobile-menu-header">
            {user && (
              <div className="mobile-user-info">
                <FiUser size={20} />
                <span>{user.name}</span>
                {/* Show balance only for regular users in mobile menu */}
                {user.role !== "admin" && (
                  <span className="mobile-balance">৳{user.balance}</span>
                )}
                {user.role === "admin" && (
                  <span className="mobile-admin-badge">👑 Admin</span>
                )}
              </div>
            )}
          </div>

          <div className="mobile-menu-links">
            <Link to="/" className="mobile-nav-link" onClick={closeMobileMenu}>
              Home
            </Link>
            <Link
              to="/products"
              className="mobile-nav-link"
              onClick={closeMobileMenu}
            >
              Products
            </Link>
            <Link
              to="/categories"
              className="mobile-nav-link"
              onClick={closeMobileMenu}
            >
              Categories
            </Link>

            {user ? (
              <>
                <Link to="/profile" className="mobile-nav-link" onClick={closeMobileMenu}>
                  Profile
                </Link>
                {/* Only show My Orders for regular users */}
                {user.role !== "admin" && (
                  <Link to="/orders" className="mobile-nav-link" onClick={closeMobileMenu}>
                    My Orders
                  </Link>
                )}
                {/* Only show Deposit for regular users */}
                {user.role !== "admin" && (
                  <Link to="/deposit" className="mobile-nav-link" onClick={closeMobileMenu}>
                    Deposit
                  </Link>
                )}
                {user.role === "admin" && (
                  <Link to="/admin" className="mobile-nav-link admin-link" onClick={closeMobileMenu}>
                    <FiShield /> Admin Dashboard
                  </Link>
                )}
                <button className="mobile-logout-btn" onClick={handleLogout}>
                  <FiLogOut /> Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="mobile-nav-link"
                  onClick={closeMobileMenu}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="mobile-nav-link"
                  onClick={closeMobileMenu}
                >
                  Register
                </Link>
                <Link
                  to="/admin/login"
                  className="mobile-nav-link admin-link"
                  onClick={closeMobileMenu}
                >
                  <FiShield /> Admin Login
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>
      <CartSidebar />
    </>
  );
};

export default Navbar;