import * as https from 'https';
import * as fs from 'fs';
import * as path from 'path';

export function downloadFile(
  url: string,
  downloadsDir: string,
): Promise<string> {
  const filename = url.split('/').pop();
  const filePath = path.join(downloadsDir, filename);

  return new Promise((resolve, reject) => {
    fs.access(downloadsDir, (error) => {
      if (error) {
        fs.mkdirSync(downloadsDir, { recursive: true });
      }

      const fileStream = fs.createWriteStream(filePath);

      https
        .get(url, (res) => {
          res.pipe(fileStream);

          fileStream.on('finish', () => {
            fileStream.close();
            resolve(filePath);
          });
        })
        .on('error', (err) => {
          fs.unlink(filePath, () => reject(err));
        });
    });
  });
}
