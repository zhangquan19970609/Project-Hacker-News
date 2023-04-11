// 使用 useReducer，将 fetch 得来的数据、render 在页面上的增删，
// 统统放进一个
import React, { useContext, useEffect, useReducer } from 'react'

import {
  SET_LOADING,
  SET_STORIES,
  REMOVE_STORY,
  HANDLE_PAGE,
  HANDLE_SEARCH,
} from './actions'
// 无论是 在 context，index 或者 App.js 中，或是在 reducer 中 define dispatch 时，
// 直接 invoke useReducer 和 dispatch，都有一定机会把 string 打错。
// 因此使用 variable 代替 string. 这也是设置 action.js 的意义。

import reducer from './reducer'

const API_ENDPOINT = 'https://hn.algolia.com/api/v1/search?'
// 例如：查询 react: ${API_ENDPOINT}query=react &page=2 &hitsPerPage=50
  // "hits": [50 items], 返回了 50 个
  // "nbHits": 276411,
  // "page": 2,
  // "nbPages": 20,
  // "hitsPerPage": 50,

  // 这些 urlParams 都可以作为 initialState 的一部分设置

const initialState = {
  // 输入 reducer 一开始的 default state。
  isLoading: true,
  hits:[],
  query:'react',
  page:0,
  nbPages:0,
// 无论 page/nbPages/hitsPerPage 自行设置为什么，state 都会默认为：
 // "page": 0,
 // "nbPages": 50,
 // "hitsPerPage": 20,                 
}

const AppContext = React.createContext()

const AppProvider = ({ children }) => {
  // 参考 useReducer 教程，设置一个 useReducer 在 context 中，
  // 且引用 ruducer from ./reducer
  const [state, dispatch] = useReducer(reducer, initialState); 
    // 将 loading state 放入 useReducer 的 initial State (而不是使用 useState)
    // 注意 import 中 useReducer 诸多 method 中，包含一个 SET_LOADING
  const fetchStories = async (url) => {
    dispatch({type: SET_LOADING});
    try {
      const response = await fetch(url);
      const data = await response.json();
      console.log(data);
      // 设置 fetch: 用 SET_STORIES, payload 包含两个 properties！
      dispatch({type: SET_STORIES, payload:{hits: data.hits, nbPages: data.nbPages}});
    } catch (error) {
      console.log(error);
    }
  }
  // 设定 Search 功能的初步思路：
    // 将 useEffect 的 dependency list 中加入 state.query，
    // 当 query 变化时，自动 reload 页面。

    // globalContext 输出一个 setSearch 和 ...state，
    // 并在 SearchForm.js 内, 规定 onChange => setSearch(e.target.value),
    // 且 (state.)query 作为 input 的 value.

    // 当 SearchForm invoke 了 setSearch 之后，
    // 则开始使用 dispatch.
    
  // 在 dispatch 中规定：当 invoke 这个 SET_SEARCH 时，
    // 将 state 中的 query 设置为 setSearch 输入的 searchTerm 值。
  
  // invoke 后，useEffect 根据 [state.query] 刷新.
  const setSearch = async (searchTerm) => {
    dispatch({type: HANDLE_SEARCH, payload:searchTerm})
  }

  const remove = (id) => {
    dispatch({type:REMOVE_STORY, payload:id}) // payload 不使用与 state 一样的 property名。
  }

  const handlePage = (direction) => {
    dispatch({type:HANDLE_PAGE, payload:direction})
  }

  useEffect(() => {
    fetchStories(`${API_ENDPOINT}query=${state.query}&page=${state.page}`);
  },[state.query, state.page, state.nbPages])
  // 在 useGlobalContext 的 value 中注入一个 useReducer 的 ...state.
  // 下一步：在 stories 中注入 isLoading state.


  // 将 useReducer 的 state pass 进 globalContext，这一步非常重要。
  return <AppContext.Provider value={{...state, remove, setSearch, handlePage}}>{children}</AppContext.Provider>
}
// make sure use
export const useGlobalContext = () => {
  return useContext(AppContext)
}

export { AppContext, AppProvider }
