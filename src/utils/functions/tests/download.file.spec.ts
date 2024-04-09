import * as https from 'https';
import * as fs from 'fs';
import { downloadFile } from '../download.file';

const mockStream = {
  on: jest.fn((event, callback) => {
    if (event === 'finish') {
      callback();
    }
    return mockStream;
  }),
  close: jest.fn(),
  pipe: jest.fn(),
};

const mockRes = {
  on: jest.fn((event, handler) => {
    if (event === 'error') handler(new Error('Mock error'));
    return mockRes;
  }),
  pipe: jest.fn(() => mockRes),
};

jest.mock('https', () => ({
  get: jest.fn((_url, callback) => {
    callback(mockRes);
    return {
      on: jest.fn().mockImplementation((event, handler) => {
        if (event === 'error') handler(new Error('Mock request error'));
      }),
    };
  }),
}));

jest.mock('fs', () => ({
  access: jest.fn((_, callback) => callback(null)),
  createWriteStream: jest.fn(() => mockStream),
}));

jest.mock('path', () => ({
  join: (...args) => args.join('/'),
}));

describe('downloadFile', () => {
  it('should download a file to the specified directory', async () => {
    const url = 'https://example.com/avatar.png';
    const downloadsDir = './downloads';
    const expectedFilePath = `${downloadsDir}/avatar.png`;

    await expect(downloadFile(url, downloadsDir)).resolves.toEqual(
      expectedFilePath,
    );

    expect(fs.access).toHaveBeenCalledWith(downloadsDir, expect.any(Function));
    expect(fs.createWriteStream).toHaveBeenCalledWith(expectedFilePath);
    expect(https.get).toHaveBeenCalledWith(url, expect.any(Function));
  });
});
