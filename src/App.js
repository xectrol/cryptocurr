import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import { makeStyles } from '@material-ui/core/styles';
import axios from 'axios';
import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import BasicPagination from './components/BasicPagination';
import CurrencyDetail from './components/CurrencyDetail';
import DataTable from './components/DataTable';


const useStyles = makeStyles((theme) => ({
    formControl: {
      margin: theme.spacing(-2,0,0,5),
      minWidth: 120,
    },
    selectEmpty: {
      marginTop: theme.spacing(0),
    },
  }));


export default function App() {

    const classes = useStyles();

    //crypto currencies
    const [cryptoCurrencyList, setCryptoCurrencyList] = useState([]);

    //currencies with symbols
    const [currencies, setCurrencies] = useState([]);

    //selected currency from dropdown
    const [currency, setCurrency] = React.useState('');

    //saerch input value
    const [searchValue, setSearchValue] = useState([]);

      
    // pagination data
    const [currentPage, setCurrentPage] = useState(1);
    const [currencyPerPage] = useState(7);

    // 7 day values for currency
    const [currencyHistory, setCurrencyHistory] = useState([]);

    //preparing timestamp data for 7 day history endpoint
    const date = new Date();
    const todayTime = date.setHours(0,0,0,0)
    var weekAgoTime = new Date().setDate(date.getDate() - 8);


    //dropdown item change function
    const handleSelect = (event) => {
      setCurrency(event.target.value);
      setCryptoCurrencyList(cryptoCurrencyList.map((item) => {
          item.priceUsd = item.priceUsd / event.target.value
          return item
      }))
  };

  const search = (rows) => {
    return rows.filter(row => row.name.toLowerCase().indexOf(searchValue) > -1)
  }

    // CoinCap API requests with useEffect hook
    useEffect(() => {
        axios.get(`https://api.coincap.io/v2/assets`)
        .then((response) => {
            setCryptoCurrencyList(response.data.data)
          
        })
        
        axios.get(`https://api.coincap.io/v2/assets/bitcoin/history?interval=d1&start=${weekAgoTime}&end=${todayTime}`)
        .then((response) => {
            setCurrencyHistory(response.data.data)
        })

        axios.get(`https://api.coincap.io/v2/rates`)
        .then((response) => {
            setCurrencies(response.data.data)
        })
    }, [])

    // Get current currencies for pagination
    const indexOfLastCurrency = currentPage * currencyPerPage;
    const indexOfFirstCurrency = indexOfLastCurrency - currencyPerPage;
    const currentCurrencies = cryptoCurrencyList.slice(indexOfFirstCurrency, indexOfLastCurrency);


    // Change page action
    const paginate = pageNumber => setCurrentPage(pageNumber);

    return(
        <div>
            <Router>
                <div className="main-app container mt-5">
                    {/* A <Switch> looks through its children <Route>s and
                        renders the first one that matches the current URL. */}
                    <Switch>
                    <Route exact path="/">
                        <div className="d-flex mb-4">
                            <input placeholder="Please type crypto currency name" className="search-input" type="text" value={searchValue} onChange={(e) => setSearchValue(e.target.value)} />
                            <FormControl  className={classes.formControl}>
                                <InputLabel id="demo-simple-select-label">Currencies</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    value={currency}
                                    onChange={handleSelect}
                                >
                                    {
                                        currencies.map(currency =>
                                            <MenuItem key={currency.symbol} value={currency.rateUsd}>{currency.symbol}</MenuItem>
                                        )
                                    }
                                
                                </Select>
                            </FormControl>
                        </div>
                        <DataTable cryptoCurrencyList={search(currentCurrencies)}/>

                        <BasicPagination
                            postsPerPage={currencyPerPage}
                            currentPage={currentPage}
                            totalPosts={cryptoCurrencyList.length}
                            paginate={paginate}
                        />
                    </Route>
                    <Route path='/currency/:id' render={(props) => <CurrencyDetail {...props} history={currencyHistory}/>} />
                    </Switch>
                </div>
            </Router>
        </div>
    )
}
 