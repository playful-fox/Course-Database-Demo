// TransTable.js

// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from 'react';

function TransTable() {
    const [data, setData] = useState([]);

    useEffect(() => {
        // 使用 fetch 來從後端獲取數據
        fetch('/api/trans')
            .then((response) => response.json())
            .then((data) => {
                setData(data);
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
            });
    }, []);

    return (
        <div>
            <h2>Transaction Data</h2>
            <table className="table-auto">
                <thead>
                <tr>
                    <th>AccID</th>
                    <th>TranID</th>
                    <th>TranTime</th>
                    <th>AtmID</th>
                    <th>TranType</th>
                    <th>TranNote</th>
                    <th>UP_DATETIME</th>
                    <th>UP_USR</th>
                </tr>
                </thead>
                <tbody>
                {data.map((item) => (
                    <tr key={item.TranID}>
                        <td>{item.AccID}</td>
                        <td>{item.TranID}</td>
                        <td>{item.TranTime}</td>
                        <td>{item.AtmID}</td>
                        <td>{item.TranType}</td>
                        <td>{item.TranNote}</td>
                        <td>{item.UP_DATETIME}</td>
                        <td>{item.UP_USR}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}

export default TransTable;
