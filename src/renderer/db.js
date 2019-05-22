import Datastore from 'nedb';
import path from 'path';
import { remote } from 'electron'; // eslint-disable-line

const db = {
  user: new Datastore({
    filename: path.join(remote.app.getPath('userData'), '/db/user.db'),
  }),

  config: new Datastore({
    filename: path.join(remote.app.getPath('userData'), '/db/config.db'),
  }),

  device: new Datastore({
    filename: path.join(remote.app.getPath('userData'), '/db/device.db'),
  }),

  element: new Datastore({
    filename: path.join(remote.app.getPath('userData'), '/db/element.db'),
  }),

  pageHome: new Datastore({
    filename: path.join(remote.app.getPath('userData'), '/db/pageHome.db'),
  }),

  settingPage: new Datastore({
    filename: path.join(remote.app.getPath('userData'), '/db/settingPage.db'),
  }),
  node: new Datastore({
    filename: path.join(remote.app.getPath('userData'), '/db/node.db'),
  }),
};

export default db;
