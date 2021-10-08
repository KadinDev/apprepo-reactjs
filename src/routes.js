import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

import { Main } from './pages/Main';
import { Repositorio } from './pages/Repositorio';

export function Routes(){
    return (
        <BrowserRouter>
            <Switch
            // /:repositorio ali, quer dizer que vai esperar um params, que é o /:repositorio
            >
                <Route exact path='/' component={Main} />
                <Route exact path='/repositorio/:repositorio' component={Repositorio} />
            </Switch>
        </BrowserRouter>
    )
}