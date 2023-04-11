import React from 'react'
import { useGlobalContext } from './context'
// 添加 disabled={isLoading} 的意义：
  // 当 isLoading 正在加载时，禁止点击 button.
const Buttons = () => {
  const {isLoading, page, nbPages, handlePage} = useGlobalContext();
  return <div className='btn-container'>
    <button 
      onClick={() => {handlePage("prev")}}
      disabled={isLoading}
    >prev</button>
    <p>{page + 1} of {nbPages}</p>
    <button 
      onClick={() => {handlePage("next")}}
      disabled={isLoading}
    >next</button>
  </div>
}

export default Buttons
