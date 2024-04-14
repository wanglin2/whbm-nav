const { exec } = require('child_process');
const path = require('path')
const fs = require('fs')
const process = require('process')

// 获取组件列表
const getComps = () => {
    let res = []
    let files = fs.readdirSync(__dirname)
    files.forEach((filename) => {
        // 是否是目录
        let dir = path.join(__dirname, filename)
        let isDir = fs.statSync(dir).isDirectory
        // 入口文件是否存在
        let entryFile = path.join(dir, 'index.js')
        let entryExist = fs.existsSync(entryFile)
        if (isDir && entryExist) {
            res.push(filename)
        }
    })
    return res
}

// 打包所有组件
const buildAll = () => {
    let compList = getComps()
    let taskList = compList.map((comp) => {
        return new Promise((resolve, reject) => {
            exec(`vue-cli-service build --target lib --dest dist_applets/${comp} --name comp --entry src/applets/${comp}/index.js`, (error, stdout, stderr) => {
                if (error) {
                    reject(error)
                } else {
                    console.log(comp + ' 组件打包完成');
                    resolve()
                }
            })
        });
    })
    Promise.all(taskList)
        .then(() => {
            console.log('所有组件打包完成');
        })
        .catch((e) => {
            console.error('打包失败');
            console.error(e);
        })
}

if (process.argv[2]) {
    let comp = process.argv[2]
    exec(`vue-cli-service build --target lib --dest dist_applets/${comp} --name comp --entry src/applets/${comp}/index.js`, (error) => {
        if (error) {
            console.log(comp + ' 组件打包失败');
        } else {
            console.log(comp + ' 组件打包完成');
        }
    })
} else {
    buildAll()
}