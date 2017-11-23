import React, { Component } from 'react';
import {Grid,Row} from 'react-bootstrap';
import Table from '../Table/index';
import {Button, Loading } from '../Button/index';
import Search from '../Search/index';
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
} from '../../constants/index';


// const url = PATH_BASE + PATH_SEARCH + '?' + PARAM_SEARCH + DEFAULT_QUERY;
const url = `${PATH_BASE}${PATH_SEARCH}${PARAM_SEARCH}?${DEFAULT_QUERY}&${PARAM_PAGE}&${PARAM_HPP}${DEFAULT_HPP}`;
console.log(url);

//higher order components
const withLoading = (Component)=>({ isLoading, ...rest})=>
isLoading? <Loading/> : <Component {...rest}/>





const updatedTopStories = (hits, page) => prevState => {
  const {searchKey,results} = prevState;
  const oldHits = results && results[searchKey]?results[searchKey].hits:[];
  const updatedHits = [...oldHits, ...hits];
  return { 
    results: { ...results, [searchKey]: {hits: updatedHits, page} },
    isloading: false
        }
}

class Python extends Component {
  constructor(props){
    super(props);
    this.state = {
      results:null,
      searchKey:'',
      searchTerm: 'python',
      isloading: false,
     

    }
    this.removeItem=this.removeItem.bind(this);// alwasys bind inside the class constructor
    this.searchValue=this.searchValue.bind(this);
    this.fetchTopStories = this.fetchTopStories.bind(this);
    this.setTopStories = this.setTopStories.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.checkTopStoriesSearchTerm=this.checkTopStoriesSearchTerm.bind(this);
    
  }

  // check top stories search term
  checkTopStoriesSearchTerm(searchTerm){
    return !this.state.results[searchTerm];
  }
  // set top stories
  setTopStories(result){
    // get the hits nad page from the result
    const {hits,page} = result;
    this.setState(updatedTopStories(hits, page));
    // // meaning page is not 0, button has been clicked, page might be 1 or 2
    // old hits are already available in the state

    

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

    console.log(this);
    return (
    
      <div>


      <Grid>
        <Row>
          <Table 
            list={list}
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






const ButtonWithLoading = withLoading(Button);

export default Python;
