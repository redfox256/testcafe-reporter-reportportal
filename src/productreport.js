require('dotenv').config();
const baseUrl = process.env.REPORT_PORTAL_BASE_URL + '/api/v1';

const RPClient = require('reportportal-client');

export default class ProductReport {

    constructor() {
        this.launchName = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
        this.rpClient = new RPClient({
            token : process.env.REPORT_PORTAL_TOKEN,
            endpoint : baseUrl,
            launch : this.launchName,
            project : process.env.REPORT_PORTAL_PROJECT_NAME
        });

        this.rpClient.checkConnect().then((response) => {
            console.log('You have successfully connected to the server.');
            console.log(`You are using an account: ${response.full_name}`);
        }, (error) => {
            console.log('Error connection to server');
            console.dir(error);
        });
    }

    startLaunch() {
        const launchObj = this.rpClient.startLaunch({
            name: this.launchName,
            start_time: this.rpClient.helpers.now()
        });

        return launchObj.tempId;
    }

    captureFixtureItem(launchId, fixtureName) {
        const suiteObj = this.rpClient.startTestItem({
            name: fixtureName,
            start_time: this.rpClient.helpers.now(),
            type: 'SUITE'
        }, launchId);

        return suiteObj.tempId;
    }

    captureTestItem(launchId, fixtureId, stepName, status) {
        const stepObj = this.rpClient.startTestItem({
            name: stepName,
            start_time: this.rpClient.helpers.now(),
            tags: ['step_tag', 'step_tag2', 'step_tag3'],
            type: 'STEP'
        }, launchId, fixtureId);

        this.rpClient.finishTestItem(stepObj.tempId, {
            status: status
        });
    }

    finishLaunch(launchId) {
        this.rpClient.finishLaunch(launchId, {
            end_time: this.rpClient.helpers.now()
        });
    }

}
