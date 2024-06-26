import { BrowserWindowConstructorOptions } from 'electron'

const editorWinOptions: BrowserWindowConstructorOptions = {
  width: 1024,
  height: 768,
  autoHideMenuBar: true,
  resizable: false,
  transparent: true,
  titleBarStyle: 'hidden'
}
export { editorWinOptions }
