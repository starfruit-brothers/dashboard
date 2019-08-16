import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Calculation from "./components/Calculation";
import NavBar from "./components/NavBar";

function Index() {
  return (
    <h2>
      <NavBar />
    </h2>
  );
}

function Users() {
  return <h2>Users</h2>;
}

function AppRouter() {
  return (
    <Router>
      <div>
        <Route path="/" exact component={Index} />
        <Route path="/calculation/" component={Calculation} />
        <Route path="/users/" component={Users} />
      </div>
    </Router>
  );
}

export default AppRouter;
