import React, { useEffect, useState } from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import queryString from 'query-string';
import beer from '../assets/beerMug.png';
import axios from 'axios';
import Pagination from './Pagination';

import '../App.css';
type Breweries = {
  id: number;
  name: string;
  brewery_type: string;
  state: string;
  city: string;
  country: string;
  street: string;
} 

function Brewerlist() {
  const [breweries, setBreweries] = useState<Breweries[]>([]);
  const [sortType, setSortType] = useState<string>("");
  const [sortValue, setSortValue] = useState<string>("");
  const [sortValueEmpty, setSortValueEmpty] = useState<boolean>(false);

  const location = useLocation();
  const history = useHistory();
  const path = window.location.pathname;
  const url = queryString.parse(location.search);
  const pageNo = Number(url.page) || 1;

  const [currentPage, setCurrentPage] = useState(pageNo);
  const [ordersPerPage] = useState(10); 
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = breweries?.slice(indexOfFirstOrder, indexOfLastOrder);
  const paginate = (pageNumber: any) => setCurrentPage(pageNumber);

//fetch breweries
  const fetchData = async () => {
    try {
      const res = await axios.get("https://api.openbrewerydb.org/breweries?per_page=50");
      setBreweries(res?.data);
      } catch (error) {
      console.log(error);
    }
  }

  const filterValues = (array: any) => array.filter((v: any, i:any) => breweries.indexOf(v) === i);

  const fetchDataAnother50 = async () => {
    
    try {
      const res = await axios.get("https://api.openbrewerydb.org/breweries?by_state=ohio&per_page=50");

      setBreweries(prevState => [
        ...prevState, ...res.data
      ]);

      } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    fetchData();
    fetchDataAnother50();
    history.push(`${path}?page=${currentPage}`);
  }, [history, path]);

 //fetcher function
 const fetcher = async (api: string, type: string, val: string) => {
  const res = await axios.get(`${api}by_${type}=${val}`);
  setBreweries(res.data)
 }

 //fetch by term
 const fetchByType = async (type: string, value: string) => {
  if(sortValue === "") {
   setSortValueEmpty(true)
  }

  if(value && type === "state"){
    try {
        fetcher("https://api.openbrewerydb.org/breweries?per_page=50&", type, value)
      } catch (error) {
        console.log(error);
    }
  } 
  if(type === "brewery_type") {
    try { 
        fetcher("https://api.openbrewerydb.org/breweries?per_page=50&", "type", value)
      } catch (error) {
        console.log(error);
    }
  }
 }

 //handlers
 const handleSort = (event: React.ChangeEvent<HTMLSelectElement>) => {
  setSortType(event.target.value)
 }

 const handleSortValue = (event: React.ChangeEvent<HTMLInputElement>) => {
  setSortValue(event.target.value)
 }

 const hideError = () => {
  setSortValueEmpty(false)
 }

 const refreshResults = () => {
   fetchData();
   setSortValueEmpty(false);
 }

  const mapBreweries = () => {
      return (
        <React.Fragment>
          {breweries.map((item: Breweries) => (
              <div className="item" key={item.id}>
                <ul>
                  <li><span className="title">Name:</span>{item.name || "N/A"}</li>
                  <li><span className="title">State:</span>{item.state || "N/A"}</li>
                  <li><span className="title">Brewery type:</span>{item.brewery_type || "N/A"}</li>
                  <li><span className="title">Street:</span>{item.street || "N/A"}</li>
                  <li><span className="title">Country:</span>{item.country || "N/A"}</li>
                  <li><span className="title">City:</span>{item.city || "N/A"}</li>
                </ul>
              </div>
            ))}
        </React.Fragment>
      )
  }

  return (
    <React.Fragment>
      <div className="header">
          <img src={beer} className="image" alt=""/>
            <h1>Sherman Brewery</h1>
          <img src={beer} className="image" alt=""/>
        </div>
        <div className="container">
        <div className="selectContainer">
          <label htmlFor="type">Sort by: </label>
          <select name="type" defaultValue="" data-testid="select" onChange={handleSort}> 
            <option value="" selected defaultValue="Sort By:" disabled hidden>Sort By</option>
            <option data-testid="type-option" value="state">State</option>
            <option data-testid="type-option" value="brewery_type">Brewery Type</option>
          </select>
          <label htmlFor="sortBy">Search by {sortType === "state" ? "State: " : "Brewery Type: "} </label>
          <input data-testid="search" disabled={sortType ? false : true} name="sortby" type="text" onFocus={hideError} onChange={handleSortValue} />
          <button disabled={sortType ? false : true} type="submit" onClick={() => fetchByType(sortType, sortValue)}>Sort</button>
          <button type="submit" onClick={refreshResults}>Refresh results</button>
          {sortValueEmpty ? <span className="error"> Please add a value</span> : null}
        </div>
            {mapBreweries()}
            {/* <Pagination
              ordersPerPage={ordersPerPage}
              ordersAmount={breweries?.length}
              paginate={paginate}
            /> */}
        </div>
      </React.Fragment>
    );
}

export default Brewerlist;
