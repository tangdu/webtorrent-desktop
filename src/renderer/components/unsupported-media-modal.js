const React = require('react')
const electron = require('electron')

const ModalOKCancel = require('./modal-ok-cancel')
const {dispatcher} = require('../lib/dispatcher')

module.exports = class UnsupportedMediaModal extends React.Component {
  render () {
    const state = this.props.state
    const err = state.modal.error
    const message = (err && err.getMessage)
      ? err.getMessage()
      : err
    const onAction = state.modal.externalPlayerInstalled
      ? dispatcher('openExternalPlayer')
      : () => this.onInstall()
    const actionText = state.modal.externalPlayerInstalled
      ? '播放在 ' + state.getExternalPlayerName().toUpperCase()
      : '安装VLC播放器'
    const errorMessage = state.modal.externalPlayerNotFound
      ? '不能运行外部播放器，请确保你已安装'
      : ''
    return (
      <div>
        <p><strong>对不起，我们不能播放那个文件.</strong></p>
        <p>{message}</p>
        <ModalOKCancel
          cancelText='取消'
          onCancel={dispatcher('backToList')}
          okText={actionText}
          onOK={onAction} />
        <p className='error-text'>{errorMessage}</p>
      </div>
    )
  }

  onInstall () {
    electron.shell.openExternal('http://www.videolan.org/vlc/')

    // TODO: dcposch send a dispatch rather than modifying state directly
    const state = this.props.state
    state.modal.externalPlayerInstalled = true // Assume they'll install it successfully
  }
}
