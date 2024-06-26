/*
 * @Date: 2024-03-06 00:14:25
 * @LastEditors: Chenqy
 * @LastEditTime: 2024-03-31 15:28:40
 * @FilePath: \server-monitor\src\main\utils\http\index.ts
 * @Description: True or False
 */
import axios, { AxiosInstance, AxiosResponse, AxiosRequestConfig } from 'axios'

class HttpService {
  private axiosInstance: AxiosInstance

  constructor() {
    this.axiosInstance = axios.create({
      timeout: 10000 // 请求超时时间，单位毫秒
    })
  }

  public async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.axiosInstance.get<T>(url, config)
    return response.data
  }

  public async post<T>(url: string, data?: T, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.axiosInstance.post<T>(url, data, config)
    return response.data
  }

  public async put<T>(url: string, data?: T, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.axiosInstance.put<T>(url, data, config)
    return response.data
  }

  public async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.axiosInstance.delete<T>(url, config)
    return response.data
  }
}

const httpService = new HttpService()

export { httpService }
