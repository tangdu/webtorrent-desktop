const path = require('path')
const React = require('react')

const colors = require('material-ui/styles/colors')
const Checkbox = require('material-ui/Checkbox').default
const RaisedButton = require('material-ui/RaisedButton').default
const Heading = require('../components/heading')
const PathSelector = require('../components/path-selector')

const {dispatch} = require('../lib/dispatcher')
const config = require('../../config')

class PreferencesPage extends React.Component {
  constructor (props) {
    super(props)

    this.handleDownloadPathChange =
      this.handleDownloadPathChange.bind(this)

    this.handleOpenExternalPlayerChange =
      this.handleOpenExternalPlayerChange.bind(this)

    this.handleExternalPlayerPathChange =
      this.handleExternalPlayerPathChange.bind(this)

    this.handleStartupChange =
      this.handleStartupChange.bind(this)
  }

  downloadPathSelector () {
    return (
      <Preference>
        <PathSelector
          dialog={{
            title: '选择下载目录',
            properties: [ 'openDirectory' ]
          }}
          onChange={this.handleDownloadPathChange}
          title='下载目录'
          value={this.props.state.unsaved.prefs.downloadPath} />
      </Preference>
    )
  }

  handleDownloadPathChange (filePath) {
    dispatch('updatePreferences', 'downloadPath', filePath)
  }

  openExternalPlayerCheckbox () {
    return (
      <Preference>
        <Checkbox
          className='control'
          checked={!this.props.state.unsaved.prefs.openExternalPlayer}
          label={'使用WebTorrent播放torrent媒体文件'}
          onCheck={this.handleOpenExternalPlayerChange} />
      </Preference>
    )
  }

  handleOpenExternalPlayerChange (e, isChecked) {
    dispatch('updatePreferences', 'openExternalPlayer', !isChecked)
  }

  highestPlaybackPriorityCheckbox () {
    return (
      <Preference>
        <Checkbox
          className='control'
          checked={this.props.state.unsaved.prefs.highestPlaybackPriority}
          label={'回放最高优先级'}
          onCheck={this.handleHighestPlaybackPriorityChange}
        />
        <p>暂停所有活跃的torrents以允许回放使用所有可用带宽.</p>
      </Preference>
    )
  }

  handleHighestPlaybackPriorityChange (e, isChecked) {
    dispatch('updatePreferences', 'highestPlaybackPriority', isChecked)
  }

  externalPlayerPathSelector () {
    const playerPath = this.props.state.unsaved.prefs.externalPlayerPath
    const playerName = this.props.state.getExternalPlayerName()

    const description = this.props.state.unsaved.prefs.openExternalPlayer
      ? `Torrent媒体文件将一直播放 ${playerName}.`
      : `Torrent媒体文件将一直播放 ${playerName} 如果WebTorrent不能播放它们.`

    return (
      <Preference>
        <p>{description}</p>
        <PathSelector
          dialog={{
            title: '选择媒体播放器应用程序',
            properties: [ 'openFile' ]
          }}
          displayValue={playerName}
          onChange={this.handleExternalPlayerPathChange}
          title='外部播放器'
          value={playerPath ? path.dirname(playerPath) : null} />
      </Preference>
    )
  }

  handleExternalPlayerPathChange (filePath) {
    dispatch('updatePreferences', 'externalPlayerPath', filePath)
  }

  autoAddTorrentsCheckbox () {
    return (
      <Preference>
        <Checkbox
          className='control'
          checked={this.props.state.unsaved.prefs.autoAddTorrents}
          label={'查看新的.torrent文件并立即添加它们'}
          onCheck={(e, value) => { this.handleAutoAddTorrentsChange(e, value) }}
        />
      </Preference>
    )
  }

  handleAutoAddTorrentsChange (e, isChecked) {
    const torrentsFolderPath = this.props.state.unsaved.prefs.torrentsFolderPath
    if (isChecked && !torrentsFolderPath) {
      alert('首先选择一个torrents文件夹.') // eslint-disable-line
      e.preventDefault()
      return
    }

    dispatch('updatePreferences', 'autoAddTorrents', isChecked)

    if (isChecked) {
      dispatch('startFolderWatcher', null)
      return
    }

    dispatch('stopFolderWatcher', null)
  }

  torrentsFolderPathSelector () {
    const torrentsFolderPath = this.props.state.unsaved.prefs.torrentsFolderPath

    return (
      <Preference>
        <PathSelector
          dialog={{
            title: '选择文件夹以查看新的torrent',
            properties: [ 'openDirectory' ]
          }}
          displayValue={torrentsFolderPath || ''}
          onChange={this.handletorrentsFolderPathChange}
          title='文件夹查看'
          value={torrentsFolderPath ? path.dirname(torrentsFolderPath) : null} />
      </Preference>
    )
  }

  handletorrentsFolderPathChange (filePath) {
    dispatch('updatePreferences', 'torrentsFolderPath', filePath)
  }

  setDefaultAppButton () {
    const isFileHandler = this.props.state.unsaved.prefs.isFileHandler
    if (isFileHandler) {
      return (
        <Preference>
          <p>WebTorrent是你的默认torrent应用程序!</p>
        </Preference>
      )
    }
    return (
      <Preference>
        <p>WebTorrent现在不是默认的torrent应用.</p>
        <RaisedButton
          className='control'
          onClick={this.handleSetDefaultApp}
          label='使WebTorrent默认' />
      </Preference>
    )
  }

  handleStartupChange (e, isChecked) {
    dispatch('updatePreferences', 'startup', isChecked)
  }

  setStartupSection () {
    if (config.IS_PORTABLE) {
      return
    }

    return (
      <PreferencesSection title='启动'>
        <Preference>
          <Checkbox
            className='control'
            checked={this.props.state.unsaved.prefs.startup}
            label={'在启动时打开WebTorrent.'}
            onCheck={this.handleStartupChange}
          />
        </Preference>
      </PreferencesSection>
    )
  }

  handleSetDefaultApp () {
    dispatch('updatePreferences', 'isFileHandler', true)
  }

  render () {
    const style = {
      color: colors.grey400,
      marginLeft: 25,
      marginRight: 25
    }
    return (
      <div style={style}>
        <PreferencesSection title='文件设置'>
          {this.downloadPathSelector()}
          {this.autoAddTorrentsCheckbox()}
          {this.torrentsFolderPathSelector()}
        </PreferencesSection>
        <PreferencesSection title='播放设置'>
          {this.openExternalPlayerCheckbox()}
          {this.externalPlayerPathSelector()}
          {this.highestPlaybackPriorityCheckbox()}
        </PreferencesSection>
        <PreferencesSection title='默认的torrent应用'>
          {this.setDefaultAppButton()}
        </PreferencesSection>
        {this.setStartupSection()}
      </div>
    )
  }
}

class PreferencesSection extends React.Component {
  static get propTypes () {
    return {
      title: React.PropTypes.string
    }
  }

  render () {
    const style = {
      marginBottom: 25,
      marginTop: 25
    }
    return (
      <div style={style}>
        <Heading level={2}>{this.props.title}</Heading>
        {this.props.children}
      </div>
    )
  }
}

class Preference extends React.Component {
  render () {
    const style = { marginBottom: 10 }
    return (<div style={style}>{this.props.children}</div>)
  }
}

module.exports = PreferencesPage
