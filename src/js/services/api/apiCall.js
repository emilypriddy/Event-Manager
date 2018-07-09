const timeoutDuration = 5000;

export default function apiCall(route, body={}, method="GET") {

	const request = new Promise((resolve, reject) => {
		// Code for fetch
		const headers = new Headers({
			'Content-Type': 'application/json',
		});

		const requestDetails = {
			method,
			mode: 'cors',
			headers,
		};

		if (method != 'GET') requestDetails.body = JSON.stringify(body);

		function handleErrors(response) {
			if(response.ok) {
				return response.json();
			} else {
				throw Error(response.statusText);
			}
		}
		fetch(`${SERVER_URL}/${route}`, requestDetails)
			.then(response => handleErrors(response))
			.then(data => resolve(data))
			.catch(err => reject(err));
	});

	const timeout = new Promise((resolve, reject) => {
		setTimeout(reject, timeoutDuration,`Request timed out!`);
	});

	return new Promise((resolve, reject) => {
		Promise.race([request, timeout])
			.then(resolve)
			.catch(reject);
	});
}