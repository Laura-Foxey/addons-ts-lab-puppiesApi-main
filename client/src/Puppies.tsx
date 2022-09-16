import React, { useEffect, useState } from 'react';
import { Link, Routes, Route, BrowserRouter as Router, } from 'react-router-dom';
import { ObjectId } from 'mongodb';
import './App.css';
import Puppy from './interfaces';

function Puppies() {
  const [puppies, setPuppies] = useState<Array<Puppy>>([]); // NOTE may need to declare type of passed array
  const [loading, setLoading] = useState<boolean>(true);

  let puppydata: Puppy[] = [];

  useEffect(() => {
    fetch('puppies')
      .then(data => data.json())
      .then(data => {
        puppydata = data;
        setPuppies(puppydata)
      })
      .then(() => setLoading(false))
      .catch(error => console.error(error));
  }, [])


  if (loading) 
    return ( 
      <div> We be loading here wait </div> 
    );
  
  return (
    <div className="App">
      <h1>All puppies</h1>
      <ul>
        {
          React.Children.toArray(
            puppies.map(el => {
              return <li><Link to={`/${el._id}`} > {el.name} </Link></li>
            })
          )
        }
      </ul>
    </div>
  );
}

export default Puppies;
