import React from "react";
import { Link } from "react-router-dom";
import { Layout, Menu, Breadcrumb } from "antd";

const { Header, Content, Footer } = Layout;

function NavBar() {
  return (
    <Header>
      <div className="logo" />
      <Menu
        theme="dark"
        mode="horizontal"
        defaultSelectedKeys={[window.location.pathname]}
        style={{ lineHeight: "64px" }}
      >
        <Menu.Item key="/">
          <Link to="/">Home</Link>
        </Menu.Item>
        <Menu.Item key="/calculation">
          <Link to="/calculation">Calculation</Link>
        </Menu.Item>
        <Menu.Item key="/users">
          <Link to="/users">Users</Link>
        </Menu.Item>
      </Menu>
    </Header>
  );
}

export default NavBar;
