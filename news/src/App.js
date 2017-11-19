import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import list from '../src/list';

function isSearched(searchTerm){
  return function(item){
    return !searchTerm || item.title.toLowerCase().includes(searchTerm.toLowerCase());
  }
}

class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      list
    }
    this.removeItem=this.removeItem.bind(this);// alwasys bind inside the class constructor
    this.searchValue=this.searchValue.bind(this);
  }
  removeItem(id){
    console.log('Remove Item');
    // using javascript filter method 
    // we can filter out the clicked item and render the updated list
    function isNotId(item){
      return item.objectID!== id;
    }
    // create a new updated list
    const updatedList = this.state.list.filter(isNotId);
    // assign the new updated list to the list using setState method
    this.setState({
      list: updatedList,
      searchTerm:''
    });
  }
  searchValue(event){
    // console.log(event);
    this.setState({ searchTerm : event.target.value});

  }
  render() {
    const {list, searchTerm} = this.state;
  console.log(this);
    return (
      <div className="App">
     <Search 
     onChange={this.searchValue} 
      value={ searchTerm }
      >Search here</Search>

      <Table 
      list={list}
      searchTerm={searchTerm}
      removeItem={this.removeItem}
      />

      </div>
    );
  }
}

// class Search extends Component{
//   render(){
//     const { onChange, value, children}= this.props;
    
//   }
//}
const Search = ({ onChange, value, children})=>{
  return(
    <form>
      {children}
    <input 
    type="text" 
    onChange={onChange} 
    value={ value }/>
  </form>
  )
}


const Table =({list,searchTerm,removeItem})=>{
  return (
    <div>
        {
          list.filter(isSearched(searchTerm)).map(item=>{
            return (
              <div key={item.objectID}>
              <h1><a href={item.url}>{item.title}</a> by {item.author}</h1>
              <p>{item.num_comments} Comments| {item.points} points</p>
              <Button type="button"
              onClick={()=>removeItem(item.objectID)}>
              Remove Me 
              </Button>
            </div> 
            )
          })
        }
    </div>
    )

}

// class Button extends Component{
//   render(){
//     const {onClick,children}=this.props;
//     return(
//       <button onClick={onClick}>
//       {children}
//       </button>
//     )
//   }
// }
function Button({onClick,children}){
  return(
    <button onClick={onClick}>
    {children}
    </button>
  )
}

export default App;
