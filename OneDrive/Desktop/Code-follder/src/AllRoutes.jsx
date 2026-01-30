import React from "react";

import { Routes, Route } from 'react-router-dom'

import Home from "./components/pages/Home/Home";
import Auth from "./components/pages/Auth/Auth";
const AllRoutes = () => {

    return (
        <Routes>
            <Route exact path='/Home' Component={Home} />
            <Route exact path='/Auth' Component={Auth} />
        </Routes>
    )
}

export default AllRoutes