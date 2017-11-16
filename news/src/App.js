import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import list from '../src/list';


class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      list: list
    }
    this.removeItem=this.removeItem.bind(this);// alwasys bind inside the class constructor
  }
  removeItem(id){
    console.log('Remove Item');
  }
  render() {
  console.log(this);
    return (
      <div className="App">
        <p>{
          this.state.list.map(item=>{
            return (
              <div key={item.objectID}>
              <h1><a href={item.url}>{item.title}</a> by {item.author}</h1>
              <p>{item.num_comments} Comments| {item.points} points</p>
              <button type="button" onClick={()=>this.removeItem(item.objectID)}>Remove</button>
            </div> 
            )
          })
        }</p>
      </div>
    );
  }
}

export default App;
