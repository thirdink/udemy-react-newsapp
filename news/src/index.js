import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './components/App';
import Javascript from './components/Javascript/index';
import Python from './components/Python/index';
import {BrowserRouter as Router ,Route,Link,NavLink} from 'react-router-dom';
import {Navbar,Nav,NavItem} from 'react-bootstrap';
import registerServiceWorker from './registerServiceWorker';

const Root = () =>
<Router>
<div>
    <Navbar>
        <Link to="/">Home</Link>
        <Link to="/javascript">Javascript</Link> 
        <Link to="/python">Python</Link> 
    </Navbar>
   

    <Route exact path="/" component={ App }/>
    <Route exact path="/javascript" component={ Javascript }/>
    <Route exact path="/python" component={ Python }/>
</div>
</Router> 

const About = () => 
<div>
    <h1>This is about page.... </h1>
</div>

ReactDOM.render(<Root />, document.getElementById('root'));
registerServiceWorker();
