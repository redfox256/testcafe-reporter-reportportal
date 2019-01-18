require('dotenv').config();
const fs = require('fs');
const baseUrl = process.env.REPORT_PORTAL_BASE_URL + '/api/v1';

const RPClient = require('reportportal-client');

export default class ProductReport {

    constructor() {
        this.projectName = process.env.REPORT_PORTAL_PROJECT_NAME;
        this.date = new Date();
        this.launchName = `${this.projectName} [${this.date.toLocaleDateString()} ${this.date.toLocaleTimeString()}]`;
        this.fixtureList = [];

        this.rpClient = new RPClient({
            token : process.env.REPORT_PORTAL_TOKEN,
            endpoint : baseUrl,
            launch : this.launchName,
            project : this.projectName
        });

        this.rpClient.checkConnect().then((response) => {
            // console.log('You have successfully connected to the server.');
            // console.log(`You are using an account: ${response.full_name}`);
        }, (error) => {
            console.log('Error connecting to ReportPortal, confirm that your details are correct.');
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

        this.fixtureList.push(suiteObj.tempId);
        return suiteObj.tempId;
    }

    captureTestItem(launchId, fixtureId, stepName, status, testRunInfo, parentSelf) {

        console.log('start -> ', this.rpClient.helpers.now() - testRunInfo.durationMs);
        console.log('end -> ', this.rpClient.helpers.now());


        const stepObj = this.rpClient.startTestItem({
            name: stepName,
            start_time: this.rpClient.helpers.now() - testRunInfo.durationMs,
            type: 'STEP'
        }, launchId, fixtureId);

        if (testRunInfo.errs) {
            testRunInfo.errs.forEach((err, idx) => {
                err = parentSelf.formatError(err, `${idx + 1}) `);

                if (err) {
                    this.rpClient.sendLog(stepObj.tempId, {
                        status: 'error',
                        message: err,
                        time: this.rpClient.helpers.now()
                    });
                }
                
            });
        }

        if (testRunInfo.screenshots) {
            for (const screenshots of testRunInfo.screenshots) {
                console.log('screenshotPath -> ', screenshots.screenshotPath);

                const screenshotContent = fs.readFileSync(screenshots.screenshotPath);

                this.rpClient.sendLog(stepObj.tempId, {
                    name: `${stepName}.png`,
                    type: 'image/png',
                    content: screenshotContent
                });
            }
        }

        this.rpClient.finishTestItem(stepObj.tempId, {
            end_time: this.rpClient.helpers.now(),
            status: status
        });
    }

    finishFixture() {
        for (const fixtureId of this.fixtureList) {
            this.rpClient.finishTestItem(fixtureId, {
                end_time: this.rpClient.helpers.now()
            });
        }
    }

    finishLaunch(launchId) {
        this.finishFixture();
        this.rpClient.finishLaunch(launchId, {
            end_time: this.rpClient.helpers.now()
        });
    }

}
