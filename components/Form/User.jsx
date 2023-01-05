import { Inter } from '@next/font/google';
import React, { useEffect, useState } from 'react';
import styles from '../../styles/Home.module.css';
const inter = Inter({ subsets: ['latin'] });

const User = ({ client, wallet, setIsExist }) => {
	const [isLoading, setIsLoading] = useState(false);
	const [attributea, setAttributea] = useState(null);

	useEffect(() => {
		(async () => {
			if (!client) return;
			try {
				const {
					data: { entityTypes },
				} = await client.BeltestEav.query.queryEntityTypesAll();
				const guid = entityTypes[0].name.toLowerCase() === 'user' ? entityTypes[0].guid : entityTypes[1].guid;

				const {
					data: { attributes },
				} = await client.BeltestEav.query.queryAttributes(guid);
				setAttributea(attributes);
			} catch (error) {
				console.log(error);
			}
		})();
	}, [client]);

	const submitHandler = async (e) => {
		setIsLoading(true);
		e.preventDefault();
		const form = new FormData(e.currentTarget);

		let values = new Array();
		for (let pair of form.entries()) {
			if (pair[1]) {
				values.push({
					guid: pair[0],
					value: pair[1],
				});
			}
		}

		if (!values || !client || !wallet) {
			setIsLoading(false);
			console.error('something went wrong');
			return;
		}
		try {
			const {
				[0]: { address },
			} = await client.signer.getAccounts();

			const payload = {
				attributes: values,
				creator: address,
			};
			console.log('payload', payload);
			const tx = await client.BeltestEav.tx.sendMsgCreateUser({
				value: payload,
			});
			console.log('ts', tx);
			setIsExist(true);
			setIsLoading(false);
		} catch (error) {
			setIsLoading(false);
			console.log(error);
		}
	};

	return (
		<form className={styles.form} onSubmit={submitHandler}>
			<h4 className={inter.className}>Become User</h4>
			{attributea &&
				attributea.map((attribute) => (
					<input
						key={attribute.guid}
						type='text'
						name={attribute.guid}
						id={attribute.name}
						placeholder={`Enter ${attribute.name}`}
					/>
				))}
			<button disabled={isLoading}>{isLoading ? 'Loading...' : 'Submit'}</button>
		</form>
	);
};

export default User;
