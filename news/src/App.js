import React, { Component } from 'react';
import {Grid,Row,FormGroup} from 'react-bootstrap';
import list from '../src/list';
import PropTypes from 'prop-types';
import {sortBy} from 'lodash';
// import parameters from constants folder
import {
  DEFAULT_QUERY, 
  PATH_BASE, 
  PATH_SEARCH, 
  DEFAULT_PAGE ,
  DEFAULT_HPP, 
  PARAM_SEARCH, 
  PARAM_PAGE, 
  PARAM_HPP
} from '../src/constants/index';


const SORTS = {
  NONE : list=>list,
  TITLE: list=>sortBy(list, 'title'),
  AUTHOR: list=>sortBy(list, 'author'),
  COMMENTS: list=>sortBy(list, 'num_comments').reverse(),
  POINTS: list=>sortBy(list, 'points').reverse(),


}

// const url = PATH_BASE + PATH_SEARCH + '?' + PARAM_SEARCH + DEFAULT_QUERY;
const url = `${PATH_BASE}${PATH_SEARCH}${PARAM_SEARCH}?${DEFAULT_QUERY}&${PARAM_PAGE}&${PARAM_HPP}${DEFAULT_HPP}`;
console.log(url);

//higher order components
const withLoading = (Component)=>({ isLoading, ...rest})=>
isLoading? <Loading/> : <Component {...rest}/>




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
      searchTerm: DEFAULT_QUERY,
      isloading: false,
      sortKey: 'NONE',
      isSortReverse: false

    }
    this.removeItem=this.removeItem.bind(this);// alwasys bind inside the class constructor
    this.searchValue=this.searchValue.bind(this);
    this.fetchTopStories = this.fetchTopStories.bind(this);
    this.setTopStories = this.setTopStories.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.checkTopStoriesSearchTerm=this.checkTopStoriesSearchTerm.bind(this);
    this.onSort=this.onSort.bind(this)
  }
  // sorting fucntion
  onSort(sortKey){
    const isSortReverse = this.state.sortKey === sortKey && !this.state.isSortReverse;
    this.setState({sortKey, isSortReverse});
  }
  // check top stories search term
  checkTopStoriesSearchTerm(searchTerm){
    return !this.state.results[searchTerm];
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
    
    this.setState({ results: { ...results, [searchKey]: {hits: updatedHits, page} },
      isloading: false
    });
  }
  // fetch top stories
  fetchTopStories(searchTerm, page){
    this.setState({isLoading:true});
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
    if(this.checkTopStoriesSearchTerm(searchTerm)){
      this.fetchTopStories(searchTerm, DEFAULT_PAGE);
    }

   
    event.preventDefault();
  }
  removeItem(id){
    const {results, searchKey } = this.state;
    const {hits,page} = results[searchKey];
    //console.log('Remove Item');
    // using javascript filter method 
    // we can filter out the clicked item and render the updated list
    function isNotId(item){
      return item.objectID!== id;
    }
    // create a new updated list
    const updatedList = hits.filter(isNotId);
    // assign the new updated list to the list using setState method
    // this.setState({
    //   result: Object.assign({},this.state.result,{hits: updatedList})
      
    // });
    this.setState({ results:{...results,[searchKey] : {hits: updatedList}}});
  }
  searchValue(event){
    // console.log(event);
    this.setState({ searchTerm : event.target.value});

  }
  render() {
    const { results, searchTerm,searchKey,isLoading,sortKey, isSortReverse } = this.state;
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

      <Grid>
        <Row>
          <Table 
            list={list}
            sortKey={sortKey}
            isSortReverse={isSortReverse}
            onSort={this.onSort}
            searchTerm={searchTerm}
            removeItem={this.removeItem}
            />     
            <div className="text-center alert">
              
             
              <ButtonWithLoading isLoading={isLoading}
              className="btn btn-success" 
              onClick={()=> this.fetchTopStories(searchTerm,page + 1) }>
              Load More
              </ButtonWithLoading> 
            
            </div>
        </Row>
      </Grid>

      </div>
    );
  }
}

// class Search extends Component{
//   render(){
//     const { onChange, value, children}= this.props;
    
//   }
//}
class Search extends Component{
  componentDidMount(){
    this.input.focus();
  }
  render(){
    const {onChange, value, children, onSubmit}=this.props;
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
            value={ value }
            ref={(node)=>{this.input = node}}
            />
            <span className="input-group-btn">
            <Button className="btn btn-primary searchBtn" type="submit">Search</Button>
            </span>

          </div>
          

          </FormGroup>
        
      </form>
      )
    }
}


const Table =({list,searchTerm,removeItem,sortKey,onSort, isSortReverse})=>{
const sortedList = SORTS[sortKey](list);
const reverseSortedList = isSortReverse ? sortedList.reverse() : sortedList;

  return (
    <div className="col-ms-10 col-sm-offset-1">
        <div className="text-center">
        <hr/>
        <Sort className="btn btn-xs btn-default sortBtn" 
          sortKey ={'NONE'}
                onSort={onSort} 
                activeSortKey = { sortKey }
                >Default</Sort>
          <Sort className="btn btn-xs btn-default sortBtn" 
          sortKey ={'TITLE'}
                onSort={onSort} 
                activeSortKey = { sortKey }
                >Title</Sort>
          <Sort className="btn btn-xs btn-default sortBtn" 
          sortKey ={'AUTHOR'}
                onSort={onSort} 
                activeSortKey = { sortKey }
                >Author</Sort>
          <Sort className="btn btn-xs btn-default sortBtn" 
          sortKey ={'COMMENTS'}
                onSort={onSort} 
                activeSortKey = { sortKey }
                >Comments</Sort>
          <Sort className="btn btn-xs btn-default sortBtn" 
          sortKey ={'POINTS'}
                onSort={onSort} 
                activeSortKey = { sortKey }
                >Points</Sort>
                <hr/>
        </div>
        { 

          // list.filter(isSearched(searchTerm)).map(item=>{
            reverseSortedList.map(item=>{
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
Table.propTypes = {
  list: PropTypes.arrayOf(
    PropTypes.shape({
      objectID: PropTypes.string.isRequired,
      author: PropTypes.string,
      url: PropTypes.string,
      num_comments: PropTypes.number,
      points: PropTypes.number,
    })
  ).isRequired,
  removeItem: PropTypes.func.isRequired,
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
Button.PropTypes = {
  onClick: PropTypes.func.isRequired,
  className: PropTypes.string,
  children: PropTypes
}
Button.defaultProps ={
  className: '',
}
const Loading = () => 
  <div>
   <h2> Loading... </h2>
  </div>


const ButtonWithLoading = withLoading(Button);

const Sort = ({sortKey,onSort, children, className, activeSortKey}) =>
{
  const sortClass = ['btn btn-default'];

  if(sortKey === activeSortKey){
    sortClass.push('btn btn-primary');
  }
return (
          <Button className={ sortClass.join(' ') } 
                  onClick={ () => onSort(sortKey) }
                  >
                  {children}
          </Button>
        )

}

export default App;
