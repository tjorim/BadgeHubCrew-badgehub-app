'use strict';

var dbm;
var type;
var seed;
var fs = require('fs');
var path = require('path');
var Promise;
var sharp = require('sharp');
var blurhash = require('blurhash');

/**
  * We receive the dbmigrate dependency from dbmigrate initially.
  * This enables us to not have to rely on NODE_PATH.
  */
exports.setup = function(options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
  Promise = options.Promise;
};

exports.up = function(db) {
  var filePath = path.join(__dirname, 'sqls', '20250810101521-version-blur-hash-up.sql');
  return new Promise( function( resolve, reject ) {
    fs.readFile(filePath, {encoding: 'utf-8'}, function(err,data){
      if (err) return reject(err);
      console.log('received data: ' + data);

      resolve(data);
    });
  })
  .then(function(data) {
    return db.runSql(data);
  })
  .then(function() {
    return populateExistingVersionBlurHashes(db);
  });
};

exports.down = function(db) {
  var filePath = path.join(__dirname, 'sqls', '20250810101521-version-blur-hash-down.sql');
  return new Promise( function( resolve, reject ) {
    fs.readFile(filePath, {encoding: 'utf-8'}, function(err,data){
      if (err) return reject(err);
      console.log('received data: ' + data);

      resolve(data);
    });
  })
  .then(function(data) {
    return db.runSql(data);
  });
};

exports._meta = {
  "version": 1
};

function populateExistingVersionBlurHashes(db) {
  return db.all(`
    select v.id as version_id,
           fd.content as content
    from versions v
           join lateral (
             select icon_path
             from (values
                     (1, v.app_metadata -> 'icon_map' ->> '64x64'),
                     (2, v.app_metadata -> 'icon_map' ->> '32x32'),
                     (3, v.app_metadata -> 'icon_map' ->> '16x16'),
                     (4, v.app_metadata -> 'icon_map' ->> '8x8')
                  ) as preferred_icons(sort_order, icon_path)
             where icon_path is not null
             order by sort_order
             limit 1
           ) icon on true
           join files f on f.version_id = v.id
             and f.deleted_at is null
             and f.mimetype like 'image/%'
             and (
               case
                 when f.dir = '' then f.name || f.ext
                 else f.dir || '/' || f.name || f.ext
               end
             ) = icon.icon_path
           join file_data fd on fd.sha256 = f.sha256
    where v.blur_hash is null
  `).then(function(rows) {
    return Promise.each(rows, function(row) {
      return createBlurHash(row.content)
        .then(function(hash) {
          if (!hash) {
            return;
          }
          return db.runSql(
            'update versions set blur_hash = ? where id = ?',
            [hash, row.version_id]
          );
        });
    });
  });
}

function createBlurHash(fileContent) {
  return sharp(fileContent)
    .resize(32, 32, { fit: 'inside' })
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true })
    .then(function(result) {
      return blurhash.encode(
        new Uint8ClampedArray(result.data),
        result.info.width,
        result.info.height,
        4,
        3
      );
    })
    .catch(function(error) {
      console.warn('Could not create blurhash for existing version icon', error);
      return undefined;
    });
}
