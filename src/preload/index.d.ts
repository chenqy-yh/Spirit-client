/*
 * @Date: 2023-12-21 23:40:23
 * @LastEditors: Chenqy
 * @LastEditTime: 2024-04-07 19:23:28
 * @FilePath: \server-monitor\src\preload\index.d.ts
 * @Description: True or False
 */
import { ElectronAPI } from '@electron-toolkit/preload'
import { BrowserViewConstructorOptions } from 'electron'

/**
 *  @description ipc handle api
 *
 */
type HandleApi = ServerHandleApi &
  FirewallHandleApi &
  FileHandleApi &
  CommonHandleApi &
  TLHInstanceHandleApi

/**
 *  @description 通用 API
 *
 */
type CommonHandleApi = {
  openWindow: (url: BrowserViewConstructorOptions, hash: string) => Promise<number>
  getData: () => Promise<string>
}

/**
 * @description 服务器信息 API
 *
 * */
type ServerHandleApi = {
  ping: (url: string) => Promise<string>
  getServerInfo: (url: string) => Promise<ServerData>
  createWsService: (url: string) => Promise<number>
  getServerLog: (
    url: string,
    type: string,
    page: number,
    size?: number
  ) => Promise<{ total: number; data: string[] }>
}

/**
 *  @description 防火墙 API
 *
 */
type FirewallHandleApi = {
  descInsList: (parms?: unknown) => Promise<{ InstanceSet: TLHInstance[] }>
  descFirewallRules: (params: unknown) => Promise<QueryFirewallrulesResponse>
  modifyFirewallRules: (params?: unknown) => Promise<CommonResponse> | Promise<string>
  addFirewallRules: (params?: unknown) => Promise<CommonResponse> | Promise<string>
  modifyFirewallRuleDescription: (params?: unknown) => Promise<CommonResponse> | Promise<string>
  deleteFirewallRules: (params?: unknown) => Promise<CommonResponse> | Promise<string>
  delFirewallRules: (params?: unknown) => Promise<CommonResponse> | Promise<string>
}

/**
 *  @description 文件 API
 *
 */
type FileHandleApi = {
  getFileList: (url: string, path: string, filter?: string) => Promise<FileStat[]>
  getFilePath: () => Promise<string>
  getFileContent: (url: string, path: string) => Promise<string>
  saveFileContent: (url: string, path: string, content: string) => Promise<string>
  findEditorWindow: (win_id: number) => Promise<boolean>
  getWinId: () => Promise<number>
  delFile: (url: string, path: string) => Promise<string>
  copyFile: (url: string, src: string, dest: string) => Promise<string>
  moveFile: (url: string, src: string, dest: string) => Promise<string>
  mkdir: (url: string, path: string) => Promise<string>
  mkfile: (url: string, path: string) => Promise<string>
  uploadFile: (url: string, path: string, formData: any) => Promise<string>
  mergeChunk: (url: string, path: string, formData: any) => Promise<string>
  queryFinishedChunk: (url: string, path: string, hash: string, total: number) => Promise<number[]>
}

type TLHInstanceHandleApi = {
  getTLHInstanceList: (
    apiId: string,
    apiKey: string,
    region: string
  ) => Promise<{
    TotalCount?: number
    InstanceSet?: Array<TLHInstance>
    RequestId?: string
  }>
}

/**
 *  @description ipc on api
 *
 */
type OnApi = {
  showContextMenu: (menu_key?: string) => void
  winMove: (
    move_x: number,
    move_y: number,
    width: number,
    height: number,
    isFullScreen: boolean
  ) => void
  winResize: (width: number, height: number) => void
  appQuit: () => void
  appFullScreen: (isFullScreen: boolean, width: number, height: number) => void
  appMin: () => void
  closeWebSocket: (url: string, port: number) => void
  createNewWindow: (url: string, winName: string) => void
  updateTencentCredential: (secretId: string, secretKey: string) => void
  updateTencentRegion: (region: string) => void
  emitFilePath: (path: string) => void
  winClose: () => void
  editorOpenFile: (winId: number, filePath: string, fileSize: number, fileType: string) => void
}

type RendererResponse = {
  onResponse: (eventKey: string, callback: (...args: unknown[]) => unknown) => void
}

declare global {
  interface Window {
    electron: ElectronAPI
    api: HandleApi & OnApi & RendererResponse
    ipcRenderer: Electron.IpcRenderer
  }
}
