import React, { Component } from 'react';
import {Grid,Row,FormGroup} from 'react-bootstrap';
import list from '../src/list';
// default parameters to fetch data from the API

const DEFAULT_QUERY = 'react';
const PATH_BASE = 'http://hn.algolia.com/api/v1';
const PATH_SEARCH = '/search';
const PARAM_SEARCH = 'query=';

// const url = PATH_BASE + PATH_SEARCH + '?' + PARAM_SEARCH + DEFAULT_QUERY;
const url = `${PATH_BASE}${PATH_SEARCH}${PARAM_SEARCH}?${DEFAULT_QUERY}`;
console.log(url);



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
      <div>
      <Grid fluid>
        <Row>
          <div className="jumbotron text-center">
          <Search 
          onChange={this.searchValue} 
            value={ searchTerm }
            >News App</Search>
          </div>
        </Row>
      </Grid>

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
      <FormGroup>
      <h1 style={{fontweight:'bold'}}>  {children}  </h1> 
      <hr style={{border:'1px solid black',width:'100px'}}/>
      <div className="input-group">
      <input 
        className="form-control width100 searchForm"
        type="text" 
        onChange={onChange} 
        value={ value }/>
        <span className="input-group-btn">
        <button className="btn btn-primary searchBtn" type="submit">Search</button>
        </span>

      </div>
       

      </FormGroup>
     
  </form>
  )
}


const Table =({list,searchTerm,removeItem})=>{
  return (
    <div className="col-ms-10 col-sm-offset-1">
        {
          list.filter(isSearched(searchTerm)).map(item=>{
            return (
              <div key={item.objectID}>
              <h1><a href={item.url}>{item.title}</a> by {item.author}</h1>
              <p>{item.num_comments} Comments| {item.points} points
              <Button className="btn btn-danger btn-xs" type="button "
              onClick={()=>removeItem(item.objectID)}>
              Remove Me 
              </Button>
              </p>
              <hr/>
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
function Button({onClick,children,className}){
  return(
    <button 
    className={ className }
    onClick={onClick}>
    {children}
    </button>
  )
}

export default App;
