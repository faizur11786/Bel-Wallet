import { Inter } from '@next/font/google';
import React, { useEffect, useState } from 'react';
import styles from '../../styles/Home.module.css';
const inter = Inter({ subsets: ['latin'] });

const Profile = ({ client, wallet, setIsExist }) => {
	const [isLoading, setIsLoading] = useState(false);
	const [attributes, setAttributes] = useState(null);
	const [balances, setBalances] = useState(null);
	const [userInfo, setUserInfo] = useState(null);

	useEffect(() => {
		(async () => {
			if (!client) return;
			const entitytyperes = await client.BelshareEav.query.queryEntityTypeAll();
			let res = await client.BelshareEav.query.queryAttributeAll();
			let filterRes = res.data.attribute.filter(
				(attribute) => entitytyperes.data.entityType[0].guid === attribute.entityId
			);
			setAttributes(filterRes);
			await loadBalance();
			let userRes;
			try {
				userRes = await client.BelshareEav.query.queryMerchantNew(wallet.address);
				setIsExist(true);
			} catch (error) {
				setIsExist(false);
				console.log(res);
			}

			if (!userRes) return;
			let values = new Object();
			for (let index = 0; index < filterRes.length; index++) {
				try {
					const res = await client.BelshareEav.query.queryValue(
						userRes.data.merchantNew.guid,
						filterRes[index].guid
					);
					Object.assign(values, {
						[filterRes[index].name]: res.data.value.value,
					});
				} catch (error) {
					console.log(error);
				}
			}
			setUserInfo({ userRes: res, attributes: values });
		})();
	}, [client]);

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
				coins: ['10token', '50stake'],
			}),
		}).then((res) => res.json());
		console.log('tx', tx);
		await loadBalance();
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
			{userInfo && (
				<ul className={styles.attributes}>
					<h3>Attributes</h3>
					{attributes &&
						attributes.map((attribute, index) => (
							<li key={index + 1}>{`${attribute.name.toUpperCase()} - ${
								!userInfo?.attributes[attribute.name] ? 'NA' : userInfo?.attributes[attribute.name]
							}`}</li>
						))}
				</ul>
			)}
		</div>
	);
};

export default Profile;
