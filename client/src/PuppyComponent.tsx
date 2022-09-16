import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from "react-router-dom";
import axios, { AxiosResponse } from "axios";
import Puppy from './interfaces';

interface UpdateProps {
  puppy: Puppy,
  setPuppy: React.Dispatch<React.SetStateAction<Puppy>>,
  setDisplayForm: React.Dispatch<React.SetStateAction<boolean>>,
} 

const UpdateForm = ({ puppy, setPuppy, setDisplayForm }: UpdateProps) => {
  const { id } = useParams();
  const [input, setInput] = useState({
    name: puppy.name,
    breed: puppy.breed,
    birthDate: puppy.birthDate,
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setInput({
      ...input,
      [e.target.name]: e.target.value
    });
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    fetch(`puppies/${id}`, { // NOTE error here "unexpected end of json"
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(input)
    })
    .then(() => {
      setPuppy({
          ...puppy,
          ...input,
        });
    })
    .then(() => setDisplayForm(false))
    .catch(error => console.error(error));
  }

  return (
    <form
      action=""
      onSubmit={e => handleSubmit(e)}
      style={{
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <input
        type="text"
        value={input.name}
        name="name"
        onChange={handleChange}
        placeholder={puppy.name}
      />
      <input
        type="text"
        value={input.breed}
        name="breed"
        onChange={handleChange}
        placeholder={puppy.breed}
      />
      <input
        type="text"
        value={input.birthDate}
        name="birthDate"
        onChange={handleChange}
        placeholder={puppy.birthDate}
      />
      <input type='submit' />
    </form>
  )
}

const PuppyComponent = ( ) => {
  const { id } = useParams();
  const [loading, setLoading] = useState<boolean>(true);
  const [displayForm, setDisplayForm] = useState<boolean>(true);
  const [puppy, setPuppy] = useState<Puppy>({} as Puppy);
  const navigate = useNavigate();
  
  useEffect(() => {
    fetch(`puppies/${id}`)
      .then(data => data.json())
      .then(data => setPuppy(data))
      .then(() => setLoading(false))
      .catch(error => console.error(error));
  }, [])

  //-----------Opted using AXIOS for delete------
  // const handleDelete = () => {
  //   fetch(`/api/puppies/${id}`, {
  //     method: 'DELETE',
  //     headers: {
  //       'Content-Type': 'application/json'
  //     },
  //   })
  //     .then(res => console.log(res))
  //     .catch(error => console.error(error));

  //   navigate("/");
  // }

  // AXIOS DELETE
  const handleDelete = async () => {
    axios.delete(`puppies/${id}`)
    .then(response => console.log(response))
    .then(() => navigate("/"))
    .catch(error => console.error(error));
  }

  if (loading) return ( <div> We be loading here wait </div>);
  
  return (
      <div>
        <h1>{puppy.name}</h1>
        <p>{puppy.breed}</p>
        <p>{puppy.birthDate}</p>
        <button onClick={() => setDisplayForm(true)}>Update</button>
        {displayForm && <UpdateForm puppy={puppy} setPuppy={setPuppy} setDisplayForm={setDisplayForm} />}
        <button onClick={handleDelete}>DELETE</button>
        <button onClick={() => navigate(-1)}>Take me back</button>
      </div>
  );
}

export default PuppyComponent;
