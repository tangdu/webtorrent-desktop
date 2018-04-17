module.exports = {
  init,
  toggle播放Controls,
  setWindowFocus,
  setAllowNav,
  onPlayerUpdate,
  onToggleAlwaysOnTop,
  onToggleFullScreen
}

const electron = require('electron')

const app = electron.app

const config = require('../config')
const windows = require('./windows')

let menu = null

function init () {
  menu = electron.Menu.buildFromTemplate(getMenuTemplate())
  electron.Menu.setApplicationMenu(menu)
}

function toggle播放Controls (flag) {
  getMenuItem('播放/暂停').enabled = flag
  getMenuItem('下一个').enabled = flag
  getMenuItem('上一个').enabled = flag
  getMenuItem('增大音量').enabled = flag
  getMenuItem('减小音量').enabled = flag
  getMenuItem('前进').enabled = flag
  getMenuItem('倒退').enabled = flag
  getMenuItem('增加速度').enabled = flag
  getMenuItem('减少速度').enabled = flag
  getMenuItem('添加字幕文件...').enabled = flag

  if (flag === false) {
    getMenuItem('下一个').enabled = false
    getMenuItem('上一个').enabled = false
  }
}

function onPlayerUpdate (hasNext, hasPrevious) {
  getMenuItem('下一个').enabled = hasNext
  getMenuItem('上一个').enabled = hasPrevious
}

function setWindowFocus (flag) {
  getMenuItem('全屏').enabled = flag
  getMenuItem('窗口前置').enabled = flag
}

// Disallow opening more screens on top of the current one.
function setAllowNav (flag) {
  getMenuItem('配置').enabled = flag
  if (process.platform === 'darwin') {
    getMenuItem('创建新Torrent...').enabled = flag
  } else {
    getMenuItem('创建新Torrent来自文件夹...').enabled = flag
    getMenuItem('创建新Torrent来自文件...').enabled = flag
  }
}

function onToggleAlwaysOnTop (flag) {
  getMenuItem('窗口前置').checked = flag
}

function onToggleFullScreen (flag) {
  getMenuItem('全屏').checked = flag
}

function getMenuItem (label) {
  for (let i = 0; i < menu.items.length; i++) {
    const menuItem = menu.items[i].submenu.items.find(function (item) {
      return item.label === label
    })
    if (menuItem) return menuItem
  }
}

function getMenuTemplate () {
  const template = [
    {
      label: '文件',
      submenu: [
        {
          label: process.platform === 'darwin'
            ? '创建新Torrent...'
            : '创建新Torrent来自文件夹...',
          accelerator: 'CmdOrCtrl+N',
          click: () => {
            const dialog = require('./dialog')
            dialog.openSeedDirectory()
          }
        },
        {
          label: '打开Torrent文件...',
          accelerator: 'CmdOrCtrl+O',
          click: () => {
            const dialog = require('./dialog')
            dialog.openTorrentFile()
          }
        },
        {
          label: '打开Torrent路径...',
          accelerator: 'CmdOrCtrl+U',
          click: () => {
            const dialog = require('./dialog')
            dialog.openTorrentAddress()
          }
        },
        {
          type: 'separator'
        },
        {
          role: 'close'
        }
      ]
    },
    {
      label: '编辑',
      submenu: [
        {
          role: 'undo'
        },
        {
          role: 'redo'
        },
        {
          type: 'separator'
        },
        {
          role: 'cut'
        },
        {
          role: 'copy'
        },
        {
          label: 'Parse Torrent',
          role: 'paste'
        },
        {
          role: 'delete'
        },
        {
          role: 'selectall'
        }
      ]
    },
    {
      label: '视图',
      submenu: [
        {
          label: '全屏',
          type: 'checkbox',
          accelerator: process.platform === 'darwin'
            ? 'Ctrl+Command+F'
            : 'F11',
          click: () => windows.main.toggleFullScreen()
        },
        {
          label: '窗口前置',
          type: 'checkbox',
          click: () => windows.main.toggleAlwaysOnTop()
        },
        {
          type: 'separator'
        },
        {
          label: '返回',
          accelerator: 'Esc',
          click: () => windows.main.dispatch('escapeBack')
        },
        {
          type: 'separator'
        },
        {
          label: '开发者',
          submenu: [
            {
              label: '开发者工具',
              accelerator: process.platform === 'darwin'
                ? 'Alt+Command+I'
                : 'Ctrl+Shift+I',
              click: () => windows.main.toggleDevTools()
            },
            {
              label: '显示WebTorrent进程',
              accelerator: process.platform === 'darwin'
                ? 'Alt+Command+P'
                : 'Ctrl+Shift+P',
              click: () => windows.webtorrent.toggleDevTools()
            }
          ]
        }
      ]
    },
    {
      label: '播放',
      submenu: [
        {
          label: '播放/暂停',
          accelerator: 'Space',
          click: () => windows.main.dispatch('playPause'),
          enabled: false
        },
        {
          type: 'separator'
        },
        {
          label: '下一个',
          accelerator: 'N',
          click: () => windows.main.dispatch('nextTrack'),
          enabled: false
        },
        {
          label: '上一个',
          accelerator: 'P',
          click: () => windows.main.dispatch('previousTrack'),
          enabled: false
        },
        {
          type: 'separator'
        },
        {
          label: '增大音量',
          accelerator: 'CmdOrCtrl+Up',
          click: () => windows.main.dispatch('changeVolume', 0.1),
          enabled: false
        },
        {
          label: '减小音量',
          accelerator: 'CmdOrCtrl+Down',
          click: () => windows.main.dispatch('changeVolume', -0.1),
          enabled: false
        },
        {
          type: 'separator'
        },
        {
          label: '前进',
          accelerator: process.platform === 'darwin'
            ? 'CmdOrCtrl+Alt+Right'
            : 'Alt+Right',
          click: () => windows.main.dispatch('skip', 10),
          enabled: false
        },
        {
          label: '倒退',
          accelerator: process.platform === 'darwin'
            ? 'CmdOrCtrl+Alt+Left'
            : 'Alt+Left',
          click: () => windows.main.dispatch('skip', -10),
          enabled: false
        },
        {
          type: 'separator'
        },
        {
          label: '增加速度',
          accelerator: 'CmdOrCtrl+=',
          click: () => windows.main.dispatch('change播放Rate', 1),
          enabled: false
        },
        {
          label: '减少速度',
          accelerator: 'CmdOrCtrl+-',
          click: () => windows.main.dispatch('change播放Rate', -1),
          enabled: false
        },
        {
          type: 'separator'
        },
        {
          label: '添加字幕文件...',
          click: () => windows.main.dispatch('openSubtitles'),
          enabled: false
        }
      ]
    },
    {
      label: '传输',
      submenu: [
        {
          label: '暂停所有',
          click: () => windows.main.dispatch('pauseAllTorrents')
        },
        {
          label: '唤醒所有',
          click: () => windows.main.dispatch('resumeAllTorrents')
        }
      ]
    },
    {
      label: '帮助',
      role: 'help',
      submenu: [
        {
          label: '关于 ' + config.APP_NAME,
          click: () => {
            const shell = require('./shell')
            shell.openExternal(config.HOME_PAGE_URL)
          }
        },
        {
          label: '访问GitHub',
          click: () => {
            const shell = require('./shell')
            shell.openExternal(config.GITHUB_URL)
          }
        },
        {
          type: 'separator'
        },
        {
          label: '报告问题...',
          click: () => {
            const shell = require('./shell')
            shell.openExternal(config.GITHUB_URL_ISSUES)
          }
        }
      ]
    }
  ]

  if (process.platform === 'darwin') {
    // WebTorrent menu (Mac)
    template.unshift({
      label: config.APP_NAME,
      submenu: [
        {
          role: 'about'
        },
        {
          type: 'separator'
        },
        {
          label: '配置',
          accelerator: 'Cmd+,',
          click: () => windows.main.dispatch('preferences')
        },
        {
          type: 'separator'
        },
        {
          role: 'services',
          submenu: []
        },
        {
          type: 'separator'
        },
        {
          role: 'hide'
        },
        {
          role: 'hideothers'
        },
        {
          role: 'unhide'
        },
        {
          type: 'separator'
        },
        {
          role: 'quit'
        }
      ]
    })

    // Edit menu (Mac)
    template[2].submenu.push(
      {
        type: 'separator'
      },
      {
        label: 'Speech',
        submenu: [
          {
            role: 'startspeaking'
          },
          {
            role: 'stopspeaking'
          }
        ]
      }
    )

    // Window menu (Mac)
    template.splice(6, 0, {
      role: 'window',
      submenu: [
        {
          role: 'minimize'
        },
        {
          type: 'separator'
        },
        {
          role: 'front'
        }
      ]
    })
  }

  // On Windows and Linux, open dialogs do not support selecting both files and
  // folders and files, so add an extra menu item so there is one for each type.
  if (process.platform === 'linux' || process.platform === 'win32') {
    // File menu (Windows, Linux)
    template[0].submenu.unshift({
      label: '创建新Torrent来自文件...',
      click: () => {
        const dialog = require('./dialog')
        dialog.openSeedFile()
      }
    })

    // Edit menu (Windows, Linux)
    template[1].submenu.push(
      {
        type: 'separator'
      },
      {
        label: '配置',
        accelerator: 'CmdOrCtrl+,',
        click: () => windows.main.dispatch('preferences')
      })

    // 帮助 menu (Windows, Linux)
    template[5].submenu.push(
      {
        type: 'separator'
      },
      {
        label: 'About ' + config.APP_NAME,
        click: () => windows.about.init()
      }
    )
  }
  // Add "File > Quit" menu item so Linux distros where the system tray icon is
  // missing will have a way to quit the app.
  if (process.platform === 'linux') {
    // File menu (Linux)
    template[0].submenu.push({
      label: 'Quit',
      click: () => app.quit()
    })
  }

  return template
}
