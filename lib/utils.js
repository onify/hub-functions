'use strict';

/**
 * Converts SIDs from hex buffers (returned by AD) to human readable strings
 * Reference: https://github.com/jsumners/node-activedirectory/blob/8ff17bdf366a2d6926879ba06fbe84ba0171c01f/lib/components/utilities.js#L415
 *
 * @private
 * @param {buffer} sid
 * @returns {string}
 */
function binarySidToStringSid(sid) {
  const _32bit = 0x100000000;
  const revision = sid.readUInt8(0);
  const authority = _32bit * sid.readUInt16BE(2) + sid.readUInt32BE(4);
  const parts = ['S', revision, authority];

  for (let i = 8; i < sid.length; i += 4) {
    parts.push(sid.readUInt32LE(i));
  }
  return parts.join('-');
}

module.exports = {
  binarySidToStringSid,
};
