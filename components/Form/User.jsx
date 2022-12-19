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
			const entitytyperes = await client.BelshareEav.query.queryEntityTypeAll();
			const attribute = await client.BelshareEav.query.queryEntityAttributes(
				entitytyperes.data.entityType[1].guid
			);
			setAttributea(attribute.data.attributes);
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
					name: pair[1],
					entityId: '',
				});
			}
		}

		console.log('values', {
			attributs: values,
			address: wallet.address,
			creator: wallet.address,
		});

		if (!values || !client || !wallet) {
			setIsLoading(false);
			console.error('something went wrong');
			return;
		}
		console.log('client.BelshareEav.tx', client.BelshareEav.tx);
		const tx = await client.BelshareEav.tx.sendMsgCreateNewUser({
			value: {
				attributes: values,
				address: wallet.address,
				creator: wallet.address,
			},
		});
		console.log('ts', tx);
		setIsExist(true);
		setIsLoading(false);
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
