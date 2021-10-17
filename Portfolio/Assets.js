import React, { Component } from 'react'
import bitimg from '../shared/img/bit.jpg'
import Styles from './portfolio.module.css'

export default class Assets extends Component {
    constructor() {
        super();
        this.state = {
            articles: [],
            total: 0
        }
    }
    async componentDidMount() {
        //Add id and amount of coins in assets from database
        const data = [{ id: "bitcoin", amount: 100 }, { id: "ethereum", amount: 500 }, { id: "tether", amount: 30 }, { id: "binancecoin", amount: 10 }, { id: "solana", amount: 300 }]
        for (var element in data) {
            let url = `https://api.coingecko.com/api/v3/coins/${data[element].id}?tickers=false&community_data=false&developer_data=false&sparkline=false`;
            let Data = await fetch(url);
            let parseData = await Data.json();
            parseData.amount = data[element].amount;
            parseData.sno = this.state.total + 1;
            this.setState({
                articles: this.state.articles.concat(parseData),
                total: this.state.total + 1
            })
        }
    }
    render() {
        return (
            <div>
                <div className="card">
                    <div className="card-header"><h3>Your assets</h3></div>
                    <div className="card-body">
                        {this.state.total > 0 &&
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th scope="col">#</th>
                                        <th scope="col">Asset</th>
                                        <th scope="col">Balance</th>
                                        <th scope="col">Price</th>
                                        <th scope="col">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {this.state.articles.map((element) => {
                                        return (
                                            <tr>
                                                <th scope="row">{element.sno}</th>
                                                <td>
                                                    <span><img src={element.image.small} alt="" /> {element.name}</span> 
                                                </td>
                                                <td>
                                                    <p>{element.amount} {element.symbol}</p>
                                                    <p>&#8377; {(element.amount * element.market_data.current_price.inr).toFixed(2)}</p>
                                                </td>
                                                <td>&#8377; {element.market_data.current_price.inr}</td>
                                                <td>
                                                    <button type="button" className="btn btn-success">Sell</button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        }
                        {this.state.total === 0 &&
                            <div className="d-flex flex-column justify-content-center align-items-center">
                                <img src={bitimg} className={Styles.bitcoin} alt="" />
                                <h4>Get started with crypto</h4>
                                <h6 className="text-secondary">Your crypto assets will appear here.</h6>
                                <a className="btn btn-success m-10" href="/list">Explore</a>
                            </div>
                        }
                    </div>
                </div>
            </div>
        )
    }
}