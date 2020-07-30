import React from "react";
import { Switch, Route } from "react-router-dom";
import { Main } from "./components/main/Main";
import { MovieDetail } from "./components/moviedetail/MovieDetail";

export function App() {
  return (
    <main>
      <Switch>
        <Route path="/" component={Main} exact />
        <Route path="/movie/:id" component={MovieDetail} />
      </Switch>
    </main>
  );
}

export default App;
