import * as authController from './auth.controller.js';
import * as teamController from './team.controller.js';
import * as mediaController from './media.controller.js';
import * as resultController from './result.controller.js';
import * as dashboardController from './dashboard.controller.js';
import * as newsController from './news.controller.js';
import * as galleryController from './gallery.controller.js';
import * as templateController from './template.controller.js';

export default {
  ...authController,
  ...teamController,
  ...mediaController,
  ...resultController,
  ...dashboardController,
  ...newsController,
  ...galleryController,
  ...templateController,
};