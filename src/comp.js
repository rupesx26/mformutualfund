import React, { useState, useEffect } from 'react'

export default function Comp() {

    const [data, setData] = useState([])

 const fetchApi =  async () => {
    try {
        const response = await fetch("https://jsonplaceholder.typicode.com/users", {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': 'https://jsonplaceholder.typicode.com/'

            },
          })
          const results = await response.json();
          setData(results)

    } catch (error) {
        console.error('Error:', error);

    }

 }
 console.log('data', data.length)

    useEffect(() => {
        fetchApi()
    }, [])
  return (
    <div>{

        data.length > 0 && data.map((x,y) => {
           return <div key={y}>{x.name}</div>
        })
        } hello</div>
  )
}
