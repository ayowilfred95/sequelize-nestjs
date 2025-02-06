// import { Sequelize, DataTypes, ModelStatic, Model } from 'sequelize';
// import * as fs from 'fs';
// import * as path from 'path';
// import * as process from 'process';

// const basename = path.basename(__filename);
// const env = process.env.NODE_ENV || 'development';

// interface ExtendedModelStatic<T extends Model> extends ModelStatic<T> {
//   associate?: (models: { [key: string]: ExtendedModelStatic<any> }) => void;
// }

// const db: { [key: string]: ExtendedModelStatic<any> } = {};

// let sequelize: Sequelize;

// (async () => {
//     const fileExtension = env === 'production' ? '.js' : '.ts';
//     const config = (
//       await import(
//         path.join(__dirname, `../../../config/sequelize${fileExtension}`)
//       )
//     )[env];
//     // const config = (
//     //     await import(
//     //       path.join(__dirname, `../core/database/database.config`)
//     //     )
//     //   )[env];

//   if (config.use_env_variable) {
//     sequelize = new Sequelize(process.env[config.use_env_variable]!, config);
//   } else {
//     sequelize = new Sequelize(config.database, config.username, config.password, config);
//   }

//   // Read and import all models from the current directory
//   const modelFiles = fs.readdirSync(__dirname).filter((file) => {
//     return (
//       file.indexOf('.') !== 0 &&
//       file !== basename &&
//       file.slice(-3) === '.ts' &&
//       file.indexOf('.test.ts') === -1
//     );
//   });

//   for (const file of modelFiles) {
//     const model = (await import(path.join(__dirname, file))).default(sequelize, DataTypes) as ExtendedModelStatic<any>;
//     db[model.name] = model;
//   }

//   // Initialize model associations
//   Object.keys(db).forEach((modelName) => {
//     if (db[modelName].associate) {
//       db[modelName].associate(db);
//     }
//   });
// })();

// export { sequelize, db };



// 'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '../../../config/sequelize.ts')[env];
const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

fs
  .readdirSync(__dirname)
  .filter(file => {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
  })
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

// db.sequelize = sequelize;
// db.Sequelize = Sequelize;

module.exports = {sequelize, db};

