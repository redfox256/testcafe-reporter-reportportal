const chalk = require('chalk');
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
            const result = testRunInfo.skipped ? 'skipped' : hasErr ? 'failed' : 'passed';
        
            const fixtureName = `${this.currentFixtureName} - ${name}`;
        
            const title = `[ ${result === 'passed' ? chalk.green.bold('✓') : chalk.red.bold('✖')} ] ${fixtureName}`;
        
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
        
            this.newline()
                .write(footer)
                .newline();

            this.productReport.finishLaunch(this.launchId);
        }
    };
}
