const { build } = require('esbuild');

const args = require('minimist')(process.argv.slice(2)) //node scripts/dev.js reactivity -f global
//这里minimist是用来解析命令行参数
//console.log(args);
const target = args[0] || 'reactivity';
const format = args.f || 'global';

//开发环境只打包某一个
const pkg = require(resolve(__dirname, `../packages/${target}/package.json`));


//iife 立即执行函数 (function(){})()
//cjs node中的模块 module.exports
//esm 浏览器中的esModule模块 import
const outputFormat = format.startsWith('global') ? 'iife' : format === 'cjs' ? 'cjs' : 'esm'

const outfile = resolve(__dirname, `../packages/${target}/dist/${target}.${format}.js`)


build({
    entryPoints: [resolve(__dirname, `../packages/${target}/src/index.ts`)],
    outfile,
    bundle: true, //所有包打到一起
    sourcemap: true,
    format: outputFormat, //输出的格式
    globalName: pkg.buildOption?.name, //打包的全局的名字
    platform: format === 'cjs' ? 'node' : 'browser', //平台
    watch:{  //监控文件的变化
        onRebuild(error){
            if(!error) console.log('rebuilt~~~~')
        }
    }
}).then(()=>{
    console.log('watching')
})