const ProductReport = require('./productreport');

export default function () {
    return {
        noColors: false,
        
        reportTaskStart (startTime, userAgents, testCount) {
            this.startTime = startTime;
            this.testCount = testCount;
        
            this.write(`Running tests in: ${userAgents}`)
                .newline()
                .newline();
                
            this.productReport = new ProductReport();
            this.launchId = this.productReport.startLaunch();
        },
        
        reportFixtureStart (name) {
            this.currentFixtureName = name;
            this.fixtureId = this.productReport.captureFixtureItem(this.launchId, this.currentFixtureName);
        },
        
        reportTestDone (name, testRunInfo) {
            const hasErr = !!testRunInfo.errs.length;
            const result = testRunInfo.skipped ? 'skipped' : hasErr ? 'passed' : 'failed';
        
            const fixtureName = `${this.currentFixtureName} - ${name}`;
        
            let title = `${result} ${fixtureName}`;
        
            if (testRunInfo.unstable)
                title += ' (unstable)';
        
            if (testRunInfo.screenshotPath)
                title += ` (screenshots: ${testRunInfo.screenshotPath})`;
        
            this.write(title)
                .newline();

            this.productReport.captureTestItem(this.launchId, this.fixtureId, name, result);
        },
        
        reportTaskDone (endTime, passed) {
            const durationMs  = endTime - this.startTime;
            const durationStr = this.moment
                                    .duration(durationMs)
                                    .format('h[h] mm[m] ss[s]');

            let footer = passed === this.testCount ?
                         `${this.testCount} passed` :
                         `${this.testCount - passed}/${this.testCount} failed`;
        
            footer += ` (Duration: ${durationStr})`;
        
            this.write(footer)
                .newline();

            this.productReport.finishLaunch(this.launchId);
        }
    };
}
