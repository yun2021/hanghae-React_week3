import React, { useEffect } from "react";

import { Route } from "react-router-dom";
import { BrowserRouter } from "react-router-dom";
import { Grid } from "../elements";

import PostList from "../pages/PostList";


function App() {


  return (
    <React.Fragment>
      <Grid isRoot>
        <BrowserRouter>
          <Route exact path="/" component={PostList} />
        </BrowserRouter>
      </Grid>
    </React.Fragment>
  );
}

export default App;