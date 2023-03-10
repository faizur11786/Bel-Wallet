import { Inter } from '@next/font/google';
import React, { useEffect, useState } from 'react';
import styles from '../../styles/Home.module.css';
const inter = Inter({ subsets: ['latin'] });

const Attribute = ({ client, wallet, entitys }) => {
	const [isLoading, setIsLoading] = useState(false);

	const submitHandler = async (e) => {
		setIsLoading(true);
		e.preventDefault();
		const form = new FormData(e.currentTarget);

		let values = new Object();
		for (let pair of form.entries()) {
			values[pair[0]] = pair[1];
		}

		if (!values.name || !client || !wallet) {
			setIsLoading(false);
			console.error('something went wrong');
			return;
		}
		console.log('client', { client, values });
		const {
			[0]: { address },
		} = await client.signer.getAccounts();
		try {
			const tx = await client.BeltestEav.tx.sendMsgCreateAttribute({
				value: {
					...values,
					creator: address,
				},
			});
			console.log('ts', tx);
			setIsLoading(false);
		} catch (error) {
			setIsLoading(false);
			console.log(error);
		}
	};

	return (
		<form className={styles.form} onSubmit={submitHandler}>
			<h4 className={inter.className}>Create Attribute</h4>
			<input type='text' name='name' placeholder='ex: firstname, lastname' id='' />
			<select name='entityId' id=''>
				{entitys ? (
					entitys?.map((entity) => (
						<option key={entity.guid} value={entity.guid}>
							{entity.name}
						</option>
					))
				) : (
					<option>NA</option>
				)}
			</select>
			<button disabled={isLoading}>{isLoading ? 'Loading...' : 'Submit'}</button>
		</form>
	);
};

export default Attribute;
