import React from 'react';
import Td from './Td';

const DataTable = ({cryptoCurrencyList}) => {
    return (
        <div className="table-responsive">
            <table className="table" cellPadding={0} cellSpacing={0}>
                <thead className="thead-dark">
                    <tr>
                    <th scope="col">Name</th>
                    <th scope="col">Symbol</th>
                    <th scope="col">Price</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        cryptoCurrencyList.map(row => 
                            <tr key={row.symbol} >
                                <Td to={{
                                        pathname:`/currency/${row.id}`, 
                                        id: `${row.id}`, 
                                        item: row
                                        }}>{row.name}
                                    </Td>
                                <td>{row.symbol}</td>
                                <td>{ addCommasToCryptoValue(row.priceUsd) }</td>
                            </tr>   
                        )
                    }
                </tbody>
            </table>
            </div>
);
};

export default DataTable;

const addCommasToCryptoValue = (nStr) => {
    nStr += '';
    var x = nStr.split('.');
    var x1 = x[0];
    var x2 = x.length > 1 ? '.' + x[1] : '';
    var rgx = /(\d+)(\d{3})/;
    while (rgx.test(x1)) {
        x1 = x1.replace(rgx, '$1' + ',' + '$2');
    }
    return (x1 + x2);
}
