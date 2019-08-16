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
        defaultSelectedKeys={["1"]}
        style={{ lineHeight: "64px" }}
      >
        <Menu.Item key="1">
          <Link to="/">Home</Link>
        </Menu.Item>
        <Menu.Item key="2">
          <Link to="/calculation">Calculation</Link>
        </Menu.Item>
        <Menu.Item key="3">
          <Link to="/users">Users</Link>
        </Menu.Item>
      </Menu>
    </Header>
  );
}

export default NavBar;
