import Link from "next/link";
import React from "react";
import { Inter } from "@next/font/google";
import styles from "../../styles/Home.module.css";
const inter = Inter({ subsets: ["latin"] });

const Nav = () => {
    return (
        <ul className={`${inter.className} ${styles.nav}`}>
            {/* <li>
				<Link href='/explorer' target={'_blank'}>
					Explorer
				</Link>
			</li> */}
            <li>
                <Link href="/user">User</Link>
            </li>
            <li>
                <Link href="/merchant">Merchant</Link>
            </li>
            <li>
                <Link href="/admin">Admin</Link>
            </li>
        </ul>
    );
};

export default Nav;
