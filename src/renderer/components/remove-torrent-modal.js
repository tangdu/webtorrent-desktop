const React = require('react')

const ModalOKCancel = require('./modal-ok-cancel')
const {dispatch, dispatcher} = require('../lib/dispatcher')

module.exports = class RemoveTorrentModal extends React.Component {
  render () {
    const state = this.props.state
    const message = state.modal.deleteData
      ? '您确定要从列表中删除该种子并删除数据文件吗?'
      : '您确定要从列表中删除该种子吗??'
    const buttonText = state.modal.deleteData ? '删除数据文件' : '删除'

    return (
      <div>
        <p><strong>{message}</strong></p>
        <ModalOKCancel
          cancelText='取消'
          onCancel={dispatcher('exitModal')}
          okText={buttonText}
          onOK={handleRemove} />
      </div>
    )

    function handleRemove () {
      dispatch('deleteTorrent', state.modal.infoHash, state.modal.deleteData)
      dispatch('exitModal')
    }
  }
}
