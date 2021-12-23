import React from "react";
import { useHistory } from "react-router-dom";

import SuccessLogo from "../shared/img/Success.gif";
import FailedLogo from "../shared/img/failed.gif";
import Styles from "./PaymentConfirm.module.css";

const PaymentConfirmation = (props) => {
	const history = useHistory();

	const data = props.location.state;

	return (
		<div>
			{data.success && (
				<div class="card shadow p-3 mb-5 bg-body rounded" id={Styles.card}>
					<div class="card-body d-flex flex-column justify-content-center align-items-center">
						<img src={SuccessLogo} id={Styles.simg} alt="..." />
						<div className="details">
							<h2>Transaction Successful</h2>
							<p className="h4 text-primary">
								&#x20B9; {data.amount} is added to your wallet
							</p>
							<hr />
							<div className="d-flex justify-content-between">
								<p className="h5 me-5">Transaction ID: </p>
								<p className="h5">{data.transaction_id}</p>
							</div>
							<hr />
							<div className="d-flex justify-content-between">
								<p className="h5 me-5">RazorPay Order ID: </p>
								<p className="h5">{data.razorpay_order_id}</p>
							</div>
							<hr />
							<div className="d-flex justify-content-between">
								<p className="h5 me-5">Updated Balance: </p>
								<p className="h5">&#x20B9; {data.balance}</p>
							</div>
							<hr />
						</div>
						<button
							type="button"
							class="btn btn-success"
							id={Styles.back}
							onClick={() => {
								history.push("/portfolio");
							}}
						>
							Back to Portfolio
						</button>
					</div>
				</div>
			)}
			{!data.success && (
				<div class="card shadow p-3 mb-5 bg-body rounded" id={Styles.card}>
					<div class="card-body d-flex flex-column justify-content-center align-items-center">
						<img src={FailedLogo} id={Styles.simg} alt="..." />
						<div className="details">
							<h2>Transaction Failed</h2>
							<p className="h4 text-primary">Here's what we know</p>
							<hr />
							<div className="d-flex justify-content-between">
								<p className="h5 me-5">Transaction ID: </p>
								<p className="h5">{data.transaction_id}</p>
							</div>
							<hr />
							<div className="d-flex justify-content-between">
								<p className="h5 me-5">RazorPay Order ID: </p>
								<p className="h5">{data.razorpay_order_id}</p>
							</div>
							<hr />
							<div className="d-flex justify-content-between">
								<p className="h5 me-5">Error: </p>
								<p className="h5">{data.error_message}</p>
							</div>
							<hr />
						</div>
						<button
							type="button"
							class="btn btn-danger"
							id={Styles.back}
							onClick={() => {
								history.push("/portfolio");
							}}
						>
							Back to Portfolio
						</button>
					</div>
				</div>
			)}
		</div>
	);
};

export default PaymentConfirmation;
