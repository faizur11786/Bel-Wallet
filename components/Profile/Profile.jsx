import { Inter } from '@next/font/google';
import React, { useEffect, useState } from 'react';
import styles from '../../styles/Home.module.css';
const inter = Inter({ subsets: ['latin'] });

const Profile = ({ info, client, wallet, setIsExist, merchants }) => {
	const [isLoading, setIsLoading] = useState(false);
	const [balances, setBalances] = useState(null);

	useEffect(() => {
		(async () => {
			// await loadBalance();
			// const ws = new WebSocket('ws://127.0.0.1:26657/websocket');
			// console.log('es', ws);
			// const obj = new Object({
			// 	jsonrpc: '2.0',
			// 	method: 'subscribe',
			// 	id: 0,
			// 	params: { query: "tm.event='NewBlock'" },
			// });
			// ws.onopen = () => {
			// 	ws.send(JSON.stringify(obj));
			// };
			// ws.onmessage = (data) => {
			// 	console.log(JSON.parse(data.data));
			// };
			// const keplr = await client.useKeplr();
			// console.log('keplr', keplr);
		})();
	}, [client]);

	useEffect(() => {
		loadBalance();
	}, []);
	const loadBalance = async () => {
		const balance = await client.CosmosBankV1Beta1.query.queryAllBalances(wallet.address);
		setBalances(balance.data.balances);
	};

	const dropFaucet = async () => {
		setIsLoading(true);
		const tx = await fetch('http://0.0.0.0:4500/', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				address: wallet.address,
				coins: ['10belc'],
			}),
		}).then((res) => res.json());
		console.log('tx', tx);
		await loadBalance();
		setIsLoading(false);
	};

	const shareHandler = (e) => {
		setIsLoading(true);
		e.preventDefault();
		const form = new FormData(e.currentTarget);

		let values = new Array();
		setIsLoading(false);
	};

	return (
		<div className={`${inter.className} ${styles.profile}`}>
			<h3>{wallet.address}</h3>
			<ul className={styles.balances}>
				{balances &&
					balances.map((balance, index) => (
						<li key={index}>
							<span>{`${balance.denom.toUpperCase()} : `}</span>
							<span>{balance.amount}</span>
						</li>
					))}
				<button onClick={dropFaucet} disabled={isLoading}>
					{isLoading ? 'Wait...' : 'Give me token faucet'}
				</button>
			</ul>
			{info?.attributes && (
				<ul className={styles.attributes}>
					<h3>Attributes</h3>
					{info.attributes.map((attribute, index) => (
						<li key={index + 1}>
							<div>
								<p>{`${attribute.label.toUpperCase()} - ${
									!attribute.value ? 'NA' : attribute.value
								}`}</p>
								{merchants && (
									<form onSubmit={shareHandler}>
										<select name='merchant' id=''>
											{merchants.merchants.map((merchant, index) => {
												return (
													<option key={index + 1} value={merchant.creator}>
														{merchant.creator}
													</option>
												);
											})}
										</select>
										<button disabled={isLoading}>
											{isLoading ? 'Loading...' : 'Share with them'}
										</button>
									</form>
								)}
							</div>
						</li>
					))}
				</ul>
			)}
		</div>
	);
};

export default Profile;
