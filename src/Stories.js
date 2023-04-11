import React from 'react'

import { useGlobalContext } from './context'

const Stories = () => {
  const {isLoading, hits, remove} = useGlobalContext();
  console.log(isLoading); // 检验后发现 isLoading 先 true 后 undefined.
    if (isLoading) {
      
      return <div className='loading'></div>
    } // 尽管 isLoading 的initial state 为 true，
      // 目前也无法加载出 div loading。
      // 想要加载，必须对 reducer 内的 initial state 定义特定的 dispatch 操作！

  return <section className='stories'>
    {hits.map((item, index) => {
      const {points, num_comments, title, url, author, objectID} = item;
      return (
        <article className='story' key={index}>
          <h4 className='title'>{title}</h4>
          <p className='info'>
            {points} points by <span>{author}</span> | {num_comments} comments
          </p>
          <div>
            {/* 使用 target='_blank' 来在点击时新开一个 tab; 
            这样使用会导致报 Warning:
            Using target="_blank" without rel="noopener noreferrer" is a security risk
            所以也加上 rel */}
            <a 
              href={url} 
              className='read-link' 
              target='_blank'
              rel="noopener noreferrer"
            >read more</a>
            <button className='remove-btn' onClick={() => {remove(objectID)}}>remove</button>
          </div>
        </article>
      )
    })}
  </section>
}

export default Stories
