import React from 'react'
import { useGlobalContext } from './context'

const SearchForm = () => {
  const {query, setSearch} = useGlobalContext();
  return <form className='search-form' onSubmit={(e) => {e.preventDefault()}}>
    <h2>search hacker form</h2>
    <input 
      type='text' 
      className='form-input' 
      value={query}
      onChange={(e) => {setSearch(e.target.value)}}
    ></input>
  </form>
}

export default SearchForm
