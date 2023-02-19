import React from 'react';
import { BrowserRouter, Route, Routes} from 'react-router-dom';
import { Home } from '../pages/home/home';
import { PokeInfo } from '../pages/pokeInfo/pokeInfo.jsx'

export function Rotas() {
    return(
        <BrowserRouter>
            <Routes>
                <Route element = { <Home/> } path="/" />
                <Route element = { <PokeInfo/> } path="/pokemon" />
            </Routes>
        </BrowserRouter>
    )
 }