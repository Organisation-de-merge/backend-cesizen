import { diskStorage } from 'multer';
import { extname } from 'path';
import { Request } from 'express';
import * as fs from 'fs';
import * as path from 'path';

export const multerConfig = {
  storage: diskStorage({
    destination: (req: Request, file, cb) => {
      let folder = 'uploads/others';

      if (req.url.includes('/activities')) {
        folder = 'uploads/activities';
      } else if (req.url.includes('/pages')) {
        folder = 'uploads/pages';
      }

      const fullPath = path.join(process.cwd(), folder);
      fs.mkdirSync(fullPath, { recursive: true });

      cb(null, fullPath);
    },

    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      cb(null, `${file.fieldname}-${uniqueSuffix}${extname(file.originalname)}`);
    },
  }),
};
