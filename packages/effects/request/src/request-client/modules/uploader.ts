import type { AxiosRequestConfig, AxiosResponse } from 'axios';

import type { RequestClient } from '../request-client';

class FileUploader {
  private client: RequestClient;

  constructor(client: RequestClient) {
    this.client = client;
  }

  public async upload(
    url: string,
    file: Blob | File,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse> {
    // const formData = new FormData();
    // formData.append('file', file);
    const finalConfig: AxiosRequestConfig = {
      ...config,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        ...config?.headers,
      },
    };

    return this.client.post(url, file, finalConfig);
  }
}

export { FileUploader };
