import { Inter } from '@next/font/google';
import Head from 'next/head';
import React, { useEffect, useState } from 'react';
import styles from '../styles/Home.module.css';
import { Client } from '../../belShare/ts-client';
import { DirectSecp256k1HdWallet } from '@cosmjs/proto-signing';
import Form from '../components/Form';
import Profile from '../components/Profile/Profile';
const inter = Inter({ subsets: ['latin'] });

const Wallet = (props) => {
	const [tx, setTx] = useState(null);
	const [client, setClient] = useState(null);
	const [balances, setBalances] = useState(null);
	const [wallet, setWallet] = useState(null);

	const [isExist, setIsExist] = useState(true);
	const [merchants, setMerchants] = useState(null);

	useEffect(() => {
		(async () => {
			const mnemonic =
				'lab quarter witness come frequent strong bird tribe run dwarf sick thumb tail salon endorse gym asthma ski life february dish review connect ecology';
			const wallet = await DirectSecp256k1HdWallet.fromMnemonic(mnemonic, { prefix: 'share' });

			const chain = new Client(
				{
					apiURL: 'http://localhost:1317',
					rpcURL: 'http://localhost:26657',
					prefix: 'share',
				},
				wallet
			);
			setClient(chain);
			const accounts = await wallet.getAccounts();
			setWallet(accounts[0]);
			const balance = await chain.CosmosBankV1Beta1.query.queryAllBalances(accounts[0].address);
			setBalances(balance.data.balances);
			await loadMerchants(chain);
		})();
	}, []);

	const loadMerchants = async (client) => {
		const res = await client.BelshareEav.query.queryMerchantNewAll();
		setMerchants(res.data);
	};

	return (
		<>
			<Head>
				<title>Create Next App</title>
				<meta name='description' content='Generated by create next app' />
				<meta name='viewport' content='width=device-width, initial-scale=1' />
				<link rel='icon' href='/favicon.ico' />
			</Head>
			<main className={styles.main}>
				<h3 className={inter.className}>User's perspective</h3>
				<br />
				{wallet && <Profile client={client} setIsExist={setIsExist} wallet={wallet} />}
				<div className={styles.formGroup}>
					{/* <Form.Entity client={client} wallet={wallet} /> */}
					{/* <Form.Attribute client={client} wallet={wallet} /> */}
					{!isExist && <Form.User client={client} setIsExist={setIsExist} wallet={wallet} />}
				</div>

				{merchants ? (
					<div className={`${inter.className} ${styles.merchantCard}`}>
						{merchants.merchantNew.map((merchant, index) => (
							<div key={index} className={styles.card}>
								<h5 style={{ marginBottom: '0.25rem' }}>Merchant {index + 1}</h5>
								<p>{merchant.address}</p>
								<p>{merchant.guid}</p>
							</div>
						))}
					</div>
				) : (
					'Merchant Not found'
				)}
			</main>
		</>
	);
};

export default Wallet;