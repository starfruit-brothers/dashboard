import React from "react";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import Calculation from "./components/Calculation";
import NavBar from "./components/NavBar";
import UserInfo from "./components/UserInfo";
import { Layout, Menu, Breadcrumb } from "antd";
import "./App.css";
const { Header, Content, Footer } = Layout;

function PageLayout(props) {
  return (
    <Layout className="layout" style={{ minHeight: "100vh" }}>
      <NavBar />
      <Content style={{ padding: "0 50px" }}>
        <Breadcrumb style={{ margin: "16px 0" }}>
          <Breadcrumb.Item>Home</Breadcrumb.Item>
          <Breadcrumb.Item>List</Breadcrumb.Item>
          <Breadcrumb.Item>App</Breadcrumb.Item>
        </Breadcrumb>
        <div style={{ background: "#fff", padding: 24 }}>{props.children}</div>
      </Content>
      <Footer style={{ textAlign: "center" }}>
        Ant Design ©2018 Created by Ant UED
      </Footer>
    </Layout>
  );
}

function Home() {
  return (
    <PageLayout>
      <h1>Home</h1>
    </PageLayout>
  );
}

function Users() {
  return (
    <PageLayout>
      <UserInfo />
    </PageLayout>
  );
}

function CalculationPage() {
  return (
    <PageLayout>
      <Calculation />
    </PageLayout>
  );
}

function AppRouter() {
  return (
    <Router>
      <div>
        <Route path="/" exact component={Home} />
        <Route path="/calculation/" component={CalculationPage} />
        <Route path="/users/" component={Users} />
      </div>
    </Router>
  );
}

export default AppRouter;
