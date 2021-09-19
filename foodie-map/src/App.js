import { Route, Switch } from "react-router-dom";

import Map from "./pages/Map";
import Layout from "./components/layout/Layout";
import MyFavorite from "./pages/MyFavorite";

function App() {
  return (
    <Layout>
      <Switch>
        <Route path="/" exact>
          <Map />
        </Route>
        <Route path="/favorites" exact>
          <MyFavorite />
        </Route>
      </Switch>
    </Layout>
  );
}

export default App;
