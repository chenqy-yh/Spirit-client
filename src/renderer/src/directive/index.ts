/*
 * @Date: 2024-03-26 11:06:45
 * @LastEditors: Chenqy
 * @LastEditTime: 2024-04-18 20:45:06
 * @FilePath: \Spirit-client\src\renderer\src\directive\index.ts
 * @Description: True or False
 */
import LoadingDirective from './loading'
import ContextDirective from './context-menu/index'
import enterDirective from './enter'
import MessageDirective from './message'
import ButtonLoadingDirective from './button-loading'
import { App } from 'vue'

const setupDirectives = (app: App) => {
  app.directive('win-loading', LoadingDirective)
  app.directive('context-menu', ContextDirective)
  app.directive('message-box', MessageDirective)
  app.directive('button-loading', ButtonLoadingDirective)
  app.directive('enter', enterDirective)
}

export { setupDirectives }
