import React, { useEffect, useState } from "react";
import { CartesianGrid, Line, LineChart, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import axios from 'axios';


const CurrencyDetail = (props) => {



  const { history } = props;

  const [currency, setCurrency] = useState([]);

  useEffect(() => {
    axios.get(`https://api.coincap.io/v2/assets/${props.match.params.id}`)
    .then((response) => {
      setCurrency(response.data.data)
        console.log(response.data.data)
    })
}, [])
  history.map(item => {
    item.time = new Date(item.time).toLocaleDateString("en-US")
    return item
  })

  console.log(props)
  return (
  <div>
    <h2 className="text-center mb-5">Weekly {currency.name} change chart</h2>
    <ResponsiveContainer width="95%" height={400} className="mb-5">
      <LineChart   data={history} >
        <Line type="monotone" dataKey="priceUsd" stroke="#8884d8" />
        <CartesianGrid stroke="#ccc" />
        <XAxis dataKey="time"/>
        <YAxis />
      </LineChart>
    </ResponsiveContainer>
    <h2 className="text-center mb-5">{currency.name} details</h2>
    <div className="table-responsive">
    <table className="table">
      <thead>
          <tr>
          <th scope="col">Rank</th>
          <th scope="col">Name</th>
          <th scope="col">Symbol</th>
          <th scope="col">Supply</th>
          <th scope="col">Change Percent 24 Hour</th>
          </tr>
      </thead>
      <tbody>
        <tr>
          <td>{currency.rank}</td>
          <td>{currency.name}</td>
          <td>{currency.symbol}</td>
          <td>{currency.supply}</td>
          <td>{currency.changePercent24Hr}</td>
        </tr>
      </tbody>
      </table>
      </div>
    </div>
  );
};

export default CurrencyDetail;