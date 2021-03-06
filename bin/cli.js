#!/usr/bin/env node
const program = require('commander'), fs = require('fs'), inq = require('inquirer'),projectTool = require('../src/project.js'),execSync = require('child_process').execSync;

const packageJson = JSON.parse(fs.readFileSync('./package.json'));

async function run() {
    program.version(packageJson.version);
    program.command('init').description('初始化项目,生成projects.json').action(async ()=>{
        if(fs.existsSync(process.cwd() + '/projects.json')){
            let res = await inq.prompt({
                type: 'confirm',
                name: 'init',
                message: '已初始化过，是否继续初始化，将清空配置文件'
            });
            if(!res.init) return;
        }
        fs.writeFileSync(process.cwd() + '/projects.json', fs.readFileSync(__dirname + '/../template/projects.json.sample'));
        fs.writeFileSync(process.cwd() + '/tsconfig.json', fs.readFileSync(__dirname + '/../template/tsconfig.json.sample'));
        fs.mkdirSync(process.cwd() + '/src/common', { recursive: true });
        fs.writeFileSync(process.cwd() + '/src/common/index.ts', fs.readFileSync(__dirname + '/../template/common.index.ts.sample'));
        fs.mkdirSync(process.cwd() + '/src/projects', { recursive: true });
        await projectTool.addProject();
    });
    program.command('run').description('执行项目').option('-m, --mode [value]', '指定运行模式,dev(开发调试)|build(构建部署)|batch(批量构建部署)', 'dev').action(async (cmdObj)=>{
        // await gulpRunner.asyncRun(cmdObj.mode);
        execSync(`node ${__dirname}/gulp_cli.js --gulpfile ${__dirname}/../src/gulpfile.js --cwd ${process.cwd()} ${cmdObj.mode}`, {stdio:[0,1,2]});
    });
    program.parseAsync(process.argv);
}
run().catch(console.error);