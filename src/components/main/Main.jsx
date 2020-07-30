import React, { useState, useEffect } from "react";
import {
  fetchDiscoverMovie,
  fetchFilterRateMovie,
  fetchSearchResults
} from "../../service";
import "react-bootstrap-carousel/dist/react-bootstrap-carousel.css";
import { Link } from "react-router-dom";
import ReactStars from "react-rating-stars-component";
import Search from '../search/Search';
import { usePromiseTracker } from 'react-promise-tracker';

export function Main() {
  const [catalog, setCatalog] = useState([]);
  const [state, setState] = useState({
    searchValue: "",
    currentRating: 0,
    ratingFilter: false
  });
  const { promiseInProgress } = usePromiseTracker();

  useEffect(() => {

    const fetchAPI = async () => {
      setCatalog(await fetchDiscoverMovie());
    };

    fetchAPI();
  }, []);


  const handleInput = async (e) => {
    let s = e.target.value;

    if (s === "") {
      setCatalog(await fetchDiscoverMovie());
    }
    setState(prevState => {
      return { ...prevState, searchValue: s }
    });
  }

  const LoadingIndicator = props => {
    return (
      <h1>Loading...</h1>
    );
  }

  const itemList = catalog.slice(0, 16).map((item, index) => {
    return (
      <div className="col-md-3" key={index}>
        <div className="card">
          <Link to={`/movie/${item.id}`}>
            <img className="img-fluid" src={item.poster} alt={item.title}></img>
          </Link>
        </div>
        <div className="mt-3">
          <p style={{ fontWeight: "bolder" }}>{item.title}</p>
          <p>Rated: {item.rating}</p>
          <ReactStars
            count={item.rating}
            size={20}
            color1={"#f4c10f"}
          ></ReactStars>
        </div>
      </div>
    );
  });

  const starFilter = {
    size: 50,
    count: 5,
    value: state.currentRating,
    onChange: newValue => {
      if (newValue === state.currentRating) {
        setState(prevState => {
          return { ...prevState, ratingFilter: false, currentRating: 0 }
        })
        fetchByTopRanking();
      }
      else {
        setState(prevState => {
          return { ...prevState, ratingFilter: true, currentRating: newValue }
        })

        var min = (newValue * 2) - 2;
        var max = newValue * 2;
        fetchByRating(min, max);
      }
    }
  };

  const fetchSearch = async (e) => {
    if ((e.key === "Enter") && (state.searchValue !== "")) {
      setState(prevState => {
        return { ...prevState, ratingFilter: false, currentRating: 0 }
      })
      setCatalog(await fetchSearchResults(state.searchValue));
    }
  };

  const fetchByRating = async (min, max) => {
    setCatalog(await fetchFilterRateMovie(min, max));
  };

  const fetchByTopRanking = async () => {
    setCatalog(await fetchDiscoverMovie());
  };

  return (
    <div className="mainContainer">
      <div className="containerF">
        <div className="starFilter" align="left"><h2>Search by rating:</h2></div>
        <div><ReactStars {...starFilter} /></div>
      </div>

      <div className="containerF">
        <div className="searchFilter"><h2>Search by keyword:</h2></div>
        <div><Search handleInput={handleInput} search={fetchSearch} /></div>
      </div>

      <div className="row mt-3">
        <div className="col">
          <p className="font-weight-bold" style={{ color: "#5a606b" }}>
            And Discover New Movies
          </p>
        </div>
      </div>
      {promiseInProgress ? (<div><LoadingIndicator /></div>)
        :
        (<div className="row mt-3">{itemList}</div>)}

      <hr className="mt-5" style={{ borderTop: "1px solid #5a606b" }}></hr>

      <div className="row mt-3 mb-5">
        <div className="col-md-8 col-sm-6" style={{ color: "#5a606b" }}>
          <h3>React Coding Challenge</h3>
          <p>
            By Gabriel Funes
          </p>

        </div>
        <div className="col-md-4 col-sm-6" style={{ color: "#5a606b" }}>
          <h3>Contact Me:</h3>
          <ul className="list-unstyled">
            <li>
              <p>
                <strong>
                  <i className="fas fa-envelope"></i> Email:
                </strong>{" "}
                gabrielffunes@hotmail.com
              </p>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}