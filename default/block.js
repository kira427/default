'use strict';

// Генератор файлов блока

// Использование: node block.js [имя блока] [доп. расширения через пробел]

const fs = require('fs');                // будем работать с файловой системой
const pjson = require('./package.json'); // получим настройки из package.json
const dirs = pjson.config.directories;   // отдельно имеем объект с директориями (где лежаи папка с блоками)
const mkdirp = require('mkdirp');        // зависимость

let blockName = process.argv[2];          // получим имя блока
let defaultExtensions = ['scss', 'html']; // расширения по умолчанию
let extensions = uniqueArray(defaultExtensions.concat(process.argv.slice(3)));  // добавим введенные при вызове расширения (если есть)

// Если есть имя блока
if(blockName) {

    let dirPath = dirs.source + '/blocks/' + blockName + '/'; // полный путь к создаваемой папке блока
    mkdirp(dirPath, function(err){                            // создаем

        // Если какая-то ошибка — покажем
        if(err) {
            console.error('[NTH] Отмена операции: ' + err);
        }

        // Нет ошибки, поехали!
        else {
            console.log('[NTH] Создание папки ' + dirPath + ' (создана, если ещё не существует)');

            // Читаем файл диспетчера подключений
            let connectManager = fs.readFileSync(dirs.source + '/scss/style.scss', 'utf8');

            // Делаем из строк массив, фильтруем массив, оставляя только строки с незакомментированными импортами
            let fileSystem = connectManager.split('\n').filter(function(item) {
                if(/^(\s*)@import/.test(item)) return true;
                else return false;
            });

            // Обходим массив расширений и создаем файлы, если они еще не созданы
            extensions.forEach(function(extention){

                let filePath = dirPath + blockName + '.' + extention; // полный путь к создаваемому файлу
                let fileContent = '';                                 // будущий контент файла
                let SCSSfileImport = '';                              // конструкция импорта будущего SCSS
                let fileCreateMsg = '';                               // будущее сообщение в консоли при создании файла

                // Если это SCSS
                if(extention == 'scss') {
                    SCSSfileImport = "@import \"" + "../blocks/" + blockName + "/" + blockName + ".scss\";";
                    fileContent = '@import \"../../scss/variables.scss\";   \n@import \"../../scss/mixins.scss\";  \n\n.' + blockName + ' {\n  \n}\n';
                    // fileCreateMsg = '[NTH] Для импорта стилей: ' + SCSSfileImport;

                    // Создаем  регулярку с импортом
                    let reg = new RegExp(SCSSfileImport, '');

                    // Создадим флаг отсутствия блока среди импортов
                    let impotrtExist = false;

                    // Обойдём массив и проверим наличие импорта
                    for (var i = 0, j=fileSystem.length; i < j; i++) {
                        if(reg.test(fileSystem[i])) {
                            impotrtExist = true;
                            break;
                        }
                    }

                    // Если флаг наличия импорта по-прежнему опущен, допишем импорт
                    if(!impotrtExist) {
                        // Открываем файл
                        fs.open(dirs.source + '/scss/style.scss', 'a', function(err, fileHandle) {
                            // Если ошибок открытия нет...
                            if (!err) {
                                // Запишем в конец файла
                                fs.write(fileHandle, SCSSfileImport + '\n', null, 'utf8', function(err, written) {
                                    if (!err) {
                                        console.log('[NTH] В диспетчер подключений ('+ dirs.source + '/scss/style.scss) записано: ' + SCSSfileImport);
                                    } else {
                                        console.log('[NTH] ОШИБКА записи в '+ dirs.source + '/scss/style.scss: ' + err);
                                    }
                                });
                            } else {
                                console.log('[NTH] ОШИБКА открытия '+ dirs.source + '/scss/style.scss: ' + err);
                            }
                        });
                    }
                    else {
                        console.log('[NTH] Импорт НЕ прописан в '+ dirs.source + '/scss/style.scss (он там уже есть)');
                    }
                }

                // Если это html
                else if(extention == 'html') {
                    fileContent = '<div class="' + blockName + '">\n\n</div>\n';
                    fileCreateMsg = '[NTH] Для вставки разметки: @@include(\'blocks/' + blockName + '/' + blockName + '.html\') Подробнее: https://www.npmjs.com/package/gulp-file-include';
                }

                // Если это JS
                else if(extention == 'js') {
                    fileContent = '// (function(){\n// код\n// }());\n';
                }

                // Если нужна подпапка для картинок
                else if(extention == 'img') {
                    let imgFolder = dirPath + 'img/';
                    if(fileExist(imgFolder) === false) {
                        mkdirp(imgFolder, function (err) {
                            if (err) console.error(err)
                            else console.log('[NTH] Папка создана: ' + imgFolder)
                        });
                    }
                    else {
                        console.log('[NTH] Папка НЕ создана (уже существует) ')
                    }
                }

                // Создаем файл, если он еще не существует
                if(fileExist(filePath) === false && extention !== 'img') {
                    fs.writeFile(filePath, fileContent, function(err) {
                        if(err) {
                            return console.log('[NTH] Файл НЕ создан: ' + err);
                        }
                        console.log('[NTH] Файл создан: ' + filePath);
                        if(fileCreateMsg) {
                            console.warn(fileCreateMsg);
                        }
                    });
                }
                else if(extention !== 'img') {
                    console.log('[NTH] Файл НЕ создан: ' + filePath + ' (уже существует)');
                }
            });
        }
    });
}
else {
    console.log('[NTH] Отмена операции: не указан блок');
}

// Оставить в массиве только уникальные значения (убрать повторы)
function uniqueArray(arr) {
    var objectTemp = {};
    for (var i = 0; i < arr.length; i++) {
        var str = arr[i];
        objectTemp[str] = true; // запомнить строку в виде свойства объекта
    }
    return Object.keys(objectTemp);
}

// Проверка существования файла
function fileExist(path) {
    const fs = require('fs');
    try {
        fs.statSync(path);
    } catch(err) {
        return !(err && err.code === 'ENOENT');
    }
}