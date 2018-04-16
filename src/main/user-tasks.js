module.exports = {
  init
}

const electron = require('electron')

const app = electron.app

/**
 * Add a user task menu to the app icon on right-click. (Windows)
 */
function init () {
  if (process.platform !== 'win32') return
  app.setUserTasks(getUserTasks())
}

function getUserTasks () {
  return [
    {
      arguments: '-n',
      title: '创建新Torrent...',
      description: 'Create a new torrent'
    },
    {
      arguments: '-o',
      title: '打开Torrent文件...',
      description: 'Open a .torrent file'
    },
    {
      arguments: '-u',
      title: '打开Torrent路径...',
      description: 'Open a torrent from a URL'
    }
  ].map(getUserTasksItem)
}

function getUserTasksItem (item) {
  return Object.assign(item, {
    program: process.execPath,
    iconPath: process.execPath,
    iconIndex: 0
  })
}
