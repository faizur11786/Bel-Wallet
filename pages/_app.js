import Nav from '../components/Nav/Nav';
import '../styles/globals.css';

export default function App({ Component, pageProps }) {
	return (
		<>
			<Nav />
			<Component {...pageProps} />
		</>
	);
}
