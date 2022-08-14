import React, {Fragment} from 'react';
import NavBar from './NavBar/NavBar';
import {Container} from 'semantic-ui-react';
import {Outlet} from 'react-router-dom';

const Main = () => {

    return (
        <Fragment>
            <NavBar />
            <Container style={{marginTop: '7em'}}>
                <Outlet/>
            </Container>
        </Fragment>
    );
}

export default Main;
