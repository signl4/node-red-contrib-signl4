// MIT License
// Copyright (c) 2021 Derdack GmbH

module.exports = function(RED) {
    function SIGNL4(config) {
		RED.nodes.createNode(this,config);
		var node = this;
		node.on('input', function(msg) {

		// Create or change values if required
		if (msg.payload == undefined) {
			msg.payload = {
				'Subject': '',
				'Body': '',
				'X-S4-Service': '',
				'X-S4-Location': '',
				'X-S4-AlertingScenario': '',
				'X-S4-ExternalID': ''
			};
		}
		if (msg.payload.Subject == undefined) {
			msg.payload.Subject = '';
		}
		if (msg.payload.Subject == '') {
			msg.payload.Subject = config.alertSubject;
		}
		if (msg.payload.Body == undefined) {
			msg.payload.Body = '';
		}
		if (msg.payload.Body == '') {
			msg.payload.Body = config.alertBody;
		}
		if (msg.payload['X-S4-Service'] == undefined) {
			msg.payload['X-S4-Service'] = '';
		}
		if (msg.payload['X-S4-Service'] == '') {
			msg.payload['X-S4-Service'] = config.alertS4Service;
		}
		if (msg.payload['X-S4-Location'] == undefined) {
			msg.payload['X-S4-Location'] = '';
		}
		if (msg.payload['X-S4-Location'] == '') {
			msg.payload['X-S4-Location'] = config.alertS4Location;
		}
		if (msg.payload['X-S4-AlertingScenario'] == undefined) {
			msg.payload['X-S4-AlertingScenario'] = '';
		}
		if (msg.payload['X-S4-AlertingScenario'] == '') {
			msg.payload['X-S4-AlertingScenario'] = config.alertS4AlertingScenario;
		}
		if (msg.payload['X-S4-ExternalID'] == undefined) {
			msg.payload['X-S4-ExternalID'] = '';
		}
		if (msg.payload['X-S4-ExternalID'] == '') {
			msg.payload['X-S4-ExternalID'] = config.alertS4ExternalID;
		}

		// Send alert
		// msg.payload = msg.payload.toLowerCase();
		sendSIGNL4Alert(node, config.teamSecret, msg.payload);

		if (node.done) {
			node.done();
		}
		
		node.send({payload:'OK', statusCodenumber: 200});

        });
    }
    RED.nodes.// MIT License
// Copyright (c) 2020 Derdack GmbH


module.exports = function(RED) {

	// Send alert
	function SIGNL4(config) {
		RED.nodes.createNode(this,config);
		var node = this;
		node.on('input', function(msg) {

		// Create or change values if required
		if ((msg.payload == undefined) || (msg.payload.Subject == undefined)) {
			msg.payload = {
				'Subject': '',
				'Body': '',
				'X-S4-Service': '',
				'X-S4-Location': '',
				'X-S4-AlertingScenario': '',
				'X-S4-ExternalID': ''
			};
		}
		if (msg.payload.Subject == undefined) {
			msg.payload.Subject = '';
		}
		if (msg.payload.Subject == '') {
			msg.payload.Subject = config.alertSubject;
		}
		if (msg.payload.Body == undefined) {
			msg.payload.Body = '';
		}
		if (msg.payload.Body == '') {
			msg.payload.Body = config.alertBody;
		}
		if (msg.payload['X-S4-Service'] == undefined) {
			msg.payload['X-S4-Service'] = '';
		}
		if (msg.payload['X-S4-Service'] == '') {
			msg.payload['X-S4-Service'] = config.alertS4Service;
		}
		if (msg.payload['X-S4-Location'] == undefined) {
			msg.payload['X-S4-Location'] = '';
		}
		if (msg.payload['X-S4-Location'] == '') {
			msg.payload['X-S4-Location'] = config.alertS4Location;
		}
		if (msg.payload['X-S4-AlertingScenario'] == undefined) {
			msg.payload['X-S4-AlertingScenario'] = '';
		}
		if (msg.payload['X-S4-AlertingScenario'] == '') {
			msg.payload['X-S4-AlertingScenario'] = config.alertS4AlertingScenario;
		}
		if (msg.payload['X-S4-ExternalID'] == undefined) {
			msg.payload['X-S4-ExternalID'] = '';
		}
		if (msg.payload['X-S4-ExternalID'] == '') {
			msg.payload['X-S4-ExternalID'] = config.alertS4ExternalID;
		}

		// New alert
		msg.payload['X-S4-Status'] = 'new'

		// Send alert
		// msg.payload = msg.payload.toLowerCase();
		sendSIGNL4Alert(node, config.teamSecret, msg.payload);

		if (node.done) {
			node.done();
		}
		
		node.send({payload:'OK', statusCodenumber: 200});

        });
	}

	// Resolve alert
	function SIGNL4Resolve(config) {
		RED.nodes.createNode(this,config);
		var node = this;
		node.on('input', function(msg) {

		// Create or change values if required
		if ((msg.payload == undefined) || (msg.payload.Subject == undefined)) {
			msg.payload = {
				'Subject': '',
				'Body': '',
				'X-S4-ExternalID': ''
			};
		}

		if (msg.payload.Subject == undefined) {
			msg.payload.Subject = '';
		}
		if (msg.payload.Subject == '') {
			msg.payload.Subject = config.alertSubject;
		}
		if (msg.payload.Body == undefined) {
			msg.payload.Body = '';
		}
		if (msg.payload.Body == '') {
			msg.payload.Body = config.alertBody;
		}
		if (msg.payload['X-S4-ExternalID'] == '') {
			msg.payload['X-S4-ExternalID'] = config.alertS4ExternalID;
		}

		// Resolve
		msg.payload['X-S4-Status'] = 'resolved'

		// Send alert
		// msg.payload = msg.payload.toLowerCase();
		sendSIGNL4Alert(node, config.teamSecret, msg.payload);

		if (node.done) {
			node.done();
		}
		
		node.send({payload:'OK', statusCodenumber: 200});

        });
	}
	RED.nodes.registerType("SIGNL4 Resolve", SIGNL4Resolve);

	function SIGNL4Alert(node, teamsecret, body) {
		
		try {

			// Send the HTTP POST request to SIGNL4
			const https = require('https');
			var options = {
				hostname: 'connect.signl4.com',
				path: '/webhook/' + teamsecret,
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				}
			};

			var data = '';
			const req = https.request(options, (res) => {

				res.on('data', (d) => {
					data += d;
				});

				res.on('end', () => {
					if ((res.statusCode >= 200) & (res.statusCode < 300)) {
						// OK
						node.log('SIGNL4 alert sent.');
						var msg = { payload: data };
						node.send(msg);
						
					} else {
						// Error
						node.log('SIGNL4 alert failed.');
						var msg = { payload: { error: 'SIGNL4 alert failed.' }};
						node.error(msg);
					} 
				});

				res.on('error', (err) => {
					// Error
					node.log('SIGNL4 alert failed: ' + err.message);
					var msg = { payload: { error: 'SIGNL4 alert failed: ' + err.message }};
					node.error(msg);
				});
			});

			req.write(JSON.stringify(body));
			req.end();

		} catch (error) {
			// Error
			node.error("SIGNL4 alert failed: " + err.message);
			var msg = { payload: { error: 'SIGNL4 alert failed: ' + err.message }};
			node.error(msg);
		}

    }
	RED.nodes.registerType("SIGNL4", SIGNL4);
}
