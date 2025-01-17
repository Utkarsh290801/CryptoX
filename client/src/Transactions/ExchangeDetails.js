import React, { Fragment, useContext, useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

import loader from "../shared/img/load.gif"

import Styles from "./Transaction.module.css";
import success from "../shared/img/success.png";
import failed from "../shared/img/failed.png";
import Alert from "../shared/components/Alert";
import AuthContext from "../store/authContext";



export default function ExchangeDetails(props) {
    const ctx = useContext(AuthContext);
    const tid = props.location.state.tid;

    const [error, setError] = useState(null);
    const [transaction, setTransaction] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const { data } = await axios.post(
                    "http://localhost:5000/transaction/data",
                    {
                        tid,
                    },
                    {
                        headers: {
                            Authorization: "Bearer " + ctx.token,
                        },
                    }
                );

                setTransaction(data);
            } catch (err) {
                console.log(err.response.data);
                setError("Something went wrong!" + err.response.data.message);
            }
            setTimeout(() => {
                setIsLoading(false);
            }, 500);
        };

        fetchData();
    }, [ctx, tid]);

    const clearError = () => {
        setError(null);
    };

    return (
        <Fragment>
            {error && <Alert msg={error} onClose={clearError} />}
            <div class="card m-5 shadow p-3 mb-5 bg-body rounded">
                <div class="card-body">
                    {isLoading && <img src={loader} alt="" />}
                    {!isLoading && transaction.isSuccess && (
                        <div>
                            <img src={success} alt="" id={Styles.simg} />
                            <p className="text-primary h5">
                                Added {transaction.recieveCoinName} of value
                            </p>
                            <p className="h3">
                                {transaction.quantityRecieved} ({transaction.coinid2})
                            </p>
                            <p className="mx-auto h5" id={Styles.tid}>
                                Transaction ID:{" "}
                                <span className="text-secondary">{transaction.id}</span>
                            </p>
                            <p className="text-secondary h6">
                                {new Date(transaction.updatedAt).toString().slice(0, -31)}
                            </p>
                            <div class="card" id={Styles.details}>
                                <div class="card-body d-flex flex-column align-items-start">
                                    <p className="h5">State: </p>
                                    <p className="fs-6 text-secondary">{transaction.status}</p>
                                    <p className="h5">Transaction charge: </p>
                                    <p className="fs-6 text-secondary">
                                        &#8377; {transaction.chargedMoney} ({transaction.chargedQuantity} {transaction.coinid1})
                                    </p>
                                    <p className="h5">Exchanged from:</p>
                                    <p className="fs-6 text-secondary">
                                        {transaction.quantitySendForExchange} {transaction.sendCoinSymbol}
                                    </p>
                                </div>
                            </div>
                            <Link className="btn btn-success mt-2 fs-5" to="/transactions">Back to Transactions</Link>
                        </div>
                    )}
                    {!isLoading && !transaction.isSuccess && (
                        <div>
                            <img src={failed} alt="" id={Styles.simg} />
                            <p className="text-primary h5">
                                Exchange {transaction.sendCoinName} of value
                            </p>
                            <p className="h3">
                                {transaction.quantitySendForExchange} ({transaction.sendCoinSymbol})
                            </p>
                            <p className="mx-auto h5" id={Styles.tid}>
                                Transaction ID{" "}
                                <span className="text-secondary">{transaction.id}</span>
                            </p>
                            <p className="text-secondary h6">
                                {new Date(transaction.updatedAt).toString().slice(0, -31)}
                            </p>
                            <div class="card" id={Styles.details}>
                                <div class="card-body d-flex flex-column align-items-start">
                                    <p className="h5">State: </p>
                                    <p className="fs-6 text-secondary">{transaction.status}</p>
                                    <p className="h5">Exchange To:</p>
                                    <p className="fs-6 text-secondary">
                                        {transaction.recieveCoinName}
                                    </p>
                                    <p className="h5">Error Message:</p>
                                    <p className="fs-6 text-secondary">
                                        {transaction.statusMessage}
                                    </p>
                                </div>
                            </div>
                            <Link className="btn btn-danger mt-2 fs-5" to="/transactions">Back to Transactions</Link>
                        </div>
                    )}
                </div>
            </div>
        </Fragment>
    )
}
