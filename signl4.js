// MIT License
// Copyright (c) 2021 Derdack GmbH

module.exports = function(RED) {

	// Send alert
	function SIGNL4(config) {
		RED.nodes.createNode(this,config);
		var node = this;
		node.on('input', function(msg) {
		
		// Multi-part data
		var data = "";

		// Create or change values if required
		if ((msg.payload == undefined)) {
			msg.payload = {
				'Subject': '',
				'Body': '',
				'X-S4-Service': '',
				'X-S4-Location': '',
				'X-S4-AlertingScenario': '',
				'X-S4-Filtering': false,
				'X-S4-ExternalID': '',
				'X-S4-SourceSystem': 'NodeRED'
			};
		}

		// Title
		if (msg.payload.Subject == undefined) {
			msg.payload.Subject = '';
		}
		if (msg.payload.Subject == '') {
			msg.payload.Subject = config.alertSubject;
		}
		data += "------Boundary-cc2050af-c42f-4cda-a0c3-ede7eaa89513\r\n";
		data += "Content-Disposition: form-data; name=\"Title\"\r\n\r\n";
		data += msg.payload.Subject + "\r\n";
		
		// Message
		if (msg.payload.Body == undefined) {
			msg.payload.Body = '';
		}
		if (msg.payload.Body == '') {
			msg.payload.Body = config.alertBody;
		}
		if (msg.payload.Body != '') {
			data += "------Boundary-cc2050af-c42f-4cda-a0c3-ede7eaa89513\r\n";
			data += "Content-Disposition: form-data; name=\"Message\"\r\n\r\n";
			data += msg.payload.Body + "\r\n";
		}
		
		// X-S4-Service
		if (msg.payload['X-S4-Service'] == undefined) {
			msg.payload['X-S4-Service'] = '';
		}
		if (msg.payload['X-S4-Service'] == '') {
			msg.payload['X-S4-Service'] = config.alertS4Service;
		}
		if (msg.payload['X-S4-Service'] != '') {
			data += "------Boundary-cc2050af-c42f-4cda-a0c3-ede7eaa89513\r\n";
			data += "Content-Disposition: form-data; name=\"X-S4-Service\"\r\n\r\n";
			data += msg.payload['X-S4-Service'] + "\r\n";
		}
		// X-S4-Location
		if (msg.payload['X-S4-Location'] == undefined) {
			msg.payload['X-S4-Location'] = '';
		}
		if (msg.payload['X-S4-Location'] == '') {
			msg.payload['X-S4-Location'] = config.alertS4Location;
		}
		if (msg.payload['X-S4-Location'] != '') {
			data += "------Boundary-cc2050af-c42f-4cda-a0c3-ede7eaa89513\r\n";
			data += "Content-Disposition: form-data; name=\"X-S4-Location\"\r\n\r\n";
			data += msg.payload['X-S4-Location'] + "\r\n";
		}

		// X-S4-AlertingScenario
		if (msg.payload['X-S4-AlertingScenario'] == undefined) {
			msg.payload['X-S4-AlertingScenario'] = '';
		}
		if (msg.payload['X-S4-AlertingScenario'] == '') {
			msg.payload['X-S4-AlertingScenario'] = config.alertS4AlertingScenario;
		}
		if (msg.payload['X-S4-AlertingScenario'] != '') {
		  data += "------Boundary-cc2050af-c42f-4cda-a0c3-ede7eaa89513\r\n";
		  data += "Content-Disposition: form-data; name=\"X-S4-AlertingScenario\"\r\n\r\n";
		  data += msg.payload['X-S4-AlertingScenario'] + "\r\n";
		}
		
		// X-S4-Filtering
		if (msg.payload['X-S4-Filtering'] == undefined) {
			msg.payload['X-S4-Filtering'] = config.alertS4Filtering;;
		}
		data += "------Boundary-cc2050af-c42f-4cda-a0c3-ede7eaa89513\r\n";
		data += "Content-Disposition: form-data; name=\"X-S4-Filtering\"\r\n\r\n";
		data += msg.payload['X-S4-Filtering'] + "\r\n";

		// X-S4-ExternalID
		if (msg.payload['X-S4-ExternalID'] == undefined) {
			msg.payload['X-S4-ExternalID'] = '';
		}
		if (msg.payload['X-S4-ExternalID'] == '') {
			msg.payload['X-S4-ExternalID'] = config.alertS4ExternalID;
		}
		if (msg.payload['X-S4-ExternalID'] != '') {
			data += "------Boundary-cc2050af-c42f-4cda-a0c3-ede7eaa89513\r\n";
			data += "Content-Disposition: form-data; name=\"X-S4-ExternalID\"\r\n\r\n";
			data += msg.payload['X-S4-ExternalID'] + "\r\n";
		}

		// Status
		data += "------Boundary-cc2050af-c42f-4cda-a0c3-ede7eaa89513\r\n";
		data += "Content-Disposition: form-data; name=\"X-S4-Status\"\r\n\r\n";
		data += "new\r\n";

		// Source System
		data += "------Boundary-cc2050af-c42f-4cda-a0c3-ede7eaa89513\r\n";
		data += "Content-Disposition: form-data; name=\"X-S4-SourceSystem\"\r\n\r\n";
		data += "NodeRED\r\n";

		// Attachment support
		if (msg.payload['attachmentBase64Content1'] != undefined) {
			if (msg.payload['attachmentMimeType1'] != undefined) {
				msg.payload['attachmentMimeType1'] = 'image/jpeg';
			}
			var strFileExtension = getFileExtension(msg.payload['attachmentMimeType1']);

			data += "------Boundary-cc2050af-c42f-4cda-a0c3-ede7eaa89513\r\n";
			data += "Content-Disposition: form-data; name=\"Attachment1\"; filename=\"Attachment1." + strFileExtension + "\"\r\n";
			data += "Content-Type: " + msg.payload['attachmentMimeType1'] + "\r\n";
			data += "Content-Transfer-Encoding: base64\r\n\r\n";
			data += msg.payload['attachmentBase64Content1'] + "\r\n";
		}
		if (msg.payload['attachmentBase64Content2'] != undefined) {
			if (msg.payload['attachmentMimeType2'] != undefined) {
				msg.payload['attachmentMimeType2'] = 'image/jpeg';
			}
			var strFileExtension = getFileExtension(msg.payload['attachmentMimeType2']);
			data += "------Boundary-cc2050af-c42f-4cda-a0c3-ede7eaa89513\r\n";
			data += "Content-Disposition: form-data; name=\"Attachment2\"; filename=\"Attachment2." + strFileExtension + "\"\r\n";
			data += "Content-Type: " + msg.payload['attachmentMimeType2'] + "\r\n";
			data += "Content-Transfer-Encoding: base64\r\n\r\n";
			data += msg.payload['attachmentBase64Content2'] + "\r\n";
		}
		
		// Read additional payload
		for (const [key, value] of Object.entries(msg.payload)) {
			// node.log(`${key}: ${value}`);
			
			var listParameters = ["Subject", "Body", "X-S4-Service", "X-S4-Location", "X-S4-AlertingScenario", "X-S4-Filtering", "X-S4-ExternalID", "X-S4-Status", "X-S4-SourceSystem", "attachmentBase64Content1", "attachmentMimeType1", "attachmentBase64Content2", "attachmentMimeType2"];
			if( listParameters.indexOf(key) == -1 ) {
				data += "------Boundary-cc2050af-c42f-4cda-a0c3-ede7eaa89513\r\n";
				data += "Content-Disposition: form-data; name=\"" + key + "\"\r\n\r\n";
				data += value + "\r\n";
			}
		}
		
		data += "------Boundary-cc2050af-c42f-4cda-a0c3-ede7eaa89513--\r\n";

		// Send alert
		// msg.payload = msg.payload.toLowerCase();
		sendSIGNL4Alert(node, config.teamSecret, data, 'multipart/form-data; boundary=----Boundary-cc2050af-c42f-4cda-a0c3-ede7eaa89513');

		if (node.done) {
			node.done();
		}
		
		node.send({payload:'OK', statusCodenumber: 201});

        });
	}
	RED.nodes.registerType("SIGNL4", SIGNL4);

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
				'X-S4-ExternalID': '',
				'X-S4-SourceSystem': 'NodeRED'
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
		sendSIGNL4Alert(node, config.teamSecret, JSON.stringify(msg.payload), 'application/json');

		if (node.done) {
			node.done();
		}
		
		node.send({payload:'OK', statusCodenumber: 201});

        });
	}	
	RED.nodes.registerType("SIGNL4 Resolve", SIGNL4Resolve);

	function sendSIGNL4Alert(node, teamsecret, body, content_type) {
		
		try {

			// Send the HTTP POST request to SIGNL4
			const https = require('https');
			var options = {
				hostname: 'connect.signl4.com',
				path: '/webhook/' + teamsecret,
				method: 'POST',
				headers: {
					'Content-Type': content_type
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
						node.log('SIGNL4 alert failed. Status code: ' + res.statusCode);
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

			req.write(body);
			req.end();

		} catch (error) {
			// Error
			node.error("SIGNL4 alert failed: " + err.message);
			var msg = { payload: { error: 'SIGNL4 alert failed: ' + err.message }};
			node.error(msg);
		}
    }
	
	function getFileExtension(strMimeType) {
		
		var strFileExtension = "";

		strFileExtension = strMimeType.slice(strMimeType.lastIndexOf('/') + 1);
		
		return strFileExtension;
	}
}
