const React = require('react')

const {dispatcher} = require('../lib/dispatcher')

module.exports = class CreateTorrentErrorPage extends React.Component {
  render () {
    return (
      <div className='create-torrent'>
        <h2>Create torrent</h2>
        <p className='torrent-info'>
          <p>
          对不起，您必须选择至少一个不是隐藏文件的文件.
          </p>
          <p>
            Hidden files, starting with a . character, are not included.
          </p>
        </p>
        <p className='float-right'>
          <button className='button-flat light' onClick={dispatcher('cancel')}>
            取消
          </button>
        </p>
      </div>
    )
  }
}
