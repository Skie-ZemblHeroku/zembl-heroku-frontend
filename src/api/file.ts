import { performPostRequest } from '../helpers'
import { extractPureBase64, toBase64 } from '../helpers/file'
import { CommonResponse } from './common'

export const postUploadAttachment = async (file: SFFile, token: string) => {
  // const formData = new FormData()
  // formData.append('')
  const response = await performPostRequest('/uploadFile', file, token)
  return response.data as CommonResponse
}

export const transformFile = async (recordId: string, file: File): Promise<SFFile> => {
  const base64File = (await toBase64(file))
  const pureBase64 = extractPureBase64(base64File)
  return { recordId, fileName: file.name, fullFileName: file.name, versionData: pureBase64 }
}

export interface SFFile {
  recordId: string // String {Salesforce-Record-Id},
  fullFileName: string // String "test2.pdf",
  fileName: string // String "test2",
  versionData: string // String {Base-64-Data}
}