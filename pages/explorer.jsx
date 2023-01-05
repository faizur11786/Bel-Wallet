import { Inter } from '@next/font/google';
import React from 'react';
const inter = Inter({ subsets: ['latin'] });
import styles from '../styles/Home.module.css';

const Explorer = () => {
	return (
		<>
			<main className={`${styles.main} ${inter.className}`}>
				<div className={styles.explorerContainer}>
					<div className={styles.cardGroup}>
						<div className={styles.cardItems}>
							<div>
								<h2>Transactions</h2>
							</div>
						</div>
						<div className={styles.cardItems}>
							<div>
								<h2>Blocks</h2>
							</div>
							<div className={styles.blocks}>
								<div className={styles.block}>1 Block</div>
							</div>
						</div>
					</div>
				</div>
			</main>
		</>
	);
};

export default Explorer;
