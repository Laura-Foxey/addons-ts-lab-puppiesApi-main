import React, { useEffect, useState } from 'react';
import { Link, Routes, Route, BrowserRouter as Router, } from 'react-router-dom';
import { ObjectId } from 'mongodb';
import './App.css';
import Puppies from './Puppies';
import PuppyComponent from './PuppyComponent';
import Puppy from './interfaces';

function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Puppies />} />
        <Route path="/:id" element={<PuppyComponent />} />
      </Routes>
    </Router>
  );
}

export default App;

