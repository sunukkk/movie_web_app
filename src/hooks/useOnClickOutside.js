import React from 'react'
import { useEffect } from 'react'

function useOnClickOutside(ref, handler) {
  useEffect(() =>{
    console.log('ref ->',ref) //ref.current => div.modal

    const listener = (event) => {
      if(!ref.current || ref.current.contains(event.target)){
        //modal 안 닫히는 경우
        return;
      }
      //modal 닫히는 경우
      handler(event);
    }

    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener)
  }, [ref, handler]);
}

export default useOnClickOutside