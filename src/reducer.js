import {
  SET_LOADING,
  SET_STORIES,
  REMOVE_STORY,
  HANDLE_PAGE,
  HANDLE_SEARCH,
} from './actions'
// 

const reducer = (state, action) => {
  switch (action.type) {
    case SET_LOADING:
    // 这样一来，尽管 isLoading deafult 为 true，
    // 但经过 Reducer 的 dispatch 处理，仍然为 true, 而非 undefined.
      return {...state, isLoading: true} 
      break;
    // 设置 fetchStories！
    case SET_STORIES:
      // 同时也要把 isLoading 改为 false！
      return {...state, isLoading: false, hits: action.payload.hits, nbPages: action.payload.nbPages}
      break;
    case REMOVE_STORY:
      return {...state, hits: state.hits.filter((item) => item.objectID !== action.payload)}
      break;
    case HANDLE_SEARCH:
      return {...state, isLoading: false, page: 0, query: action.payload} // 另加一点：每次 Search 后，仍需要设置 page = 0 
      break;
    case HANDLE_PAGE:
      // 对 API 链接 https://hn.algolia.com/api/v1/search?query='react'&page=49
        // 进行测试后发现， nbPages (number of pages)确实是 50，
        // 但由于页码是从 0 算起的，因此 page 最多到 49，而不是 50！

        // 因此当 prev 到极限值时，不是恢复 page 50，而是恢复到 page 49.
        // 当 next 到极限值（49）时，也应该回到 0.

        // 在页面 UI 上修饰这个页码，将 page 增一位。
      if (action.payload === 'next'){
        if (state.page + 1 > state.nbPages - 1){
          return {...state, page: 0}
        }
        return {...state, page: state.page + 1}
      } else if (action.payload === 'prev'){
        if (state.page - 1 < 0) {
          return {...state, page: state.nbPages - 1}
        }
        return {...state, page: state.page - 1}
      }
      
      break;
    default:
      throw new Error(`no matching "${action.type}" type`)
      break;
  }
}
export default reducer
