import {existsSync} from 'node:fs';
import {spawnSync} from 'node:child_process';
const isWin=process.platform==='win32';
function run(command,args){const r=spawnSync(command,args,{stdio:'inherit',shell:isWin});if(r.status!==0)process.exit(r.status??1);}
if(!existsSync('android'))run('npx',['cap','add','android']);
run('npx',['cap','sync','android']);
const gradle=isWin?'android\\gradlew.bat':'./android/gradlew';
run(gradle,['-p','android','assembleDebug']);
console.log('APK gerado em android/app/build/outputs/apk/debug/app-debug.apk');
