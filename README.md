# SIGNL4 – Mobile Alerting and Incident Response for Node-RED

Turn Node-RED events into reliable mobile alerts and fast human action.

A machine overheats, a cold storage temperature rises, a server goes offline or an AI-enabled camera detects a person in a restricted area. Node-RED detects and processes the event – SIGNL4 makes sure the right people are notified and can respond, even when nobody is watching the dashboard.

[SIGNL4](https://www.signl4.com/) adds critical mobile alerting, incident response and on-call scheduling to your Node-RED flows, from Raspberry Pi projects to industrial automation and enterprise IT operations.

## Features and benefits

- **Reliable mobile alerting:** Persistent app push notifications, SMS and voice calls.
- **Automatic escalation:** Notify additional responders if an alert remains unacknowledged.
- **On-call scheduling:** Route alerts to the right people based on duty and shift schedules.
- **Mobile incident response:** Acknowledge, annotate, track and resolve alerts from your smartphone.
- **Rich alert context:** Include sensor readings, equipment details, links, GPS locations and camera snapshots.
- **Alert lifecycle management:** Automatically resolve alerts when the monitored condition returns to normal.
- **Two-way workflows:** Use SIGNL4 outbound webhooks and remote actions with Node-RED HTTP endpoints to trigger follow-up processes.

Features and notification channels depend on your SIGNL4 subscription and configuration.

## Use cases

- **Industrial automation (OT):** Machine failures, abnormal temperatures, pressure or vibration readings from PLCs, SCADA systems or MQTT devices.
- **IoT and edge computing:** Sensor threshold violations, disconnected devices, water leaks or cold chain monitoring.
- **IT operations:** Server outages, failed services, network issues or failed automation jobs.
- **AI and computer vision:** Person or object detection, quality inspection failures or unusual activity.
- **Smart buildings and home automation:** HVAC failures, power outages, flooding or door alerts.

## Installation

### Node-RED Palette Manager

1. Open the Node-RED editor.
2. Select **Manage palette** from the main menu.
3. Open the **Install** tab and search for `node-red-contrib-signl4`.
4. Install the package.

### npm

Alternatively, run the following command in your Node-RED user directory (typically `~/.node-red`):

```bash
npm install node-red-contrib-signl4
```

Restart Node-RED after installation.

## Getting started

1. Create a SIGNL4 account at [signl4.com](https://www.signl4.com/) and set up your team.
2. Obtain your team's integration secret (Team Secret) from SIGNL4.
3. Add a **SIGNL4** node to your Node-RED flow and open its configuration.
4. Enter the Team Secret and optionally configure default alert parameters.
5. Connect an Inject node or your existing event source to the SIGNL4 node.
6. Deploy the flow and trigger a test alert. Check the SIGNL4 app and your configured notification channels.

The node sends events via outbound HTTPS to `connect.signl4.com` (TCP port 443). Keep your Team Secret private and remove it from any flows you share or export publicly.

## Node: SIGNL4

The SIGNL4 node creates an alert for your team. SIGNL4 handles notification delivery, on-call routing and escalation according to your team's configuration.

### Input

Pass a JavaScript object in `msg.payload`. Values supplied in the message can override the defaults configured in the node. Additional properties can be used to provide context as alert fields; use simple scalar values or stringify complex data before sending.

Example JSON payload for a machine temperature alert:

```json
{
  "Subject": "Machine A2 – Temperature too high",
  "Body": "Motor temperature exceeds the configured threshold.",
  "Machine": "A2",
  "Temperature": "95 °C",
  "Threshold": "80 °C",
  "X-S4-Service": "Production",
  "X-S4-Location": "52.3984235,13.0544149",
  "X-S4-AlertingScenario": "single_ack",
  "X-S4-Filtering": false,
  "X-S4-ExternalID": "machine-a2-temperature"
}
```

### Alert parameters

All parameters below are properties of `msg.payload`.

| Parameter | Description |
| --- | --- |
| `Subject` | Alert title. |
| `Body` | Alert message. |
| `X-S4-Service` | Name of the SIGNL4 service or system category to associate with the alert. |
| `X-S4-Location` | Coordinates as `latitude,longitude` for displaying the location on a map. |
| `X-S4-AlertingScenario` | `single_ack` for acknowledgement by one responder, or `multi_ack` for acknowledgement by all required on-duty responders. |
| `X-S4-Filtering` | Boolean controlling whether SIGNL4 service/category keyword filtering is applied. |
| `X-S4-ExternalID` | Identifier from the source system for correlating alerts, status updates and resolution events. |
| `attachmentBase64Content1` | Optional first attachment, encoded as Base64. |
| `attachmentMimeType1` | MIME type of the first attachment (use `image/jpeg` with the current implementation). |
| `attachmentBase64Content2` | Optional second attachment, encoded as Base64. |
| `attachmentMimeType2` | MIME type of the second attachment (use `image/jpeg` with the current implementation). |

In a Function node, use bracket notation for properties containing hyphens, for example `msg.payload["X-S4-ExternalID"]`.

### Camera snapshots

For example, if the incoming `msg.payload` is a Buffer containing a JPEG snapshot, a Function node can prepare the alert as follows:

```javascript
const snapshot = msg.payload;
msg.payload = {
    Subject: "Person detected in restricted area",
    Body: "Check the attached camera snapshot.",
    attachmentBase64Content1: snapshot.toString("base64"),
    attachmentMimeType1: "image/jpeg"
};
return msg;
```

Connect the Function node to the SIGNL4 node.

## Node: SIGNL4 Resolve

Use the **SIGNL4 Resolve** node to close a previously raised alert when the underlying issue has been resolved.

Configure the same Team Secret and send the same external ID that was used when creating the alert:

```json
{
  "X-S4-ExternalID": "machine-a2-temperature"
}
```

For example, a Node-RED flow can raise an alert when a machine exceeds its temperature threshold and resolve it when the temperature returns to normal. Use a stable external ID for each monitored condition and consider hysteresis or an RBE (report by exception) node to avoid repeated alerts.

## Outputs and error handling

Both nodes provide output messages that can be connected to a Debug node or used in subsequent processing.

In the current implementation, an immediate output with `msg.payload` set to `OK` is followed by the webhook response body as a string when the server accepts the request. The immediate output alone does not confirm successful delivery. A successful webhook response may contain an event ID, for example:

```json
{
  "eventId": "2518287496003329336_737e2711-fe38-469b-b1dc-f812eac5cc35"
}
```

Parse the response string as JSON if you need to access the event ID. Use a Catch node and the Node-RED logs to inspect errors reported by the nodes. For production use, also consider independent delivery monitoring and retry handling in your flow.

## Two-way integration and remote actions

The two SIGNL4 nodes send events to SIGNL4. For workflows in the opposite direction, use Node-RED's built-in HTTP In and HTTP Response nodes together with SIGNL4 outbound webhooks or remote actions.

Examples include synchronizing alert acknowledgements with another system, creating or updating a service ticket, enriching incidents with additional information, or triggering an authorized remediation workflow directly from the SIGNL4 app.

Ensure the receiving endpoint is reachable from SIGNL4, appropriately authenticated and protected. Validate incoming requests before triggering any actions.

## Troubleshooting

- Verify that the Team Secret is correct and belongs to the intended team.
- Check outbound HTTPS connectivity from the Node-RED runtime.
- Confirm that team members are on duty and that notification and escalation settings are configured.
- If filtering is enabled, check whether the event matches a configured service or category.
- If an alert does not resolve, verify that both nodes use the same Team Secret and external ID.

## Resources

- [Get started with SIGNL4](https://www.signl4.com/)
- [SIGNL4 integration guide for Node-RED](https://docs.signl4.com/integrations/node-red/)
- [SIGNL4 documentation](https://docs.signl4.com/)
- [Node-RED Flow Library](https://flows.nodered.org/node/node-red-contrib-signl4)
- [GitHub repository and issue tracker](https://github.com/signl4/node-red-contrib-signl4)

## License

MIT – see the [LICENSE](https://github.com/signl4/node-red-contrib-signl4/blob/master/LICENSE) file.
