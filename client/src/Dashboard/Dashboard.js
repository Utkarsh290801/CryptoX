import React, { Fragment, useContext, useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import axios from "axios";

import Styles from "./Dashboard.module.css";
import Spinner from "../shared/components/Spinner";
import News from "./News";
import AuthContext from "../store/authContext";
import Alert from "../shared/components/Alert";

const totalArticles = 100;

const Dashboard = (props) => {
	const ctx = useContext(AuthContext);

	const [articles, setArticles] = useState([]);
	const [page, setPage] = useState(2);
	const [loading, setLoading] = useState(false);
	const [name, setName] = useState("User");
	const [balanceRupees, setBalanceRupees] = useState("***");
	const [balancePaise, setBalancePaise] = useState("**");
	const [referralBalance, setReferralBalance] = useState("***.**");
	const [isEmailVerified, setIsEmailVerified] = useState(false);
	const [error, setError] = useState(null);

	useEffect(() => {
		// Getting Balance and Email Verification Info & news articles
		const fetchData = async () => {
			setLoading(true);

			try {
				const { data } = await axios.post(
					`${process.env.REACT_APP_SERVER_URL}/user/data`,
					{
						name: true,
						balance: true,
						isEmailVerified: true,
						referralBalance: true,
					},
					{
						headers: {
							Authorization: "Bearer " + ctx.token,
						},
					}
				);

				console.log(data);

				let url = `https://newsapi.org/v2/everything?sortBy=popularity&q=crypto&page=1&pageSize=10&apiKey=${process.env.REACT_APP_NEWS_API_KEY}`;
				const { data: parseData } = await axios.get(url);

				setName(data.name);
				setBalanceRupees(data.balance.Rupees);
				setBalancePaise(data.balance.Paise);
				setReferralBalance(data.referralBalance);
				setIsEmailVerified(data.isEmailVerified);
				setArticles(parseData.articles);
				setLoading(false);
			} catch (err) {
				// Error fetching Balance and Email Verification Info & news articles
				console.log(err.response);
			}
		};

		fetchData();
	}, [ctx]);

	const fetchMoreData = async () => {
		setPage((lastPageNumber) => {
			return lastPageNumber + 1;
		});

		let url = `https://newsapi.org/v2/everything?sortBy=popularity&q=crypto&page=${page}&pageSize=10&apiKey=${process.env.REACT_APP_NEWS_API_KEY}`;
		const { data: parsedData } = await axios.get(url);

		setArticles((prevArticles) => {
			return [...prevArticles, ...parsedData.articles];
		});
	};

	const sendVerificationMail = async () => {
		setLoading(true);

		try {
			const { data } = await axios.get(`${process.env.REACT_APP_SERVER_URL}/verify/email`, {
				headers: {
					Authorization: "Bearer " + ctx.token,
				},
			});

			console.log(data);

			setError(data.message);
			setLoading(false);
		} catch (err) {
			// Error sending Email Verification Mail
			setError(err.response.data.message);
			console.log(err.response);
		}
	};

	const clearError = () => {
		setError(null);
	};

	return (
		<Fragment>
			{error && <Alert msg={error} onClose={clearError} />}
			<div className="card" id={Styles.top}>
				<div className="card-body">
					<h4>Welcome {name}</h4>
					<div className="card shadow-sm p-3 mb-5 bg-body rounded">
						{isEmailVerified && (
							<div className="card-body" id={Styles.verify}>
								<i className="fa fa-check-circle text-success">Account verified</i>
							</div>
						)}
						{!isEmailVerified && (
							<div className="card-body" id={Styles.verify}>
								<i className="fa fa-exclamation-triangle text-danger">Account not verified</i>
								<button type="button" className="btn btn-success" onClick={sendVerificationMail}>
									<strong>Verify your ID</strong>
								</button>
							</div>
						)}
					</div>
					<div className="card shadow-sm p-3 mb-5 bg-body rounded">
						<div className="card-body">
							<h3>
								Total balance ₹ {balanceRupees}.{balancePaise}
							</h3>
							<h4>Total amount earned from referral: ₹ {referralBalance}</h4>
						</div>
					</div>
				</div>
			</div>
			<div className="card" id={Styles.body}>
				<div className="card-header">
					<h3>Top Stories</h3>
				</div>
				<div className="card-body">
					<InfiniteScroll
						dataLength={articles.length}
						next={fetchMoreData}
						hasMore={articles.length <= totalArticles - 1}
						loader={<Spinner />}
					>
						{loading && <Spinner />}
						{articles.map((element) => {
							return <News articles={element} key={element.url} />;
						})}
					</InfiniteScroll>
				</div>
			</div>
		</Fragment>
	);
};

export default Dashboard;
