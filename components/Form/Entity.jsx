import { Inter } from "@next/font/google";
import React, { useState } from "react";
import styles from "../../styles/Home.module.css";
const inter = Inter({ subsets: ["latin"] });

const Entity = ({ client, wallet, loadEntity }) => {
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
            console.error("something went wrong");
            return;
        }
        const {
            [0]: { address },
        } = await client.signer.getAccounts();
        console.log("client", client);

        try {
            const tx = await client.BeltestEav.tx.sendMsgCreateEntityType({
                value: {
                    name: values.name,
                    creator: address,
                },
            });
            console.log("ts", tx);
            setIsLoading(false);
            await loadEntity();
        } catch (error) {
            setIsLoading(false);
            console.log("error", error);
        }
    };

    return (
        <form className={styles.form} onSubmit={submitHandler}>
            <h4 className={inter.className}>Create Entity Type</h4>
            <input
                type="text"
                name="name"
                placeholder="ex: User, Merchant"
                id=""
            />
            <button disabled={isLoading}>
                {isLoading ? "Loading..." : "Submit"}
            </button>
        </form>
    );
};

export default Entity;
