import React, { Component } from 'react';
import {Grid,Row,FormGroup} from 'react-bootstrap';
import list from '../src/list';
// default parameters to fetch data from the API

const DEFAULT_QUERY = 'react';
const PATH_BASE = 'http://hn.algolia.com/api/v1';
const PATH_SEARCH = '/search';
const DEFAULT_PAGE=0;
const DEFAULT_HPP=100;


const PARAM_SEARCH = 'query=';
const PARAM_PAGE='page=';
const PARAM_HPP='hitsPerPage=';

// const url = PATH_BASE + PATH_SEARCH + '?' + PARAM_SEARCH + DEFAULT_QUERY;
const url = `${PATH_BASE}${PATH_SEARCH}${PARAM_SEARCH}?${DEFAULT_QUERY}&${PARAM_PAGE}&${PARAM_HPP}${DEFAULT_HPP}`;
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
      results:null,
      searchKey:'',
      searchTerm: DEFAULT_QUERY
    }
    this.removeItem=this.removeItem.bind(this);// alwasys bind inside the class constructor
    this.searchValue=this.searchValue.bind(this);
    this.fetchTopStories = this.fetchTopStories.bind(this);
    this.setTopStories = this.setTopStories.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }
  // set top stories
  setTopStories(result){
    // get the hits nad page from the result
    const {hits,page} = result;
    // // meaning page is not 0, button has been clicked, page might be 1 or 2
    // old hits are already available in the state
    const {searchKey,results} = this.state;
    const oldHits = results && results[searchKey]?results[searchKey].hits:[];
    const updatedHits = [...oldHits, ...hits];
    
    this.setState({ results: { ...results, [searchKey]: {hits: updatedHits, page} }});
  }
  // fetch top stories
  fetchTopStories(searchTerm, page){
    fetch(`${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}&${PARAM_PAGE}${page}&${PARAM_HPP}${DEFAULT_HPP}`)
    .then(response => response.json()).then(result => this.setTopStories(result))
    .catch(e => e);
  }
  // component did mount 
  componentDidMount(){
    const {searchTerm} = this.state;
    this.setState({ searchKey: searchTerm});
    this.fetchTopStories(this.state.searchTerm,DEFAULT_PAGE);
  }
  // on th search submit function
  onSubmit(event){
    const {searchTerm} = this.state;
    this.setState({ searchKey: searchTerm});
    this.fetchTopStories(searchTerm, DEFAULT_PAGE);
    event.preventDefault();
  }
  removeItem(id){
    const {result } = this.state;
    //console.log('Remove Item');
    // using javascript filter method 
    // we can filter out the clicked item and render the updated list
    function isNotId(item){
      return item.objectID!== id;
    }
    // create a new updated list
    const updatedList = result.hits.filter(isNotId);
    // assign the new updated list to the list using setState method
    // this.setState({
    //   result: Object.assign({},this.state.result,{hits: updatedList})
      
    // });
    this.setState({ result:{...result, hits: updatedList}});
  }
  searchValue(event){
    // console.log(event);
    this.setState({ searchTerm : event.target.value});

  }
  render() {
    const {results, searchTerm,searchKey} = this.state;
    const page = (results && results[searchKey] && results[searchKey].page) ||0;
    const list = (results && results[searchKey]&&results[searchKey].hits)||[];
    // if(!result){
    //   return null;
    // }
    console.log(this);
    return (
    
      <div>
      <Grid fluid>
        <Row>
          <div className="jumbotron text-center">
          <Search 
          onChange={this.searchValue} 
            value={ searchTerm }
            onSubmit= {this.onSubmit}
            >News App</Search>
          </div>
        </Row>
      </Grid>

      
      <Table 
      list={list}
      searchTerm={searchTerm}
      removeItem={this.removeItem}
      /> 
      
      <div className="text-center alert">
        <Button className="btn btn-success" 
        onClick={()=> this.fetchTopStories(searchTerm,page + 1) }>
          Load More
        </Button>
      </div>

      </div>
    );
  }
}

// class Search extends Component{
//   render(){
//     const { onChange, value, children}= this.props;
    
//   }
//}
const Search = ({ onChange, value, children, onSubmit})=>{
  return(
    <form onSubmit={onSubmit}>
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
        <Button className="btn btn-primary searchBtn" type="submit">Search</Button>
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
          // list.filter(isSearched(searchTerm)).map(item=>{
            list.map(item=>{
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
const Button = ({ onClick, children, className='' }) => 
<button
  className={ className }  
  onClick={ onClick } >
  { children }
</button>

export default App;
